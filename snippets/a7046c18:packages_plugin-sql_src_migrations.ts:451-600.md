# a7046c18:packages_plugin-sql_src_migrations.ts:451-600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/migrations.ts:451-600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        await db.execute(
          sql.raw(
            `ALTER TABLE "agents" RENAME COLUMN "owner_id" TO "server_id"`,
          ),
        );
        logger.debug("[Migration] ✓ Renamed agents.owner_id → server_id");
      } else if (hasOwnerId && hasServerId) {
        // Both exist - drop owner_id (data should be in server_id)
        logger.debug(
          "[Migration] → Both owner_id and server_id exist, dropping owner_id...",
        );
        await db.execute(
          sql.raw(`ALTER TABLE "agents" DROP COLUMN "owner_id" CASCADE`),
        );
        logger.debug("[Migration] ✓ Dropped agents.owner_id");
      } else {
        logger.debug(
          "[Migration] ⊘ agents table already has server_id (or no owner_id), skipping",
        );
      }
    } catch (_error) {
      logger.debug("[Migration] ⊘ Could not check/migrate agents.owner_id");
    }

    // Migrate data from obsolete 'owners' table to 'servers' (if owners exists)
    // v1.6.4 used owners table, v1.6.5+ uses servers table
    logger.debug(
      "[Migration] → Checking for owners → servers data migration...",
    );
    try {
      const ownersTableResult = await db.execute(sql`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name = 'owners'
      `);

      if (ownersTableResult.rows && ownersTableResult.rows.length > 0) {
        // First, ensure servers table exists
        logger.debug("[Migration] → Ensuring servers table exists...");
        await db.execute(
          sql.raw(`
          CREATE TABLE IF NOT EXISTS "servers" (
            "id" uuid PRIMARY KEY,
            "created_at" timestamp with time zone DEFAULT now() NOT NULL,
            "updated_at" timestamp with time zone DEFAULT now() NOT NULL
          )
        `),
        );

        // Migrate data from owners to servers (if any)
        logger.debug("[Migration] → Migrating owners data to servers...");
        await db.execute(
          sql.raw(`
          INSERT INTO "servers" ("id", "created_at", "updated_at")
          SELECT "id", COALESCE("created_at", now()), COALESCE("updated_at", now())
          FROM "owners"
          ON CONFLICT ("id") DO NOTHING
        `),
        );
        logger.debug("[Migration] ✓ Migrated owners data to servers");

        // Now safe to drop owners table
        logger.debug("[Migration] → Dropping obsolete owners table...");
        await db.execute(sql.raw(`DROP TABLE IF EXISTS "owners" CASCADE`));
        logger.debug("[Migration] ✓ Dropped obsolete owners table");
      } else {
        logger.debug("[Migration] ⊘ owners table not found, skipping");
      }
    } catch (error) {
      logger.warn(`[Migration] ⚠️ Could not migrate owners → servers: ${error}`);
    }

    // Special handling for server_agents → message_server_agents rename
    // This aligns with the server_id → message_server_id naming convention
    logger.debug("[Migration] → Checking server_agents table rename...");
    try {
      const tablesResult = await db.execute(sql`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
          AND table_name IN ('server_agents', 'message_server_agents')
        ORDER BY table_name
      `);

      const tables = tablesResult.rows || [];
      const hasServerAgents = tables.some(
        (t: any) => t.table_name === "server_agents",
      );
      const hasMessageServerAgents = tables.some(
        (t: any) => t.table_name === "message_server_agents",
      );

      if (hasServerAgents && !hasMessageServerAgents) {
        // Rename server_agents → message_server_agents
        logger.debug(
          "[Migration] → Renaming server_agents to message_server_agents...",
        );
        await db.execute(
          sql.raw(
            `ALTER TABLE "server_agents" RENAME TO "message_server_agents"`,
          ),
        );
        logger.debug(
          "[Migration] ✓ Renamed server_agents → message_server_agents",
        );

        // Now rename server_id column → message_server_id
        logger.debug(
          "[Migration] → Renaming message_server_agents.server_id to message_server_id...",
        );
        await db.execute(
          sql.raw(
            `ALTER TABLE "message_server_agents" RENAME COLUMN "server_id" TO "message_server_id"`,
          ),
        );
        logger.debug(
          "[Migration] ✓ Renamed message_server_agents.server_id → message_server_id",
        );
      } else if (!hasServerAgents && !hasMessageServerAgents) {
        // Neither table exists - RuntimeMigrator will create message_server_agents
        logger.debug("[Migration] ⊘ No server_agents table to migrate");
      } else if (hasMessageServerAgents) {
        // Check if it has the columns and rename if needed
        logger.debug("[Migration] → Checking message_server_agents columns...");
        const columnsResult = await db.execute(sql`
          SELECT column_name
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = 'message_server_agents'
            AND column_name IN ('server_id', 'message_server_id')
          ORDER BY column_name
        `);

        const columns = columnsResult.rows || [];
        const hasServerId = columns.some(
          (c: any) => c.column_name === "server_id",
        );
        const hasMessageServerId = columns.some(
          (c: any) => c.column_name === "message_server_id",
        );

        if (hasServerId && !hasMessageServerId) {
          // Rename server_id → message_server_id
          logger.debug(
            "[Migration] → Renaming message_server_agents.server_id to message_server_id...",
          );
          await db.execute(
            sql.raw(
              `ALTER TABLE "message_server_agents" RENAME COLUMN "server_id" TO "message_server_id"`,
```