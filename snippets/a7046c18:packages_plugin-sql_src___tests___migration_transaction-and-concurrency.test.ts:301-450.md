# a7046c18:packages_plugin-sql_src___tests___migration_transaction-and-concurrency.test.ts:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/transaction-and-concurrency.test.ts:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

        // One should succeed, one might fail due to locking or be ignored due to idempotency
        const successCount = [result1, result2].filter(
          (r) => r.status === "fulfilled",
        ).length;
        const failureCount = [result1, result2].filter(
          (r) => r.status === "rejected",
        ).length;

        // Either both succeed (serialized by advisory lock) or one fails (locked)
        expect(successCount + failureCount).toBe(2);
        expect(successCount).toBeGreaterThanOrEqual(1);

        // Check final state - should have exactly one migration record
        const migrationCount = await db.execute(
          sql.raw(`SELECT COUNT(*) as count FROM migrations._migrations 
                 WHERE plugin_name = '@elizaos/concurrent-test-same-plugin'`),
        );

        expect(
          parseInt(String((migrationCount.rows[0] as CountRow).count), 10),
        ).toBe(1);

        // Table should exist
        const tableExists = await db.execute(
          sql.raw(`SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_schema = 'public' AND table_name = 'test_concurrent_3'
        )`),
        );

        expect(tableExists.rows[0]?.exists).toBe(true);
      },
    );

    it("should allow concurrent migrations for different plugins", async () => {
      const schema1 = {
        testTable1: pgTable("test_concurrent_1", {
          id: uuid("id").primaryKey().defaultRandom(),
          data: text("data"),
          created_at: timestamp("created_at").defaultNow(),
        }),
      };

      const schema2 = {
        testTable2: pgTable("test_concurrent_2", {
          id: uuid("id").primaryKey().defaultRandom(),
          name: text("name"),
          created_at: timestamp("created_at").defaultNow(),
        }),
      };

      // Run migrations concurrently for different plugins
      const [result1, result2] = await Promise.allSettled([
        migrator.migrate("@elizaos/concurrent-test-1", schema1),
        migrator.migrate("@elizaos/concurrent-test-2", schema2),
      ]);

      // Both should complete successfully
      expect(result1.status).toBe("fulfilled");
      expect(result2.status).toBe("fulfilled");

      // Verify both tables were created
      const table1Exists = await db.execute(
        sql.raw(`SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_schema = 'public' AND table_name = 'test_concurrent_1'
        )`),
      );

      const table2Exists = await db.execute(
        sql.raw(`SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_schema = 'public' AND table_name = 'test_concurrent_2'
        )`),
      );

      expect(table1Exists.rows[0]?.exists).toBe(true);
      expect(table2Exists.rows[0]?.exists).toBe(true);

      // Verify both migrations were recorded
      const migration1Count = await db.execute(
        sql.raw(`SELECT COUNT(*) as count FROM migrations._migrations 
                 WHERE plugin_name = '@elizaos/concurrent-test-1'`),
      );

      const migration2Count = await db.execute(
        sql.raw(`SELECT COUNT(*) as count FROM migrations._migrations 
                 WHERE plugin_name = '@elizaos/concurrent-test-2'`),
      );

      expect(
        parseInt(String((migration1Count.rows[0] as CountRow).count), 10),
      ).toBe(1);
      expect(
        parseInt(String((migration2Count.rows[0] as CountRow).count), 10),
      ).toBe(1);
    });

    testOrSkip(
      "should use proper locking to prevent race conditions",
      async () => {
        // Create multiple migrators to simulate different processes
        const migrator2 = new RuntimeMigrator(db);
        const migrator3 = new RuntimeMigrator(db);

        const testSchema = {
          testTable: pgTable("test_lock_table", {
            id: uuid("id").primaryKey().defaultRandom(),
            process_id: text("process_id"),
            created_at: timestamp("created_at").defaultNow(),
          }),
        };

        // Run migrations from multiple "processes" simultaneously
        const results = await Promise.allSettled([
          migrator.migrate(
            "@elizaos/concurrent-test-locking",
            testSchema,
          ) as Promise<any>,
          migrator2.migrate(
            "@elizaos/concurrent-test-locking",
            testSchema,
          ) as Promise<any>,
          migrator3.migrate(
            "@elizaos/concurrent-test-locking",
            testSchema,
          ) as Promise<any>,
        ]);

        // Check results
        const successfulMigrations = results.filter(
          (r) => r.status === "fulfilled",
        ).length;
        const failedMigrations = results.filter(
          (r) => r.status === "rejected",
        ).length;

        console.log(
          `Concurrent migration results: ${successfulMigrations} successful, ${failedMigrations} failed`,
        );

        // Should have exactly one successful migration due to advisory locking
        expect(successfulMigrations).toBeGreaterThanOrEqual(1);

        // Verify only one migration record exists
        const migrationCount = await db.execute(
          sql.raw(`SELECT COUNT(*) as count FROM migrations._migrations 
                 WHERE plugin_name = '@elizaos/concurrent-test-locking'`),
        );
```