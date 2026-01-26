# a7046c18:packages_core_typescript_src___tests___runtime-embedding.test.ts:301-355

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/runtime-embedding.test.ts:301-355
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      // Test with null
      await runtime.queueEmbeddingGeneration(null, "normal");

      // No events should be emitted
      const events = emittedEvents.filter(
        (e) => e.event === EventType.EMBEDDING_GENERATION_REQUESTED,
      );
      expect(events).toHaveLength(0);
    });

    it("should handle memory with null content gracefully", async () => {
      // Testing edge case: malformed memory with null content
      // This simulates data corruption or invalid API input
      interface MalformedMemory extends Omit<Memory, "content"> {
        content: null;
      }
      const memory: MalformedMemory = {
        id: "null-content" as UUID,
        entityId: "test-entity" as UUID,
        agentId: "test-agent" as UUID,
        roomId: "test-room" as UUID,
        content: null,
        createdAt: Date.now(),
      };

      // Cast to Memory to test runtime handling of invalid data
      await runtime.queueEmbeddingGeneration(memory as Memory, "normal");

      // No event should be emitted
      const event = emittedEvents.find(
        (e) => e.event === EventType.EMBEDDING_GENERATION_REQUESTED,
      );
      expect(event).toBeUndefined();
    });

    it("should handle empty text content gracefully", async () => {
      const memory: Memory = {
        id: "empty-text" as UUID,
        entityId: "test-entity" as UUID,
        agentId: "test-agent" as UUID,
        roomId: "test-room" as UUID,
        content: { text: "" },
        createdAt: Date.now(),
      };

      await runtime.queueEmbeddingGeneration(memory, "normal");

      // No event should be emitted for empty text
      const event = emittedEvents.find(
        (e) => e.event === EventType.EMBEDDING_GENERATION_REQUESTED,
      );
      expect(event).toBeUndefined();
    });
  });
});
```