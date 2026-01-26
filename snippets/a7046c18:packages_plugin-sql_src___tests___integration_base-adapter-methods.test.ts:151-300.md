# a7046c18:packages_plugin-sql_src___tests___integration_base-adapter-methods.test.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/base-adapter-methods.test.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

      // Create memories in different rooms
      const memories: Memory[] = [
        {
          id: uuidv4() as UUID,
          agentId,
          entityId: testEntityId,
          roomId: roomId1,
          content: { text: "Room 1 memory" } as Content,
          createdAt: Date.now(),
          metadata: { type: "test" },
        },
        {
          id: uuidv4() as UUID,
          agentId,
          entityId: testEntityId,
          roomId: roomId2,
          content: { text: "Room 2 memory" } as Content,
          createdAt: Date.now(),
          metadata: { type: "test" },
        },
      ];

      for (const memory of memories) {
        await adapter.createMemory(memory, "memories");
      }

      // Test getting memories from multiple rooms
      const retrievedMemories = await adapter.getMemoriesByRoomIds({
        roomIds: [roomId1, roomId2],
        tableName: "memories",
      });

      expect(retrievedMemories.length).toBe(2);
    });

    it("should handle updateEntity", async () => {
      const entity: Entity = {
        id: uuidv4() as UUID,
        agentId: testAgentId,
        names: ["Test Entity"],
        metadata: {
          test: true,
          version: 1,
        },
      };

      // Create entity
      await adapter.createEntities([entity]);

      // Update entity
      const updatedEntity: Entity = {
        ...entity,
        names: ["Updated Entity"],
        metadata: {
          test: false,
          version: 2,
        },
      };

      await adapter.updateEntity(updatedEntity);

      // Verify update
      const retrieved = await adapter.getEntitiesByNames({
        names: ["Updated Entity"],
        agentId: testAgentId,
      });
      expect(retrieved.length).toBe(1);
      expect(retrieved[0]?.id).toBe(entity.id as UUID);
      expect(retrieved[0]?.metadata?.version).toBe(2);
    });

    it("should handle updateMemory", async () => {
      const roomId = uuidv4() as UUID;

      // Create room first
      await adapter.createRooms([
        {
          id: roomId,
          agentId: testAgentId,
          source: "test",
          type: "GROUP" as ChannelType,
          name: "Test Room",
        },
      ]);

      const memoryId = uuidv4() as UUID;
      const memory: Memory = {
        id: memoryId,
        agentId: testAgentId,
        entityId: testEntityId,
        roomId: roomId,
        content: { text: "Original content" } as Content,
        createdAt: Date.now(),
        metadata: { type: "test" },
      };

      // Create memory
      await adapter.createMemory(memory, "memories");

      // Update memory
      await adapter.updateMemory({
        id: memoryId,
        content: { text: "Updated content" } as Content,
        metadata: { type: "updated" },
      });

      // Verify update
      const retrieved = await adapter.getMemoryById(memoryId);
      expect(retrieved?.content?.text).toBe("Updated content");
      expect(retrieved?.metadata?.type).toBe("updated");
    });

    it("should handle updateComponent", async () => {
      const worldId = uuidv4() as UUID;
      const sourceEntityId = uuidv4() as UUID;
      const roomId = uuidv4() as UUID;

      // Create world first
      await adapter.createWorld({
        id: worldId,
        agentId: testAgentId,
        serverId: uuidv4() as UUID,
        name: "Test World",
      });

      // Create room
      await adapter.createRooms([
        {
          id: roomId,
          agentId: testAgentId,
          source: "test",
          type: "GROUP" as ChannelType,
          name: "Test Room",
        },
      ]);

      // Create source entity
      await adapter.createEntities([
        {
          id: sourceEntityId,
          agentId: testAgentId,
          names: ["Source Entity"],
          metadata: {},
        },
      ]);

      const component: Component = {
        id: uuidv4() as UUID,
        type: "relationship",
```