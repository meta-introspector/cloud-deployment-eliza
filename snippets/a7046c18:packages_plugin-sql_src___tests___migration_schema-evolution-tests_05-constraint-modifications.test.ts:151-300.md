# a7046c18:packages_plugin-sql_src___tests___migration_schema-evolution-tests_05-constraint-modifications.test.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/schema-evolution-tests/05-constraint-modifications.test.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      { name: "Agent 2", username: "beta" },
      { name: "Agent 3", username: "alpha" }, // Duplicate!
      { name: "Agent 4", username: "gamma" },
    ]);

    console.log("  ✅ Created 4 agents (with duplicate usernames)");

    // V2: Add unique constraint
    const agentTableV2 = pgTable(
      "agents",
      {
        id: uuid("id").primaryKey().defaultRandom(),
        name: text("name").notNull(),
        username: text("username").unique(), // Now unique!
      },
      (table) => [unique("username_unique").on(table.username)],
    );

    const schemaV2 = { agents: agentTableV2 };

    console.log("\n🔍 Checking UNIQUE constraint addition...");
    const check = await migrator.checkMigration(
      "@elizaos/unique-test-v1",
      schemaV2,
    );

    if (check) {
      console.log("  ⚠️ Migration check results:");
      if (check.warnings.length > 0) {
        check.warnings.forEach((w) => console.log(`    - ${w}`));
      }
    }

    // Try to apply migration - should fail due to duplicates
    console.log("\n❌ Attempting migration with duplicate values...");
    let migrationError: Error | null = null;
    try {
      await migrator.migrate("@elizaos/unique-test-v1", schemaV2);
    } catch (error) {
      migrationError = error as Error;
    }

    if (migrationError) {
      console.log(
        "  ✅ Migration failed as expected (duplicates violate UNIQUE)",
      );
      console.log(`  Error: ${migrationError.message.substring(0, 100)}...`);
    }

    // Fix duplicates
    console.log("\n🔧 Fixing duplicate values...");
    await db.execute(
      sql`UPDATE agents SET username = username || '-' || id WHERE username IN (
        SELECT username FROM agents GROUP BY username HAVING COUNT(*) > 1
      )`,
    );
    console.log("  ✅ Made usernames unique by appending IDs");

    // Now migration should succeed
    console.log("\n📦 Retrying migration after fixing duplicates...");
    await migrator.migrate("@elizaos/unique-test-v1", schemaV2);
    console.log("  ✅ Migration succeeded after fixing duplicates");

    // Verify unique constraint is enforced
    let insertError: Error | null = null;
    try {
      await db.execute(
        sql`INSERT INTO agents (name, username) VALUES ('Test', 'beta')`,
      );
    } catch (error) {
      insertError = error as Error;
    }

    expect(insertError).not.toBeNull();
    console.log("  ✅ UNIQUE constraint is now enforced");
  });

  it("should handle adding CHECK constraints with violating data", async () => {
    // V1: Table without check constraints
    const productTableV1 = pgTable("products", {
      id: uuid("id").primaryKey().defaultRandom(),
      name: text("name").notNull(),
      price: integer("price"),
      quantity: integer("quantity"),
    });

    const schemaV1 = { products: productTableV1 };

    console.log("📦 Creating schema without check constraints...");
    await migrator.migrate("@elizaos/check-test-v1", schemaV1);

    // Insert data that would violate future constraints
    await db.insert(productTableV1).values([
      { name: "Product 1", price: 100, quantity: 10 },
      { name: "Product 2", price: -50, quantity: 5 }, // Negative price!
      { name: "Product 3", price: 200, quantity: -2 }, // Negative quantity!
      { name: "Product 4", price: 0, quantity: 0 }, // Zero values
    ]);

    console.log("  ✅ Created 4 products (some with invalid values)");

    // V2: Add check constraints
    const productTableV2 = pgTable(
      "products",
      {
        id: uuid("id").primaryKey().defaultRandom(),
        name: text("name").notNull(),
        price: integer("price"),
        quantity: integer("quantity"),
      },
      () => [
        check("positive_price", sql`price > 0`),
        check("non_negative_quantity", sql`quantity >= 0`),
      ],
    );

    const schemaV2 = { products: productTableV2 };

    console.log("\n🔍 Checking CHECK constraint addition...");
    const check2 = await migrator.checkMigration(
      "@elizaos/check-test-v1",
      schemaV2,
    );

    if (check2) {
      console.log("  ⚠️ Migration analysis:");
      if (check2.warnings.length > 0) {
        check2.warnings.forEach((w) => console.log(`    - ${w}`));
      }
    }

    // Try to apply migration - should fail due to constraint violations
    console.log("\n❌ Attempting migration with constraint violations...");
    let migrationError: Error | null = null;
    try {
      await migrator.migrate("@elizaos/check-test-v1", schemaV2);
    } catch (error) {
      migrationError = error as Error;
    }

    if (migrationError) {
      console.log("  ✅ Migration failed as expected (data violates CHECK)");
      console.log(`  Error: ${migrationError.message.substring(0, 100)}...`);
    }

    // Fix violating data
    console.log("\n🔧 Fixing constraint violations...");
    await db.execute(sql`UPDATE products SET price = 1 WHERE price <= 0`);
    await db.execute(sql`UPDATE products SET quantity = 0 WHERE quantity < 0`);
    console.log("  ✅ Fixed negative and zero prices/quantities");
```