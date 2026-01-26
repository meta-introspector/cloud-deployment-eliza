# a7046c18:packages_plugin-sql_src___tests___migration_transaction-and-concurrency.test.ts:451-600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/transaction-and-concurrency.test.ts:451-600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

        expect(
          parseInt(String((migrationCount.rows[0] as CountRow).count), 10),
        ).toBe(1);

        // Verify table was created exactly once
        const tableExists = await db.execute(
          sql.raw(`SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_schema = 'public' AND table_name = 'test_lock_table'
        )`),
        );

        expect(tableExists.rows[0]?.exists).toBe(true);
      },
    );

    testOrSkip(
      "should release advisory locks after migration completion",
      async () => {
        // Run a migration
        const testSchema = {
          testTable: pgTable("test_lock_cleanup", {
            id: uuid("id").primaryKey().defaultRandom(),
            data: text("data"),
          }),
        };

        await migrator.migrate("@elizaos/concurrent-test-cleanup", testSchema);

        // Check if there are any advisory locks still held
        // PostgreSQL advisory locks can be checked via pg_locks
        const activeLocks = await db.execute(
          sql.raw(`SELECT COUNT(*) as count FROM pg_locks 
                 WHERE locktype = 'advisory' 
                 AND granted = true`),
        );

        const lockCount = parseInt(
          String((activeLocks.rows[0] as CountRow).count),
          10,
        );

        // There might be some locks from other operations, but there shouldn't be
        // an excessive number indicating leaked migration locks
        expect(lockCount).toBeLessThan(10); // Reasonable threshold

        // Try another migration to ensure no stale locks prevent it
        const anotherSchema = {
          testTable: pgTable("test_lock_cleanup_2", {
            id: uuid("id").primaryKey().defaultRandom(),
            data: text("data"),
          }),
        };

        // Should succeed without lock conflicts - migration completes without throwing
        await migrator.migrate(
          "@elizaos/concurrent-test-cleanup-2",
          anotherSchema,
        );

        // Verify table was created
        const tableExists = await db.execute(
          sql.raw(`SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_schema = 'public' AND table_name = 'test_lock_cleanup_2'
        )`),
        );

        expect(tableExists.rows[0]?.exists).toBe(true);
      },
    );

    it("should handle high-concurrency scenarios with advisory locks", async () => {
      // Create many concurrent migrations
      const migrationPromises: Promise<any>[] = [];

      for (let i = 0; i < 10; i++) {
        const schema = {
          testTable: pgTable(`test_concurrent_${i}`, {
            id: uuid("id").primaryKey().defaultRandom(),
            index: integer("index").default(i),
            data: text("data"),
          }),
        };

        migrationPromises.push(
          migrator.migrate(`@elizaos/concurrent-test-high-${i}`, schema),
        );
      }

      // Wait for all migrations to complete
      const results = await Promise.allSettled(migrationPromises);

      // Count successful migrations
      const successfulCount = results.filter(
        (r) => r.status === "fulfilled",
      ).length;
      const failedCount = results.filter((r) => r.status === "rejected").length;

      console.log(
        `High concurrency results: ${successfulCount} successful, ${failedCount} failed`,
      );

      // All should succeed since they're different plugins
      expect(successfulCount).toBe(10);
      expect(failedCount).toBe(0);

      // Verify all migration records exist
      const totalMigrations = await db.execute(
        sql.raw(`SELECT COUNT(*) as count FROM migrations._migrations 
                 WHERE plugin_name LIKE '@elizaos/concurrent-test-high-%'`),
      );

      expect(parseInt((totalMigrations.rows[0] as any).count, 10)).toBe(10);

      // Verify all tables were created
      const createdTables = await db.execute(
        sql.raw(`SELECT COUNT(*) as count FROM information_schema.tables 
                 WHERE table_schema = 'public' 
                 AND table_name LIKE 'test_concurrent_%'`),
      );

      expect(
        parseInt((createdTables.rows[0] as any).count, 10),
      ).toBeGreaterThanOrEqual(10);
    });

    it("should handle errors in one migration without affecting others", async () => {
      const validSchema = {
        testTable: pgTable("test_concurrent_4", {
          id: uuid("id").primaryKey().defaultRandom(),
          data: text("data"),
        }),
      };

      // Create an actually invalid schema that will cause an error
      const invalidSchema = {
        testTable: pgTable("test_invalid_concurrent", {
          id: uuid("id").primaryKey().defaultRandom(),
          // This will cause an error during migration due to invalid reference
          bad_ref: uuid("bad_ref").references(
            () => (null as unknown as { id: ReturnType<typeof uuid> }).id,
          ),
        }),
      };

      // Run one valid and one invalid migration concurrently
      const [validResult, invalidResult] = await Promise.allSettled([
        migrator.migrate("@elizaos/concurrent-test-valid", validSchema),
```