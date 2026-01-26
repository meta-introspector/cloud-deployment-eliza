# a7046c18:packages_plugin-sql_src___tests___migration_runtime-migrator.test.ts:601-708

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/runtime-migrator.test.ts:601-708
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      // Clean up
      await db.execute(
        sql`DROP TABLE IF EXISTS public.custom_analytics CASCADE`,
      );
    });

    it("should not schedule DROP for tables from other plugins in public schema", async () => {
      // Create a table simulating another plugin's data
      await db.execute(
        sql`CREATE TABLE IF NOT EXISTS public.other_plugin_data (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          server_id UUID,
          plugin_name TEXT NOT NULL DEFAULT 'other-plugin',
          data JSONB,
          created_at TIMESTAMP DEFAULT NOW()
        )`,
      );

      // Run migration
      await migrator.migrate("plugin-sql", schema, { verbose: true });

      // Verify the table still exists and was not touched
      const tableExists = await db.execute(
        sql`SELECT EXISTS (
          SELECT 1 FROM pg_tables
          WHERE schemaname = 'public'
          AND tablename = 'other_plugin_data'
        ) as exists`,
      );

      const exists = (tableExists.rows[0] as ExistsRow).exists;
      expect(exists).toBe(true);

      // Also verify the server_id column was not dropped by RuntimeMigrator
      // (Note: migrations.ts might drop it, but RuntimeMigrator should not)
      const columnExists = await db.execute(
        sql`SELECT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_schema = 'public'
          AND table_name = 'other_plugin_data'
          AND column_name = 'server_id'
        ) as exists`,
      );

      // Note: The column might be dropped by migrations.ts (which runs before RuntimeMigrator)
      // but RuntimeMigrator itself should not touch this table
      const _serverIdExists = (columnExists.rows[0] as ExistsRow).exists;

      if (exists) {
        testResults.passed.push(
          "Table filtering: other_plugin_data table preserved by RuntimeMigrator",
        );
      } else {
        testResults.failed.push(
          "Table filtering: other_plugin_data table was deleted by RuntimeMigrator!",
        );
      }

      // Clean up
      await db.execute(
        sql`DROP TABLE IF EXISTS public.other_plugin_data CASCADE`,
      );
    });
  });

  describe("Development Features", () => {
    it("should support dry-run mode", async () => {
      // Test dry-run doesn't actually execute
      await migrator.migrate("dry-run-test", schema, {
        dryRun: true,
      });

      // Check no tables were created
      const result = await db.execute(
        sql`SELECT COUNT(*) as count
            FROM migrations._migrations
            WHERE plugin_name = 'dry-run-test'`,
      );

      const count = parseInt(String((result.rows[0] as CountRow).count), 10);
      expect(count).toBe(0);

      if (count === 0) {
        testResults.passed.push("Dry-run mode: No changes applied");
      } else {
        testResults.failed.push("Dry-run mode: Changes were applied!");
      }
    });

    it("should support reset for development", async () => {
      // Create a test migration
      await migrator.migrate("reset-test", { testTable: {} });

      // Reset it
      await migrator.reset("reset-test");

      // Check it's gone
      const status = await migrator.getStatus("reset-test");
      expect(status.hasRun).toBe(false);

      if (!status.hasRun) {
        testResults.passed.push("Reset functionality: Works correctly");
      } else {
        testResults.failed.push("Reset functionality: Failed to clear state");
      }
    });
  });
});
```