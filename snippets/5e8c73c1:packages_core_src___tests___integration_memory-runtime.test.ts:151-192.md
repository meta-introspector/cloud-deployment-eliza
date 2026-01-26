# 5e8c73c1:packages_core_src___tests___integration_memory-runtime.test.ts:151-192

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/__tests__/integration/memory-runtime.test.ts:151-192
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

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

      const memories = await runtime.adapter.getMemories({
        roomId,
        count: 10,
        tableName: 'messages',
      });
      expect(memories).toHaveLength(2);

      const texts = memories.map((m) => getMemoryText(m));
      expect(texts).toContain('First message');
      expect(texts).toContain('Second message');
    });

    it('should handle empty memory retrieval gracefully', async () => {
      (mockAdapter.getMemories as ReturnType<typeof mock>).mockResolvedValue([]);

      const memories = await runtime.adapter.getMemories({
        roomId,
        count: 10,
        tableName: 'messages',
      });
      expect(memories).toHaveLength(0);
      expect(memories).toEqual([]);
    });
  });
});
```