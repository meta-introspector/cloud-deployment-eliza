# a7046c18:packages_plugin-sql_src___tests___migration_schema-evolution-tests_05-constraint-modifications.test.ts:301-425

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/schema-evolution-tests/05-constraint-modifications.test.ts:301-425
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

    // Now migration should succeed
    console.log("\n📦 Retrying migration after fixing data...");
    await migrator.migrate("@elizaos/check-test-v1", schemaV2);
    console.log("  ✅ Migration succeeded after fixing violations");

    // Verify check constraints are enforced
    let insertError: Error | null = null;
    try {
      await db.execute(
        sql`INSERT INTO products (name, price, quantity) VALUES ('Bad Product', -10, 5)`,
      );
    } catch (error) {
      insertError = error as Error;
    }

    expect(insertError).not.toBeNull();
    console.log("  ✅ CHECK constraints are now enforced");
  });

  it("should handle multiple constraint additions in single migration", async () => {
    // V1: Simple table
    const tableV1 = pgTable("test_multi_constraints", {
      id: uuid("id").primaryKey().defaultRandom(),
      code: text("code"),
      value: integer("value"),
      active: boolean("active"),
    });

    const schemaV1 = { test_multi_constraints: tableV1 };

    console.log("📦 Creating initial schema...");
    await migrator.migrate("@elizaos/multi-constraints-v1", schemaV1);

    // Insert test data
    await db.insert(tableV1).values([
      { code: "ABC", value: 100, active: true },
      { code: "DEF", value: 200, active: false },
      { code: null, value: null, active: null },
    ]);

    // V2: Add multiple constraints at once
    const tableV2 = pgTable(
      "test_multi_constraints",
      {
        id: uuid("id").primaryKey().defaultRandom(),
        code: text("code").notNull().unique(), // Add NOT NULL + UNIQUE
        value: integer("value").notNull(), // Add NOT NULL
        active: boolean("active").default(true).notNull(), // Add NOT NULL with default
      },
      (table) => [
        check("value_positive", sql`value > 0`), // Add CHECK constraint
        unique("code_unique_constraint").on(table.code), // Additional unique constraint
      ],
    );

    const schemaV2 = { test_multi_constraints: tableV2 };

    console.log("\n🔍 Checking multiple constraint additions...");
    const check2 = await migrator.checkMigration(
      "@elizaos/multi-constraints-v1",
      schemaV2,
    );

    if (check2) {
      console.log("  ⚠️ Multiple constraints being added:");
      console.log("    - NOT NULL on code");
      console.log("    - UNIQUE on code");
      console.log("    - NOT NULL on value");
      console.log("    - NOT NULL with default on active");
      console.log("    - CHECK constraint on value");
    }

    // Fix data to meet all constraints
    console.log("\n🔧 Preparing data for constraints...");
    await db.execute(
      sql`DELETE FROM test_multi_constraints WHERE code IS NULL`,
    );
    await db.execute(
      sql`UPDATE test_multi_constraints SET value = 50 WHERE value IS NULL`,
    );
    await db.execute(
      sql`UPDATE test_multi_constraints SET active = true WHERE active IS NULL`,
    );

    // Apply migration
    console.log("\n📦 Applying multiple constraints...");
    await migrator.migrate("@elizaos/multi-constraints-v1", schemaV2);
    console.log("  ✅ All constraints added successfully");

    // Verify all constraints work
    const violations: string[] = [];

    // Test NOT NULL on code
    try {
      await db.execute(
        sql`INSERT INTO test_multi_constraints (code, value) VALUES (NULL, 100)`,
      );
    } catch (_e) {
      violations.push("NOT NULL on code");
    }

    // Test UNIQUE on code
    try {
      await db.execute(
        sql`INSERT INTO test_multi_constraints (code, value) VALUES ('ABC', 100)`,
      );
    } catch (_e) {
      violations.push("UNIQUE on code");
    }

    // Test CHECK on value
    try {
      await db.execute(
        sql`INSERT INTO test_multi_constraints (code, value) VALUES ('XYZ', -10)`,
      );
    } catch (_e) {
      violations.push("CHECK on value");
    }

    console.log("\n✅ All constraints enforced:");
    violations.forEach((v) => console.log(`  - ${v}`));
    expect(violations.length).toBeGreaterThanOrEqual(3);
  });
});
```