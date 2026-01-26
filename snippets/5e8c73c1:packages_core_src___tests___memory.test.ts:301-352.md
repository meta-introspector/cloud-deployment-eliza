# 5e8c73c1:packages_core_src___tests___memory.test.ts:301-352

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/__tests__/memory.test.ts:301-352
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
        id: mockEntityId,
        entityId: mockEntityId,
        roomId: mockRoomId,
        content: {} as Content,
        createdAt: Date.now(),
        metadata: {
          type: MemoryType.MESSAGE,
          timestamp: Date.now(),
          scope: 'shared',
        },
        agentId: mockAgentId,
      };
      expect(getMemoryText(memory)).toBe('');
      expect(getMemoryText(memory, 'default')).toBe('default');
    });

    it('should return custom default value when provided', () => {
      const memory: Memory = {
        id: mockEntityId,
        entityId: mockEntityId,
        roomId: mockRoomId,
        content: {} as Content,
        createdAt: Date.now(),
        metadata: {
          type: MemoryType.MESSAGE,
          timestamp: Date.now(),
          scope: 'shared',
        },
        agentId: mockAgentId,
      };
      expect(getMemoryText(memory, 'No text available')).toBe('No text available');
    });

    it('should handle undefined text in content', () => {
      const memory: Memory = {
        id: mockEntityId,
        entityId: mockEntityId,
        roomId: mockRoomId,
        content: { text: undefined } as Content,
        createdAt: Date.now(),
        metadata: {
          type: MemoryType.MESSAGE,
          timestamp: Date.now(),
          scope: 'shared',
        },
        agentId: mockAgentId,
      };
      expect(getMemoryText(memory)).toBe('');
      expect(getMemoryText(memory, 'Default')).toBe('Default');
    });
  });
});
```