# a7046c18:packages_plugin-sql_src_migrations.ts:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/migrations.ts:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
              sql.raw(
                `ALTER TABLE "${tableName}" ALTER COLUMN "message_server_id" SET NOT NULL`,
              ),
            );
            logger.debug(
              `[Migration] ✓ Set ${tableName}.message_server_id NOT NULL`,
            );
          }
        } else if (serverId && messageServerId) {
          // Both exist → just drop the old column
          logger.debug(
            `[Migration] → ${tableName} has both columns, dropping ${oldColumnName}...`,
          );
          await db.execute(
            sql.raw(
              `ALTER TABLE "${tableName}" DROP COLUMN "${oldColumnName}" CASCADE`,
            ),
          );
          logger.debug(`[Migration] ✓ Dropped ${tableName}.${oldColumnName}`);
        } else if (!serverId && messageServerId) {
          // Only message_server_id exists - check if it needs type conversion from TEXT to UUID
          // This handles idempotency when migration partially ran before rollback
          if (messageServerId.data_type === "text") {
            logger.debug(
              `[Migration] → ${tableName}.message_server_id exists but is TEXT, needs UUID conversion...`,
            );

            // CRITICAL: Drop DEFAULT constraint before type conversion
            // This prevents "default for column cannot be cast automatically" errors
            logger.debug(
              `[Migration] → Dropping DEFAULT constraint on ${tableName}.message_server_id...`,
            );
            await db.execute(
              sql.raw(
                `ALTER TABLE "${tableName}" ALTER COLUMN "message_server_id" DROP DEFAULT`,
              ),
            );
            logger.debug(`[Migration] ✓ Dropped DEFAULT constraint`);

            // Convert TEXT to UUID using MD5 hash for non-UUID text values
            // This creates deterministic UUIDs from text values, preserving data
            logger.debug(
              `[Migration] → Converting ${tableName}.message_server_id from text to uuid (generating UUIDs from text)...`,
            );
            await db.execute(
              sql.raw(`
              ALTER TABLE "${tableName}"
              ALTER COLUMN "message_server_id" TYPE uuid
              USING CASE
                WHEN "message_server_id" ~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
                THEN "message_server_id"::uuid
                ELSE md5("message_server_id")::uuid
              END
            `),
            );
            logger.debug(
              `[Migration] ✓ Converted ${tableName}.message_server_id to uuid`,
            );
          } else {
            logger.debug(
              `[Migration] ⊘ ${tableName}.message_server_id already UUID, skipping`,
            );
          }
        } else {
          logger.debug(`[Migration] ⊘ ${tableName} already migrated, skipping`);
        }
      } catch (error) {
        logger.warn(
          `[Migration] ⚠️ Error migrating ${tableName}.server_id: ${error}`,
        );
      }
    }

    // Drop ALL remaining server_id columns (will be re-added by RLS after migrations)
    // This prevents RuntimeMigrator from seeing them and trying to drop them
    // EXCEPT for tables where server_id is part of the schema (like agents, server_agents)
    logger.debug(
      "[Migration] → Dropping all remaining RLS-managed server_id columns...",
    );
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
      logger.debug(
        `[Migration] → Found ${tablesToClean.length} tables with server_id columns`,
      );

      for (const row of tablesToClean) {
        const tableName = row.table_name as string;
        try {
          await db.execute(
            sql.raw(
              `ALTER TABLE "${tableName}" DROP COLUMN IF EXISTS server_id CASCADE`,
            ),
          );
          logger.debug(`[Migration] ✓ Dropped server_id from ${tableName}`);
        } catch (_error) {
          logger.debug(
            `[Migration] ⊘ Could not drop server_id from ${tableName}`,
          );
        }
      }
    } catch (_error) {
      logger.debug(
        "[Migration] ⊘ Could not drop server_id columns (may not have permissions)",
      );
    }

    // Special handling for agents table: rename owner_id → server_id
    // v1.6.4 had owner_id, v1.6.5 changed it to server_id
    logger.debug(
      "[Migration] → Checking agents.owner_id → server_id rename...",
    );
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
      const hasOwnerId = agentsColumns.some(
        (c: any) => c.column_name === "owner_id",
      );
      const hasServerId = agentsColumns.some(
        (c: any) => c.column_name === "server_id",
      );

      if (hasOwnerId && !hasServerId) {
        // Rename owner_id → server_id
        logger.debug("[Migration] → Renaming agents.owner_id to server_id...");
```