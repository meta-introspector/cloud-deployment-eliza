# a7046c18:packages_plugin-sql_src___tests___migration_schema-evolution-tests_07-foreign-key-evolution.test.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/schema-evolution-tests/07-foreign-key-evolution.test.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    console.log("\n📦 Retrying FK addition after cleanup...");
    await migrator.migrate("@elizaos/fk-test-v1", schemaV2);
    console.log("  ✅ Foreign key constraint added successfully");

    // Verify FK is enforced
    let insertError: Error | null = null;
    try {
      await db.execute(
        sql`INSERT INTO memories (agent_id, content) 
            VALUES ('999e8400-e29b-41d4-a716-446655440999', 'Should fail')`,
      );
    } catch (error) {
      insertError = error as Error;
    }

    expect(insertError).not.toBeNull();
    console.log("  ✅ Foreign key constraint is now enforced");
  });

  it("should handle changing CASCADE behavior", async () => {
    // V1: Tables with CASCADE delete
    const parentTableV1 = pgTable("parents", {
      id: uuid("id").primaryKey().defaultRandom(),
      name: text("name").notNull(),
    });

    const childTableV1 = pgTable("children", {
      id: uuid("id").primaryKey().defaultRandom(),
      parentId: uuid("parent_id")
        .notNull()
        .references(() => parentTableV1.id, {
          onDelete: "cascade", // CASCADE delete
        }),
      name: text("name").notNull(),
    });

    const schemaV1 = {
      parents: parentTableV1,
      children: childTableV1,
    };

    console.log("📦 Creating tables with CASCADE delete...");
    await migrator.migrate("@elizaos/cascade-test-v1", schemaV1);

    // Create test data
    const parent1Id = "110e8400-e29b-41d4-a716-446655440001";
    const parent2Id = "110e8400-e29b-41d4-a716-446655440002";

    await db.insert(parentTableV1).values([
      { id: parent1Id, name: "Parent 1" },
      { id: parent2Id, name: "Parent 2" },
    ]);

    await db.insert(childTableV1).values([
      { parentId: parent1Id, name: "Child 1-1" },
      { parentId: parent1Id, name: "Child 1-2" },
      { parentId: parent2Id, name: "Child 2-1" },
    ]);

    console.log("  ✅ Created 2 parents with 3 children");

    // Test CASCADE delete behavior
    console.log("\n🔍 Testing current CASCADE behavior...");
    await db.execute(sql`DELETE FROM parents WHERE id = ${parent1Id}`);
    const remainingChildren = await db.execute(
      sql`SELECT COUNT(*) as count FROM children WHERE parent_id = ${parent1Id}`,
    );
    expect(Number((remainingChildren.rows[0] as CountRow).count)).toBe(0);
    console.log("  ✅ CASCADE delete removed children as expected");

    // Restore data
    await db.insert(parentTableV1).values({ id: parent1Id, name: "Parent 1" });
    await db.insert(childTableV1).values([
      { parentId: parent1Id, name: "Child 1-1" },
      { parentId: parent1Id, name: "Child 1-2" },
    ]);

    // V2: Change to SET NULL
    const parentTableV2 = pgTable("parents", {
      id: uuid("id").primaryKey().defaultRandom(),
      name: text("name").notNull(),
    });

    const childTableV2 = pgTable("children", {
      id: uuid("id").primaryKey().defaultRandom(),
      parentId: uuid("parent_id").references(() => parentTableV2.id, {
        onDelete: "set null", // Changed to SET NULL
      }),
      name: text("name").notNull(),
    });

    const schemaV2 = {
      parents: parentTableV2,
      children: childTableV2,
    };

    console.log("\n📦 Changing CASCADE behavior to SET NULL...");
    const check = await migrator.checkMigration(
      "@elizaos/cascade-test-v1",
      schemaV2,
    );

    if (check) {
      console.log("  ℹ️ Cascade behavior change detected");
      if (check.warnings.length > 0) {
        check.warnings.forEach((w) => console.log(`    - ${w}`));
      }
    }

    await migrator.migrate("@elizaos/cascade-test-v1", schemaV2);
    console.log("  ✅ CASCADE behavior changed to SET NULL");

    // Test new SET NULL behavior
    console.log("\n🔍 Testing new SET NULL behavior...");
    await db.execute(sql`DELETE FROM parents WHERE id = ${parent2Id}`);
    const orphanedChildren = await db.execute(
      sql`SELECT * FROM children WHERE parent_id IS NULL`,
    );
    expect(orphanedChildren.rows.length).toBe(1); // Child 2-1 should have NULL parent_id
    console.log("  ✅ SET NULL behavior working (children not deleted)");
    console.log(
      `     Orphaned child: ${(orphanedChildren.rows[0] as ChildRow).name}`,
    );
  });

  it("should handle complex foreign key scenarios with composite keys", async () => {
    // V1: Complex relationship structure without FKs
    const worldTableV1 = pgTable("worlds", {
      id: uuid("id").primaryKey().defaultRandom(),
      name: text("name").notNull(),
    });

    const agentTableV1 = pgTable("agents", {
      id: uuid("id").primaryKey().defaultRandom(),
      worldId: uuid("world_id"), // No FK
      name: text("name").notNull(),
    });

    const roomTableV1 = pgTable("rooms", {
      id: uuid("id").primaryKey().defaultRandom(),
      worldId: uuid("world_id"), // No FK
      agentId: uuid("agent_id"), // No FK
      name: text("name").notNull(),
    });

    const memoryTableV1 = pgTable("memories", {
      id: uuid("id").primaryKey().defaultRandom(),
      roomId: uuid("room_id"), // No FK
      agentId: uuid("agent_id"), // No FK
      content: text("content").notNull(),
```