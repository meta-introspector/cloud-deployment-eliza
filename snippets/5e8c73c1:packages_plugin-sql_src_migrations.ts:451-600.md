# 5e8c73c1:packages_plugin-sql_src_migrations.ts:451-600

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-sql/src/migrations.ts:451-600
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
      const hasServerAgents = tables.some((t: any) => t.table_name === 'server_agents');
      const hasMessageServerAgents = tables.some(
        (t: any) => t.table_name === 'message_server_agents'
      );

      if (hasServerAgents && !hasMessageServerAgents) {
        // Rename server_agents → message_server_agents
        logger.debug('[Migration] → Renaming server_agents to message_server_agents...');
        await db.execute(sql.raw(`ALTER TABLE "server_agents" RENAME TO "message_server_agents"`));
        logger.debug('[Migration] ✓ Renamed server_agents → message_server_agents');

        // Now rename server_id column → message_server_id
        logger.debug(
          '[Migration] → Renaming message_server_agents.server_id to message_server_id...'
        );
        await db.execute(
          sql.raw(
            `ALTER TABLE "message_server_agents" RENAME COLUMN "server_id" TO "message_server_id"`
          )
        );
        logger.debug('[Migration] ✓ Renamed message_server_agents.server_id → message_server_id');
      } else if (!hasServerAgents && !hasMessageServerAgents) {
        // Neither table exists - RuntimeMigrator will create message_server_agents
        logger.debug('[Migration] ⊘ No server_agents table to migrate');
      } else if (hasMessageServerAgents) {
        // Check if it has the columns and rename if needed
        logger.debug('[Migration] → Checking message_server_agents columns...');
        const columnsResult = await db.execute(sql`
          SELECT column_name
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'message_server_agents'
            AND column_name IN ('server_id', 'message_server_id')
          ORDER BY column_name
        `);

        const columns = columnsResult.rows || [];
        const hasServerId = columns.some((c: any) => c.column_name === 'server_id');
        const hasMessageServerId = columns.some((c: any) => c.column_name === 'message_server_id');

        if (hasServerId && !hasMessageServerId) {
          // Rename server_id → message_server_id
          logger.debug(
            '[Migration] → Renaming message_server_agents.server_id to message_server_id...'
          );
          await db.execute(
            sql.raw(
              `ALTER TABLE "message_server_agents" RENAME COLUMN "server_id" TO "message_server_id"`
            )
          );
          logger.debug('[Migration] ✓ Renamed message_server_agents.server_id → message_server_id');
        } else if (!hasServerId && !hasMessageServerId) {
          // Table exists but doesn't have either column - truncate it
          logger.debug(
            '[Migration] → message_server_agents exists without required columns, truncating...'
          );
          await db.execute(sql`TRUNCATE TABLE message_server_agents CASCADE`);
          logger.debug('[Migration] ✓ Truncated message_server_agents');
        } else {
          logger.debug('[Migration] ⊘ message_server_agents already has correct schema');
        }
      }
    } catch (error) {
      logger.debug('[Migration] ⊘ Could not check/migrate server_agents table');
    }

    // Special handling for channel_participants: rename userId → entityId
    // This handles the migration from the old userId column to the new entityId column
    logger.debug('[Migration] → Checking channel_participants table...');
    try {
      const columnsResult = await db.execute(sql`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'channel_participants'
          AND column_name IN ('user_id', 'entity_id')
        ORDER BY column_name
      `);

      const columns = columnsResult.rows || [];
      const hasUserId = columns.some((c: any) => c.column_name === 'user_id');
      const hasEntityId = columns.some((c: any) => c.column_name === 'entity_id');

      if (hasUserId && !hasEntityId) {
        // Rename user_id → entity_id
        logger.debug('[Migration] → Renaming channel_participants.user_id to entity_id...');
        await db.execute(
          sql.raw(`ALTER TABLE "channel_participants" RENAME COLUMN "user_id" TO "entity_id"`)
        );
        logger.debug('[Migration] ✓ Renamed channel_participants.user_id → entity_id');
      } else if (!hasUserId && !hasEntityId) {
        // Table exists but has neither column - truncate it so RuntimeMigrator can add entity_id
        logger.debug(
          '[Migration] → channel_participants exists without entity_id or user_id, truncating...'
        );
        await db.execute(sql`TRUNCATE TABLE channel_participants CASCADE`);
        logger.debug('[Migration] ✓ Truncated channel_participants');
      } else {
        logger.debug('[Migration] ⊘ channel_participants already has entity_id column');
      }
    } catch (error) {
      logger.debug('[Migration] ⊘ Could not check/migrate channel_participants');
    }

    // Drop ALL regular indexes (not PK or unique constraints) to avoid conflicts
    // The RuntimeMigrator will recreate them based on the schema
    logger.debug('[Migration] → Discovering and dropping all regular indexes...');
    try {
      const indexesResult = await db.execute(sql`
        SELECT i.relname AS index_name
        FROM pg_index idx
        JOIN pg_class i ON i.oid = idx.indexrelid
        JOIN pg_class c ON c.oid = idx.indrelid
        JOIN pg_namespace n ON n.oid = c.relnamespace
        LEFT JOIN pg_constraint con ON con.conindid = idx.indexrelid
        WHERE n.nspname = 'public'
          AND NOT idx.indisprimary  -- Not a primary key
          AND con.contype IS NULL   -- Not a constraint (unique, etc)
        ORDER BY i.relname
      `);

      const indexesToDrop = indexesResult.rows || [];
      logger.debug(`[Migration] → Found ${indexesToDrop.length} indexes to drop`);

      for (const row of indexesToDrop) {
        const indexName = row.index_name as string;
        try {
          await db.execute(sql.raw(`DROP INDEX IF EXISTS "${indexName}"`));
          logger.debug(`[Migration] ✓ Dropped index ${indexName}`);
        } catch (error) {
          logger.debug(`[Migration] ⊘ Could not drop index ${indexName}`);
        }
      }
    } catch (error) {
      logger.debug('[Migration] ⊘ Could not drop indexes (may not have permissions)');
    }

    // =========================================================================
    // SMOOTH MIGRATION: camelCase → snake_case column renames
    // This ensures a non-destructive transition from v1.6.4 to v1.6.5+
    // All data is preserved through RENAME COLUMN operations
    // This section can be removed once all deployments have been migrated
    // =========================================================================
    logger.debug('[Migration] → Starting camelCase → snake_case column renames...');

    const columnRenames = [
      // rooms table
      { table: 'rooms', from: 'agentId', to: 'agent_id' },
      { table: 'rooms', from: 'worldId', to: 'world_id' },
      { table: 'rooms', from: 'channelId', to: 'channel_id' },
```