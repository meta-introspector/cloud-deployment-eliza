# a7046c18:packages_plugin-sql_src___tests___integration_memory.test.ts:451-600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/memory.test.ts:451-600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    it("should handle offset without count parameter", async () => {
      // Create 5 test memories
      for (let i = 0; i < 5; i++) {
        await adapter.createMemory(
          createTestMemory({ text: `mem${i}` }),
          "memories",
        );
      }

      // Get all memories
      const allMemories = await adapter.getMemories({
        roomId: testRoomId,
        tableName: "memories",
      });
      expect(allMemories.length).toBe(5);

      // Get memories with only offset (skip first 2)
      const withOffset = await adapter.getMemories({
        roomId: testRoomId,
        tableName: "memories",
        offset: 2,
      });
      expect(withOffset.length).toBe(3);

      // Verify the offset memories are the last 3 of all memories
      const lastThreeIds = allMemories.slice(2).map((m) => m.id);
      const offsetIds = withOffset.map((m) => m.id);
      expect(offsetIds).toEqual(lastThreeIds);
    });

    it("should handle edge cases for offset pagination", async () => {
      // Create 3 test memories
      for (let i = 0; i < 3; i++) {
        await adapter.createMemory(
          createTestMemory({ text: `mem${i}` }),
          "memories",
        );
      }

      // Offset beyond available memories
      const beyondOffset = await adapter.getMemories({
        roomId: testRoomId,
        tableName: "memories",
        count: 2,
        offset: 10,
      });
      expect(beyondOffset.length).toBe(0);

      // Offset of 0 should behave like no offset
      const zeroOffset = await adapter.getMemories({
        roomId: testRoomId,
        tableName: "memories",
        count: 2,
        offset: 0,
      });
      expect(zeroOffset.length).toBe(2);

      // No offset should return all (up to count limit)
      const noOffset = await adapter.getMemories({
        roomId: testRoomId,
        tableName: "memories",
        count: 2,
      });
      expect(noOffset.length).toBe(2);
      expect(noOffset.map((m) => m.id)).toEqual(zeroOffset.map((m) => m.id));
    });

    it("should reject negative offset values", async () => {
      // Create a test memory
      await adapter.createMemory(
        createTestMemory({ text: "test" }),
        "memories",
      );

      // Attempt to use negative offset
      await expect(async () => {
        await adapter.getMemories({
          roomId: testRoomId,
          tableName: "memories",
          offset: -1,
        });
      }).toThrow("offset must be a non-negative number");

      // Attempt to use another negative offset
      await expect(async () => {
        await adapter.getMemories({
          roomId: testRoomId,
          tableName: "memories",
          count: 5,
          offset: -10,
        });
      }).toThrow("offset must be a non-negative number");
    });

    it("should maintain consistent pagination results with countMemories", async () => {
      // Create 10 test memories
      const totalMemories = 10;
      for (let i = 0; i < totalMemories; i++) {
        await adapter.createMemory(
          createTestMemory({ text: `mem${i}` }),
          "memories",
        );
      }

      // Get total count
      const totalCount = await adapter.countMemories(
        testRoomId,
        false,
        "memories",
      );
      expect(totalCount).toBe(totalMemories);

      // Paginate through all memories
      const pageSize = 3;
      const totalPages = Math.ceil(totalCount / pageSize);
      const allPaginatedMemories: Memory[] = [];

      for (let page = 0; page < totalPages; page++) {
        const pageMemories = await adapter.getMemories({
          roomId: testRoomId,
          tableName: "memories",
          count: pageSize,
          offset: page * pageSize,
        });
        allPaginatedMemories.push(...pageMemories);
      }

      // Verify we got all memories through pagination
      expect(allPaginatedMemories.length).toBe(totalMemories);

      // Verify all IDs are unique (no duplicates from pagination)
      const ids = allPaginatedMemories.map((m) => m.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });
  });

  describe("Memory Search Operations", () => {
    it("should search memories by embedding similarity", async () => {
      const baseEmbedding = Array.from({ length: 384 }, () => Math.random());
      const memory1: Partial<Memory> = {
        id: v4() as UUID,
        content: { text: "memory 1" },
        createdAt: Date.now(),
        embedding: baseEmbedding,
      };
      memory1.agentId = testAgentId;
      memory1.roomId = testRoomId;
      memory1.entityId = testEntityId;
      await adapter.createMemory(memory1 as Memory, "search");
```