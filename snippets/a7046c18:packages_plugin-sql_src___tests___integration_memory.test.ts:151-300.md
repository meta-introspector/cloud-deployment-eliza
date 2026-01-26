# a7046c18:packages_plugin-sql_src___tests___integration_memory.test.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/memory.test.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      });
      const retrieved = await adapter.getMemoryById(memoryId);
      expect(retrieved?.content).toEqual({ text: "updated" });
    });

    it("should delete a memory", async () => {
      const memory = createTestMemory({ text: "to be deleted" });
      const memoryId = await adapter.createMemory(memory, "memories");
      let retrieved = await adapter.getMemoryById(memoryId);
      expect(retrieved).toBeDefined();
      await adapter.deleteMemory(memoryId);
      retrieved = await adapter.getMemoryById(memoryId);
      expect(retrieved).toBeNull();
    });

    it("should create a memory with embedding", async () => {
      const memory: Memory = {
        id: v4() as UUID,
        agentId: testAgentId,
        entityId: testEntityId,
        roomId: testRoomId,
        content: { text: "memory with embedding" },
        createdAt: Date.now(),
        embedding: Array.from({ length: 384 }, () => Math.random()),
      };
      const memoryId = await adapter.createMemory(memory, "memories");
      const createdMemory = await adapter.getMemoryById(memoryId);
      expect(createdMemory).not.toBeNull();
      expect(createdMemory?.embedding).toBeDefined();
      expect(createdMemory?.embedding?.length).toBe(384);
    });

    it("should perform partial updates without affecting other fields", async () => {
      // Create a complete memory first with content, metadata and embedding
      const memory = {
        ...memoryTestMemoriesWithEmbedding[0],
        // Override with correct test IDs
        agentId: testAgentId,
        entityId: testEntityId,
        roomId: testRoomId,
        metadata: {
          type: "test-original",
          source: "integration-test",
          tags: ["original", "test"],
          timestamp: 1000,
        },
      };

      const memoryId = await adapter.createMemory(memory, "memories");

      // Update only content
      const contentUpdate = {
        id: memoryId,
        content: {
          text: "This is updated content only",
          type: "text",
        },
      };

      await adapter.updateMemory(contentUpdate);

      // Verify only content changed, embedding and metadata preserved
      const afterContentUpdate = await adapter.getMemoryById(memoryId);
      expect(afterContentUpdate?.content.text).toBe(
        "This is updated content only",
      );
      expect(afterContentUpdate?.embedding).toEqual(
        memory.embedding as number[],
      );
      expect(afterContentUpdate?.metadata).toEqual(memory.metadata);

      // Update only one field in metadata
      const metadataUpdate = {
        id: memoryId,
        metadata: {
          type: "test-original",
          source: "updated-source", // Only updating the source field
          tags: ["original", "test"],
          timestamp: 1000,
        },
      };

      await adapter.updateMemory(metadataUpdate);

      // Verify partial metadata update behaves as expected
      const afterMetadataUpdate = await adapter.getMemoryById(memoryId);
      expect(afterMetadataUpdate?.content.text).toBe(
        "This is updated content only",
      );
      expect(afterMetadataUpdate?.metadata?.type).toBe("test-original");
      expect(afterMetadataUpdate?.metadata?.source).toBe("updated-source");
      expect(afterMetadataUpdate?.metadata?.tags).toEqual(["original", "test"]);
      expect(afterMetadataUpdate?.metadata?.timestamp).toBe(1000);
    });

    it("should perform nested partial updates without overriding existing fields", async () => {
      // Create a memory with rich content and metadata
      const originalMemory = {
        ...memoryTestMemoriesWithEmbedding[0],
        // Override with correct test IDs
        agentId: testAgentId,
        entityId: testEntityId,
        roomId: testRoomId,
        content: {
          text: "Original content text",
          type: "text",
          additionalInfo: "This should be preserved",
        },
        metadata: {
          type: "test-original",
          source: "integration-test",
          tags: ["original", "test"],
          timestamp: 1000,
        },
      };

      const memoryId = await adapter.createMemory(originalMemory, "memories");

      // When updating content, we must include the full content object
      // since partial updates fully replace the content object
      const contentTextUpdate = {
        id: memoryId,
        content: {
          text: "Updated text only",
          type: "text",
          additionalInfo: "This should be preserved",
        },
      };

      await adapter.updateMemory(contentTextUpdate);

      // Verify content was updated but metadata preserved
      const afterContentTextUpdate = await adapter.getMemoryById(memoryId);
      expect(afterContentTextUpdate?.content.text).toBe("Updated text only");
      expect(afterContentTextUpdate?.content.type).toBe("text");
      expect(afterContentTextUpdate?.content.additionalInfo).toBe(
        "This should be preserved",
      );
      expect(afterContentTextUpdate?.metadata).toEqual(originalMemory.metadata);

      // Update only source field in metadata, but must include all metadata fields
      // since partial updates fully replace the metadata object
      const sourceUpdate = {
        id: memoryId,
        metadata: {
          type: "test-original",
          source: "updated-source",
          tags: ["original", "test"],
          timestamp: 1000,
        },
```