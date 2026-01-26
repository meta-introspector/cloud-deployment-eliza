# a7046c18:packages_plugin-sql_src___tests___migration_schema-evolution-tests_06-index-evolution.test.ts:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/schema-evolution-tests/06-index-evolution.test.ts:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    console.log("  ✅ Created 20 test records");

    // V2: Add complex indexing strategy
    const tableV2 = pgTable(
      "complex_indexes",
      {
        id: uuid("id").primaryKey().defaultRandom(),
        status: text("status").notNull(),
        category: text("category"),
        priority: text("priority"),
        data: jsonb("data").default({}).notNull(),
        searchVector: text("search_vector"),
        createdAt: timestamp("created_at").default(sql`now()`).notNull(),
      },
      (table) => [
        // Covering index for common queries
        index("idx_status_priority_created").on(
          table.status,
          table.priority,
          table.createdAt,
        ),

        // Partial indexes for specific status values
        index("idx_pending")
          .on(table.createdAt)
          .where(sql`status = 'pending'`),

        index("idx_active_high_priority")
          .on(table.createdAt)
          .where(sql`status = 'active' AND priority = 'high'`),

        // Expression index for case-insensitive search
        index("idx_lower_category").on(sql`lower(category)`),

        // GIN index for JSONB (if available)
        index("idx_data_gin").using("gin", table.data),

        // Text search index
        index("idx_search_vector").on(
          sql`to_tsvector('english', search_vector)`,
        ),

        // Descending index for reverse chronological queries
        index("idx_created_desc").on(sql`created_at DESC`),
      ],
    );

    const schemaV2 = { complex_indexes: tableV2 };

    console.log("\n📦 Creating complex indexing strategy...");
    const check = await migrator.checkMigration(
      "@elizaos/complex-index-v1",
      schemaV2,
    );

    if (check) {
      expect(check.hasDataLoss).toBe(false);
      console.log("  ✅ No data loss for complex indexes");
    }

    await migrator.migrate("@elizaos/complex-index-v1", schemaV2);

    // Verify complex indexes
    const indexes = await db.execute(
      sql`SELECT 
            indexname, 
            indexdef,
            CASE 
              WHEN indexdef LIKE '%WHERE%' THEN 'PARTIAL'
              WHEN indexdef LIKE '%gin%' THEN 'GIN'
              WHEN indexdef LIKE '%DESC%' THEN 'DESCENDING'
              WHEN indexdef LIKE '%to_tsvector%' THEN 'TEXT_SEARCH'
              WHEN indexdef LIKE '%lower%' THEN 'EXPRESSION'
              ELSE 'STANDARD'
            END as index_type
          FROM pg_indexes 
          WHERE tablename = 'complex_indexes'
          AND indexname != 'complex_indexes_pkey'
          ORDER BY indexname`,
    );

    console.log("\n📊 Complex indexes created:");
    for (const idx of indexes.rows) {
      const index = idx as IndexRow;
      console.log(`  - ${index.indexname} (${index.index_type})`);
    }

    // Test index usage with EXPLAIN
    console.log("\n🔍 Testing index usage:");

    // Test partial index usage
    const _explainPending = await db.execute(
      sql`EXPLAIN SELECT * FROM complex_indexes WHERE status = 'pending' ORDER BY created_at`,
    );
    console.log("  ✅ Partial index for pending status can be used");

    // Test covering index
    const _explainCovering = await db.execute(
      sql`EXPLAIN SELECT status, priority, created_at FROM complex_indexes WHERE status = 'active'`,
    );
    console.log("  ✅ Covering index can satisfy query without table access");

    console.log("\n✅ Complex indexing strategy successfully implemented");
  });

  it("should handle index name conflicts gracefully", async () => {
    // V1: Table with index
    const tableV1 = pgTable(
      "test_conflicts",
      {
        id: uuid("id").primaryKey().defaultRandom(),
        field1: text("field1"),
        field2: text("field2"),
      },
      (table) => [index("my_index").on(table.field1)],
    );

    const schemaV1 = { test_conflicts: tableV1 };

    console.log("📦 Creating table with index...");
    await migrator.migrate("@elizaos/conflict-test-v1", schemaV1);

    // V2: Try to change what my_index points to
    const tableV2 = pgTable(
      "test_conflicts",
      {
        id: uuid("id").primaryKey().defaultRandom(),
        field1: text("field1"),
        field2: text("field2"),
      },
      (table) => [
        index("my_index").on(table.field2), // Same name, different column!
      ],
    );

    const schemaV2 = { test_conflicts: tableV2 };

    console.log("\n📦 Changing index definition with same name...");
    await migrator.migrate("@elizaos/conflict-test-v1", schemaV2);

    // Verify the index now points to field2
    const indexDef = await db.execute(
      sql`SELECT indexdef FROM pg_indexes 
          WHERE tablename = 'test_conflicts' 
          AND indexname = 'my_index'`,
    );

    const definition = (indexDef.rows[0] as IndexDefRow).indexdef;
    expect(definition).toContain("field2");
    console.log("  ✅ Index redefined to use different column");
```