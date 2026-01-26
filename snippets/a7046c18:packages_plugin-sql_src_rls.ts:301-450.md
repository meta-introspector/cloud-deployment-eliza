# a7046c18:packages_plugin-sql_src_rls.ts:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/rls.ts:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  const db = getDb(adapter);

  // Check if agent exists using Drizzle
  const agents = await db
    .select()
    .from(agentTable)
    .where(eq(agentTable.id, agentId));

  if (agents.length > 0) {
    const agent = agents[0];
    const currentServerId = agent.server_id;

    if (currentServerId === serverId) {
      logger.debug(
        { src: "plugin:sql", agentName: agent.name },
        "Agent already assigned to correct server",
      );
    } else {
      // Update agent server using Drizzle
      await db
        .update(agentTable)
        .set({ server_id: serverId })
        .where(eq(agentTable.id, agentId));

      if (currentServerId === null) {
        logger.info(
          { src: "plugin:sql", agentName: agent.name },
          "Agent assigned to server",
        );
      } else {
        logger.warn(
          { src: "plugin:sql", agentName: agent.name },
          "Agent server changed",
        );
      }
    }
  } else {
    logger.debug({ src: "plugin:sql", agentId }, "Agent does not exist yet");
  }
}

/**
 * Apply RLS to all tables by calling PostgreSQL function
 */
export async function applyRLSToNewTables(
  adapter: IDatabaseAdapter,
): Promise<void> {
  const db = getDb(adapter);

  try {
    await db.execute(sql`SELECT apply_rls_to_all_tables()`);
    logger.info({ src: "plugin:sql" }, "RLS applied to all tables");
  } catch (error) {
    logger.warn(
      { src: "plugin:sql", error: String(error) },
      "Failed to apply RLS to some tables",
    );
  }
}

/**
 * Disable RLS globally
 * SIMPLE APPROACH:
 * - Disables RLS for ALL server instances
 * - Keeps server_id columns and data intact
 * - Use only in development or when migrating to single-server mode
 */
export async function uninstallRLS(adapter: IDatabaseAdapter): Promise<void> {
  const db = getDb(adapter);

  try {
    // Check if RLS is actually enabled by checking if the servers table exists
    const checkResult = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM pg_tables
        WHERE schemaname = 'public' AND tablename = 'servers'
      ) as rls_enabled
    `);

    const rlsEnabled = checkResult.rows?.[0]?.rls_enabled;

    if (!rlsEnabled) {
      logger.debug(
        { src: "plugin:sql" },
        "RLS not installed, skipping cleanup",
      );
      return;
    }

    logger.info(
      { src: "plugin:sql" },
      "Disabling RLS globally (keeping server_id columns for schema compatibility)...",
    );

    // First, uninstall Entity RLS (depends on Server RLS)
    try {
      await uninstallEntityRLS(adapter);
    } catch (_entityRlsError) {
      logger.debug(
        { src: "plugin:sql" },
        "Entity RLS cleanup skipped (not installed or already cleaned)",
      );
    }

    // Create a temporary stored procedure to safely drop policies and disable RLS
    // Using format() with %I ensures proper identifier quoting and prevents SQL injection
    await db.execute(sql`
      CREATE OR REPLACE FUNCTION _temp_disable_rls_on_table(
        p_schema_name text,
        p_table_name text
      ) RETURNS void AS $$
      DECLARE
        policy_rec record;
      BEGIN
        -- Drop all policies on this table
        FOR policy_rec IN
          SELECT policyname
          FROM pg_policies
          WHERE schemaname = p_schema_name AND tablename = p_table_name
        LOOP
          EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I',
            policy_rec.policyname, p_schema_name, p_table_name);
        END LOOP;

        -- Disable RLS
        EXECUTE format('ALTER TABLE %I.%I NO FORCE ROW LEVEL SECURITY', p_schema_name, p_table_name);
        EXECUTE format('ALTER TABLE %I.%I DISABLE ROW LEVEL SECURITY', p_schema_name, p_table_name);
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Get all tables in public schema
    const tablesResult = await db.execute(sql`
      SELECT schemaname, tablename
      FROM pg_tables
      WHERE schemaname = 'public'
        AND tablename NOT IN ('drizzle_migrations', '__drizzle_migrations')
    `);

    // Safely disable RLS on each table using the stored procedure
    for (const row of tablesResult.rows || []) {
      const schemaName = row.schemaname;
      const tableName = row.tablename;

      try {
        // Call stored procedure with parameterized query (safe from SQL injection)
        await db.execute(
          sql`SELECT _temp_disable_rls_on_table(${schemaName}, ${tableName})`,
        );
        logger.debug(
```