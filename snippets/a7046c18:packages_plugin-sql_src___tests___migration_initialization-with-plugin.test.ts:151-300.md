# a7046c18:packages_plugin-sql_src___tests___migration_initialization-with-plugin.test.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/initialization-with-plugin.test.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    });

    it("should track plugin migration in _migrations table", async () => {
      const result = await db.execute(
        sql.raw(`SELECT * FROM migrations._migrations 
                 WHERE plugin_name = 'polymarket'
                 ORDER BY created_at DESC
                 LIMIT 1`),
      );

      expect(result.rows.length).toBeGreaterThan(0);
      const migration = result.rows[0] as MigrationRow;
      expect(migration.plugin_name).toBe("polymarket");
      expect(migration.hash).toBeDefined();
    });

    it("should verify foreign key constraints work across tables in polymarket schema", async () => {
      // Check that foreign key constraints were properly created
      const fkResult = await db.execute(
        sql.raw(`
          SELECT 
            tc.constraint_name,
            tc.table_name,
            kcu.column_name,
            ccu.table_name AS foreign_table_name,
            ccu.column_name AS foreign_column_name
          FROM information_schema.table_constraints AS tc
          JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
          JOIN information_schema.constraint_column_usage AS ccu
            ON ccu.constraint_name = tc.constraint_name
            AND ccu.table_schema = tc.table_schema
          WHERE tc.constraint_type = 'FOREIGN KEY' 
            AND tc.table_schema = 'polymarket'
          ORDER BY tc.table_name, tc.constraint_name
        `),
      );

      const foreignKeys = fkResult.rows;
      console.log(
        `Found ${foreignKeys.length} foreign keys in polymarket schema`,
      );

      // Verify at least some expected foreign keys exist
      const tokensFk = foreignKeys.find(
        (fk: any) =>
          fk.table_name === "tokens" && fk.foreign_table_name === "markets",
      );
      expect(tokensFk).toBeDefined();

      const pricesFk = foreignKeys.find(
        (fk: any) =>
          fk.table_name === "prices" && fk.foreign_table_name === "markets",
      );
      expect(pricesFk).toBeDefined();
    });

    it("should create indexes in polymarket schema", async () => {
      // Check that indexes were created
      const indexResult = await db.execute(
        sql.raw(`
          SELECT 
            schemaname,
            tablename,
            indexname
          FROM pg_indexes
          WHERE schemaname = 'polymarket'
          ORDER BY tablename, indexname
        `),
      );

      const indexes = indexResult.rows;
      console.log(`Found ${indexes.length} indexes in polymarket schema`);

      // Verify some expected indexes exist
      const marketIndexes = indexes.filter(
        (idx: any) => idx.tablename === "markets",
      );
      expect(marketIndexes.length).toBeGreaterThan(0);

      // Check for specific index
      const conditionIdIdx = indexes.find(
        (idx: any) => idx.indexname === "markets_condition_id_idx",
      );
      expect(conditionIdIdx).toBeDefined();
    });
  });

  describe("Migration Idempotency", () => {
    it("should skip re-migration when schema has not changed", async () => {
      console.log("\n🔄 Testing migration idempotency...\n");

      // Try to migrate core schema again
      const _coreResult = await migrator.migrate(
        "@elizaos/plugin-sql",
        coreSchema,
        {
          verbose: true,
        },
      );

      // Check logs to verify it was skipped
      const coreMigrations = await db.execute(
        sql.raw(`SELECT COUNT(*) as count FROM migrations._migrations 
                 WHERE plugin_name = '@elizaos/plugin-sql'`),
      );

      // Should only have 1 migration record
      expect(Number(coreMigrations.rows[0]?.count)).toBe(1);

      // Try to migrate plugin schema again
      const _pluginResult = await migrator.migrate(
        "polymarket",
        testPolymarketSchema,
        {
          verbose: true,
        },
      );

      const pluginMigrations = await db.execute(
        sql.raw(`SELECT COUNT(*) as count FROM migrations._migrations
                 WHERE plugin_name = 'polymarket'`),
      );

      // Should only have 1 migration record
      expect(Number(pluginMigrations.rows[0]?.count)).toBe(1);
    });
  });

  describe("Schema Isolation", () => {
    it("should verify core and plugin schemas are properly isolated", async () => {
      // Get all schemas
      const schemasResult = await db.execute(
        sql.raw(`SELECT schema_name FROM information_schema.schemata 
                 WHERE schema_name NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
                 ORDER BY schema_name`),
      );

      const schemas = schemasResult.rows.map((r: any) => r.schema_name);
      console.log("Available schemas:", schemas);

      expect(schemas).toContain("public");
      expect(schemas).toContain("polymarket");
      expect(schemas).toContain("migrations");
    });

    it("should verify table counts per schema", async () => {
      const tableCountsResult = await db.execute(
        sql.raw(`
```