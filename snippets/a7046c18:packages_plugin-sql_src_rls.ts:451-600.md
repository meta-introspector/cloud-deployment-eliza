# a7046c18:packages_plugin-sql_src_rls.ts:451-600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/rls.ts:451-600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
          { src: "plugin:sql", schemaName, tableName },
          "Disabled RLS on table",
        );
      } catch (error) {
        logger.warn(
          { src: "plugin:sql", schemaName, tableName, error: String(error) },
          "Failed to disable RLS on table",
        );
      }
    }

    // Drop the temporary function
    await db.execute(
      sql`DROP FUNCTION IF EXISTS _temp_disable_rls_on_table(text, text)`,
    );

    // 2. KEEP server_id values intact (do NOT clear them)
    // This prevents data theft when re-enabling RLS:
    // - Each row keeps its original server_id
    // - When RLS is re-enabled, only NULL rows are backfilled (new data created while RLS was off)
    // - Existing data remains owned by its original server instance
    logger.info(
      { src: "plugin:sql" },
      "Keeping server_id values intact (prevents data theft on re-enable)",
    );

    // 3. Keep the servers table structure but clear it
    // When RLS is re-enabled, servers will be re-created from server initialization
    logger.info({ src: "plugin:sql" }, "Clearing servers table...");
    await db.execute(sql`TRUNCATE TABLE servers`);

    // 4. Drop all RLS functions
    await db.execute(
      sql`DROP FUNCTION IF EXISTS apply_rls_to_all_tables() CASCADE`,
    );
    await db.execute(
      sql`DROP FUNCTION IF EXISTS add_server_isolation(text, text) CASCADE`,
    );
    await db.execute(sql`DROP FUNCTION IF EXISTS current_server_id() CASCADE`);
    logger.info({ src: "plugin:sql" }, "Dropped all RLS functions");

    logger.info(
      { src: "plugin:sql" },
      "RLS disabled successfully (server_id columns preserved)",
    );
  } catch (error) {
    logger.error(
      { src: "plugin:sql", error: String(error) },
      "Failed to disable RLS",
    );
    throw error;
  }
}

// ============================================================================
// ENTITY RLS
// ============================================================================

/**
 * Install Entity RLS functions for user privacy isolation
 *
 * This provides database-level privacy between different entities (client users: Plugins/API)
 * interacting with agents, independent of JWT authentication.
 *
 * **How Entity RLS Works:**
 * - Each database transaction sets `app.entity_id` before querying
 * - Policies filter rows based on entity ownership or participant membership
 * - Two isolation strategies:
 *   1. Direct ownership: `entity_id` or `author_id` column matches `current_entity_id()`
 *   2. Shared access: `room_id`/`channel_id` exists in `participants` table for the entity
 *
 * **Performance Considerations:**
 * - **Subquery policies** (for `room_id`/`channel_id`) run on EVERY row access
 * - Indexes are automatically created on: `entity_id`, `author_id`, `room_id`, `channel_id`
 * - The `participants` table should have an index on `(entity_id, channel_id)`
 * - For large datasets (>1M rows), consider:
 *   - Materialized views for frequently accessed entity-filtered data
 *   - Partitioning large tables by date or entity_id
 *
 * **Optimization Tips:**
 * - Direct column policies (`entity_id = current_entity_id()`) are faster than subquery policies
 * - The `participants` lookup is cached per transaction but still requires index scans
 *
 * **Tables Excluded from Entity RLS:**
 * - `servers` - Server RLS table
 * - `users` - Authentication (no entity isolation)
 * - `entity_mappings` - Cross-platform entity mapping
 * - `drizzle_migrations`, `__drizzle_migrations` - Migration tracking
 *
 * @param adapter - Database adapter with access to the Drizzle ORM instance
 * @returns Promise that resolves when Entity RLS functions are installed
 * @throws {Error} If database connection fails or SQL execution fails
 *
 * @example
 * ```typescript
 * // Called automatically by installRLSFunctions()
 * await installRLSFunctions(database);
 *
 * // Or call separately if needed
 * await installEntityRLS(database);
 * await applyEntityRLSToAllTables(database);
 * ```
 */
export async function installEntityRLS(
  adapter: IDatabaseAdapter,
): Promise<void> {
  const db = getDb(adapter);

  logger.info("[Entity RLS] Installing entity RLS functions and policies...");

  // 1. Create current_entity_id() function - reads from app.entity_id session variable
  await db.execute(sql`
    CREATE OR REPLACE FUNCTION current_entity_id()
    RETURNS UUID AS $$
    DECLARE
      entity_id_text TEXT;
    BEGIN
      -- Read from transaction-local variable
      entity_id_text := NULLIF(current_setting('app.entity_id', TRUE), '');

      IF entity_id_text IS NULL OR entity_id_text = '' THEN
        RETURN NULL;
      END IF;

      BEGIN
        RETURN entity_id_text::UUID;
      EXCEPTION WHEN OTHERS THEN
        RETURN NULL;
      END;
    END;
    $$ LANGUAGE plpgsql STABLE;
  `);

  logger.info("[Entity RLS] Created current_entity_id() function");

  // 2. Create add_entity_isolation() function - applies entity RLS to a single table
  await db.execute(sql`
    CREATE OR REPLACE FUNCTION add_entity_isolation(
      schema_name text,
      table_name text,
      require_entity boolean DEFAULT false
    ) RETURNS void AS $$
    DECLARE
      full_table_name text;
      has_entity_id boolean;
      has_author_id boolean;
      has_channel_id boolean;
      has_room_id boolean;
      entity_column_name text;
      room_column_name text;
```