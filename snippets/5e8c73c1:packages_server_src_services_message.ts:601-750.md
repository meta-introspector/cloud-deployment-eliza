# 5e8c73c1:packages_server_src_services_message.ts:601-750

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/services/message.ts:601-750
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
    );

    try {
      if (!(await this.validateMessageServerSubscription(message))) {
        return;
      }
      if (!(await this.validateNotSelfMessage(message))) {
        return;
      }

      logger.debug(
        { src: 'service:message-bus', agentId: this.runtime.agentId },
        'All checks passed, processing message'
      );

      // Get ElizaOS instance
      const elizaOS = getGlobalElizaOS();

      // Prepare world and room IDs
      const { agentWorldId, agentRoomId } = await this.ensureWorldAndRoomExist(message);
      const agentAuthorEntityId = await this.ensureAuthorEntityExists(message);

      // Generate deterministic memory ID
      const uniqueMemoryId = createUniqueUuid(
        this.runtime,
        `${message.id}-${this.runtime.agentId}`
      );

      // Check if this memory already exists (in case of duplicate processing)
      const existingMemory = await this.runtime.getMemoryById(uniqueMemoryId);
      if (existingMemory) {
        logger.debug(
          { src: 'service:message-bus', agentId: this.runtime.agentId, memoryId: uniqueMemoryId },
          'Memory already exists, skipping duplicate'
        );
        return;
      }

      // Prepare message content
      const messageContent: Content = {
        text: message.content,
        source: message.source_type || 'central-bus',
        attachments: message.metadata?.attachments?.map((att) => ({
          id: att.id,
          url: att.url,
          title: att.name,
          contentType: att.type as ContentType | undefined,
        })),
        inReplyTo: message.in_reply_to_message_id
          ? createUniqueUuid(this.runtime, message.in_reply_to_message_id)
          : undefined,
      };

      // Use elizaOS.handleMessage() with async callback
      await elizaOS.handleMessage(
        this.runtime.agentId,
        {
          id: uniqueMemoryId,
          entityId: agentAuthorEntityId,
          roomId: agentRoomId,
          worldId: agentWorldId,
          content: messageContent,
          createdAt: message.created_at,
          metadata: {
            ...(message.metadata || {}),
            type: 'message',
            source: message.source_type || 'central-bus',
            sourceId: message.id,
            raw: {
              ...(typeof message.raw_message === 'object' && message.raw_message !== null
                ? message.raw_message
                : {}),
              senderName:
                message.author_display_name || `User-${message.author_id.substring(0, 8)}`,
              senderId: message.author_id,
            },
          },
        },
        {
          onStreamChunk: (() => {
            let chunkIndex = 0;
            return async (chunk: string, messageId?: UUID) => {
              // Emit stream chunk to internal bus for Socket.IO broadcast
              const room = await this.runtime.getRoom(agentRoomId);
              const channelId = room?.channelId;
              if (channelId && messageId) {
                internalMessageBus.emit('message_stream_chunk', {
                  channelId,
                  messageId,
                  chunk,
                  index: chunkIndex++,
                  agentId: this.runtime.agentId,
                });
              }
            };
          })(),
          onResponse: async (responseContent: Content) => {
            logger.info(
              { src: 'service:message-bus', agentId: this.runtime.agentId },
              'Agent generated response, sending to bus'
            );

            await this.runtime.createMemory(
              {
                id: responseContent.responseId as UUID | undefined,
                entityId: this.runtime.agentId,
                content: responseContent,
                roomId: agentRoomId,
                worldId: agentWorldId,
                agentId: this.runtime.agentId,
              },
              'messages'
            );

            // Send response to central bus
            await this.sendAgentResponseToBus(
              agentRoomId,
              agentWorldId,
              responseContent,
              uniqueMemoryId,
              message
            );
          },
          onError: async (error: Error) => {
            logger.error(
              {
                src: 'service:message-bus',
                agentId: this.runtime.agentId,
                agentName: this.runtime.character.name,
                error: error.message,
              },
              'Error processing message via handleMessage'
            );
          },
        }
      );

      // Notify completion after handling
      const room = await this.runtime.getRoom(agentRoomId);
      const world = await this.runtime.getWorld(agentWorldId);
      const channelId = room?.channelId as UUID;
      const messageServerId = world?.messageServerId;
      await this.notifyMessageComplete(channelId, messageServerId);
    } catch (error) {
      logger.error(
        {
          src: 'service:message-bus',
          agentId: this.runtime.agentId,
          agentName: this.runtime.character.name,
          error: error instanceof Error ? error.message : String(error),
```