# 5e8c73c1:packages_plugin-sql_src___tests___test-helpers.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-sql/src/__tests__/test-helpers.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
import type { Plugin, UUID } from '@elizaos/core';
import { AgentRuntime } from '@elizaos/core';
import { sql } from 'drizzle-orm';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { v4 } from 'uuid';
import { plugin as sqlPlugin } from '../index';
import { DatabaseMigrationService } from '../migration-service';
import { PgDatabaseAdapter } from '../pg/adapter';
import { PostgresConnectionManager } from '../pg/manager';
import { PgliteDatabaseAdapter } from '../pglite/adapter';
import { PGliteClientManager } from '../pglite/manager';
import { mockCharacter } from './fixtures';

/**
 * Creates a fully initialized, in-memory PGlite database adapter and a corresponding
 * AgentRuntime instance for testing purposes. It uses the dynamic migration system
 * to set up the schema for the core SQL plugin and any additional plugins provided.
 *
 * This is the standard helper for all integration tests in `plugin-sql`.
 *
 * @param testAgentId - The UUID to use for the agent runtime and adapter.
 * @param testPlugins - An array of additional plugins to load and migrate.
 * @returns A promise that resolves to the initialized adapter and runtime.
 */
export async function createTestDatabase(
  testAgentId: UUID,
  testPlugins: Plugin[] = []
): Promise<{
  adapter: PgliteDatabaseAdapter | PgDatabaseAdapter;
  runtime: AgentRuntime;
  cleanup: () => Promise<void>;
}> {
  if (process.env.POSTGRES_URL) {
    // PostgreSQL testing - use superuser for full permissions
    // Transform URL to use postgres:postgres credentials
    const originalUrl = process.env.POSTGRES_URL;
    const superuserUrl = new URL(originalUrl);
    superuserUrl.username = 'postgres';
    superuserUrl.password = 'postgres';

    console.log('[TEST] Using PostgreSQL (superuser) for test database');
    const connectionManager = new PostgresConnectionManager(superuserUrl.toString());
    const adapter = new PgDatabaseAdapter(testAgentId, connectionManager);
    await adapter.init();

    const runtime = new AgentRuntime({
      character: { ...mockCharacter, id: undefined },
      agentId: testAgentId,
      plugins: [sqlPlugin, ...testPlugins],
    });
    runtime.registerDatabaseAdapter(adapter);

    const schemaName = `test_${testAgentId.replace(/-/g, '_')}`;
    const db = connectionManager.getDatabase();

    // Drop schema if it exists to ensure clean state
    await db.execute(sql.raw(`DROP SCHEMA IF EXISTS ${schemaName} CASCADE`));
    await db.execute(sql.raw(`CREATE SCHEMA IF NOT EXISTS ${schemaName}`));
    await db.execute(sql.raw(`SET search_path TO ${schemaName}, public`));

    const migrationService = new DatabaseMigrationService();
    await migrationService.initializeWithDatabase(db);
    migrationService.discoverAndRegisterPluginSchemas([sqlPlugin, ...testPlugins]);
    await migrationService.runAllPluginMigrations();

    await adapter.createAgent({
      id: testAgentId,
      ...mockCharacter,
    } as any);

    const cleanup = async () => {
      await db.execute(sql.raw(`DROP SCHEMA IF EXISTS ${schemaName} CASCADE`));
      await adapter.close();
    };

    return { adapter, runtime, cleanup };
  } else {
    // PGlite testing
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'eliza-test-'));
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

    const migrationService = new DatabaseMigrationService();
    await migrationService.initializeWithDatabase(adapter.getDatabase());
    migrationService.discoverAndRegisterPluginSchemas([sqlPlugin, ...testPlugins]);
    await migrationService.runAllPluginMigrations();

    await adapter.createAgent({
      id: testAgentId,
      ...mockCharacter,
    } as any);

    const cleanup = async () => {
      await adapter.close();
      fs.rmSync(tempDir, { recursive: true, force: true });
    };

    return { adapter, runtime, cleanup };
  }
}

/**
 * Creates a properly isolated test database with automatic cleanup.
 * This function ensures each test has its own isolated database state.
 *
 * @param testName - A unique name for this test to ensure isolation
 * @param testPlugins - Additional plugins to load
 * @returns Database adapter, runtime, and cleanup function
 */
export async function createIsolatedTestDatabase(
  testName: string,
  testPlugins: Plugin[] = []
): Promise<{
  adapter: PgliteDatabaseAdapter | PgDatabaseAdapter;
  runtime: AgentRuntime;
  cleanup: () => Promise<void>;
  testAgentId: UUID;
}> {
  // Generate a unique agent ID for this test
  const testAgentId = v4() as UUID;
  const testId = testName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();

  if (process.env.POSTGRES_URL) {
    // PostgreSQL - use superuser for full control over schema
    // Transform URL to use postgres:postgres credentials (superuser)
    // This ensures tests have full permissions to create/drop tables
    const originalUrl = process.env.POSTGRES_URL;
    const superuserUrl = new URL(originalUrl);
    superuserUrl.username = 'postgres';
    superuserUrl.password = 'postgres';

    console.log(`[TEST] Using PostgreSQL with superuser for: ${testId}`);

    const connectionManager = new PostgresConnectionManager(superuserUrl.toString());
    const adapter = new PgDatabaseAdapter(testAgentId, connectionManager);
    await adapter.init();

    const db = connectionManager.getDatabase();

```