# dd338745:packages_core_src___tests___integration_memory-runtime.test.ts:151-185

**Commit:** dd338745cb075f0766fb7dc04df0f2cb018bd06e
**Author:** standujar
**Date:** Tue Dec 16 02:41:08 2025 +0100
**File:** packages/core/src/__tests__/integration/memory-runtime.test.ts:151-185
**Novelty Score:** 18.06
**Concepts:** rag-system, testing

```
        {
          id: uuidv4() as UUID,
          entityId,
          roomId,
          content: { text: 'Second message' },
          createdAt: Date.now(),
          metadata: {
            type: MemoryType.MESSAGE,
            timestamp: Date.now(),
            scope: 'shared',
          },
          agentId,
        },
      ];

      (mockAdapter.getMemories as ReturnType<typeof mock>).mockResolvedValue(testMemories);

      const memories = await runtime.adapter.getMemories({ roomId, count: 10, tableName: 'messages' });
      expect(memories).toHaveLength(2);

      const texts = memories.map((m) => getMemoryText(m));
      expect(texts).toContain('First message');
      expect(texts).toContain('Second message');
    });

    it('should handle empty memory retrieval gracefully', async () => {
      (mockAdapter.getMemories as ReturnType<typeof mock>).mockResolvedValue([]);

      const memories = await runtime.adapter.getMemories({ roomId, count: 10, tableName: 'messages' });
      expect(memories).toHaveLength(0);
      expect(memories).toEqual([]);
    });
  });
});

```