# a7046c18:packages_plugin-sql_src___tests___migration_runtime-migrator.test.ts:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/runtime-migrator.test.ts:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      );

      const fkCount = parseInt(String((result.rows[0] as CountRow).count), 10);
      expect(fkCount).toBeGreaterThan(0);

      if (fkCount > 0) {
        testResults.passed.push(`Foreign keys created: ${fkCount}`);
      } else {
        testResults.failed.push("No foreign keys created");
      }
    });

    it("should create unique constraints", async () => {
      const result = await db.execute(
        sql`SELECT constraint_name, table_name
            FROM information_schema.table_constraints
            WHERE table_schema = 'public'
            AND constraint_type = 'UNIQUE'`,
      );

      const uniqueCount = result.rows.length;
      expect(uniqueCount).toBeGreaterThan(0);

      if (uniqueCount > 0) {
        testResults.passed.push(`Unique constraints created: ${uniqueCount}`);

        // Check specific unique constraint on agents.name
        const hasAgentNameUnique = result.rows.some(
          (r: any) =>
            r.table_name === "agents" && r.constraint_name === "name_unique",
        );

        if (hasAgentNameUnique) {
          testResults.passed.push("agents.name unique constraint created");
        } else {
          testResults.failed.push("agents.name unique constraint missing");
        }
      } else {
        testResults.failed.push("No unique constraints created");
      }
    });
  });

  describe("Idempotency", () => {
    it("should handle running the same migration twice", async () => {
      // Run migration again - should not fail or create duplicates
      await migrator.migrate("plugin-sql", schema);

      // Check that we still have only one migration record
      const result = await db.execute(
        sql`SELECT COUNT(*) as count
            FROM migrations._migrations
            WHERE plugin_name = 'plugin-sql'`,
      );

      const count = parseInt(String((result.rows[0] as CountRow).count), 10);
      expect(count).toBe(1);

      if (count === 1) {
        testResults.passed.push("Idempotency: Migration not duplicated");
      } else {
        testResults.failed.push(
          `Idempotency: Found ${count} migrations instead of 1`,
        );
      }
    });

    it("should detect when no changes are needed", async () => {
      const status = await migrator.getStatus("plugin-sql");
      expect(status.hasRun).toBe(true);

      if (status.hasRun) {
        testResults.passed.push("Migration status correctly tracked");
      } else {
        testResults.failed.push("Migration status not tracked");
      }
    });
  });

  describe("Schema Evolution Support", () => {
    it("should support ALTER operations (when schema changes)", async () => {
      // This would test ALTER column functionality when we have schema changes
      // For now, just verify the infrastructure is in place

      // Check that we have snapshot comparison capability
      const status = await migrator.getStatus("plugin-sql");
      expect(status.snapshots).toBeGreaterThan(0);

      if (status.snapshots > 0) {
        testResults.passed.push(
          "Schema evolution: Snapshots stored for comparison",
        );
      } else {
        testResults.failed.push("Schema evolution: No snapshots stored");
      }
    });

    it("should track migration history properly", async () => {
      const journal = await db.execute(
        sql`SELECT entries FROM migrations._journal 
            WHERE plugin_name = 'plugin-sql'`,
      );

      if (journal.rows.length > 0) {
        const entries = (journal.rows[0] as JournalRow).entries;
        expect(entries.length).toBeGreaterThan(0);

        if (entries.length > 0) {
          testResults.passed.push(
            `Migration history: ${entries.length} entries tracked`,
          );
        } else {
          testResults.failed.push("Migration history: No entries in journal");
        }
      } else {
        testResults.failed.push("Migration history: Journal not found");
      }
    });
  });

  describe("Index Creation", () => {
    it("should create indexes on tables", async () => {
      // First, let's see ALL indexes
      const allIndexes = await db.execute(
        sql`SELECT schemaname, tablename, indexname
            FROM pg_indexes
            WHERE schemaname = 'public'`,
      );
      console.log("All indexes in public schema:", allIndexes.rows);

      // Then check for idx_ prefixed ones
      const result = await db.execute(
        sql`SELECT COUNT(*) as count
            FROM pg_indexes
            WHERE schemaname = 'public'
            AND indexname LIKE 'idx_%'`,
      );

      const indexCount = parseInt(
        String((result.rows[0] as CountRow).count),
        10,
      );
      console.log("Count of idx_ indexes:", indexCount);

      // Our schema does create indexes with idx_ prefix
      if (indexCount > 0) {
        testResults.passed.push(`Indexes created: ${indexCount}`);
      } else {
        testResults.failed.push("🔴 CRITICAL GAP: No indexes created");
      }
```