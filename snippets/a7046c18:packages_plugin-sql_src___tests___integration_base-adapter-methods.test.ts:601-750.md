# a7046c18:packages_plugin-sql_src___tests___integration_base-adapter-methods.test.ts:601-750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/base-adapter-methods.test.ts:601-750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        {
          id: uuidv4() as UUID,
          agentId: testAgentId,
          names: ["Bob Johnson"],
          metadata: { type: "person" },
        },
        {
          id: uuidv4() as UUID,
          agentId: testAgentId,
          names: ["Alice Cooper"],
          metadata: { type: "person" },
        },
      ];

      for (const entity of entities) {
        await adapter.createEntities([entity]);
      }

      // Search for entities with 'Alice' in name
      const searchResults = await adapter.searchEntitiesByName({
        query: "Alice",
        agentId: testAgentId,
        limit: 10,
      });

      expect(searchResults.length).toBe(2);
      expect(
        searchResults.every((e) =>
          e.names.some((name) => name.toLowerCase().includes("alice")),
        ),
      ).toBe(true);

      // Test with limit
      const limitedResults = await adapter.searchEntitiesByName({
        query: "Alice",
        agentId: testAgentId,
        limit: 1,
      });

      expect(limitedResults.length).toBe(1);
    });

    it("should handle complex memory searches", async () => {
      const agentId = testAgentId;
      const roomId = uuidv4() as UUID;
      const entityId = uuidv4() as UUID;

      // Create entity first
      await adapter.createEntities([
        {
          id: entityId,
          agentId: testAgentId,
          names: ["Test Entity for Memory Search"],
          metadata: { type: "test" },
        },
      ]);

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

      // Create memories with different metadata
      const memories: Memory[] = [
        {
          id: uuidv4() as UUID,
          agentId,
          entityId: entityId,
          roomId,
          content: { text: "Meeting scheduled for tomorrow" } as Content,
          createdAt: new Date(Date.now() - 3600_000), // 1 hour ago
          metadata: { type: "calendar", priority: "high" },
        },
        {
          id: uuidv4() as UUID,
          agentId,
          entityId: entityId,
          roomId,
          content: { text: "Remember to buy groceries" } as Content,
          createdAt: new Date(Date.now() - 1800_000), // 30 min ago
          metadata: { type: "todo", priority: "low" },
        },
        {
          id: uuidv4() as UUID,
          agentId,
          entityId: entityId,
          roomId,
          content: { text: "Important meeting notes" } as Content,
          createdAt: new Date(Date.now() - 900_000), // 15 min ago
          metadata: { type: "notes", priority: "high" },
        },
      ];

      for (const memory of memories) {
        await adapter.createMemory(memory, "memories");
      }

      // Get recent memories
      const recentMemories = await adapter.getMemories({
        roomId,
        tableName: "memories",
        count: 2,
      });
      expect(recentMemories.length).toBe(2);
      // Memories are ordered by createdAt DESC, so most recent should be first
      expect(recentMemories[0].content?.text).toBe("Important meeting notes");
    });
  });

  describe("Error Handling", () => {
    it("should handle duplicate entity creation gracefully", async () => {
      const entity: Entity = {
        id: uuidv4() as UUID,
        agentId: testAgentId,
        names: ["Test Entity"],
        metadata: { type: "test" },
      };

      // Create entity
      await adapter.createEntities([entity]);

      // Try to create duplicate - createEntities returns false on duplicate
      const result = await adapter.createEntities([entity]);
      expect(result).toBe(false);
    });

    it("should handle updating non-existent entity", async () => {
      const entity: Entity = {
        id: uuidv4() as UUID,
        agentId: testAgentId,
        names: ["Non-existent Entity"],
        metadata: { type: "test" },
      };

      // Update should not throw but also shouldn't create
      await adapter.updateEntity(entity);

      // Verify entity doesn't exist
      const retrieved = await adapter.getEntitiesByNames({
        names: entity.names,
        agentId: testAgentId,
      });
      expect(retrieved.length).toBe(0);
    });
```