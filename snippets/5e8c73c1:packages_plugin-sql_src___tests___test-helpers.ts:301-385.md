# 5e8c73c1:packages_plugin-sql_src___tests___test-helpers.ts:301-385

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-sql/src/__tests__/test-helpers.ts:301-385
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
        // Clean up custom schemas
        await db.execute(sql.raw(`DROP SCHEMA IF EXISTS polymarket CASCADE`));
        await db.execute(sql.raw(`DROP SCHEMA IF EXISTS migrations CASCADE`));
        // Clean up migration tables in public schema
        await db.execute(sql.raw(`DROP TABLE IF EXISTS _snapshots CASCADE`));
        await db.execute(sql.raw(`DROP TABLE IF EXISTS _journal CASCADE`));
        await db.execute(sql.raw(`DROP TABLE IF EXISTS _migrations CASCADE`));

        // Restore grants for eliza_test user (PostgreSQL 15+ requires explicit grants on public schema)
        // This is needed because migration tests run as superuser and may affect schema ownership
        await db.execute(sql.raw(`GRANT ALL ON SCHEMA public TO eliza_test`));
        await db.execute(sql.raw(`GRANT USAGE ON SCHEMA public TO eliza_test`));
        await db.execute(sql.raw(`GRANT CREATE ON SCHEMA public TO eliza_test`));
      } catch (error) {
        console.error(`[MIGRATION TEST] Failed to cleanup:`, error);
      }
      await adapter.close();
    };

    return { db, adapter, cleanup, testAgentId };
  } else {
    // PGLite - use unique directory per test
    const tempDir = path.join(os.tmpdir(), `eliza-migration-test-${testId}-${Date.now()}`);
    console.log(`[MIGRATION TEST] Creating isolated PGLite database: ${tempDir}`);

    const connectionManager = new PGliteClientManager({ dataDir: tempDir });
    await connectionManager.initialize();
    const adapter = new PgliteDatabaseAdapter(testAgentId, connectionManager);
    await adapter.init();

    const db = adapter.getDatabase();

    const cleanup = async () => {
      await adapter.close();
      try {
        fs.rmSync(tempDir, { recursive: true, force: true });
      } catch (error) {
        console.error(`[MIGRATION TEST] Failed to remove temp directory ${tempDir}:`, error);
      }
    };

    return { db, adapter, cleanup, testAgentId };
  }
}

/**
 * Creates an isolated test database for schema evolution tests that need to test schema evolution
 * with destructive migrations. This helper manages the ELIZA_ALLOW_DESTRUCTIVE_MIGRATIONS
 * environment variable and provides a clean database for each test.
 *
 * @param testName - A unique name for this test to ensure isolation
 * @returns Database connection, adapter, cleanup function, and environment management
 */
export async function createIsolatedTestDatabaseForSchemaEvolutionTests(testName: string): Promise<{
  db: any; // DrizzleDatabase
  adapter: PgliteDatabaseAdapter | PgDatabaseAdapter;
  cleanup: () => Promise<void>;
  testAgentId: UUID;
  originalDestructiveSetting?: string;
}> {
  // Save original environment variable
  const originalDestructiveSetting = process.env.ELIZA_ALLOW_DESTRUCTIVE_MIGRATIONS;

  // Get the base setup
  const baseSetup = await createIsolatedTestDatabaseForMigration(testName);

  // Enhance cleanup to restore environment variable
  const enhancedCleanup = async () => {
    // Restore original environment variable
    if (originalDestructiveSetting !== undefined) {
      process.env.ELIZA_ALLOW_DESTRUCTIVE_MIGRATIONS = originalDestructiveSetting;
    } else {
      delete process.env.ELIZA_ALLOW_DESTRUCTIVE_MIGRATIONS;
    }

    // Call original cleanup
    await baseSetup.cleanup();
  };

  return {
    ...baseSetup,
    cleanup: enhancedCleanup,
    originalDestructiveSetting,
  };
}
```