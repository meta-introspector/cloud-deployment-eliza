# dd338745:packages_core_src___tests___runtime-embedding.test.ts:301-319

**Commit:** dd338745cb075f0766fb7dc04df0f2cb018bd06e
**Author:** standujar
**Date:** Tue Dec 16 02:41:08 2025 +0100
**File:** packages/core/src/__tests__/runtime-embedding.test.ts:301-319
**Novelty Score:** 18.06
**Concepts:** rag-system, testing

```

    it('should handle empty text content gracefully', async () => {
      const memory: Memory = {
        id: 'empty-text' as UUID,
        entityId: 'test-entity' as UUID,
        agentId: 'test-agent' as UUID,
        roomId: 'test-room' as UUID,
        content: { text: '' },
        createdAt: Date.now(),
      };

      await runtime.queueEmbeddingGeneration(memory, 'normal');

      // No event should be emitted for empty text
      const event = emittedEvents.find((e) => e.event === EventType.EMBEDDING_GENERATION_REQUESTED);
      expect(event).toBeUndefined();
    });
  });
});
```