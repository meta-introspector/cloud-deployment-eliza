# a7046c18:packages_plugin-sql_src___tests___migration_comprehensive-migration.test.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/comprehensive-migration.test.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  beforeAll(async () => {
    const testSetup = await createIsolatedTestDatabaseForMigration(
      "comprehensive_migration_tests",
    );
    db = testSetup.db;
    cleanup = testSetup.cleanup;

    // Note: Vector extension is already installed by adapter.init()
  });

  afterAll(async () => {
    if (cleanup) {
      await cleanup();
    }
  });

  // Skip introspection tests since our RuntimeMigrator handles this internally
  describe.skip("Schema Introspection", () => {
    // Our RuntimeMigrator now uses snapshot-generator.ts internally
    // which properly extracts schema information from Drizzle definitions
  });

  describe("Migration Execution", () => {
    // Clean up any existing schemas before migration tests
    beforeAll(async () => {
      try {
        await db.execute(sql`DROP SCHEMA IF EXISTS migrations CASCADE`);
        await db.execute(sql`DROP SCHEMA IF EXISTS public CASCADE`);
        await db.execute(sql`CREATE SCHEMA public`);
        console.log("[TEST CLEANUP] Reset schemas for migration tests");
      } catch (error) {
        console.log("[TEST CLEANUP] Schema cleanup failed:", error);
      }

      // Initialize RuntimeMigrator
      migrator = new RuntimeMigrator(db);
      await migrator.initialize();
    });

    it("should create all tables in correct dependency order", async () => {
      // Run the migration
      await migrator.migrate("test-plugin", testSchema, { verbose: true });

      // Verify all tables were created
      const result = await db.execute(
        sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name`,
      );

      const tableNames = result.rows.map((row: any) => row.table_name);
      expect(tableNames).toContain("base_entities");
      expect(tableNames).toContain("dependent_entities");
      expect(tableNames).toContain("vector_embeddings");
      expect(tableNames).toContain("complex_relations");
    });

    it("should create vector columns with correct types", async () => {
      // Check vector column types
      const result = await db.execute(
        sql`SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'vector_embeddings' 
            AND column_name LIKE 'dim_%'
            ORDER BY column_name`,
      );

      const vectorColumns = result.rows as VectorColumnRow[];
      expect(vectorColumns).toHaveLength(3);

      // All vector columns should have USER-DEFINED type (vector extension)
      vectorColumns.forEach((col) => {
        expect(col.data_type).toBe("USER-DEFINED");
      });
    });

    it("should create foreign key constraints properly", async () => {
      // Check that foreign key constraints exist
      const result = await db.execute(
        sql`SELECT tc.constraint_name, tc.table_name, kcu.column_name, ccu.table_name AS referenced_table
            FROM information_schema.table_constraints AS tc
            JOIN information_schema.key_column_usage AS kcu
              ON tc.constraint_name = kcu.constraint_name
            JOIN information_schema.constraint_column_usage AS ccu
              ON ccu.constraint_name = tc.constraint_name
            WHERE tc.constraint_type = 'FOREIGN KEY' 
            AND tc.table_schema = 'public'
            ORDER BY tc.table_name, tc.constraint_name`,
      );

      const foreignKeys = result.rows as ForeignKeyRow[];
      expect(foreignKeys.length).toBeGreaterThan(0);

      // Check specific foreign keys
      const dependentFk = foreignKeys.find(
        (fk) =>
          fk.table_name === "dependent_entities" &&
          fk.column_name === "base_id",
      );
      expect(dependentFk).toBeDefined();
      expect(dependentFk.referenced_table).toBe("base_entities");
    });

    it("should create unique constraints properly", async () => {
      // Check that unique constraints exist
      const result = await db.execute(
        sql`SELECT tc.constraint_name, tc.table_name
            FROM information_schema.table_constraints AS tc
            WHERE tc.constraint_type = 'UNIQUE' 
            AND tc.table_schema = 'public'
            ORDER BY tc.table_name, tc.constraint_name`,
      );

      const uniqueConstraints = result.rows as UniqueConstraintRow[];
      expect(uniqueConstraints.length).toBeGreaterThan(0);

      // Check specific unique constraints
      const baseNameUnique = uniqueConstraints.find(
        (uc) =>
          uc.table_name === "base_entities" &&
          uc.constraint_name === "base_entities_name_unique",
      );
      expect(baseNameUnique).toBeDefined();
    });

    it("should create check constraints properly", async () => {
      // Check that check constraints exist
      const result = await db.execute(
        sql`SELECT tc.constraint_name, tc.table_name
            FROM information_schema.table_constraints AS tc
            WHERE tc.constraint_type = 'CHECK' 
            AND tc.table_schema = 'public'
            ORDER BY tc.table_name, tc.constraint_name`,
      );

      const checkConstraints = result.rows as CheckConstraintRow[];
      expect(checkConstraints.length).toBeGreaterThan(0);

      // Check specific check constraints
      const valuePositive = checkConstraints.find(
        (cc) =>
          cc.table_name === "dependent_entities" &&
          cc.constraint_name === "value_positive",
      );
      expect(valuePositive).toBeDefined();
    });

    it("should support vector similarity operations", async () => {
      // Insert test data with vector embeddings
      await db.execute(
        sql`INSERT INTO public.base_entities (id, name) VALUES 
```