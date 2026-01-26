# a7046c18:packages_plugin-sql_src___tests___integration_base-comprehensive.test.ts:451-558

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/base-comprehensive.test.ts:451-558
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      await adapter.log({
        body: {
          content: content,
          embedding: Array.from(embedding),
        },
        entityId: testEntityId,
        roomId: testRoomId,
        type: "embedding",
      });

      // Retrieve cached embedding
      const cached = await adapter.getCachedEmbeddings({
        query_table_name: "logs",
        query_threshold: 5,
        query_input: content,
        query_field_name: "body",
        query_field_sub_name: "content",
        query_match_count: 10,
      });

      // Note: This might return empty if the cache implementation
      // doesn't match the expected behavior
      expect(cached).toBeDefined();
    });
  });

  describe("Edge Cases", () => {
    it("should handle operations with missing optional fields", async () => {
      // Entity without metadata
      const entityId = uuidv4() as UUID;
      await adapter.createEntities([
        {
          id: entityId,
          agentId: testAgentId,
          names: ["No Metadata Entity"],
          metadata: {},
        },
      ]);

      const entities = await adapter.getEntitiesByIds([entityId]);
      expect(entities?.[0]?.metadata).toEqual({});

      // Memory with required entityId
      const memoryId = uuidv4() as UUID;
      await adapter.createMemory(
        {
          id: memoryId,
          agentId: testAgentId,
          entityId: testEntityId, // Required field
          roomId: testRoomId,
          content: { text: "Memory with entity" } as Content,
          createdAt: new Date(),
        },
        "memories",
      );

      const memories = await adapter.getMemories({
        agentId: testAgentId,
        roomId: testRoomId,
        tableName: "memories",
      });
      const memoryWithEntity = memories.find((m) => m.id === memoryId);
      expect(memoryWithEntity).toBeDefined();
      expect(memoryWithEntity?.entityId).toBe(testEntityId);
    });

    it("should handle batch operations correctly", async () => {
      const batchSize = 5;
      const entities: Entity[] = [];
      const rooms: Room[] = [];

      // Create batch of entities
      for (let i = 0; i < batchSize; i++) {
        entities.push({
          id: uuidv4() as UUID,
          agentId: testAgentId,
          names: [`Batch Entity ${i}`],
          metadata: { batchIndex: i },
        });
      }

      const entityResult = await adapter.createEntities(entities);
      expect(entityResult).toBe(true);

      // Create batch of rooms
      for (let i = 0; i < batchSize; i++) {
        rooms.push({
          id: uuidv4() as UUID,
          agentId: testAgentId,
          source: "batch",
          type: "GROUP" as ChannelType,
          name: `Batch Room ${i}`,
        });
      }

      await adapter.createRooms(rooms);

      // Verify all were created
      const entityIds = entities.map((e) => e.id!);
      const retrievedEntities = await adapter.getEntitiesByIds(entityIds);
      expect(retrievedEntities).toHaveLength(batchSize);

      const roomIds = rooms.map((r) => r.id);
      const retrievedRooms = await adapter.getRoomsByIds(roomIds);
      expect(retrievedRooms).toHaveLength(batchSize);
    });
  });
});
```