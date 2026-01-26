# a7046c18:packages_plugin-sql_src_rls.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/rls.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      ELSE
        -- Column already exists (RLS was previously enabled then disabled)
        -- Restore the DEFAULT clause (may have been removed during uninstallRLS)
        EXECUTE format('ALTER TABLE %I.%I ALTER COLUMN server_id SET DEFAULT current_server_id()', schema_name, table_name);

        -- Only backfill NULL server_id rows, do NOT steal data from other servers
        EXECUTE format('SELECT COUNT(*) FROM %I.%I WHERE server_id IS NULL', schema_name, table_name) INTO orphaned_count;

        IF orphaned_count > 0 THEN
          RAISE NOTICE 'Backfilling % rows with NULL server_id in %.%', orphaned_count, schema_name, table_name;
          EXECUTE format('UPDATE %I.%I SET server_id = current_server_id() WHERE server_id IS NULL', schema_name, table_name);
        END IF;
      END IF;

      -- Create index for efficient server_id filtering
      EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_server_id ON %I.%I(server_id)', table_name, schema_name, table_name);

      -- Enable RLS on the table
      EXECUTE format('ALTER TABLE %I.%I ENABLE ROW LEVEL SECURITY', schema_name, table_name);

      -- FORCE RLS even for table owners (critical for security)
      EXECUTE format('ALTER TABLE %I.%I FORCE ROW LEVEL SECURITY', schema_name, table_name);

      -- Drop existing policy if present
      EXECUTE format('DROP POLICY IF EXISTS server_isolation_policy ON %I.%I', schema_name, table_name);

      -- Create isolation policy: users can only see/modify rows where server_id matches current server instance
      -- No NULL clause - all rows must have a valid server_id (backfilled during column addition)
      EXECUTE format('
        CREATE POLICY server_isolation_policy ON %I.%I
        USING (server_id = current_server_id())
        WITH CHECK (server_id = current_server_id())
      ', schema_name, table_name);
    END;
    $$ LANGUAGE plpgsql;
  `);

  // Function to apply RLS to all tables
  // SCHEMA COVERAGE: This function automatically applies RLS to ALL tables in the 'public' schema
  // including: agents, rooms, memories, messages, participants, channels, embeddings, relationships,
  // entities, logs, cache, components, tasks, world, message_servers, etc.
  //
  // EXCLUDED tables (not isolated):
  // - servers (contains all server instance IDs, shared for multi-tenant management)
  // - drizzle_migrations, __drizzle_migrations (migration tracking tables)
  //
  // This dynamic approach ensures plugin tables are automatically protected when added.
  await db.execute(sql`
    CREATE OR REPLACE FUNCTION apply_rls_to_all_tables() RETURNS void AS $$
    DECLARE
      tbl record;
    BEGIN
      FOR tbl IN
        SELECT schemaname, tablename
        FROM pg_tables
        WHERE schemaname = 'public'
          AND tablename NOT IN (
            'servers',
            'drizzle_migrations',
            '__drizzle_migrations'
          )
      LOOP
        BEGIN
          PERFORM add_server_isolation(tbl.schemaname, tbl.tablename);
        EXCEPTION WHEN OTHERS THEN
          RAISE WARNING 'Failed to apply RLS to %.%: %', tbl.schemaname, tbl.tablename, SQLERRM;
        END;
      END LOOP;
    END;
    $$ LANGUAGE plpgsql;
  `);

  logger.info({ src: "plugin:sql" }, "RLS PostgreSQL functions installed");

  // Install Entity RLS functions as well (part of unified RLS system)
  await installEntityRLS(adapter);
}

/**
 * Get or create RLS server using Drizzle ORM
 */
export async function getOrCreateRlsServer(
  adapter: IDatabaseAdapter,
  serverId: string,
): Promise<string> {
  const db = getDb(adapter);

  // Use Drizzle's insert with onConflictDoNothing
  await db
    .insert(serverTable)
    .values({
      id: serverId,
    })
    .onConflictDoNothing();

  logger.info(
    { src: "plugin:sql", serverId: serverId.slice(0, 8) },
    "RLS server registered",
  );
  return serverId;
}

/**
 * Set RLS context on PostgreSQL connection pool
 * This function validates that the server exists and has correct UUID format
 */
export async function setServerContext(
  adapter: IDatabaseAdapter,
  serverId: string,
): Promise<void> {
  // Validate UUID format using @elizaos/core utility
  if (!validateUuid(serverId)) {
    throw new Error(
      `Invalid server ID format: ${serverId}. Must be a valid UUID.`,
    );
  }

  // Validate server exists
  const db = getDb(adapter);
  const servers = await db
    .select()
    .from(serverTable)
    .where(eq(serverTable.id, serverId));

  if (servers.length === 0) {
    throw new Error(`Server ${serverId} does not exist`);
  }

  logger.info(
    { src: "plugin:sql", serverId: serverId.slice(0, 8) },
    "RLS context configured",
  );
}

/**
 * Assign agent to server using Drizzle ORM
 */
export async function assignAgentToServer(
  adapter: IDatabaseAdapter,
  agentId: string,
  serverId: string,
): Promise<void> {
  // Validate inputs
  if (!agentId || !serverId) {
    logger.warn(
      `[Data Isolation] Cannot assign agent to server: invalid agentId (${agentId}) or serverId (${serverId})`,
    );
    return;
  }

```