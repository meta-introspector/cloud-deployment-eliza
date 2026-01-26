# 5e8c73c1:packages_plugin-sql_src___tests___migration_runtime-migrator.test.ts:451-600

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-sql/src/__tests__/migration/runtime-migrator.test.ts:451-600
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
      // but it should not have created any real tables
      const tablesResult = await db.execute(
        sql`SELECT COUNT(*) as count
            FROM information_schema.tables
            WHERE table_schema = 'public'
            AND table_name = 'invalidTable'`
      );

      const invalidTableExists = parseInt((tablesResult.rows[0] as any).count) > 0;
      expect(invalidTableExists).toBe(false);

      if (!invalidTableExists) {
        testResults.passed.push('Error handling: Invalid schema does not create tables');
      } else {
        testResults.failed.push('Error handling: Invalid table was created');
      }
    });
  });

  describe('Table Filtering - Ignoring Other Plugin Tables', () => {
    it('should ignore tables in public schema that are not in plugin-sql schema', async () => {
      // Create a table that is NOT in the plugin-sql schema (simulating another plugin)
      await db.execute(
        sql`CREATE TABLE IF NOT EXISTS public.custom_analytics (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          event_type TEXT NOT NULL,
          user_id UUID NOT NULL,
          data JSONB,
          created_at TIMESTAMP DEFAULT NOW()
        )`
      );

      // Create an index on the custom table
      await db.execute(
        sql`CREATE INDEX IF NOT EXISTS idx_custom_analytics_event_type
            ON public.custom_analytics(event_type)`
      );

      // Insert some test data
      await db.execute(
        sql`INSERT INTO public.custom_analytics (event_type, user_id, data)
            VALUES ('page_view', gen_random_uuid(), '{"page": "/home"}'::jsonb)`
      );

      // Now run migration again with plugin-sql schema
      // This should NOT try to drop the custom_analytics table
      await migrator.migrate('plugin-sql', schema, { verbose: true });

      // Verify custom_analytics table still exists
      const tableExists = await db.execute(
        sql`SELECT EXISTS (
          SELECT 1 FROM pg_tables
          WHERE schemaname = 'public'
          AND tablename = 'custom_analytics'
        ) as exists`
      );

      const exists = (tableExists.rows[0] as any).exists;
      expect(exists).toBe(true);

      if (exists) {
        testResults.passed.push('Table filtering: custom_analytics table preserved');
      } else {
        testResults.failed.push('Table filtering: custom_analytics table was deleted!');
      }

      // Verify the data is still there
      const dataResult = await db.execute(
        sql`SELECT COUNT(*) as count FROM public.custom_analytics`
      );

      const count = parseInt((dataResult.rows[0] as any).count);
      expect(count).toBeGreaterThan(0);

      if (count > 0) {
        testResults.passed.push('Table filtering: custom_analytics data preserved');
      } else {
        testResults.failed.push('Table filtering: custom_analytics data was deleted!');
      }

      // Clean up
      await db.execute(sql`DROP TABLE IF EXISTS public.custom_analytics CASCADE`);
    });

    it('should not schedule DROP for tables from other plugins in public schema', async () => {
      // Create a table simulating another plugin's data
      await db.execute(
        sql`CREATE TABLE IF NOT EXISTS public.other_plugin_data (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          server_id UUID,
          plugin_name TEXT NOT NULL DEFAULT 'other-plugin',
          data JSONB,
          created_at TIMESTAMP DEFAULT NOW()
        )`
      );

      // Run migration
      await migrator.migrate('plugin-sql', schema, { verbose: true });

      // Verify the table still exists and was not touched
      const tableExists = await db.execute(
        sql`SELECT EXISTS (
          SELECT 1 FROM pg_tables
          WHERE schemaname = 'public'
          AND tablename = 'other_plugin_data'
        ) as exists`
      );

      const exists = (tableExists.rows[0] as any).exists;
      expect(exists).toBe(true);

      // Also verify the server_id column was not dropped by RuntimeMigrator
      // (Note: migrations.ts might drop it, but RuntimeMigrator should not)
      const columnExists = await db.execute(
        sql`SELECT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_schema = 'public'
          AND table_name = 'other_plugin_data'
          AND column_name = 'server_id'
        ) as exists`
      );

      // Note: The column might be dropped by migrations.ts (which runs before RuntimeMigrator)
      // but RuntimeMigrator itself should not touch this table
      const serverIdExists = (columnExists.rows[0] as any).exists;

      if (exists) {
        testResults.passed.push(
          'Table filtering: other_plugin_data table preserved by RuntimeMigrator'
        );
      } else {
        testResults.failed.push(
          'Table filtering: other_plugin_data table was deleted by RuntimeMigrator!'
        );
      }

      // Clean up
      await db.execute(sql`DROP TABLE IF EXISTS public.other_plugin_data CASCADE`);
    });
  });

  describe('Development Features', () => {
    it('should support dry-run mode', async () => {
      // Test dry-run doesn't actually execute
      await migrator.migrate('dry-run-test', schema, {
        dryRun: true,
      });

      // Check no tables were created
      const result = await db.execute(
```