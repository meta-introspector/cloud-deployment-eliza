# 5e8c73c1:packages_plugin-sql_src_migrations.ts:601-726

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-sql/src/migrations.ts:601-726
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
      { table: 'rooms', from: 'createdAt', to: 'created_at' },

      // worlds table
      { table: 'worlds', from: 'agentId', to: 'agent_id' },
      { table: 'worlds', from: 'createdAt', to: 'created_at' },

      // memories table
      { table: 'memories', from: 'createdAt', to: 'created_at' },
      { table: 'memories', from: 'entityId', to: 'entity_id' },
      { table: 'memories', from: 'agentId', to: 'agent_id' },
      { table: 'memories', from: 'roomId', to: 'room_id' },
      { table: 'memories', from: 'worldId', to: 'world_id' },

      // components table
      { table: 'components', from: 'entityId', to: 'entity_id' },
      { table: 'components', from: 'agentId', to: 'agent_id' },
      { table: 'components', from: 'roomId', to: 'room_id' },
      { table: 'components', from: 'worldId', to: 'world_id' },
      { table: 'components', from: 'sourceEntityId', to: 'source_entity_id' },
      { table: 'components', from: 'createdAt', to: 'created_at' },

      // participants table
      { table: 'participants', from: 'entityId', to: 'entity_id' },
      { table: 'participants', from: 'roomId', to: 'room_id' },
      { table: 'participants', from: 'agentId', to: 'agent_id' },
      { table: 'participants', from: 'roomState', to: 'room_state' },
      { table: 'participants', from: 'createdAt', to: 'created_at' },

      // relationships table
      { table: 'relationships', from: 'sourceEntityId', to: 'source_entity_id' },
      { table: 'relationships', from: 'targetEntityId', to: 'target_entity_id' },
      { table: 'relationships', from: 'agentId', to: 'agent_id' },
      { table: 'relationships', from: 'createdAt', to: 'created_at' },

      // logs table
      { table: 'logs', from: 'entityId', to: 'entity_id' },
      { table: 'logs', from: 'roomId', to: 'room_id' },
      { table: 'logs', from: 'createdAt', to: 'created_at' },

      // tasks table
      { table: 'tasks', from: 'roomId', to: 'room_id' },
      { table: 'tasks', from: 'worldId', to: 'world_id' },
      { table: 'tasks', from: 'entityId', to: 'entity_id' },
      { table: 'tasks', from: 'createdAt', to: 'created_at' },
      { table: 'tasks', from: 'updatedAt', to: 'updated_at' },

      // agents table
      { table: 'agents', from: 'createdAt', to: 'created_at' },
      { table: 'agents', from: 'updatedAt', to: 'updated_at' },

      // entities table
      { table: 'entities', from: 'agentId', to: 'agent_id' },
      { table: 'entities', from: 'createdAt', to: 'created_at' },

      // embeddings table
      { table: 'embeddings', from: 'memoryId', to: 'memory_id' },
      { table: 'embeddings', from: 'createdAt', to: 'created_at' },

      // cache table
      { table: 'cache', from: 'agentId', to: 'agent_id' },
      { table: 'cache', from: 'createdAt', to: 'created_at' },
      { table: 'cache', from: 'expiresAt', to: 'expires_at' },
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
        const hasOldColumn = columns.some((c: any) => c.column_name === rename.from);
        const hasNewColumn = columns.some((c: any) => c.column_name === rename.to);

        if (hasOldColumn && !hasNewColumn) {
          // Old column exists, new doesn't → RENAME (preserves data!)
          logger.debug(`[Migration] → Renaming ${rename.table}.${rename.from} to ${rename.to}...`);
          await db.execute(
            sql.raw(
              `ALTER TABLE "${rename.table}" RENAME COLUMN "${rename.from}" TO "${rename.to}"`
            )
          );
          logger.debug(`[Migration] ✓ Renamed ${rename.table}.${rename.from} → ${rename.to}`);
        } else if (hasOldColumn && hasNewColumn) {
          // Both exist → drop old (data should be in new already)
          logger.debug(
            `[Migration] → Both columns exist, dropping ${rename.table}.${rename.from}...`
          );
          await db.execute(
            sql.raw(`ALTER TABLE "${rename.table}" DROP COLUMN "${rename.from}" CASCADE`)
          );
          logger.debug(`[Migration] ✓ Dropped ${rename.table}.${rename.from}`);
        }
        // If only new column exists or neither exists, nothing to do
      } catch (error) {
        // Log but continue - table might not exist yet or column might already be renamed
        logger.debug(`[Migration] ⊘ Could not process ${rename.table}.${rename.from}: ${error}`);
      }
    }

    logger.debug('[Migration] ✓ Completed camelCase → snake_case column renames');

    logger.info('[Migration] ✓ Migration complete - pre-1.6.5 → 1.6.5+ schema migration finished');
  } catch (error) {
    // Re-throw errors to prevent RuntimeMigrator from running on broken state
    logger.error('[Migration] Migration failed:', String(error));
    throw error;
  }
}
```