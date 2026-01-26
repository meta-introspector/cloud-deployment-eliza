# a7046c18:packages_plugin-sql_src___tests___migration_transaction-and-concurrency.test.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/transaction-and-concurrency.test.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        // This table references a non-existent table, which should cause failure
        testTable2: pgTable("test_should_rollback", {
          id: uuid("id").primaryKey().defaultRandom(),
          // Reference to non-existent table will fail
          fake_ref: uuid("fake_ref").references(
            () => (null as unknown as { id: ReturnType<typeof uuid> }).id,
          ),
        }),
      };

      let migrationFailed = false;
      let _errorMessage = "";
      try {
        await migrator.migrate("@elizaos/transaction-test-fail", failingSchema);
      } catch (error) {
        migrationFailed = true;
        _errorMessage = (error as Error).message || "";
      }

      // The migration should have failed
      expect(migrationFailed).toBe(true);

      // Verify that the first table from the failed migration was NOT created
      // This proves the transaction was rolled back
      const partialTableExists = await db.execute(
        sql.raw(`SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_schema = 'public'
          AND table_name = 'test_partial_migration'
        )`),
      );

      expect(partialTableExists.rows[0]?.exists).toBe(false);

      // Verify no migration record was created for the failed migration
      const failedMigrationRecorded = await db.execute(
        sql.raw(`SELECT COUNT(*) as count
                 FROM migrations._migrations
                 WHERE plugin_name = '@elizaos/transaction-test-fail'`),
      );

      expect(
        parseInt(
          String((failedMigrationRecorded.rows[0] as CountRow).count),
          10,
        ),
      ).toBe(0);

      // Verify no journal entry was created for the failed migration
      const failedJournalRecorded = await db.execute(
        sql.raw(`SELECT COUNT(*) as count
                 FROM migrations._journal
                 WHERE plugin_name = '@elizaos/transaction-test-fail'`),
      );

      expect(
        parseInt(String((failedJournalRecorded.rows[0] as CountRow).count), 10),
      ).toBe(0);
    });

    it("should maintain consistent state across migration failures", async () => {
      // Get initial state
      const initialMigrationCount = await db.execute(
        sql.raw(`SELECT COUNT(*) as count FROM migrations._migrations`),
      );

      const initialTableCount = await db.execute(
        sql.raw(`SELECT COUNT(*) as count 
                 FROM information_schema.tables 
                 WHERE table_schema = 'public'`),
      );

      // Try an migration with invalid reference that will fail
      let errorOccurred = false;
      try {
        const invalidSchema = {
          testTable: pgTable("test_invalid_table", {
            id: uuid("id").primaryKey().defaultRandom(),
            // This will create invalid foreign key reference
            invalid_ref: uuid("invalid_ref").references(
              () =>
                (undefined as unknown as { id: ReturnType<typeof uuid> }).id,
            ),
          }),
        };

        await migrator.migrate(
          "@elizaos/invalid-migration-test",
          invalidSchema,
        );
      } catch (_error) {
        errorOccurred = true;
      }

      expect(errorOccurred).toBe(true);

      // Verify state is unchanged
      const finalMigrationCount = await db.execute(
        sql.raw(`SELECT COUNT(*) as count FROM migrations._migrations`),
      );

      const finalTableCount = await db.execute(
        sql.raw(`SELECT COUNT(*) as count 
                 FROM information_schema.tables 
                 WHERE table_schema = 'public'`),
      );

      expect(
        parseInt(String((finalMigrationCount.rows[0] as CountRow).count), 10),
      ).toBe(
        parseInt(String((initialMigrationCount.rows[0] as CountRow).count), 10),
      );

      expect(
        parseInt(String((finalTableCount.rows[0] as CountRow).count), 10),
      ).toBe(
        parseInt(String((initialTableCount.rows[0] as CountRow).count), 10),
      );
    });
  });

  describe("PostgreSQL Advisory Locks for Concurrent Migrations", () => {
    // Check if we're using real PostgreSQL (not PGLite)
    const postgresUrl = process.env.POSTGRES_URL || "";
    const isRealPostgres =
      postgresUrl &&
      !postgresUrl.includes(":memory:") &&
      !postgresUrl.includes("pglite") &&
      postgresUrl.includes("postgres");

    // Skip advisory lock tests for PGLite since it doesn't support them
    const testOrSkip = isRealPostgres ? it : it.skip;
    testOrSkip(
      "should use advisory locks to prevent concurrent migrations for the same plugin",
      async () => {
        // Use IDENTICAL schemas to test idempotency with concurrent calls
        const schema = {
          testTable: pgTable("test_concurrent_3", {
            id: uuid("id").primaryKey().defaultRandom(),
            data: text("data"),
            version: integer("version").default(1),
          }),
        };

        // Try to run the same plugin migration concurrently with identical schemas
        // Advisory locks should serialize them, and the second one should skip (idempotent)
        const [result1, result2] = await Promise.allSettled([
          migrator.migrate("@elizaos/concurrent-test-same-plugin", schema),
          migrator.migrate("@elizaos/concurrent-test-same-plugin", schema),
        ]);
```