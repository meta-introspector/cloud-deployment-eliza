# a7046c18:packages_plugin-sql_src___tests___integration_base-comprehensive.test.ts:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/base-comprehensive.test.ts:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      // Create source entity first
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
        worldId: testWorldId,
        entityId: testEntityId,
        sourceEntityId: sourceEntityId,
        agentId: testAgentId,
        roomId: testRoomId,
        data: {
          relationshipType: "friend",
          strength: 0.8,
        },
        createdAt: new Date(),
      };

      // Create component
      const created = await adapter.createComponent(component);
      expect(created).toBe(true);

      // Get component
      const retrieved = await adapter.getComponent(
        testEntityId,
        "relationship",
        testWorldId,
        sourceEntityId,
      );
      expect(retrieved).toBeDefined();
      expect(retrieved?.data.relationshipType).toBe("friend");

      // Update component
      await adapter.updateComponent({
        ...component,
        data: {
          relationshipType: "best_friend",
          strength: 1.0,
        },
      });

      // Verify update
      const updated = await adapter.getComponent(
        testEntityId,
        "relationship",
        testWorldId,
        sourceEntityId,
      );
      expect(updated?.data.relationshipType).toBe("best_friend");
      expect(updated?.data.strength).toBe(1.0);

      // Delete component
      await adapter.deleteComponent(component.id);

      // Verify deletion
      const deleted = await adapter.getComponent(
        testEntityId,
        "relationship",
        testWorldId,
        sourceEntityId,
      );
      expect(deleted).toBeNull();
    });
  });

  describe("Room Operations", () => {
    it("should handle room operations with world relationships", async () => {
      const roomId = uuidv4() as UUID;
      const room: Room = {
        id: roomId,
        agentId: testAgentId,
        source: "test",
        type: "DM" as ChannelType,
        name: "DM Room",
        metadata: {
          participants: ["user1", "user2"],
        },
      };

      // Create room
      await adapter.createRooms([room]);

      // Get rooms by IDs
      const retrieved = await adapter.getRoomsByIds([roomId]);
      expect(retrieved).toHaveLength(1);
      expect(retrieved?.[0]?.metadata?.participants).toHaveLength(2);

      // Create participant
      const userId = uuidv4() as UUID;
      await adapter.addParticipantsRoom([userId], roomId);

      // Get rooms for participant
      const participantRooms = await adapter.getRoomsForParticipant(userId);
      expect(participantRooms).toBeDefined();

      // Delete room
      await adapter.deleteRoom(roomId);

      // Verify deletion
      const deleted = await adapter.getRoomsByIds([roomId]);
      expect(deleted).toHaveLength(0);
    });
  });

  describe("Search Operations", () => {
    it("should handle searchMemoriesByEmbedding", async () => {
      const embedding = new Float32Array(384).fill(0.5);

      // Create memory with embedding
      const memoryId = uuidv4() as UUID;
      await adapter.createMemory(
        {
          id: memoryId,
          agentId: testAgentId,
          entityId: testEntityId,
          roomId: testRoomId,
          content: { text: "Memory with embedding" } as Content,
          embedding: Array.from(embedding),
          createdAt: new Date(),
          metadata: { type: "embedding" },
        },
        "memories",
      );

      // Search by embedding
      const results = await adapter.searchMemoriesByEmbedding(
        Array.from(embedding),
        {
          tableName: "memories",
          count: 5,
          match_threshold: 0.5,
        },
      );

      expect(results.length).toBeGreaterThan(0);
      expect(results[0].id).toBe(memoryId);
    });

    it("should handle getCachedEmbeddings", async () => {
      const content = "Test content for embedding";
      const embedding = new Float32Array(384).fill(0.7);

      // Store embedding in cache - log requires specific format
```