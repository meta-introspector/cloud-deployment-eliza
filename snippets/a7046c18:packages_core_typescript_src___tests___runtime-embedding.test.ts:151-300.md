# a7046c18:packages_core_typescript_src___tests___runtime-embedding.test.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/runtime-embedding.test.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

      expect((events[0].payload as EmbeddingGenerationPayload).priority).toBe(
        "high",
      );
      expect((events[1].payload as EmbeddingGenerationPayload).priority).toBe(
        "normal",
      );
      expect((events[2].payload as EmbeddingGenerationPayload).priority).toBe(
        "low",
      );
    });

    it("should use normal priority by default", async () => {
      const memory: Memory = {
        id: "test-memory-id" as UUID,
        entityId: "test-entity" as UUID,
        agentId: "test-agent" as UUID,
        roomId: "test-room" as UUID,
        content: { text: "Default priority content" },
        createdAt: Date.now(),
      };

      await runtime.queueEmbeddingGeneration(memory);

      const event = emittedEvents.find(
        (e) => e.event === EventType.EMBEDDING_GENERATION_REQUESTED,
      );
      expect((event?.payload as EmbeddingGenerationPayload).priority).toBe(
        "normal",
      );
    });

    it("should be non-blocking", async () => {
      const memory: Memory = {
        id: "test-memory-id" as UUID,
        entityId: "test-entity" as UUID,
        agentId: "test-agent" as UUID,
        roomId: "test-room" as UUID,
        content: { text: "Non-blocking test" },
        createdAt: Date.now(),
      };

      const startTime = Date.now();
      await runtime.queueEmbeddingGeneration(memory, "normal");
      const elapsed = Date.now() - startTime;

      // Should complete almost instantly (< 10ms)
      expect(elapsed).toBeLessThan(10);
    });

    it("should handle multiple queued embeddings efficiently", async () => {
      const memories = Array.from({ length: 100 }, (_, i) => ({
        id: `memory-${i}` as UUID,
        entityId: "test-entity" as UUID,
        agentId: "test-agent" as UUID,
        roomId: "test-room" as UUID,
        content: { text: `Memory content ${i}` },
        createdAt: Date.now(),
      }));

      const startTime = Date.now();

      // Queue all memories
      await Promise.all(
        memories.map((memory) =>
          runtime.queueEmbeddingGeneration(memory, "normal"),
        ),
      );

      const elapsed = Date.now() - startTime;

      // Should complete very quickly even with 100 memories (< 50ms)
      expect(elapsed).toBeLessThan(50);

      // All events should be emitted
      const events = emittedEvents.filter(
        (e) => e.event === EventType.EMBEDDING_GENERATION_REQUESTED,
      );
      expect(events).toHaveLength(100);
    });
  });

  describe("Integration with addEmbeddingToMemory", () => {
    it("should work alongside synchronous embedding generation", async () => {
      // Mock the useModel for synchronous embedding with a simulated delay
      runtime.useModel = mock().mockImplementation(
        async (modelType: string) => {
          if (modelType === "TEXT_EMBEDDING") {
            // Simulate a realistic embedding generation delay
            await new Promise((resolve) => setTimeout(resolve, 5));
            return [0.1, 0.2, 0.3, 0.4, 0.5];
          }
          return Promise.resolve("mock response");
        },
      );

      const syncMemory: Memory = {
        id: "sync-memory" as UUID,
        entityId: "test-entity" as UUID,
        agentId: "test-agent" as UUID,
        roomId: "test-room" as UUID,
        content: { text: "Synchronous embedding" },
        createdAt: Date.now(),
      };

      const asyncMemory: Memory = {
        id: "async-memory" as UUID,
        entityId: "test-entity" as UUID,
        agentId: "test-agent" as UUID,
        roomId: "test-room" as UUID,
        content: { text: "Asynchronous embedding" },
        createdAt: Date.now(),
      };

      // Synchronous embedding (blocking - will wait for the delay)
      const startSync = Date.now();
      const resultSync = await runtime.addEmbeddingToMemory(syncMemory);
      const elapsedSync = Date.now() - startSync;

      // Asynchronous embedding (non-blocking - just queues)
      const startAsync = Date.now();
      await runtime.queueEmbeddingGeneration(asyncMemory, "normal");
      const elapsedAsync = Date.now() - startAsync;

      // Sync should have embeddings immediately
      expect(resultSync.embedding).toBeDefined();
      expect(resultSync.embedding).toEqual([0.1, 0.2, 0.3, 0.4, 0.5]);

      // Async should be much faster (just queuing, no waiting)
      expect(elapsedAsync).toBeLessThan(elapsedSync);

      // Verify that sync took at least the simulated delay (with margin for timing precision)
      expect(elapsedSync).toBeGreaterThanOrEqual(3);

      // Event should be emitted for async
      const event = emittedEvents.find(
        (e) => e.event === EventType.EMBEDDING_GENERATION_REQUESTED,
      );
      expect(event).toBeDefined();
      expect((event?.payload as EmbeddingGenerationPayload).memory.id).toBe(
        asyncMemory.id,
      );
    });
  });

  describe("Error Handling", () => {
    it("should handle null or undefined memory gracefully", async () => {
      // Test with undefined
      await runtime.queueEmbeddingGeneration(undefined, "normal");

```