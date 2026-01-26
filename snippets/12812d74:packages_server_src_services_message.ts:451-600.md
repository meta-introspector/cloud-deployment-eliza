# 12812d74:packages_server_src_services_message.ts:451-600

**Commit:** 12812d7441573a7a81c2c5d2ea28a46bd10f3d0c
**Author:** standujar
**Date:** Tue Dec 16 01:47:14 2025 +0100
**File:** packages/server/src/services/message.ts:451-600
**Novelty Score:** 30.22
**Concepts:** event-driven, plugin-system, testing

```
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('worlds_pkey')) {
        logger.debug(
          { src: 'service:message-bus', agentId: this.runtime.agentId, worldId: agentWorldId },
          'World already exists'
        );
      } else {
        throw error;
      }
    }

    try {
      await this.runtime.ensureRoomExists({
        id: agentRoomId,
        name: message.metadata?.channelName || `Channel ${message.channel_id.substring(0, 8)}`,
        agentId: this.runtime.agentId,
        worldId: agentWorldId,
        channelId: message.channel_id,
        messageServerId: message.message_server_id,
        source: message.source_type || 'central-bus',
        type: (message.metadata?.channelType as ChannelType) || ChannelType.GROUP,
        metadata: {
          ...(message.metadata?.channelMetadata || {}),
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('rooms_pkey')) {
        logger.debug(
          { src: 'service:message-bus', agentId: this.runtime.agentId, roomId: agentRoomId },
          'Room already exists'
        );
      } else {
        throw error;
      }
    }

    return { agentWorldId, agentRoomId };
  }

  private async ensureAuthorEntityExists(message: MessageServiceMessage): Promise<UUID> {
    // Use the author_id directly as the entity ID to ensure consistency
    // across different sources (socketio, client_chat, etc.)
    const agentAuthorEntityId = message.author_id as UUID;

    const authorEntity = await this.runtime.getEntityById(agentAuthorEntityId);
    if (!authorEntity) {
      await this.runtime.createEntity({
        id: agentAuthorEntityId,
        names: [message.author_display_name || `User-${message.author_id.substring(0, 8)}`],
        agentId: this.runtime.agentId,
        metadata: {
          source: message.source_type,
        },
      });
    }

    return agentAuthorEntityId;
  }

  public async handleIncomingMessage(data: unknown) {
    // Validate the incoming data structure
    if (!data || typeof data !== 'object') {
      logger.error(
        {
          src: 'service:message-bus',
          agentId: this.runtime.agentId,
          agentName: this.runtime.character.name,
        },
        'Invalid message data received'
      );
      return;
    }

    // Type guard for MessageServiceMessage
    interface MessageDataCandidate {
      id?: unknown;
      channel_id?: unknown;
      message_server_id?: unknown;
      author_id?: unknown;
      content?: unknown;
      created_at?: unknown;
      [key: string]: unknown;
    }
    const messageData = data as MessageDataCandidate;

    // Validate required fields
    if (
      !messageData.id ||
      !messageData.channel_id ||
      !messageData.message_server_id ||
      !messageData.author_id ||
      !messageData.content ||
      messageData.created_at === undefined
    ) {
      logger.error(
        {
          src: 'service:message-bus',
          agentId: this.runtime.agentId,
          agentName: this.runtime.character.name,
          hasId: !!messageData.id,
          hasChannelId: !!messageData.channel_id,
          hasMessageServerId: !!messageData.message_server_id,
          hasAuthorId: !!messageData.author_id,
          hasContent: !!messageData.content,
          hasCreatedAt: messageData.created_at !== undefined,
        },
        'Message missing required fields'
      );
      return;
    }

    const message: MessageServiceMessage = {
      id: messageData.id as UUID,
      channel_id: messageData.channel_id as UUID,
      message_server_id: messageData.message_server_id as UUID,
      author_id: messageData.author_id as UUID,
      content: messageData.content as string,
      created_at: messageData.created_at as number,
      author_display_name: messageData.author_display_name as string | undefined,
      raw_message: messageData.raw_message as Record<string, unknown> | undefined,
      source_id: messageData.source_id as string | undefined,
      source_type: messageData.source_type as string | undefined,
      in_reply_to_message_id: messageData.in_reply_to_message_id as UUID | undefined,
      metadata: messageData.metadata as MessageServiceMessage['metadata'],
    };
    logger.info(
      { src: 'service:message-bus', agentId: this.runtime.agentId, messageId: message.id },
      'Received message from central bus'
    );

    const participants = await this.getChannelParticipants(message.channel_id);

    if (!participants.includes(this.runtime.agentId)) {
      logger.debug(
        {
          src: 'service:message-bus',
          agentId: this.runtime.agentId,
          channelId: message.channel_id,
        },
        'Agent not a participant in channel, ignoring message'
      );
      return;
    }

    logger.debug(
      { src: 'service:message-bus', agentId: this.runtime.agentId, channelId: message.channel_id },
      'Agent is participant, processing message'
```