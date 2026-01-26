# a7046c18:packages_plugin-sql_src___tests___migration_schema-evolution-tests_02-drop-table-with-relationships.test.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/schema-evolution-tests/02-drop-table-with-relationships.test.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        agentId: agent2Id,
        names: ["Jane Smith"],
        metadata: { type: "user", verified: false },
      },
    ]);

    // 3. Create rooms
    const room1Id = "770e8400-e29b-41d4-a716-446655440001";
    const room2Id = "770e8400-e29b-41d4-a716-446655440002";
    const channelId1 = "990e8400-e29b-41d4-a716-446655440001";
    const channelId2 = "990e8400-e29b-41d4-a716-446655440002";
    const messageServerId = "aa1e8400-e29b-41d4-a716-446655440001";

    await db.insert(roomTable).values([
      {
        id: room1Id,
        name: "Support Channel",
        agentId: agent1Id,
        source: "discord",
        type: "text",
        channelId: channelId1,
        messageServerId: messageServerId,
      },
      {
        id: room2Id,
        name: "Analytics Room",
        agentId: agent2Id,
        source: "discord",
        type: "voice",
        channelId: channelId2,
        messageServerId: messageServerId,
      },
    ]);

    // 4. Create memories (with foreign keys to agents, entities, rooms)
    await db.insert(memoryTable).values([
      {
        id: "880e8400-e29b-41d4-a716-446655440001",
        agentId: agent1Id,
        entityId: entity1Id,
        roomId: room1Id,
        type: "conversation",
        content: { text: "Customer support interaction #1", priority: "high" },
        metadata: { type: "fragment", documentId: "doc1", position: 1 },
        unique: true,
      },
      {
        id: "880e8400-e29b-41d4-a716-446655440002",
        agentId: agent1Id,
        entityId: entity1Id,
        roomId: room1Id,
        type: "fact",
        content: { text: "Customer preference noted", category: "preference" },
        metadata: { type: "fragment", documentId: "doc1", position: 2 },
        unique: true,
      },
      {
        id: "880e8400-e29b-41d4-a716-446655440003",
        agentId: agent2Id,
        entityId: entity2Id,
        roomId: room2Id,
        type: "analysis",
        content: { data: "Analytics result", confidence: 0.92 },
        metadata: { type: "document", timestamp: new Date().toISOString() },
        unique: false,
      },
    ]);

    // 5. Create relationships
    await db.insert(relationshipTable).values([
      {
        sourceEntityId: entity1Id,
        targetEntityId: entity2Id,
        agentId: agent1Id,
        tags: ["colleague", "team"],
        metadata: { strength: 0.8 },
      },
    ]);

    // Skip embeddings creation as it's complex with vectors
    // The key test is whether dropping memories table is detected

    // Verify all relationships are in place
    console.log("\n📊 Production data created:");
    const counts = await db.execute(sql`
      SELECT 
        (SELECT COUNT(*) FROM agents) as agents,
        (SELECT COUNT(*) FROM entities) as entities,
        (SELECT COUNT(*) FROM rooms) as rooms,
        (SELECT COUNT(*) FROM memories) as memories,
        (SELECT COUNT(*) FROM relationships) as relationships
    `);

    const stats = counts.rows[0] as StatsRow;
    console.log(`  - Agents: ${stats.agents}`);
    console.log(`  - Entities: ${stats.entities}`);
    console.log(`  - Rooms: ${stats.rooms}`);
    console.log(
      `  - Memories: ${stats.memories} (with FKs to agents, entities, rooms)`,
    );
    console.log(`  - Relationships: ${stats.relationships}`);

    // Create V2 schema WITHOUT memories table (destructive!)
    // This will break foreign key relationships from embeddings
    const schemaV2 = {
      agents: agentTable,
      // memories: memoryTable, // REMOVED - this will cause cascade issues!
      entities: entityTable,
      relationships: relationshipTable,
      rooms: roomTable,
      worlds: worldTable,
      participants: participantTable,
      messages: messageTable,
      messageServers: messageServerTable,
      channels: channelTable,
      channelParticipants: channelParticipantsTable,
      components: componentTable,
      embeddings: embeddingTable, // Still has references to memories!
      logs: logTable,
      cache: cacheTable,
      tasks: taskTable,
      messageServerAgents: messageServerAgentsTable,
    };

    // Test 1: Check for data loss warnings
    console.log("\n🔍 Checking migration for cascade effects...");
    const dataLossCheck = await migrator.checkMigration(
      "@elizaos/production-schema-v1",
      schemaV2,
    );

    if (dataLossCheck) {
      expect(dataLossCheck.hasDataLoss).toBe(true);
      expect(dataLossCheck.requiresConfirmation).toBe(true);
      expect(
        dataLossCheck.warnings.some(
          (w) => w.includes("memories") && w.includes("dropped"),
        ),
      ).toBe(true);

      console.log("\n⚠️  Table Drop Detection:");
      dataLossCheck.warnings.forEach((warning) => {
        console.log(`  ❌ ${warning}`);
      });
    }

    // Test 2: Should block without environment variable
    process.env.NODE_ENV = "development";
    delete process.env.ELIZA_ALLOW_DESTRUCTIVE_MIGRATIONS;

```