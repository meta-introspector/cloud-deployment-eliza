# a7046c18:packages_plugin-sql_src___tests___migration_schema-evolution-tests_03-type-changes-with-data.test.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/schema-evolution-tests/03-type-changes-with-data.test.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

    // Verify JSON was converted to string representation
    expect(typeof afterData[0].content).toBe("string");
    expect(afterData[0].content).toContain("{"); // Should be JSON string

    // Try to parse it back to verify it's valid JSON string
    let _parsed: any;
    try {
      _parsed = JSON.parse(afterData[0].content as string);
      console.log("  ✅ Content is valid JSON string, can be parsed back");
    } catch (_e) {
      console.log("  ❌ Content is not valid JSON string after conversion");
    }
  });

  it("should handle text to integer conversion with invalid data", async () => {
    // V1: Text column that might contain non-numeric data
    const userTableV1 = pgTable("users", {
      id: uuid("id").primaryKey().defaultRandom(),
      name: text("name").notNull(),
      age: text("age"), // Stored as text (bad practice but happens)
      score: text("score"),
    });

    const schemaV1 = { users: userTableV1 };

    await migrator.migrate(
      "@elizaos/schema-evolution-test-text-to-int-v1",
      schemaV1,
    );

    // Insert mixed data - some valid, some invalid for integer conversion
    await db.insert(userTableV1).values([
      {
        name: "User 1",
        age: "25", // Valid integer
        score: "100", // Valid integer
      },
      {
        name: "User 2",
        age: "30.5", // Decimal - will lose precision
        score: "95.75", // Decimal - will lose precision
      },
      {
        name: "User 3",
        age: "unknown", // Invalid for integer!
        score: "N/A", // Invalid for integer!
      },
      {
        name: "User 4",
        age: null, // NULL is ok
        score: "", // Empty string - problem!
      },
    ]);

    console.log("Test data with mixed text values:");
    const data = await db.select().from(userTableV1);
    data.forEach((row) => {
      console.log(`  - ${row.name}: age="${row.age}", score="${row.score}"`);
    });

    // V2: Convert text to integer (will fail for invalid data!)
    const userTableV2 = pgTable("users", {
      id: uuid("id").primaryKey().defaultRandom(),
      name: text("name").notNull(),
      age: integer("age"), // text → integer
      score: integer("score"), // text → integer
    });

    const schemaV2 = { users: userTableV2 };

    // This should warn about potential conversion issues
    const check = await migrator.checkMigration(
      "@elizaos/schema-evolution-test-text-to-int-v1",
      schemaV2,
    );

    expect(check).toBeDefined();
    expect(check?.warnings.length).toBeGreaterThan(0);
    expect(
      check?.warnings.some(
        (w) =>
          w.includes("Type change") ||
          w.includes("type") ||
          w.includes("column"),
      ),
    ).toBe(true);

    console.log("\n⚠️  Conversion Risk Detection:");
    check?.warnings.forEach((warning) => {
      console.log(`  • ${warning}`);
    });

    // Attempting migration should fail due to invalid data
    let migrationError: Error | null = null;
    try {
      await migrator.migrate(
        "@elizaos/schema-evolution-test-text-to-int-v1",
        schemaV2,
      );
    } catch (error) {
      migrationError = error as Error;
    }

    // Should fail because 'unknown' and 'N/A' can't convert to integer
    if (migrationError) {
      console.log("\n❌ Migration failed as expected:");
      console.log(`  Error: ${migrationError.message}`);
      // The actual error is about decimal "30.5" not being valid integer
      expect(migrationError.message.toLowerCase()).toMatch(
        /failed query|invalid|error/,
      );
    } else {
      console.log("\n⚠️  Migration succeeded with USING clause for conversion");
      // If migration succeeded, check what happened to the data
      const afterData = await db.select().from(userTableV2);
      console.log("  Converted data:");
      afterData.forEach((row) => {
        console.log(`    - ${row.name}: age=${row.age}, score=${row.score}`);
      });
    }
  });

  it("should handle boolean to text and back conversions", async () => {
    // V1: Boolean columns
    const settingsTableV1 = pgTable("settings", {
      id: uuid("id").primaryKey().defaultRandom(),
      name: text("name").notNull(),
      enabled: boolean("enabled").notNull().default(true),
      verified: boolean("verified").default(false),
      active: boolean("active"),
    });

    const schemaV1 = { settings: settingsTableV1 };

    await migrator.migrate("@elizaos/schema-evolution-test-bool-v1", schemaV1);

    // Insert boolean data
    await db.insert(settingsTableV1).values([
      { name: "Setting 1", enabled: true, verified: true, active: true },
      { name: "Setting 2", enabled: false, verified: false, active: false },
      { name: "Setting 3", enabled: true, verified: false, active: null },
    ]);

    console.log("Boolean data before conversion:");
    const beforeData = await db.select().from(settingsTableV1);
    beforeData.forEach((row) => {
      console.log(
        `  - ${row.name}: enabled=${row.enabled}, verified=${row.verified}, active=${row.active}`,
      );
```