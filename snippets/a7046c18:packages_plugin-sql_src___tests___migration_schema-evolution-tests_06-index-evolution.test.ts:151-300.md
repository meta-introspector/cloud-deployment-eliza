# a7046c18:packages_plugin-sql_src___tests___migration_schema-evolution-tests_06-index-evolution.test.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/schema-evolution-tests/06-index-evolution.test.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
          FROM pg_indexes 
          WHERE tablename = 'memories' 
          AND indexname != 'memories_pkey'
          ORDER BY indexname`,
    );

    console.log("\n📊 Created indexes:");
    for (const idx of indexes.rows) {
      const index = idx as IndexRow;
      console.log(`  - ${index.indexname}`);
      console.log(`    Definition: ${index.indexdef.substring(0, 80)}...`);
    }

    expect(indexes.rows.length).toBeGreaterThanOrEqual(7);
    console.log(`\n✅ Created ${indexes.rows.length} indexes successfully`);
  });

  it("should drop and recreate indexes without data loss", async () => {
    // V1: Table with initial indexes
    const testTableV1 = pgTable(
      "test_index_changes",
      {
        id: uuid("id").primaryKey().defaultRandom(),
        col1: text("col1"),
        col2: text("col2"),
        col3: text("col3"),
        metadata: jsonb("metadata"),
      },
      (table) => [
        index("idx_col1").on(table.col1),
        index("idx_col2").on(table.col2),
        index("idx_composite").on(table.col1, table.col2),
      ],
    );

    const schemaV1 = { test_index_changes: testTableV1 };

    console.log("📦 Creating table with initial indexes...");
    await migrator.migrate("@elizaos/index-change-v1", schemaV1);

    // Insert test data
    await db.insert(testTableV1).values([
      { col1: "a", col2: "b", col3: "c", metadata: { key: "value1" } },
      { col1: "d", col2: "e", col3: "f", metadata: { key: "value2" } },
      { col1: "g", col2: "h", col3: "i", metadata: { key: "value3" } },
    ]);

    console.log("  ✅ Created test data and initial indexes");

    // V2: Change index configuration
    const testTableV2 = pgTable(
      "test_index_changes",
      {
        id: uuid("id").primaryKey().defaultRandom(),
        col1: text("col1"),
        col2: text("col2"),
        col3: text("col3"),
        metadata: jsonb("metadata"),
      },
      (table) => [
        // idx_col1 removed (will be dropped)
        // idx_col2 kept the same
        index("idx_col2").on(table.col2),
        // idx_composite changed to different columns
        index("idx_composite").on(table.col2, table.col3), // Different columns!
        // New indexes added
        index("idx_col3").on(table.col3),
        index("idx_metadata_key").on(sql`(metadata->>'key')`),
      ],
    );

    const schemaV2 = { test_index_changes: testTableV2 };

    console.log("\n🔍 Checking index modifications...");
    const check = await migrator.checkMigration(
      "@elizaos/index-change-v1",
      schemaV2,
    );

    if (check) {
      expect(check.hasDataLoss).toBe(false);
      console.log("  ✅ No data loss for index modifications");
      if (check.warnings.length > 0) {
        console.log("  ℹ️ Index changes detected:");
        check.warnings.forEach((w) => console.log(`    - ${w}`));
      }
    }

    console.log("\n📦 Modifying indexes...");
    await migrator.migrate("@elizaos/index-change-v1", schemaV2);
    console.log("  ✅ Index modifications completed");

    // Verify index changes
    const indexes = await db.execute(
      sql`SELECT indexname 
          FROM pg_indexes 
          WHERE tablename = 'test_index_changes' 
          AND indexname != 'test_index_changes_pkey'
          ORDER BY indexname`,
    );

    const indexNames = indexes.rows.map((r: any) => r.indexname);
    console.log("\n📊 Final indexes:");
    indexNames.forEach((name) => console.log(`  - ${name}`));

    // Check specific changes
    expect(indexNames).not.toContain("idx_col1"); // Should be dropped
    expect(indexNames).toContain("idx_col2"); // Should remain
    expect(indexNames).toContain("idx_col3"); // Should be added
    expect(indexNames).toContain("idx_metadata_key"); // Should be added

    // Verify data is intact
    const dataCount = await db.execute(
      sql`SELECT COUNT(*) as count FROM test_index_changes`,
    );
    expect(Number((dataCount.rows[0] as CountRow).count)).toBe(3);
    console.log("\n✅ All data preserved during index changes");
  });

  it("should handle complex index scenarios", async () => {
    // V1: Simple table
    const tableV1 = pgTable("complex_indexes", {
      id: uuid("id").primaryKey().defaultRandom(),
      status: text("status").notNull(),
      category: text("category"),
      priority: text("priority"),
      data: jsonb("data").default({}).notNull(),
      searchVector: text("search_vector"),
      createdAt: timestamp("created_at").default(sql`now()`).notNull(),
    });

    const schemaV1 = { complex_indexes: tableV1 };

    console.log("📦 Creating initial table...");
    await migrator.migrate("@elizaos/complex-index-v1", schemaV1);

    // Insert varied data
    const statuses = ["pending", "active", "completed", "archived"];
    const categories = ["A", "B", "C", null];
    const priorities = ["high", "medium", "low", "urgent"];

    for (let i = 0; i < 20; i++) {
      await db.insert(tableV1).values({
        status: statuses[i % statuses.length],
        category: categories[i % categories.length],
        priority: priorities[i % priorities.length],
        data: { index: i, value: `test-${i}` },
        searchVector: `keyword${i % 5} term${i % 3}`,
      });
    }
```