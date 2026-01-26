# a7046c18:packages_plugin-sql_src___tests___migration_schema-evolution-tests_07-foreign-key-evolution.test.ts:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/schema-evolution-tests/07-foreign-key-evolution.test.ts:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    });

    const schemaV1 = {
      worlds: worldTableV1,
      agents: agentTableV1,
      rooms: roomTableV1,
      memories: memoryTableV1,
    };

    console.log("📦 Creating complex structure without FKs...");
    await migrator.migrate("@elizaos/complex-fk-v1", schemaV1);

    // Create interconnected data
    const worldId = "220e8400-e29b-41d4-a716-446655440001";
    const agentId = "330e8400-e29b-41d4-a716-446655440001";
    const roomId = "440e8400-e29b-41d4-a716-446655440001";

    await db.insert(worldTableV1).values({ id: worldId, name: "World 1" });
    await db
      .insert(agentTableV1)
      .values({ id: agentId, worldId, name: "Agent 1" });
    await db
      .insert(roomTableV1)
      .values({ id: roomId, worldId, agentId, name: "Room 1" });
    await db
      .insert(memoryTableV1)
      .values({ roomId, agentId, content: "Memory 1" });

    console.log("  ✅ Created interconnected data");

    // V2: Add all foreign keys with different CASCADE behaviors
    const worldTableV2 = pgTable("worlds", {
      id: uuid("id").primaryKey().defaultRandom(),
      name: text("name").notNull(),
    });

    const agentTableV2 = pgTable(
      "agents",
      {
        id: uuid("id").primaryKey().defaultRandom(),
        worldId: uuid("world_id").references(() => worldTableV2.id, {
          onDelete: "cascade", // Delete agents when world deleted
        }),
        name: text("name").notNull(),
      },
      (table) => [
        // Add unique constraint needed for composite FK from rooms table
        unique().on(table.worldId, table.id),
      ],
    );

    const roomTableV2 = pgTable(
      "rooms",
      {
        id: uuid("id").primaryKey().defaultRandom(),
        worldId: uuid("world_id").references(() => worldTableV2.id, {
          onDelete: "cascade", // Delete rooms when world deleted
        }),
        agentId: uuid("agent_id").references(() => agentTableV2.id, {
          onDelete: "set null", // Keep rooms but clear agent reference
        }),
        name: text("name").notNull(),
      },
      (table) => [
        // Composite foreign key example - requires unique constraint on referenced columns
        // The agents table has a unique constraint on (worldId, id) to make this valid
        foreignKey({
          columns: [table.worldId, table.agentId],
          foreignColumns: [agentTableV2.worldId, agentTableV2.id],
        }),
      ],
    );

    const memoryTableV2 = pgTable("memories", {
      id: uuid("id").primaryKey().defaultRandom(),
      roomId: uuid("room_id").references(() => roomTableV2.id, {
        onDelete: "cascade", // Delete memories when room deleted
      }),
      agentId: uuid("agent_id").references(() => agentTableV2.id, {
        onDelete: "cascade", // Delete memories when agent deleted
      }),
      content: text("content").notNull(),
    });

    const schemaV2 = {
      worlds: worldTableV2,
      agents: agentTableV2,
      rooms: roomTableV2,
      memories: memoryTableV2,
    };

    console.log("\n📦 Adding complex FK relationships...");
    await migrator.migrate("@elizaos/complex-fk-v1", schemaV2);
    console.log("  ✅ Complex foreign keys added");

    // Test CASCADE behaviors
    console.log("\n🔍 Testing complex CASCADE behaviors...");

    // Delete world should cascade to everything
    await db.execute(sql`DELETE FROM worlds WHERE id = ${worldId}`);

    const counts = await db.execute(sql`
      SELECT 
        (SELECT COUNT(*) FROM agents WHERE world_id = ${worldId}) as agents,
        (SELECT COUNT(*) FROM rooms WHERE world_id = ${worldId}) as rooms,
        (SELECT COUNT(*) FROM memories WHERE agent_id = ${agentId}) as memories
    `);

    const result = counts.rows[0] as StatsRow;
    expect(Number(result.agents)).toBe(0);
    expect(Number(result.rooms)).toBe(0);
    expect(Number(result.memories)).toBe(0);

    console.log(
      "  ✅ CASCADE delete propagated correctly through all relationships",
    );
  });

  it("should handle foreign keys with manager references", async () => {
    // V1: Tables with manager-employee relationship
    const departmentTableV1 = pgTable("departments", {
      id: uuid("id").primaryKey().defaultRandom(),
      name: text("name").notNull(),
      managerId: uuid("manager_id"), // Will reference employees
    });

    const employeeTableV1 = pgTable("employees", {
      id: uuid("id").primaryKey().defaultRandom(),
      name: text("name").notNull(),
      departmentId: uuid("department_id"), // Will reference departments
    });

    const schemaV1 = {
      departments: departmentTableV1,
      employees: employeeTableV1,
    };

    console.log("📦 Creating tables for manager reference test...");
    await migrator.migrate("@elizaos/circular-fk-v1", schemaV1);

    // Create data
    const dept1Id = "550e8400-e29b-41d4-a716-446655440001";
    const emp1Id = "660e8400-e29b-41d4-a716-446655440001";
    const emp2Id = "660e8400-e29b-41d4-a716-446655440002";

    await db.insert(departmentTableV1).values({
      id: dept1Id,
      name: "Engineering",
      managerId: emp1Id, // Points to employee (no constraint yet)
    });
```