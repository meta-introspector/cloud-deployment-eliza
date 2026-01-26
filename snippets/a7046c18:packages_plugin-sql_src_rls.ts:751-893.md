# a7046c18:packages_plugin-sql_src_rls.ts:751-893

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/rls.ts:751-893
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      END IF;

      -- Create indexes for efficient entity filtering
      IF room_column_name IS NOT NULL THEN
        EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_room ON %I.%I(%I)',
          table_name, schema_name, table_name, room_column_name);
      END IF;

      IF entity_column_name IS NOT NULL THEN
        EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_entity ON %I.%I(%I)',
          table_name, schema_name, table_name, entity_column_name);
      END IF;
    END;
    $$ LANGUAGE plpgsql;
  `);

  logger.info("[Entity RLS] Created add_entity_isolation() function");

  // 3. Create apply_entity_rls_to_all_tables() function - applies to all eligible tables
  await db.execute(sql`
    CREATE OR REPLACE FUNCTION apply_entity_rls_to_all_tables() RETURNS void AS $$
    DECLARE
      tbl record;
      require_entity_for_table boolean;
    BEGIN
      FOR tbl IN
        SELECT schemaname, tablename
        FROM pg_tables
        WHERE schemaname = 'public'
          AND tablename NOT IN (
            'servers',              -- Server RLS table
            'users',                -- Authentication table (no entity isolation needed)
            'entity_mappings',      -- Mapping table (no entity isolation needed)
            'drizzle_migrations',   -- Migration tracking
            '__drizzle_migrations'  -- Migration tracking
          )
      LOOP
        BEGIN
          -- Apply STRICT mode (require_entity=true) to sensitive user-facing tables
          -- These tables MUST have entity context set to access data
          -- STRICT tables: memories, logs, components, tasks (user data requiring isolation)
          -- NOTE: Excluded tables:
          --   - 'participants': Adding participants is a privileged operation during initialization
          IF tbl.tablename IN ('memories', 'logs', 'components', 'tasks') THEN
            require_entity_for_table := true;
          ELSE
            -- PERMISSIVE mode (require_entity=false) for system/privileged tables
            -- This includes: participants, rooms, channels, entities, etc.
            require_entity_for_table := false;
          END IF;

          PERFORM add_entity_isolation(tbl.schemaname, tbl.tablename, require_entity_for_table);
        EXCEPTION WHEN OTHERS THEN
          RAISE WARNING '[Entity RLS] Failed to apply to %.%: %', tbl.schemaname, tbl.tablename, SQLERRM;
        END;
      END LOOP;
    END;
    $$ LANGUAGE plpgsql;
  `);

  logger.info("[Entity RLS] Created apply_entity_rls_to_all_tables() function");

  logger.info("[Entity RLS] Entity RLS functions installed successfully");
}

/**
 * Apply Entity RLS policies to all eligible tables
 * Call this after installEntityRLS() to activate the policies
 */
export async function applyEntityRLSToAllTables(
  adapter: IDatabaseAdapter,
): Promise<void> {
  const db = getDb(adapter);

  try {
    await db.execute(sql`SELECT apply_entity_rls_to_all_tables()`);
    logger.info("[Entity RLS] Applied entity RLS to all eligible tables");
  } catch (error) {
    logger.warn(
      "[Entity RLS] Failed to apply entity RLS to some tables:",
      String(error),
    );
  }
}

/**
 * Remove Entity RLS (for rollback or testing)
 * Drops entity RLS functions and policies but keeps server RLS intact
 */
export async function uninstallEntityRLS(
  adapter: IDatabaseAdapter,
): Promise<void> {
  const db = getDb(adapter);

  logger.info("[Entity RLS] Removing entity RLS policies and functions...");

  try {
    // First, drop all entity_isolation_policy policies from all tables
    const tablesResult = await db.execute(sql`
      SELECT schemaname, tablename
      FROM pg_tables
      WHERE schemaname = 'public'
        AND tablename NOT IN ('drizzle_migrations', '__drizzle_migrations')
    `);

    for (const row of tablesResult.rows || []) {
      const schemaName = row.schemaname;
      const tableName = row.tablename;

      try {
        // Drop entity_isolation_policy if it exists
        await db.execute(
          sql.raw(
            `DROP POLICY IF EXISTS entity_isolation_policy ON "${schemaName}"."${tableName}"`,
          ),
        );
        logger.debug(
          `[Entity RLS] Dropped entity_isolation_policy from ${schemaName}.${tableName}`,
        );
      } catch (_error) {
        logger.debug(
          `[Entity RLS] No entity policy on ${schemaName}.${tableName}`,
        );
      }
    }

    // Drop the apply function (CASCADE will drop dependencies)
    await db.execute(
      sql`DROP FUNCTION IF EXISTS apply_entity_rls_to_all_tables() CASCADE`,
    );
    await db.execute(
      sql`DROP FUNCTION IF EXISTS add_entity_isolation(text, text) CASCADE`,
    );
    await db.execute(sql`DROP FUNCTION IF EXISTS current_entity_id() CASCADE`);

    logger.info(
      "[Entity RLS] Entity RLS functions and policies removed successfully",
    );
  } catch (error) {
    logger.error("[Entity RLS] Failed to remove entity RLS:", String(error));
    throw error;
  }
}
```