# a7046c18:packages_plugin-sql_src_migrations.ts:751-876

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/migrations.ts:751-876
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      { table: "participants", from: "agentId", to: "agent_id" },
      { table: "participants", from: "roomState", to: "room_state" },
      { table: "participants", from: "createdAt", to: "created_at" },

      // relationships table
      {
        table: "relationships",
        from: "sourceEntityId",
        to: "source_entity_id",
      },
      {
        table: "relationships",
        from: "targetEntityId",
        to: "target_entity_id",
      },
      { table: "relationships", from: "agentId", to: "agent_id" },
      { table: "relationships", from: "createdAt", to: "created_at" },

      // logs table
      { table: "logs", from: "entityId", to: "entity_id" },
      { table: "logs", from: "roomId", to: "room_id" },
      { table: "logs", from: "createdAt", to: "created_at" },

      // tasks table
      { table: "tasks", from: "roomId", to: "room_id" },
      { table: "tasks", from: "worldId", to: "world_id" },
      { table: "tasks", from: "entityId", to: "entity_id" },
      { table: "tasks", from: "createdAt", to: "created_at" },
      { table: "tasks", from: "updatedAt", to: "updated_at" },

      // agents table
      { table: "agents", from: "createdAt", to: "created_at" },
      { table: "agents", from: "updatedAt", to: "updated_at" },

      // entities table
      { table: "entities", from: "agentId", to: "agent_id" },
      { table: "entities", from: "createdAt", to: "created_at" },

      // embeddings table
      { table: "embeddings", from: "memoryId", to: "memory_id" },
      { table: "embeddings", from: "createdAt", to: "created_at" },

      // cache table
      { table: "cache", from: "agentId", to: "agent_id" },
      { table: "cache", from: "createdAt", to: "created_at" },
      { table: "cache", from: "expiresAt", to: "expires_at" },
    ];

    for (const rename of columnRenames) {
      try {
        // Check if table exists first
        const tableExistsResult = await db.execute(sql`
          SELECT 1 FROM information_schema.tables
          WHERE table_schema = 'public' AND table_name = ${rename.table}
        `);

        if (!tableExistsResult.rows || tableExistsResult.rows.length === 0) {
          // Table doesn't exist yet, skip
          continue;
        }

        // Check which columns exist
        const columnsResult = await db.execute(sql`
          SELECT column_name
          FROM information_schema.columns
          WHERE table_schema = 'public'
            AND table_name = ${rename.table}
            AND column_name IN (${rename.from}, ${rename.to})
          ORDER BY column_name
        `);

        const columns = columnsResult.rows || [];
        const hasOldColumn = columns.some(
          (c: any) => c.column_name === rename.from,
        );
        const hasNewColumn = columns.some(
          (c: any) => c.column_name === rename.to,
        );

        if (hasOldColumn && !hasNewColumn) {
          // Old column exists, new doesn't → RENAME (preserves data!)
          logger.debug(
            `[Migration] → Renaming ${rename.table}.${rename.from} to ${rename.to}...`,
          );
          await db.execute(
            sql.raw(
              `ALTER TABLE "${rename.table}" RENAME COLUMN "${rename.from}" TO "${rename.to}"`,
            ),
          );
          logger.debug(
            `[Migration] ✓ Renamed ${rename.table}.${rename.from} → ${rename.to}`,
          );
        } else if (hasOldColumn && hasNewColumn) {
          // Both exist → drop old (data should be in new already)
          logger.debug(
            `[Migration] → Both columns exist, dropping ${rename.table}.${rename.from}...`,
          );
          await db.execute(
            sql.raw(
              `ALTER TABLE "${rename.table}" DROP COLUMN "${rename.from}" CASCADE`,
            ),
          );
          logger.debug(`[Migration] ✓ Dropped ${rename.table}.${rename.from}`);
        }
        // If only new column exists or neither exists, nothing to do
      } catch (error) {
        // Log but continue - table might not exist yet or column might already be renamed
        logger.debug(
          `[Migration] ⊘ Could not process ${rename.table}.${rename.from}: ${error}`,
        );
      }
    }

    logger.debug(
      "[Migration] ✓ Completed camelCase → snake_case column renames",
    );

    logger.info(
      "[Migration] ✓ Migration complete - pre-1.6.5 → 1.6.5+ schema migration finished",
    );
  } catch (error) {
    // Re-throw errors to prevent RuntimeMigrator from running on broken state
    logger.error("[Migration] Migration failed:", String(error));
    throw error;
  }
}
```