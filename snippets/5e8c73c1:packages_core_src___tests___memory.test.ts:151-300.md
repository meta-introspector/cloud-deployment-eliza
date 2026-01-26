# 5e8c73c1:packages_core_src___tests___memory.test.ts:151-300

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/__tests__/memory.test.ts:151-300
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
      const metadata: DescriptionMetadata = {
        type: MemoryType.DESCRIPTION,
        timestamp: Date.now(),
      };
      expect(isDescriptionMetadata(metadata)).toBe(true);
    });

    it('should return false for non-description metadata', () => {
      const metadata: MessageMetadata = {
        type: MemoryType.MESSAGE,
        timestamp: Date.now(),
        scope: 'shared',
      };
      expect(isDescriptionMetadata(metadata)).toBe(false);
    });
  });

  describe('isCustomMetadata', () => {
    it('should return true for custom metadata types', () => {
      const metadata: CustomMetadata = {
        type: 'CUSTOM_TYPE' as MemoryType,
        timestamp: Date.now(),
      };
      expect(isCustomMetadata(metadata)).toBe(true);
    });

    it('should return false for standard metadata types', () => {
      const metadata: MessageMetadata = {
        type: MemoryType.MESSAGE,
        timestamp: Date.now(),
        scope: 'shared',
      };
      expect(isCustomMetadata(metadata)).toBe(false);
    });
  });

  describe('isDocumentMemory', () => {
    it('should return true for document memory', () => {
      const memory: Memory = {
        id: mockEntityId,
        entityId: mockEntityId,
        roomId: mockRoomId,
        content: { text: 'Document content' },
        createdAt: Date.now(),
        metadata: {
          type: MemoryType.DOCUMENT,
          timestamp: Date.now(),
        },
        agentId: mockAgentId,
      };
      expect(isDocumentMemory(memory)).toBe(true);
    });

    it('should return false for non-document memory', () => {
      const memory: Memory = {
        id: mockEntityId,
        entityId: mockEntityId,
        roomId: mockRoomId,
        content: { text: 'Message content' },
        createdAt: Date.now(),
        metadata: {
          type: MemoryType.MESSAGE,
          timestamp: Date.now(),
          scope: 'shared',
        },
        agentId: mockAgentId,
      };
      expect(isDocumentMemory(memory)).toBe(false);
    });

    it('should return false when metadata is undefined', () => {
      const memory: Memory = {
        id: mockEntityId,
        entityId: mockEntityId,
        roomId: mockRoomId,
        content: { text: 'Content without metadata' },
        createdAt: Date.now(),
        agentId: mockAgentId,
      } as Memory;
      expect(isDocumentMemory(memory)).toBe(false);
    });
  });

  describe('isFragmentMemory', () => {
    it('should return true for fragment memory', () => {
      const memory: Memory = {
        id: mockEntityId,
        entityId: mockEntityId,
        roomId: mockRoomId,
        content: { text: 'Fragment content' },
        createdAt: Date.now(),
        metadata: {
          type: MemoryType.FRAGMENT,
          timestamp: Date.now(),
        },
        agentId: mockAgentId,
      };
      expect(isFragmentMemory(memory)).toBe(true);
    });

    it('should return false for non-fragment memory', () => {
      const memory: Memory = {
        id: mockEntityId,
        entityId: mockEntityId,
        roomId: mockRoomId,
        content: { text: 'Message content' },
        createdAt: Date.now(),
        metadata: {
          type: MemoryType.MESSAGE,
          timestamp: Date.now(),
          scope: 'shared',
        },
        agentId: mockAgentId,
      };
      expect(isFragmentMemory(memory)).toBe(false);
    });

    it('should return false when metadata is undefined', () => {
      const memory: Memory = {
        id: mockEntityId,
        entityId: mockEntityId,
        roomId: mockRoomId,
        content: { text: 'Content without metadata' },
        createdAt: Date.now(),
        agentId: mockAgentId,
      } as Memory;
      expect(isFragmentMemory(memory)).toBe(false);
    });
  });

  describe('getMemoryText', () => {
    it('should extract text from memory content', () => {
      const memory: Memory = {
        id: mockEntityId,
        entityId: mockEntityId,
        roomId: mockRoomId,
        content: { text: 'Hello, world!' },
        createdAt: Date.now(),
        metadata: {
          type: MemoryType.MESSAGE,
          timestamp: Date.now(),
          scope: 'shared',
        },
        agentId: mockAgentId,
      };
      expect(getMemoryText(memory)).toBe('Hello, world!');
    });

    it('should return default value when text is missing', () => {
      const memory: Memory = {
```