# a7046c18:packages_core_typescript_src___tests___integration_memory-runtime.test.ts:151-198

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/integration/memory-runtime.test.ts:151-198
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
          agentId,
        },
        {
          id: uuidv4() as UUID,
          entityId,
          roomId,
          content: { text: "Second message" },
          createdAt: Date.now(),
          metadata: {
            type: MemoryType.MESSAGE,
            timestamp: Date.now(),
            scope: "shared",
          },
          agentId,
        },
      ];

      (mockAdapter.getMemories as ReturnType<typeof mock>).mockResolvedValue(
        testMemories,
      );

      const memories = await runtime.adapter.getMemories({
        roomId,
        count: 10,
        tableName: "messages",
      });
      expect(memories).toHaveLength(2);

      const texts = memories.map((m) => getMemoryText(m));
      expect(texts).toContain("First message");
      expect(texts).toContain("Second message");
    });

    it("should handle empty memory retrieval gracefully", async () => {
      (mockAdapter.getMemories as ReturnType<typeof mock>).mockResolvedValue(
        [],
      );

      const memories = await runtime.adapter.getMemories({
        roomId,
        count: 10,
        tableName: "messages",
      });
      expect(memories).toHaveLength(0);
      expect(memories).toEqual([]);
    });
  });
});
```