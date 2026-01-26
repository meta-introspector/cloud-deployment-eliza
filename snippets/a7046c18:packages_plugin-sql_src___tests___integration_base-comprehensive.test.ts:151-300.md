# a7046c18:packages_plugin-sql_src___tests___integration_base-comprehensive.test.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/base-comprehensive.test.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        },
      ]);

      // Create related memory
      await adapter.createMemory(
        {
          id: uuidv4() as UUID,
          agentId: testAgentId,
          entityId: entityId,
          roomId: testRoomId,
          content: { text: "Related memory" } as Content,
          createdAt: new Date(),
          metadata: { type: "test" },
        },
        "memories",
      );

      // Delete entity (should cascade delete memory)
      await adapter.deleteEntity(entityId);

      // Verify entity is deleted
      const entities = await adapter.getEntitiesByIds([entityId]);
      expect(entities).toHaveLength(0);

      // Verify related memory is also deleted
      const memories = await adapter.getMemories({
        agentId: testAgentId,
        entityId: entityId,
        tableName: "memories",
      });
      expect(memories).toHaveLength(0);
    });
  });

  describe("Memory Operations", () => {
    it("should handle memory operations with all fields", async () => {
      const memoryId = uuidv4() as UUID;
      const memory: Memory = {
        id: memoryId,
        agentId: testAgentId,
        entityId: testEntityId,
        roomId: testRoomId,
        content: {
          text: "Comprehensive test memory",
          metadata: { important: true },
        } as Content,
        createdAt: new Date(),
        metadata: {
          type: "test",
          category: "comprehensive",
          priority: 1,
        },
      };

      // Create memory
      await adapter.createMemory(memory, "memories");

      // Get memory with filters
      const memories = await adapter.getMemories({
        agentId: testAgentId,
        entityId: testEntityId,
        roomId: testRoomId,
        tableName: "memories",
        count: 10,
      });

      expect(memories).toHaveLength(1);
      expect(memories[0].id).toBe(memoryId);
      expect((memories[0].metadata as any)?.category).toBe("comprehensive");

      // Update memory
      await adapter.updateMemory({
        id: memoryId,
        content: { text: "Updated memory" } as Content,
        metadata: { type: "updated", category: "comprehensive-updated" },
      });

      // Verify update
      const updated = await adapter.getMemories({
        agentId: testAgentId,
        entityId: testEntityId,
        tableName: "memories",
      });
      expect(updated[0].content.text).toBe("Updated memory");
      expect((updated[0].metadata as any)?.category).toBe(
        "comprehensive-updated",
      );

      // Delete memory
      await adapter.deleteMemory(memoryId);

      // Verify deletion
      const deleted = await adapter.getMemories({
        agentId: testAgentId,
        entityId: testEntityId,
        tableName: "memories",
      });
      expect(deleted).toHaveLength(0);
    });

    it("should handle getMemoriesByRoomIds with multiple rooms", async () => {
      const roomIds: UUID[] = [];
      const memories: Memory[] = [];

      // Create multiple rooms
      for (let i = 0; i < 3; i++) {
        const roomId = uuidv4() as UUID;
        roomIds.push(roomId);

        await adapter.createRooms([
          {
            id: roomId,
            agentId: testAgentId,
            source: "test",
            type: "GROUP" as ChannelType,
            name: `Room ${i}`,
          },
        ]);

        // Create memory for each room
        const memory: Memory = {
          id: uuidv4() as UUID,
          agentId: testAgentId,
          entityId: testEntityId,
          roomId: roomId,
          content: { text: `Memory for room ${i}` } as Content,
          createdAt: new Date(),
          metadata: { type: "test", roomIndex: i },
        };
        memories.push(memory);
        await adapter.createMemory(memory, "memories");
      }

      // Get memories for first two rooms
      const results = await adapter.getMemoriesByRoomIds({
        roomIds: roomIds.slice(0, 2),
        tableName: "memories",
      });

      expect(results).toHaveLength(2);
      expect(
        results.every((m) => roomIds.slice(0, 2).includes(m.roomId!)),
      ).toBe(true);
    });
  });

  describe("Component Operations", () => {
    it("should handle component CRUD with all fields", async () => {
      const sourceEntityId = uuidv4() as UUID;

```