# a7046c18:packages_plugin-sql_src___tests___integration_memory.test.ts:751-900

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/memory.test.ts:751-900
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      expect(retrievedMemory?.roomId).toBe(partialMemory.roomId);
      expect(retrievedMemory?.content.text).toBe(partialMemory.content?.text);
      expect(retrievedMemory?.unique).toBe(true); // Default value
      expect(retrievedMemory?.metadata).toBeDefined(); // Default empty object
    });
  });

  describe("Memory Batch Operations", () => {
    it("should delete all memories in a room", async () => {
      // Create a unique entity ID for this test to avoid conflicts
      const uniqueEntityId = v4() as UUID;

      // Create the required entity first to avoid foreign key constraint violations
      await adapter.createEntities([
        {
          id: uniqueEntityId,
          agentId: testAgentId,
          names: ["Test Entity"],
        } as Entity,
      ]);

      // Create test memories with correct entity IDs
      for (const memory of memoryTestMemories) {
        const testMemory = {
          ...memory,
          agentId: testAgentId,
          entityId: uniqueEntityId,
          roomId: testRoomId,
        };
        await adapter.createMemory(testMemory, "memories");
      }

      // Verify memories exist
      const countBefore = await adapter.countMemories(
        testRoomId,
        true,
        "memories",
      );
      expect(countBefore).toBeGreaterThan(0);

      // Delete all memories
      await adapter.deleteAllMemories(testRoomId, "memories");

      // Verify memories were deleted
      const countAfter = await adapter.countMemories(
        testRoomId,
        true,
        "memories",
      );
      expect(countAfter).toBe(0);
    });

    it("should retrieve memories by multiple room IDs", async () => {
      const secondRoomId = v4() as UUID;
      await adapter.createRooms([
        {
          id: secondRoomId,
          name: "Memory Test Room 2",
          agentId: testAgentId,
          source: "test",
          type: ChannelType.GROUP,
          worldId: testWorldId,
        },
      ]);

      // Create memories in the first room
      await adapter.createMemory(
        createTestMemory({ text: "mem1-room1" }),
        "memories",
      );
      await adapter.createMemory(
        createTestMemory({ text: "mem2-room1" }),
        "memories",
      );

      // Create memories in the second room
      await adapter.createMemory(
        { ...createTestMemory({ text: "mem3-room2" }), roomId: secondRoomId },
        "memories",
      );

      // Retrieve memories from both rooms
      const memories = await adapter.getMemoriesByRoomIds({
        roomIds: [testRoomId, secondRoomId],
        tableName: "memories",
      });

      expect(memories.length).toEqual(3);
    });
  });

  it("should properly convert metadata objects to JSON when updating only metadata", async () => {
    // This test specifically verifies the fix for the bug where metadata objects
    // were being sent as [object Object] instead of proper JSON
    await adapter.ensureEmbeddingDimension(768);
    const memory = {
      entityId: testEntityId,
      roomId: testRoomId,
      worldId: testWorldId,
      agentId: testAgentId,
      content: { text: "Initial content" },
      embedding: Array.from({ length: 768 }, (_, i) => i / 768),
      metadata: {
        type: "initial",
        source: "test",
        tags: ["test"],
        nested: {
          value: 123,
          flag: true,
        },
      },
    };

    const memoryId = await adapter.createMemory(memory, "memory");
    expect(memoryId).toBeDefined();

    // Update only metadata with a complex object
    const complexMetadata = {
      type: "updated",
      source: "test-update",
      tags: ["updated", "test"],
      nested: {
        value: 456,
        flag: false,
        deeper: {
          array: [1, 2, 3],
          string: "test",
        },
      },
      timestamp: Date.now(),
    };

    // This should not throw a PostgreSQL jsonb cast error
    const updateResult = await adapter.updateMemory({
      id: memoryId,
      metadata: complexMetadata,
    });

    expect(updateResult).toBe(true);

    // Verify the metadata was properly stored
    const updated = await adapter.getMemoryById(memoryId);
    expect(updated?.metadata).toEqual(complexMetadata);
    expect(updated?.content.text).toBe("Initial content"); // Content should be unchanged
  });

  it("should handle partial updates correctly", async () => {
    // This test is covered by the comprehensive partial update tests above
    // Including: 'should perform partial updates without affecting other fields'
    // and 'should perform nested partial updates without overriding existing fields'
```