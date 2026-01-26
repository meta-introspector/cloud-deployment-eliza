# a7046c18:packages_plugin-sql_src___tests___integration_memory.test.ts:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/memory.test.ts:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      };

      await adapter.updateMemory(sourceUpdate);

      // Verify metadata was updated and content preserved
      const afterSourceUpdate = await adapter.getMemoryById(memoryId);
      expect(afterSourceUpdate?.content).toEqual(
        afterContentTextUpdate?.content as Content,
      );
      expect(afterSourceUpdate?.metadata?.type).toBe("test-original");
      expect(afterSourceUpdate?.metadata?.source).toBe("updated-source");
      expect(afterSourceUpdate?.metadata?.tags).toEqual(["original", "test"]);
      expect(afterSourceUpdate?.metadata?.timestamp).toBe(1000);
    });
  });

  describe("Memory Retrieval Operations", () => {
    it("should retrieve memories by room ID", async () => {
      await adapter.createMemory(
        createTestMemory({ text: "mem1" }),
        "messages",
      );
      await adapter.createMemory(
        createTestMemory({ text: "mem2" }),
        "messages",
      );
      const memories = await adapter.getMemories({
        roomId: testRoomId,
        tableName: "messages",
      });
      expect(memories.length).toBe(2);
    });

    it("should count memories in a room", async () => {
      await adapter.createMemory(
        createTestMemory({ text: "mem1" }),
        "memories",
      );
      await adapter.createMemory(
        createTestMemory({ text: "mem2" }),
        "memories",
      );
      const count = await adapter.countMemories(testRoomId, false, "memories");
      expect(count).toBe(2);
    });

    it("should retrieve memories by ID list", async () => {
      // Create test memories and collect their IDs
      const memoryIds: UUID[] = [];

      for (const memory of memoryTestMemories.slice(0, 2)) {
        // Override with correct test IDs
        const testMemory = {
          ...memory,
          agentId: testAgentId,
          entityId: testEntityId,
          roomId: testRoomId,
        };
        const memoryId = await adapter.createMemory(testMemory, "memories");
        memoryIds.push(memoryId);
      }

      // Retrieve memories by IDs
      const memories = await adapter.getMemoriesByIds(memoryIds, "memories");

      expect(memories).toHaveLength(2);
      expect(memories.map((m) => m.id)).toEqual(
        expect.arrayContaining(memoryIds),
      );
    });

    it("should retrieve memories with pagination", async () => {
      // Create test memories
      for (const memory of memoryTestMemories) {
        // Override with correct test IDs
        const testMemory = {
          ...memory,
          agentId: testAgentId,
          entityId: testEntityId,
          roomId: testRoomId,
        };
        await adapter.createMemory(testMemory, "memories");
      }

      // Retrieve first page (limit to 2)
      const firstPage = await adapter.getMemories({
        roomId: testRoomId,
        tableName: "memories",
        count: 2,
      });

      expect(firstPage).toHaveLength(2);

      // Test second page (remaining memories)
      const secondPage = await adapter.getMemories({
        roomId: testRoomId,
        tableName: "memories",
      });

      // There should be at least 3 memories total
      expect(secondPage.length).toBeGreaterThanOrEqual(
        memoryTestMemories.length,
      );
    });

    it("should retrieve memories with offset for pagination", async () => {
      // Create 5 test memories with known content
      const memoryContents = ["mem1", "mem2", "mem3", "mem4", "mem5"];
      for (const content of memoryContents) {
        await adapter.createMemory(
          createTestMemory({ text: content }),
          "memories",
        );
      }

      // First page: get first 2 memories
      const firstPage = await adapter.getMemories({
        roomId: testRoomId,
        tableName: "memories",
        count: 2,
        offset: 0,
      });
      expect(firstPage).toHaveLength(2);

      // Second page: skip first 2, get next 2
      const secondPage = await adapter.getMemories({
        roomId: testRoomId,
        tableName: "memories",
        count: 2,
        offset: 2,
      });
      expect(secondPage).toHaveLength(2);

      // Third page: skip first 4, get remaining
      const thirdPage = await adapter.getMemories({
        roomId: testRoomId,
        tableName: "memories",
        count: 2,
        offset: 4,
      });
      expect(thirdPage).toHaveLength(1);

      // Verify no overlap between pages
      const allIds = [...firstPage, ...secondPage, ...thirdPage].map(
        (m) => m.id,
      );
      const uniqueIds = new Set(allIds);
      expect(allIds.length).toBe(uniqueIds.size);
    });

```