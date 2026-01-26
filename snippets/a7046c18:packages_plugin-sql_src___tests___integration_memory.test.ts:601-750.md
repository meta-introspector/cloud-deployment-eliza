# a7046c18:packages_plugin-sql_src___tests___integration_memory.test.ts:601-750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/memory.test.ts:601-750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

      const results = await adapter.searchMemoriesByEmbedding(baseEmbedding, {
        tableName: "search",
        roomId: testRoomId,
        count: 1,
      });

      expect(results.length).toBe(1);
      expect(results[0].id).toBe(memory1.id as UUID);
      expect(results[0].similarity).toBeGreaterThan(0.99);
    });
  });

  describe("Document and Fragment Operations", () => {
    it("should create a document with fragments", async () => {
      // Create the document with correct test IDs
      const testDocument = {
        ...memoryTestDocument,
        agentId: testAgentId,
        entityId: testEntityId,
        roomId: testRoomId,
      };
      await adapter.createMemory(testDocument, "documents");

      // Create fragments that reference the document with correct test IDs
      for (const fragment of memoryTestFragments) {
        const testFragment = {
          ...fragment,
          agentId: testAgentId,
          entityId: testEntityId,
          roomId: testRoomId,
        };
        await adapter.createMemory(testFragment, "fragments");
      }

      // Retrieve fragments for the document
      const fragments = await adapter.getMemories({
        tableName: "fragments",
        roomId: testRoomId,
      });

      expect(fragments.length).toEqual(memoryTestFragments.length);
    });

    it("should delete a document and its fragments", async () => {
      // Create the document with correct test IDs
      const testDocument = {
        ...memoryTestDocument,
        agentId: testAgentId,
        entityId: testEntityId,
        roomId: testRoomId,
      };
      await adapter.createMemory(testDocument, "documents");

      // Create fragments that reference the document with correct test IDs
      for (const fragment of memoryTestFragments) {
        const testFragment = {
          ...fragment,
          agentId: testAgentId,
          entityId: testEntityId,
          roomId: testRoomId,
        };
        await adapter.createMemory(testFragment, "fragments");
      }

      // Delete the document (should cascade to fragments)
      await adapter.deleteMemory(documentMemoryId);

      // Verify document is deleted
      const document = await adapter.getMemoryById(documentMemoryId);
      expect(document).toBeNull();

      // Verify fragments are also deleted
      const fragments = await adapter.getMemories({
        tableName: "fragments",
        roomId: testRoomId,
      });

      expect(fragments.length).toBe(0);
    });
  });

  describe("Memory Model Mapping", () => {
    it("should correctly map between Memory and MemoryModel", async () => {
      const testMemory = {
        ...memoryTestMemories[0],
        agentId: testAgentId,
        entityId: testEntityId,
        roomId: testRoomId,
      };

      // Create the memory
      await adapter.createMemory(testMemory, "memories");

      // Retrieve it from database
      const retrievedMemory = await adapter.getMemoryById(
        testMemory.id as UUID,
      );
      expect(retrievedMemory).not.toBeNull();

      // Verify all fields were properly mapped
      expect(retrievedMemory?.id).toBe(testMemory.id as UUID);
      expect(retrievedMemory?.entityId).toBe(testMemory.entityId);
      expect(retrievedMemory?.roomId).toBe(testMemory.roomId);
      expect(retrievedMemory?.agentId).toBe(testMemory.agentId);
      expect(retrievedMemory?.content.text).toBe(
        testMemory.content.text as string,
      );
      expect(retrievedMemory?.metadata?.type).toBe(
        testMemory.metadata?.type as string,
      );
    });

    it("should handle partial Memory objects in mapToMemoryModel", async () => {
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

      // Create a partial memory object
      const partialMemory: Partial<any> = {
        id: memoryTestAgentId, // Using a known UUID
        entityId: uniqueEntityId,
        roomId: testRoomId,
        agentId: testAgentId,
        content: {
          text: "Partial memory object",
          type: "text",
        },
      };

      // Create the memory
      await adapter.createMemory(partialMemory as any, "memories");

      // Retrieve it from database
      const retrievedMemory = await adapter.getMemoryById(
        partialMemory.id as UUID,
      );
      expect(retrievedMemory).not.toBeNull();

      // Verify fields were properly mapped with defaults where applicable
      expect(retrievedMemory?.id).toBe(partialMemory.id);
      expect(retrievedMemory?.entityId).toBe(partialMemory.entityId);
```