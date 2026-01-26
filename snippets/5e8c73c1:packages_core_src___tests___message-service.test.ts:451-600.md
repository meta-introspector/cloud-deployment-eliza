# 5e8c73c1:packages_core_src___tests___message-service.test.ts:451-600

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/__tests__/message-service.test.ts:451-600
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
      );

      // Should still return a result even with empty input
      expect(result).toBeDefined();
    });

    it('should store incoming message in memory', async () => {
      const message: Memory = {
        id: '123e4567-e89b-12d3-a456-426614174024' as UUID,
        content: {
          text: 'Store this message',
          source: 'client_chat',
          channelType: ChannelType.DM,
        } as Content,
        entityId: '123e4567-e89b-12d3-a456-426614174005' as UUID,
        roomId: '123e4567-e89b-12d3-a456-426614174002' as UUID,
        agentId: '123e4567-e89b-12d3-a456-426614174001' as UUID,
        createdAt: Date.now(),
      };

      await messageService.handleMessage(mockRuntime as IAgentRuntime, message, mockCallback);

      expect(mockRuntime.createMemory).toHaveBeenCalledWith(
        expect.objectContaining({
          content: expect.objectContaining({
            text: 'Store this message',
          }),
        }),
        'messages'
      );
    });
  });

  describe('integration scenarios', () => {
    it('should handle voice message flow', async () => {
      const voiceMessage: Memory = {
        id: '123e4567-e89b-12d3-a456-426614174030' as UUID,
        content: {
          text: 'Hello via voice',
          source: 'discord',
          isVoiceMessage: true,
          channelType: ChannelType.VOICE_DM,
        } as Content,
        entityId: '123e4567-e89b-12d3-a456-426614174005' as UUID,
        roomId: '123e4567-e89b-12d3-a456-426614174002' as UUID,
        agentId: '123e4567-e89b-12d3-a456-426614174001' as UUID,
        createdAt: Date.now(),
      };

      const result = await messageService.handleMessage(
        mockRuntime as IAgentRuntime,
        voiceMessage,
        mockCallback
      );

      // Should process voice messages just like regular messages
      expect(result).toBeDefined();
      expect(mockRuntime.createMemory).toHaveBeenCalled();
    });

    it('should handle message without callback', async () => {
      const message: Memory = {
        id: '123e4567-e89b-12d3-a456-426614174031' as UUID,
        content: {
          text: 'Message without callback',
          source: 'discord',
          channelType: ChannelType.GROUP,
        } as Content,
        entityId: '123e4567-e89b-12d3-a456-426614174005' as UUID,
        roomId: '123e4567-e89b-12d3-a456-426614174002' as UUID,
        agentId: '123e4567-e89b-12d3-a456-426614174001' as UUID,
        createdAt: Date.now(),
      };

      // Should not throw when callback is undefined
      const result = await messageService.handleMessage(
        mockRuntime as IAgentRuntime,
        message,
        undefined
      );

      expect(result).toBeDefined();
    });

    it('should handle message from agent itself', async () => {
      const agentMessage: Memory = {
        id: '123e4567-e89b-12d3-a456-426614174032' as UUID,
        content: {
          text: 'Message from agent',
          source: 'client_chat',
          channelType: ChannelType.DM,
        } as Content,
        entityId: mockRuntime.agentId as UUID, // Same as agent
        roomId: '123e4567-e89b-12d3-a456-426614174002' as UUID,
        agentId: mockRuntime.agentId as UUID,
        createdAt: Date.now(),
      };

      const result = await messageService.handleMessage(
        mockRuntime as IAgentRuntime,
        agentMessage,
        mockCallback
      );

      // Should still process but might skip certain logic
      expect(result).toBeDefined();
    });
  });

  describe('deleteMessage', () => {
    it('should delete a message memory by ID', async () => {
      const mockDeleteMemory = mock(async () => {});
      mockRuntime.deleteMemory = mockDeleteMemory;

      const message: Memory = {
        id: '123e4567-e89b-12d3-a456-426614174040' as UUID,
        content: { text: 'Message to delete' } as Content,
        entityId: '123e4567-e89b-12d3-a456-426614174005' as UUID,
        roomId: '123e4567-e89b-12d3-a456-426614174002' as UUID,
        agentId: '123e4567-e89b-12d3-a456-426614174001' as UUID,
        createdAt: Date.now(),
      };

      await messageService.deleteMessage(mockRuntime as IAgentRuntime, message);

      expect(mockDeleteMemory).toHaveBeenCalledWith(message.id);
      if (mockRuntime.logger) {
        expect(mockRuntime.logger.info).toHaveBeenCalled();
      }
    });

    it('should handle missing message ID gracefully', async () => {
      const mockDeleteMemory = mock(async () => {});
      mockRuntime.deleteMemory = mockDeleteMemory;

      const messageWithoutId: Memory = {
        content: { text: 'Message without ID' } as Content,
        entityId: '123e4567-e89b-12d3-a456-426614174005' as UUID,
        roomId: '123e4567-e89b-12d3-a456-426614174002' as UUID,
        agentId: '123e4567-e89b-12d3-a456-426614174001' as UUID,
        createdAt: Date.now(),
      } as Memory;

      await messageService.deleteMessage(mockRuntime as IAgentRuntime, messageWithoutId);

      expect(mockDeleteMemory).not.toHaveBeenCalled();
      if (mockRuntime.logger) {
        expect(mockRuntime.logger.error).toHaveBeenCalledWith(
          { src: 'service:message', agentId: mockRuntime.agentId },
          'Cannot delete memory: message ID is missing'
```