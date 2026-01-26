# 12812d74:packages_server_src_services_message.ts:751-900

**Commit:** 12812d7441573a7a81c2c5d2ea28a46bd10f3d0c
**Author:** standujar
**Date:** Tue Dec 16 01:47:14 2025 +0100
**File:** packages/server/src/services/message.ts:751-900
**Novelty Score:** 30.22
**Concepts:** event-driven, plugin-system, testing

```
  }

  private async handleMessageDeleted(data: MessageDeletedPayload) {
    try {
      logger.info(
        { src: 'service:message-bus', agentId: this.runtime.agentId, messageId: data.messageId },
        'Received message_deleted event'
      );

      // Convert the central message ID to the agent's unique memory ID
      const agentMemoryId = createUniqueUuid(this.runtime, data.messageId);

      // Try to find and delete the existing memory
      const existingMemory = await this.runtime.getMemoryById(agentMemoryId);

      if (existingMemory) {
        if (!this.runtime.messageService) {
          logger.error(
            {
              src: 'service:message-bus',
              agentId: this.runtime.agentId,
              agentName: this.runtime.character.name,
            },
            'messageService not initialized, cannot delete message'
          );
          return;
        }

        await this.runtime.messageService.deleteMessage(this.runtime, existingMemory);
        logger.debug(
          { src: 'service:message-bus', agentId: this.runtime.agentId, messageId: data.messageId },
          'Successfully processed message deletion'
        );
      } else {
        logger.warn(
          { src: 'service:message-bus', agentId: this.runtime.agentId, messageId: data.messageId },
          'No memory found for deleted message'
        );
      }
    } catch (error) {
      logger.error(
        {
          src: 'service:message-bus',
          agentId: this.runtime.agentId,
          agentName: this.runtime.character.name,
          error: error instanceof Error ? error.message : String(error),
        },
        'Error handling message deletion'
      );
    }
  }

  private async handleChannelCleared(data: ChannelClearedPayload) {
    try {
      logger.info(
        { src: 'service:message-bus', agentId: this.runtime.agentId, channelId: data.channelId },
        'Received channel_cleared event'
      );

      // Convert the central channel ID to the agent's unique room ID
      const agentRoomId = createUniqueUuid(this.runtime, data.channelId);

      if (!this.runtime.messageService) {
        logger.error(
          {
            src: 'service:message-bus',
            agentId: this.runtime.agentId,
            agentName: this.runtime.character.name,
          },
          'messageService not initialized, cannot clear channel'
        );
        return;
      }

      // Use message service to clear the channel
      await this.runtime.messageService.clearChannel(this.runtime, agentRoomId, data.channelId);

      logger.info(
        {
          src: 'service:message-bus',
          agentId: this.runtime.agentId,
          channelId: data.channelId,
          roomId: agentRoomId,
        },
        'Successfully processed channel clear'
      );
    } catch (error) {
      logger.error(
        {
          src: 'service:message-bus',
          agentId: this.runtime.agentId,
          agentName: this.runtime.character.name,
          error: error instanceof Error ? error.message : String(error),
        },
        'Error handling channel clear'
      );
    }
  }

  private async sendAgentResponseToBus(
    agentRoomId: UUID,
    agentWorldId: UUID,
    content: Content,
    inReplyToAgentMemoryId?: UUID,
    originalMessage?: MessageServiceMessage
  ) {
    try {
      const room = await this.runtime.getRoom(agentRoomId);
      const world = await this.runtime.getWorld(agentWorldId);

      const channelId = room?.channelId as UUID;
      const messageServerId = world?.messageServerId as UUID;

      if (!channelId || !messageServerId) {
        logger.error(
          {
            src: 'service:message-bus',
            agentId: this.runtime.agentId,
            agentName: this.runtime.character.name,
            roomId: agentRoomId,
            worldId: agentWorldId,
          },
          'Cannot map room/world to central IDs'
        );
        return;
      }

      // If agent decides to IGNORE or has no valid text, notify completion and skip sending response
      const shouldSkip =
        content.actions?.includes('IGNORE') || !content.text || content.text.trim() === '';

      if (shouldSkip) {
        logger.debug(
          {
            src: 'service:message-bus',
            agentId: this.runtime.agentId,
            reason: content.actions?.includes('IGNORE') ? 'IGNORE action' : 'No text',
          },
          'Skipping response'
        );
        return;
      }

      // Resolve reply-to message ID from agent memory metadata
      let centralInReplyToRootMessageId: UUID | undefined = undefined;
      if (inReplyToAgentMemoryId) {
        const originalAgentMemory = await this.runtime.getMemoryById(inReplyToAgentMemoryId);
        if (originalAgentMemory?.metadata?.sourceId) {
          centralInReplyToRootMessageId = originalAgentMemory.metadata.sourceId as UUID;
        }
```