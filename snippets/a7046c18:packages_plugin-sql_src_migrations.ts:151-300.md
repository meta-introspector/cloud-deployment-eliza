# a7046c18:packages_plugin-sql_src_migrations.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/migrations.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
          try {
            await db.execute(
              sql.raw(`ALTER TABLE "${tableName}" DISABLE ROW LEVEL SECURITY`),
            );
            logger.debug(`[Migration] ✓ Disabled RLS on ${tableName}`);
          } catch (_error) {
            logger.debug(`[Migration] ⊘ Could not disable RLS on ${tableName}`);
          }
        }
      } else {
        logger.debug("[Migration] ⊘ No tables with RLS enabled");
      }
    } catch (_error) {
      logger.debug(
        "[Migration] ⊘ Could not check RLS (may not have permissions)",
      );
    }

    // Special handling for tables where serverId/server_id needs to become message_server_id
    // v1.6.4 had: rooms.serverId (TEXT camelCase), worlds.serverId (TEXT camelCase), channels.server_id (UUID)
    // Current: message_server_id (UUID) in all tables
    //
    // STRATEGY: Rename serverId/server_id to message_server_id preserving data
    logger.debug(
      "[Migration] → Handling serverId/server_id → message_server_id migrations...",
    );

    const tablesToMigrate = ["channels", "worlds", "rooms"];

    for (const tableName of tablesToMigrate) {
      try {
        // Check for both camelCase (serverId) and snake_case (server_id) columns
        const columnsResult = await db.execute(sql`
          SELECT column_name, data_type, is_nullable
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = ${tableName}
            AND column_name IN ('server_id', 'serverId', 'message_server_id')
          ORDER BY column_name
        `);

        const columns = columnsResult.rows || [];
        const serverIdSnake = columns.find(
          (c: any) => c.column_name === "server_id",
        );
        const serverIdCamel = columns.find(
          (c: any) => c.column_name === "serverId",
        );
        const messageServerId = columns.find(
          (c: any) => c.column_name === "message_server_id",
        );

        // Use whichever old column exists (prefer snake_case for channels)
        const serverId = serverIdSnake || serverIdCamel;
        const oldColumnName = serverIdSnake ? "server_id" : "serverId";

        if (serverId && !messageServerId) {
          // Old column exists → rename it to message_server_id
          logger.debug(
            `[Migration] → Renaming ${tableName}.${oldColumnName} to message_server_id...`,
          );
          await db.execute(
            sql.raw(
              `ALTER TABLE "${tableName}" RENAME COLUMN "${oldColumnName}" TO "message_server_id"`,
            ),
          );
          logger.debug(
            `[Migration] ✓ Renamed ${tableName}.${oldColumnName} → message_server_id`,
          );

          // If the column was text, try to convert to UUID (if data is UUID-compatible)
          if (serverId.data_type === "text") {
            // CRITICAL: Drop DEFAULT constraint before type conversion
            // This prevents "default for column cannot be cast automatically" errors
            // Wrap in separate try-catch to ensure we continue even if no default exists
            try {
              logger.debug(
                `[Migration] → Dropping DEFAULT constraint on ${tableName}.message_server_id...`,
              );
              await db.execute(
                sql.raw(
                  `ALTER TABLE "${tableName}" ALTER COLUMN "message_server_id" DROP DEFAULT`,
                ),
              );
              logger.debug(`[Migration] ✓ Dropped DEFAULT constraint`);
            } catch {
              logger.debug(
                `[Migration] ⊘ No DEFAULT constraint to drop on ${tableName}.message_server_id`,
              );
            }

            try {
              logger.debug(
                `[Migration] → Converting ${tableName}.message_server_id from text to uuid...`,
              );
              // Use robust conversion: valid UUIDs are cast directly, others get md5 hash
              // This handles: empty strings, non-UUID text, uppercase UUIDs, NULL values
              await db.execute(
                sql.raw(`
                  ALTER TABLE "${tableName}"
                  ALTER COLUMN "message_server_id" TYPE uuid
                  USING CASE
                    WHEN "message_server_id" IS NULL THEN NULL
                    WHEN "message_server_id" = '' THEN NULL
                    WHEN "message_server_id" ~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
                    THEN "message_server_id"::uuid
                    ELSE md5("message_server_id")::uuid
                  END
                `),
              );
              logger.debug(
                `[Migration] ✓ Converted ${tableName}.message_server_id to uuid`,
              );
            } catch (convertError) {
              logger.warn(
                `[Migration] ⚠️ Could not convert ${tableName}.message_server_id to uuid: ${convertError}`,
              );
            }
          }

          // If the column should be NOT NULL but has NULLs, we need to handle that
          // For channels, it's NOT NULL in the new schema
          if (tableName === "channels") {
            const nullCountResult = await db.execute(
              sql.raw(
                `SELECT COUNT(*) as count FROM "${tableName}" WHERE "message_server_id" IS NULL`,
              ),
            );
            const nullCount = nullCountResult.rows?.[0]?.count as
              | string
              | undefined;
            if (nullCount && parseInt(nullCount, 10) > 0) {
              logger.warn(
                `[Migration] ⚠️ ${tableName} has ${nullCount} rows with NULL message_server_id - these will be deleted`,
              );
              await db.execute(
                sql.raw(
                  `DELETE FROM "${tableName}" WHERE "message_server_id" IS NULL`,
                ),
              );
              logger.debug(
                `[Migration] ✓ Deleted ${nullCount} rows with NULL message_server_id from ${tableName}`,
              );
            }

            // Make it NOT NULL
            logger.debug(
              `[Migration] → Making ${tableName}.message_server_id NOT NULL...`,
            );
            await db.execute(
```