# a7046c18:packages_plugin-sql_src___tests___test-helpers.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/test-helpers.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    const superuserUrl = new URL(originalUrl);
    superuserUrl.username = "postgres";
    superuserUrl.password = "postgres";

    console.log(`[TEST] Using PostgreSQL with superuser for: ${testId}`);

    const connectionManager = new PostgresConnectionManager(
      superuserUrl.toString(),
    );
    const adapter = new PgDatabaseAdapter(testAgentId, connectionManager);
    await adapter.init();

    const db = connectionManager.getDatabase();

    // Clean up custom schemas and migration tables for fresh start
    await db.execute(sql.raw(`DROP SCHEMA IF EXISTS migrations CASCADE`));
    await db.execute(sql.raw(`DROP TABLE IF EXISTS _snapshots CASCADE`));
    await db.execute(sql.raw(`DROP TABLE IF EXISTS _journal CASCADE`));
    await db.execute(sql.raw(`DROP TABLE IF EXISTS _migrations CASCADE`));

    // Drop ALL tables in public schema for clean slate
    await db.execute(
      sql.raw(`
      DO $$ DECLARE
        r RECORD;
      BEGIN
        FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
          EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
        END LOOP;
      END $$;
    `),
    );

    const runtime = new AgentRuntime({
      character: { ...mockCharacter, id: undefined },
      agentId: testAgentId,
      plugins: [sqlPlugin, ...testPlugins],
    });
    runtime.registerDatabaseAdapter(adapter);

    // Run migrations on clean database
    const migrationService = new DatabaseMigrationService();
    await migrationService.initializeWithDatabase(db);
    migrationService.discoverAndRegisterPluginSchemas([
      sqlPlugin,
      ...testPlugins,
    ]);
    await migrationService.runAllPluginMigrations();

    // Create test agent
    await adapter.createAgent({
      id: testAgentId,
      ...mockCharacter,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    const cleanup = async () => {
      // Just close the connection - don't drop tables
      // Tables are dropped at the START of each test, not at the end
      // This ensures tests can run in any order
      await adapter.close();
    };

    return { adapter, runtime, cleanup, testAgentId };
  } else {
    // PGLite - use unique directory per test
    const tempDir = path.join(
      os.tmpdir(),
      `eliza-test-${testId}-${Date.now()}`,
    );
    console.log(`[TEST] Creating isolated PGLite database: ${tempDir}`);

    const connectionManager = new PGliteClientManager({ dataDir: tempDir });
    await connectionManager.initialize();
    const adapter = new PgliteDatabaseAdapter(testAgentId, connectionManager);
    await adapter.init();

    const runtime = new AgentRuntime({
      character: { ...mockCharacter, id: undefined },
      agentId: testAgentId,
      plugins: [sqlPlugin, ...testPlugins],
    });
    runtime.registerDatabaseAdapter(adapter);

    // Run migrations
    const migrationService = new DatabaseMigrationService();
    await migrationService.initializeWithDatabase(adapter.getDatabase());
    migrationService.discoverAndRegisterPluginSchemas([
      sqlPlugin,
      ...testPlugins,
    ]);
    await migrationService.runAllPluginMigrations();

    // Create test agent
    await adapter.createAgent({
      id: testAgentId,
      ...mockCharacter,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    const cleanup = async () => {
      await adapter.close();
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch (error) {
        console.error(
          `[TEST] Failed to remove temp directory ${tempDir}:`,
          error,
        );
      }
    };

    return { adapter, runtime, cleanup, testAgentId };
  }
}

/**
 * Creates an isolated test database specifically for migration testing.
 * This helper provides a clean database with NO migrations run,
 * allowing migration tests to control the entire migration process.
 *
 * @param testName - A unique name for this test to ensure isolation
 * @returns Database connection, adapter, and cleanup function
 */
export async function createIsolatedTestDatabaseForMigration(
  testName: string,
): Promise<{
  db: any; // DrizzleDatabase
  adapter: PgliteDatabaseAdapter | PgDatabaseAdapter;
  cleanup: () => Promise<void>;
  testAgentId: UUID;
}> {
  const testAgentId = v4() as UUID;
  const testId = testName.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();

  if (process.env.POSTGRES_URL) {
    // PostgreSQL - use superuser for migration tests (needs DROP SCHEMA permissions)
    // Transform the URL to use postgres:postgres credentials
    const originalUrl = process.env.POSTGRES_URL;
    const url = new URL(originalUrl);
    url.username = "postgres";
    url.password = "postgres";
    const superuserUrl = url.toString();

    console.log(`[MIGRATION TEST] Using PostgreSQL superuser for: ${testId}`);

    const connectionManager = new PostgresConnectionManager(superuserUrl);
    const adapter = new PgDatabaseAdapter(testAgentId, connectionManager);
```