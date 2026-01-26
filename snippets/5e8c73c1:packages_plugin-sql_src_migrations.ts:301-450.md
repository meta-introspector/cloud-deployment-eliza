# 5e8c73c1:packages_plugin-sql_src_migrations.ts:301-450

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-sql/src/migrations.ts:301-450
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
              END
            `)
            );
            logger.debug(`[Migration] ✓ Converted ${tableName}.message_server_id to uuid`);
          } else {
            logger.debug(`[Migration] ⊘ ${tableName}.message_server_id already UUID, skipping`);
          }
        } else {
          logger.debug(`[Migration] ⊘ ${tableName} already migrated, skipping`);
        }
      } catch (error) {
        logger.warn(`[Migration] ⚠️ Error migrating ${tableName}.server_id: ${error}`);
      }
    }

    // Drop ALL remaining server_id columns (will be re-added by RLS after migrations)
    // This prevents RuntimeMigrator from seeing them and trying to drop them
    // EXCEPT for tables where server_id is part of the schema (like agents, server_agents)
    logger.debug('[Migration] → Dropping all remaining RLS-managed server_id columns...');
    try {
      const serverIdColumnsResult = await db.execute(sql`
        SELECT table_name
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND column_name = 'server_id'
          AND table_name NOT IN (
            'servers',              -- server_id is the primary key
            'agents',               -- server_id is in the schema (for RLS)
            'channels',             -- already handled above
            'worlds',               -- already handled above
            'rooms',                -- already handled above
            'server_agents',        -- server_id is part of composite key
            'drizzle_migrations',
            '__drizzle_migrations'
          )
        ORDER BY table_name
      `);

      const tablesToClean = serverIdColumnsResult.rows || [];
      logger.debug(`[Migration] → Found ${tablesToClean.length} tables with server_id columns`);

      for (const row of tablesToClean) {
        const tableName = row.table_name as string;
        try {
          await db.execute(
            sql.raw(`ALTER TABLE "${tableName}" DROP COLUMN IF EXISTS server_id CASCADE`)
          );
          logger.debug(`[Migration] ✓ Dropped server_id from ${tableName}`);
        } catch (error) {
          logger.debug(`[Migration] ⊘ Could not drop server_id from ${tableName}`);
        }
      }
    } catch (error) {
      logger.debug('[Migration] ⊘ Could not drop server_id columns (may not have permissions)');
    }

    // Special handling for agents table: rename owner_id → server_id
    // v1.6.4 had owner_id, v1.6.5 changed it to server_id
    logger.debug('[Migration] → Checking agents.owner_id → server_id rename...');
    try {
      const agentsColumnsResult = await db.execute(sql`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'agents'
          AND column_name IN ('owner_id', 'server_id')
        ORDER BY column_name
      `);

      const agentsColumns = agentsColumnsResult.rows || [];
      const hasOwnerId = agentsColumns.some((c: any) => c.column_name === 'owner_id');
      const hasServerId = agentsColumns.some((c: any) => c.column_name === 'server_id');

      if (hasOwnerId && !hasServerId) {
        // Rename owner_id → server_id
        logger.debug('[Migration] → Renaming agents.owner_id to server_id...');
        await db.execute(sql.raw(`ALTER TABLE "agents" RENAME COLUMN "owner_id" TO "server_id"`));
        logger.debug('[Migration] ✓ Renamed agents.owner_id → server_id');
      } else if (hasOwnerId && hasServerId) {
        // Both exist - drop owner_id (data should be in server_id)
        logger.debug('[Migration] → Both owner_id and server_id exist, dropping owner_id...');
        await db.execute(sql.raw(`ALTER TABLE "agents" DROP COLUMN "owner_id" CASCADE`));
        logger.debug('[Migration] ✓ Dropped agents.owner_id');
      } else {
        logger.debug('[Migration] ⊘ agents table already has server_id (or no owner_id), skipping');
      }
    } catch (error) {
      logger.debug('[Migration] ⊘ Could not check/migrate agents.owner_id');
    }

    // Migrate data from obsolete 'owners' table to 'servers' (if owners exists)
    // v1.6.4 used owners table, v1.6.5+ uses servers table
    logger.debug('[Migration] → Checking for owners → servers data migration...');
    try {
      const ownersTableResult = await db.execute(sql`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = 'owners'
      `);

      if (ownersTableResult.rows && ownersTableResult.rows.length > 0) {
        // First, ensure servers table exists
        logger.debug('[Migration] → Ensuring servers table exists...');
        await db.execute(
          sql.raw(`
          CREATE TABLE IF NOT EXISTS "servers" (
            "id" uuid PRIMARY KEY,
            "created_at" timestamp with time zone DEFAULT now() NOT NULL,
            "updated_at" timestamp with time zone DEFAULT now() NOT NULL
          )
        `)
        );

        // Migrate data from owners to servers (if any)
        logger.debug('[Migration] → Migrating owners data to servers...');
        await db.execute(
          sql.raw(`
          INSERT INTO "servers" ("id", "created_at", "updated_at")
          SELECT "id", COALESCE("created_at", now()), COALESCE("updated_at", now())
          FROM "owners"
          ON CONFLICT ("id") DO NOTHING
        `)
        );
        logger.debug('[Migration] ✓ Migrated owners data to servers');

        // Now safe to drop owners table
        logger.debug('[Migration] → Dropping obsolete owners table...');
        await db.execute(sql.raw(`DROP TABLE IF EXISTS "owners" CASCADE`));
        logger.debug('[Migration] ✓ Dropped obsolete owners table');
      } else {
        logger.debug('[Migration] ⊘ owners table not found, skipping');
      }
    } catch (error) {
      logger.warn(`[Migration] ⚠️ Could not migrate owners → servers: ${error}`);
    }

    // Special handling for server_agents → message_server_agents rename
    // This aligns with the server_id → message_server_id naming convention
    logger.debug('[Migration] → Checking server_agents table rename...');
    try {
      const tablesResult = await db.execute(sql`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name IN ('server_agents', 'message_server_agents')
        ORDER BY table_name
      `);

      const tables = tablesResult.rows || [];
```