# 5e8c73c1:packages_plugin-sql_src_migrations.ts:151-300

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-sql/src/migrations.ts:151-300
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
    // STRATEGY: Rename serverId/server_id to message_server_id preserving data
    logger.debug('[Migration] → Handling serverId/server_id → message_server_id migrations...');

    const tablesToMigrate = ['channels', 'worlds', 'rooms'];

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
        const serverIdSnake = columns.find((c: any) => c.column_name === 'server_id');
        const serverIdCamel = columns.find((c: any) => c.column_name === 'serverId');
        const messageServerId = columns.find((c: any) => c.column_name === 'message_server_id');

        // Use whichever old column exists (prefer snake_case for channels)
        const serverId = serverIdSnake || serverIdCamel;
        const oldColumnName = serverIdSnake ? 'server_id' : 'serverId';

        if (serverId && !messageServerId) {
          // Old column exists → rename it to message_server_id
          logger.debug(
            `[Migration] → Renaming ${tableName}.${oldColumnName} to message_server_id...`
          );
          await db.execute(
            sql.raw(
              `ALTER TABLE "${tableName}" RENAME COLUMN "${oldColumnName}" TO "message_server_id"`
            )
          );
          logger.debug(`[Migration] ✓ Renamed ${tableName}.${oldColumnName} → message_server_id`);

          // If the column was text, try to convert to UUID (if data is UUID-compatible)
          if (serverId.data_type === 'text') {
            // CRITICAL: Drop DEFAULT constraint before type conversion
            // This prevents "default for column cannot be cast automatically" errors
            // Wrap in separate try-catch to ensure we continue even if no default exists
            try {
              logger.debug(
                `[Migration] → Dropping DEFAULT constraint on ${tableName}.message_server_id...`
              );
              await db.execute(
                sql.raw(`ALTER TABLE "${tableName}" ALTER COLUMN "message_server_id" DROP DEFAULT`)
              );
              logger.debug(`[Migration] ✓ Dropped DEFAULT constraint`);
            } catch {
              logger.debug(
                `[Migration] ⊘ No DEFAULT constraint to drop on ${tableName}.message_server_id`
              );
            }

            try {
              logger.debug(
                `[Migration] → Converting ${tableName}.message_server_id from text to uuid...`
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
                `)
              );
              logger.debug(`[Migration] ✓ Converted ${tableName}.message_server_id to uuid`);
            } catch (convertError) {
              logger.warn(
                `[Migration] ⚠️ Could not convert ${tableName}.message_server_id to uuid: ${convertError}`
              );
            }
          }

          // If the column should be NOT NULL but has NULLs, we need to handle that
          // For channels, it's NOT NULL in the new schema
          if (tableName === 'channels') {
            const nullCountResult = await db.execute(
              sql.raw(
                `SELECT COUNT(*) as count FROM "${tableName}" WHERE "message_server_id" IS NULL`
              )
            );
            const nullCount = nullCountResult.rows?.[0]?.count as string | undefined;
            if (nullCount && parseInt(nullCount, 10) > 0) {
              logger.warn(
                `[Migration] ⚠️ ${tableName} has ${nullCount} rows with NULL message_server_id - these will be deleted`
              );
              await db.execute(
                sql.raw(`DELETE FROM "${tableName}" WHERE "message_server_id" IS NULL`)
              );
              logger.debug(
                `[Migration] ✓ Deleted ${nullCount} rows with NULL message_server_id from ${tableName}`
              );
            }

            // Make it NOT NULL
            logger.debug(`[Migration] → Making ${tableName}.message_server_id NOT NULL...`);
            await db.execute(
              sql.raw(`ALTER TABLE "${tableName}" ALTER COLUMN "message_server_id" SET NOT NULL`)
            );
            logger.debug(`[Migration] ✓ Set ${tableName}.message_server_id NOT NULL`);
          }
        } else if (serverId && messageServerId) {
          // Both exist → just drop the old column
          logger.debug(`[Migration] → ${tableName} has both columns, dropping ${oldColumnName}...`);
          await db.execute(
            sql.raw(`ALTER TABLE "${tableName}" DROP COLUMN "${oldColumnName}" CASCADE`)
          );
          logger.debug(`[Migration] ✓ Dropped ${tableName}.${oldColumnName}`);
        } else if (!serverId && messageServerId) {
          // Only message_server_id exists - check if it needs type conversion from TEXT to UUID
          // This handles idempotency when migration partially ran before rollback
          if (messageServerId.data_type === 'text') {
            logger.debug(
              `[Migration] → ${tableName}.message_server_id exists but is TEXT, needs UUID conversion...`
            );

            // CRITICAL: Drop DEFAULT constraint before type conversion
            // This prevents "default for column cannot be cast automatically" errors
            logger.debug(
              `[Migration] → Dropping DEFAULT constraint on ${tableName}.message_server_id...`
            );
            await db.execute(
              sql.raw(`ALTER TABLE "${tableName}" ALTER COLUMN "message_server_id" DROP DEFAULT`)
            );
            logger.debug(`[Migration] ✓ Dropped DEFAULT constraint`);

            // Convert TEXT to UUID using MD5 hash for non-UUID text values
            // This creates deterministic UUIDs from text values, preserving data
            logger.debug(
              `[Migration] → Converting ${tableName}.message_server_id from text to uuid (generating UUIDs from text)...`
            );
            await db.execute(
              sql.raw(`
              ALTER TABLE "${tableName}"
              ALTER COLUMN "message_server_id" TYPE uuid
              USING CASE
                WHEN "message_server_id" ~ '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
                THEN "message_server_id"::uuid
                ELSE md5("message_server_id")::uuid
```