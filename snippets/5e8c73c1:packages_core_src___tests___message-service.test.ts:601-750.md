# 5e8c73c1:packages_core_src___tests___message-service.test.ts:601-750

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/__tests__/message-service.test.ts:601-750
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
        );
      }
    });

    it('should handle deletion errors and re-throw', async () => {
      const deleteError = new Error('Database deletion failed');
      const mockDeleteMemory = mock(async () => {
        throw deleteError;
      });
      mockRuntime.deleteMemory = mockDeleteMemory;

      const message: Memory = {
        id: '123e4567-e89b-12d3-a456-426614174041' as UUID,
        content: { text: 'Message to delete' } as Content,
        entityId: '123e4567-e89b-12d3-a456-426614174005' as UUID,
        roomId: '123e4567-e89b-12d3-a456-426614174002' as UUID,
        agentId: '123e4567-e89b-12d3-a456-426614174001' as UUID,
        createdAt: Date.now(),
      };

      await expect(
        messageService.deleteMessage(mockRuntime as IAgentRuntime, message)
      ).rejects.toThrow('Database deletion failed');

      if (mockRuntime.logger) {
        expect(mockRuntime.logger.error).toHaveBeenCalled();
      }
    });
  });

  describe('clearChannel', () => {
    it('should clear all messages from a channel', async () => {
      const roomId = '123e4567-e89b-12d3-a456-426614174050' as UUID;
      const channelId = 'test-channel-123';

      const mockMemories: Memory[] = [
        {
          id: '123e4567-e89b-12d3-a456-426614174051' as UUID,
          content: { text: 'Message 1' } as Content,
          entityId: '123e4567-e89b-12d3-a456-426614174005' as UUID,
          roomId,
          agentId: '123e4567-e89b-12d3-a456-426614174001' as UUID,
          createdAt: Date.now(),
        },
        {
          id: '123e4567-e89b-12d3-a456-426614174052' as UUID,
          content: { text: 'Message 2' } as Content,
          entityId: '123e4567-e89b-12d3-a456-426614174005' as UUID,
          roomId,
          agentId: '123e4567-e89b-12d3-a456-426614174001' as UUID,
          createdAt: Date.now(),
        },
        {
          id: '123e4567-e89b-12d3-a456-426614174053' as UUID,
          content: { text: 'Message 3' } as Content,
          entityId: '123e4567-e89b-12d3-a456-426614174005' as UUID,
          roomId,
          agentId: '123e4567-e89b-12d3-a456-426614174001' as UUID,
          createdAt: Date.now(),
        },
      ];

      const mockGetMemories = mock(async () => mockMemories);
      const mockDeleteMemory = mock(async () => {});

      mockRuntime.getMemoriesByRoomIds = mockGetMemories;
      mockRuntime.deleteMemory = mockDeleteMemory;

      await messageService.clearChannel(mockRuntime as IAgentRuntime, roomId, channelId);

      expect(mockGetMemories).toHaveBeenCalledWith({
        tableName: 'messages',
        roomIds: [roomId],
      });
      expect(mockDeleteMemory).toHaveBeenCalledTimes(3);
      if (mockRuntime.logger) {
        expect(mockRuntime.logger.info).toHaveBeenCalled();
      }
    });

    it('should handle empty channel gracefully', async () => {
      const roomId = '123e4567-e89b-12d3-a456-426614174060' as UUID;
      const channelId = 'empty-channel';

      const mockGetMemories = mock(async () => []);
      const mockDeleteMemory = mock(async () => {});

      mockRuntime.getMemoriesByRoomIds = mockGetMemories;
      mockRuntime.deleteMemory = mockDeleteMemory;

      await messageService.clearChannel(mockRuntime as IAgentRuntime, roomId, channelId);

      expect(mockGetMemories).toHaveBeenCalled();
      expect(mockDeleteMemory).not.toHaveBeenCalled();
    });

    it('should continue clearing even if individual deletions fail', async () => {
      const roomId = '123e4567-e89b-12d3-a456-426614174070' as UUID;
      const channelId = 'partial-fail-channel';

      const mockMemories: Memory[] = [
        {
          id: '123e4567-e89b-12d3-a456-426614174071' as UUID,
          content: { text: 'Message 1' } as Content,
          entityId: '123e4567-e89b-12d3-a456-426614174005' as UUID,
          roomId,
          agentId: '123e4567-e89b-12d3-a456-426614174001' as UUID,
          createdAt: Date.now(),
        },
        {
          id: '123e4567-e89b-12d3-a456-426614174072' as UUID,
          content: { text: 'Message 2' } as Content,
          entityId: '123e4567-e89b-12d3-a456-426614174005' as UUID,
          roomId,
          agentId: '123e4567-e89b-12d3-a456-426614174001' as UUID,
          createdAt: Date.now(),
        },
      ];

      let callCount = 0;
      const mockDeleteMemory = mock(async () => {
        callCount++;
        if (callCount === 1) {
          throw new Error('First deletion failed');
        }
      });

      mockRuntime.getMemoriesByRoomIds = mock(async () => mockMemories);
      mockRuntime.deleteMemory = mockDeleteMemory;

      await messageService.clearChannel(mockRuntime as IAgentRuntime, roomId, channelId);

      // Should have attempted to delete both messages
      expect(mockDeleteMemory).toHaveBeenCalledTimes(2);
      // Should have logged warning for the failed deletion
      if (mockRuntime.logger) {
        expect(mockRuntime.logger.warn).toHaveBeenCalled();
        // Should have logged success for partial completion
        expect(mockRuntime.logger.info).toHaveBeenCalled();
      }
    });

    it('should skip memories without IDs', async () => {
      const roomId = '123e4567-e89b-12d3-a456-426614174080' as UUID;
      const channelId = 'no-id-channel';

      const mockMemories: Memory[] = [
        {
          content: { text: 'Message without ID' } as Content,
          entityId: '123e4567-e89b-12d3-a456-426614174005' as UUID,
```