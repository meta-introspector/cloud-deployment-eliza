# a7046c18:packages_core_typescript_src___tests___memory.test.ts:301-354

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/memory.test.ts:301-354
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        id: mockEntityId,
        entityId: mockEntityId,
        roomId: mockRoomId,
        content: {} as Content,
        createdAt: Date.now(),
        metadata: {
          type: MemoryType.MESSAGE,
          timestamp: Date.now(),
          scope: "shared",
        },
        agentId: mockAgentId,
      };
      expect(getMemoryText(memory)).toBe("");
      expect(getMemoryText(memory, "default")).toBe("default");
    });

    it("should return custom default value when provided", () => {
      const memory: Memory = {
        id: mockEntityId,
        entityId: mockEntityId,
        roomId: mockRoomId,
        content: {} as Content,
        createdAt: Date.now(),
        metadata: {
          type: MemoryType.MESSAGE,
          timestamp: Date.now(),
          scope: "shared",
        },
        agentId: mockAgentId,
      };
      expect(getMemoryText(memory, "No text available")).toBe(
        "No text available",
      );
    });

    it("should handle undefined text in content", () => {
      const memory: Memory = {
        id: mockEntityId,
        entityId: mockEntityId,
        roomId: mockRoomId,
        content: { text: undefined } as Content,
        createdAt: Date.now(),
        metadata: {
          type: MemoryType.MESSAGE,
          timestamp: Date.now(),
          scope: "shared",
        },
        agentId: mockAgentId,
      };
      expect(getMemoryText(memory)).toBe("");
      expect(getMemoryText(memory, "Default")).toBe("Default");
    });
  });
});
```