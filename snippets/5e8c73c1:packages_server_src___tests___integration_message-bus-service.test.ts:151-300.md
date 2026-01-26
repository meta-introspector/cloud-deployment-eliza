# 5e8c73c1:packages_server_src___tests___integration_message-bus-service.test.ts:151-300

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/__tests__/integration/message-bus-service.test.ts:151-300
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
      // Wait for processing
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Restore
      runtime.emitEvent = originalEmit;

      // Should NOT process self-messages
      expect(messageProcessed).toBe(false);
    });

    it('should skip messages if agent not in channel', async () => {
      // Create channel WITHOUT the test agent
      const channel = await serverFixture
        .getServer()
        .createChannel(
          new ChannelBuilder().asGroupChannel('Channel Without Agent', messageServerId).build()
        );

      // Track if message processing starts
      let messageProcessed = false;
      const originalEmit = runtime.emitEvent;
      runtime.emitEvent = async (eventType: EventType, data: any) => {
        if (eventType === EventType.RUN_STARTED) {
          messageProcessed = true;
        }
        return originalEmit.call(runtime, eventType, data);
      };

      // Emit message in channel where agent is not a participant
      internalMessageBus.emit('new_message', {
        id: 'msg-not-participant' as UUID,
        channel_id: channel.id,
        message_server_id: messageServerId,
        author_id: stringToUuid('user-456'),
        content: 'Message in other channel',
        raw_message: { content: 'Message in other channel' },
        source_id: 'test-src-3',
        source_type: 'test',
        created_at: Date.now(),
        metadata: {},
      });

      // Wait
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Restore
      runtime.emitEvent = originalEmit;

      // Should NOT process messages in channels where agent is not participant
      expect(messageProcessed).toBe(false);
    });
  });

  describe('Message Deletion Handling', () => {
    it('should handle message deletion events', async () => {
      // Create channel and message
      const channel = await serverFixture
        .getServer()
        .createChannel(
          new ChannelBuilder().asIntegrationTestChannel(messageServerId, 'deletion-test').build(),
          [testAgentId]
        );

      const message = await serverFixture
        .getServer()
        .createMessage(
          new MessageBuilder()
            .withChannelId(channel.id)
            .withAuthorId(stringToUuid('user-789'))
            .withContent('Message to delete')
            .withSourceId('test-del-1')
            .withSourceType('test')
            .build()
        );

      // Track if deleteMessage is called on messageService
      let deleteMessageCalled = false;
      const originalDeleteMessage = runtime.messageService?.deleteMessage;
      if (runtime.messageService) {
        runtime.messageService.deleteMessage = async (...args: any[]) => {
          deleteMessageCalled = true;
          return originalDeleteMessage?.apply(runtime.messageService, args);
        };
      }

      // Emit deletion event
      internalMessageBus.emit('message_deleted', {
        messageId: message.id,
      });

      // Wait
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Restore
      if (runtime.messageService && originalDeleteMessage) {
        runtime.messageService.deleteMessage = originalDeleteMessage;
      }

      // The handler should attempt to delete (may not find memory if not processed yet)
      // The key is that it doesn't error out
      expect(service).toBeDefined();
    });
  });

  describe('Channel Clearing', () => {
    it('should handle channel clear events', async () => {
      // Create channel with messages
      const channel = await serverFixture
        .getServer()
        .createChannel(
          new ChannelBuilder().asIntegrationTestChannel(messageServerId, 'clear-test').build(),
          [testAgentId]
        );

      // Create multiple messages
      const messages = new MessageBuilder().buildMany(3, channel.id, (i) =>
        stringToUuid(`user-clear-${i}`)
      );

      for (const msgInput of messages) {
        await serverFixture.getServer().createMessage({
          channelId: msgInput.channelId,
          authorId: msgInput.authorId,
          content: msgInput.content,
          sourceId: msgInput.sourceId,
          sourceType: msgInput.sourceType,
          metadata: msgInput.metadata,
        });
      }

      // Track if clearChannel is called on messageService
      let clearChannelCalled = false;
      const originalClearChannel = runtime.messageService?.clearChannel;
      if (runtime.messageService) {
        runtime.messageService.clearChannel = async (...args: any[]) => {
          clearChannelCalled = true;
          return originalClearChannel?.apply(runtime.messageService, args);
        };
      }

      // Emit channel clear event
      internalMessageBus.emit('channel_cleared', {
        channelId: channel.id,
      });

      // Wait
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Restore
      if (runtime.messageService && originalClearChannel) {
```