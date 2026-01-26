# a7046c18:packages_plugin-sql_src___tests___migration_schema-evolution-tests_04-safe-column-additions.test.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/schema-evolution-tests/04-safe-column-additions.test.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        .notNull(),
      priority: integer("priority").default(0).notNull(),
      status: text("status").default("active").notNull(),
      settings: jsonb("settings").default({}).notNull(),
    });

    const schemaV2 = { entities: entityTableV2 };

    // Check migration - should have no warnings
    console.log("\n🔍 Checking for data loss warnings...");
    const check = await migrator.checkMigration(
      "@elizaos/defaults-test-v1",
      schemaV2,
    );

    if (check) {
      expect(check.hasDataLoss).toBe(false);
      console.log("  ✅ No data loss (defaults protect existing rows)");
    }

    // Apply migration
    console.log("\n📦 Applying migration with NOT NULL + defaults...");
    await migrator.migrate("@elizaos/defaults-test-v1", schemaV2);
    console.log("  ✅ Migration completed successfully");

    // Verify defaults were applied to existing rows
    const afterData = await db.execute(
      sql`SELECT * FROM entities ORDER BY name`,
    );

    expect(afterData.rows.length).toBe(3);

    for (const row of afterData.rows) {
      const entity = row as EntityRow;
      expect(entity.enabled).toBe(true); // Got default value
      expect(entity.priority).toBe(0); // Got default value
      expect(entity.status).toBe("active"); // Got default value
      expect(entity.settings).toEqual({}); // Got default value
      expect(entity.created_at).toBeDefined(); // Got NOW() default
      console.log(`  ✅ ${entity.name}: defaults applied correctly`);
    }

    console.log("\n✅ NOT NULL columns with defaults added successfully");
  });

  it("should handle adding columns with valid DEFAULT expressions", async () => {
    // V1: Basic table
    const testTableV1 = pgTable("test_complex", {
      id: uuid("id").primaryKey().defaultRandom(),
      name: text("name").notNull(),
    });

    const schemaV1 = { test_complex: testTableV1 };

    console.log("📦 Creating initial schema...");
    await migrator.migrate("@elizaos/complex-columns-v1", schemaV1);

    await db
      .insert(testTableV1)
      .values([{ name: "Test Record 1" }, { name: "Test Record 2" }]);

    // V2: Add columns with DEFAULT expressions (that don't reference columns)
    // and GENERATED columns (that can reference columns)
    const testTableV2 = pgTable("test_complex", {
      id: uuid("id").primaryKey().defaultRandom(),
      name: text("name").notNull(),
      // DEFAULT expressions (no column references allowed)
      createdAt: timestamp("created_at").default(sql`now()`).notNull(),
      status: text("status").default("active").notNull(),
      randomValue: integer("random_value").default(sql`floor(random() * 100)`),
      timestampWithOffset: timestamp("timestamp_with_offset").default(
        sql`now() + interval '1 hour'`,
      ),
      // Note: Expressions like to_tsvector('english', name) would need
      // generatedAlwaysAs() which isn't fully supported in all contexts
      // So we use only valid DEFAULT expressions that don't reference columns
    });

    const schemaV2 = { test_complex: testTableV2 };

    // Check and apply migration
    console.log("\n🔍 Testing complex column defaults...");
    const check = await migrator.checkMigration(
      "@elizaos/complex-columns-v1",
      schemaV2,
    );

    if (check) {
      expect(check.hasDataLoss).toBe(false);
      console.log("  ✅ No data loss with complex defaults");
    }

    await migrator.migrate("@elizaos/complex-columns-v1", schemaV2);

    // Verify defaults worked
    const afterData = await db.execute(
      sql`SELECT * FROM test_complex ORDER BY name`,
    );

    for (const row of afterData.rows) {
      const record = row as AgentRow;
      expect(record.created_at).toBeDefined();
      expect(record.status).toBe("active");
      expect(record.timestamp_with_offset).toBeDefined();
      // random_value can be null or a number
      if (record.random_value !== null) {
        expect(typeof record.random_value).toBe("number");
      }
      console.log(`  ✅ ${record.name}: default expressions applied correctly`);
    }

    console.log("\n✅ Valid DEFAULT expressions handled correctly");
  });

  it("should add multiple columns in single migration", async () => {
    // V1: Minimal table
    const tableV1 = pgTable("multi_test", {
      id: uuid("id").primaryKey().defaultRandom(),
    });

    const schemaV1 = { multi_test: tableV1 };

    console.log("📦 Creating minimal initial schema...");
    await migrator.migrate("@elizaos/multi-column-v1", schemaV1);

    // V2: Add many columns at once
    const tableV2 = pgTable("multi_test", {
      id: uuid("id").primaryKey().defaultRandom(),
      // Add 10+ columns in one migration
      name: text("name").default("unnamed").notNull(),
      description: text("description"),
      enabled: boolean("enabled").default(true).notNull(),
      priority: integer("priority").default(0).notNull(),
      tags: text("tags").array(),
      metadata: jsonb("metadata").default({}),
      createdAt: timestamp("created_at").default(sql`now()`).notNull(),
      updatedAt: timestamp("updated_at"),
      deletedAt: timestamp("deleted_at"),
      version: integer("version").default(1).notNull(),
      status: text("status").default("active"),
      config: jsonb("config"),
    });

    const schemaV2 = { multi_test: tableV2 };

    console.log("\n📦 Adding 12 columns in single migration...");
    const check = await migrator.checkMigration(
      "@elizaos/multi-column-v1",
      schemaV2,
    );
```