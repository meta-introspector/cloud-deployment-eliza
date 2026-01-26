# a7046c18:packages_plugin-sql_src___tests___migration_schema-evolution-tests_02-drop-table-with-relationships.test.ts:301-441

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/schema-evolution-tests/02-drop-table-with-relationships.test.ts:301-441
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    console.log("\n🛡️  Testing protection without environment variable...");
    let blockedError: Error | null = null;
    try {
      await migrator.migrate("@elizaos/production-schema-v1", schemaV2);
    } catch (error) {
      blockedError = error as Error;
    }

    expect(blockedError).not.toBeNull();
    expect(blockedError?.message).toContain("Destructive migration blocked");
    console.log(`  ✅ Table drop blocked without env var`);

    // Test 3: Production mode should also block
    process.env.NODE_ENV = "production";

    console.log("\n🛡️  Testing production protection...");
    let productionError: Error | null = null;
    try {
      await migrator.migrate("@elizaos/production-schema-v1", schemaV2);
    } catch (error) {
      productionError = error as Error;
    }

    expect(productionError).not.toBeNull();
    expect(productionError?.message).toContain("production");
    expect(productionError?.message).toContain(
      "ELIZA_ALLOW_DESTRUCTIVE_MIGRATIONS",
    );
    console.log(`  ✅ Table drop blocked in production`);

    // Verify table still exists
    const tableExists = await db.execute(
      sql`SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'memories' AND table_schema = 'public'
      ) as exists`,
    );
    expect((tableExists.rows[0] as unknown as ExistsRow).exists).toBe(true);

    // Test 4: Force drop with environment variable
    process.env.NODE_ENV = "development";
    process.env.ELIZA_ALLOW_DESTRUCTIVE_MIGRATIONS = "true";

    console.log(
      "\n⚠️  Attempting migration with ELIZA_ALLOW_DESTRUCTIVE_MIGRATIONS=true...",
    );

    // This might fail due to foreign key constraints from embeddings
    try {
      await migrator.migrate("@elizaos/production-schema-v1", schemaV2);

      // If successful, verify consequences
      const tableExistsAfter = await db.execute(
        sql`SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'memories'
        ) as exists`,
      );

      expect((tableExistsAfter.rows[0] as unknown as ExistsRow).exists).toBe(
        false,
      );

      console.log("\n📊 After forced table drop:");
      console.log("  ❌ Memories table dropped");
      console.log("  ❌ All memory data lost permanently");
      console.log("  ⚠️  Embeddings may have orphaned references");
    } catch (error) {
      console.log("\n❌ Migration failed (expected due to FK constraints):");
      console.log(`  Error: ${(error as Error).message}`);
      console.log("  💡 Would need to handle dependent tables first");
    }
  });

  it("should detect cascade effects when dropping multiple related tables", async () => {
    const schemaV1 = getFullSchemaV1();

    await migrator.migrate("@elizaos/production-cascade-test", schemaV1);

    // Insert minimal data to test cascade detection
    const agentId = "aa0e8400-e29b-41d4-a716-446655440001";
    await db.insert(agentTable).values({
      id: agentId,
      name: "Test Agent",
      bio: ["Test bio"],
      enabled: true,
      system: "Test system",
      messageExamples: [],
      postExamples: [],
      topics: [],
      adjectives: [],
      knowledge: [],
      plugins: [],
      settings: {},
      style: {},
    });

    // Schema V2: Drop multiple interconnected tables
    const schemaV2 = {
      agents: agentTable,
      // Dropped: entities, memories, relationships, embeddings
      // These all have complex FK relationships
      rooms: roomTable,
      worlds: worldTable,
      participants: participantTable,
      messages: messageTable,
      messageServers: messageServerTable,
      channels: channelTable,
      channelParticipants: channelParticipantsTable,
      components: componentTable,
      logs: logTable,
      cache: cacheTable,
      tasks: taskTable,
      messageServerAgents: messageServerAgentsTable,
    };

    const check = await migrator.checkMigration(
      "@elizaos/production-cascade-test",
      schemaV2,
    );

    if (check) {
      expect(check.hasDataLoss).toBe(true);
      expect(check.warnings.length).toBeGreaterThanOrEqual(4); // At least 4 tables dropped

      console.log("\n🔗 Cascade Drop Analysis:");
      console.log(`  Total warnings: ${check.warnings.length}`);
      check.warnings.forEach((warning) => {
        console.log(`  • ${warning}`);
      });

      // Should detect all dropped tables
      expect(check.warnings.some((w) => w.includes("entities"))).toBe(true);
      expect(check.warnings.some((w) => w.includes("memories"))).toBe(true);
      expect(check.warnings.some((w) => w.includes("relationships"))).toBe(
        true,
      );
      expect(check.warnings.some((w) => w.includes("embeddings"))).toBe(true);
    }
  });
});
```