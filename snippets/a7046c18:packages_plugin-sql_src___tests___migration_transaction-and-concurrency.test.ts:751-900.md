# a7046c18:packages_plugin-sql_src___tests___migration_transaction-and-concurrency.test.ts:751-900

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/transaction-and-concurrency.test.ts:751-900
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      );

      // Verify it's a valid bigint
      expect(typeof lockId).toBe("bigint");

      // The actual SQL queries use CAST(${lockIdStr} AS bigint) for safety
      // This ensures proper parameterization through Drizzle's sql tagged template
      const lockIdStr = lockId.toString();

      // Verify the string conversion doesn't introduce invalid characters
      expect(/^\d+$/.test(lockIdStr)).toBe(true);
    });

    it("should reject migration if invalid lock ID is generated", async () => {
      // Save original method
      interface TestableRuntimeMigrator extends RuntimeMigrator {
        getAdvisoryLockId(pluginName: string): bigint;
      }
      const testMigrator = migrator as unknown as TestableRuntimeMigrator;
      const originalGetLockId =
        testMigrator.getAdvisoryLockId.bind(testMigrator);

      try {
        // Mock getAdvisoryLockId to return an invalid value
        testMigrator.getAdvisoryLockId = () => {
          // Return an out-of-range bigint
          return BigInt("99999999999999999999999999999");
        };

        const testSchema = {
          test: pgTable("test_invalid_lock", {
            id: uuid("id").primaryKey().defaultRandom(),
          }),
        };

        // This should throw an error due to invalid lock ID
        await expect(
          migrator.migrate("@elizaos/invalid-lock-test", testSchema),
        ).rejects.toThrow("Invalid advisory lock ID");
      } finally {
        // Restore original method
        testMigrator.getAdvisoryLockId = originalGetLockId;
      }
    });

    it("should handle concurrent migrations safely with advisory locks", async () => {
      // This test verifies that our advisory lock mechanism would prevent
      // race conditions in a real PostgreSQL environment

      const schema1 = {
        testTable: pgTable("test_advisory_concurrent_1", {
          id: uuid("id").primaryKey().defaultRandom(),
          data: text("data"),
        }),
      };

      const schema2 = {
        testTable: pgTable("test_advisory_concurrent_2", {
          id: uuid("id").primaryKey().defaultRandom(),
          data: text("data"),
        }),
      };

      // Run migrations concurrently
      const results = await Promise.allSettled([
        migrator.migrate("@elizaos/advisory-concurrent-test-1", schema1),
        migrator.migrate("@elizaos/advisory-concurrent-test-2", schema2),
      ]);

      // Both should succeed
      expect(results[0].status).toBe("fulfilled");
      expect(results[1].status).toBe("fulfilled");

      // Verify both tables were created
      const tablesExist = await db.execute(
        sql.raw(`
          SELECT COUNT(*) as count 
          FROM information_schema.tables 
          WHERE table_schema = 'public' 
            AND table_name IN ('test_advisory_concurrent_1', 'test_advisory_concurrent_2')
        `),
      );

      expect(
        parseInt(String((tablesExist.rows[0] as CountRow).count), 10),
      ).toBe(2);
    });
  });

  describe("Race Condition Prevention", () => {
    // Check if we're using real PostgreSQL (not PGLite)
    const postgresUrl = process.env.POSTGRES_URL || "";
    const isRealPostgres =
      postgresUrl &&
      !postgresUrl.includes(":memory:") &&
      !postgresUrl.includes("pglite") &&
      postgresUrl.includes("postgres");

    // Skip this test for PGLite since it doesn't support advisory locks
    const testOrSkip = isRealPostgres ? it : it.skip;

    testOrSkip(
      "should handle race condition when lastMigration is initially null",
      async () => {
        // This test verifies the fix for the race condition where:
        // 1. Process A checks and finds lastMigration = null
        // 2. Process B completes a migration while A waits for lock
        // 3. Process A must detect the completion via double-check
        // Note: This only works with real PostgreSQL (advisory locks required)

        const pluginName = "@elizaos/test-race-condition-null-initial";

        const schema1 = {
          testTable: pgTable("test_race_null_initial", {
            id: uuid("id").primaryKey().defaultRandom(),
            data: text("data"),
            version: integer("version").default(1),
          }),
        };

        const schema2 = {
          testTable: pgTable("test_race_null_initial", {
            id: uuid("id").primaryKey().defaultRandom(),
            data: text("data"),
            version: integer("version").default(1), // Same version, should be idempotent
          }),
        };

        // Clean up any existing migration records for this test
        await db.execute(
          sql.raw(
            `DELETE FROM migrations._migrations WHERE plugin_name = '${pluginName}'`,
          ),
        );
        await db.execute(
          sql.raw(
            `DELETE FROM migrations._snapshots WHERE plugin_name = '${pluginName}'`,
          ),
        );

        // Drop the table if it exists
        await db.execute(
          sql.raw(`DROP TABLE IF EXISTS test_race_null_initial`),
        );

        // Create two migrators to simulate two processes
        const migrator1 = new RuntimeMigrator(db);
        const migrator2 = new RuntimeMigrator(db);

        // Run migrations concurrently - both should see no initial migration
```