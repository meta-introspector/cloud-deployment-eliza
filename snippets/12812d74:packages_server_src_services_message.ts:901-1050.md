# 12812d74:packages_server_src_services_message.ts:901-1050

**Commit:** 12812d7441573a7a81c2c5d2ea28a46bd10f3d0c
**Author:** standujar
**Date:** Tue Dec 16 01:47:14 2025 +0100
**File:** packages/server/src/services/message.ts:901-1050
**Novelty Score:** 30.22
**Concepts:** event-driven, plugin-system, testing

```
      }

      const payloadToServer = {
        messageId: content.responseMessageId as UUID | undefined,
        channel_id: channelId,
        message_server_id: messageServerId,
        author_id: this.runtime.agentId, // This needs careful consideration: is it the agent's core ID or a specific central identity for the agent?
        content: content.text,
        in_reply_to_message_id: centralInReplyToRootMessageId,
        source_type: 'agent_response',
        raw_message: {
          text: content.text,
          thought: content.thought,
          actions: content.actions,
        },
        metadata: {
          agent_id: this.runtime.agentId,
          agentName: this.runtime.character.name,
          attachments: content.attachments,
          channelType: originalMessage?.metadata?.channelType || room?.type,
          isDm:
            originalMessage?.metadata?.isDm ||
            (originalMessage?.metadata?.channelType || room?.type) === ChannelType.DM,
        },
      };

      logger.debug(
        { src: 'service:message-bus', agentId: this.runtime.agentId, channelId, messageServerId },
        'Sending response to central server'
      );

      // Actual fetch to the central server API
      const baseUrl = this.getCentralMessageServerUrl();
      // Use URL constructor for safe URL building
      const submitUrl = new URL('/api/messaging/submit', baseUrl);
      const serverApiUrl = submitUrl.toString();
      const response = await fetch(serverApiUrl, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(payloadToServer),
      });

      if (!response.ok) {
        logger.error(
          {
            src: 'service:message-bus',
            agentId: this.runtime.agentId,
            agentName: this.runtime.character.name,
            status: response.status,
          },
          'Error sending response to central server'
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
        'Error sending agent response to bus'
      );
    }
  }

  async notifyActionStart(
    agentRoomId: UUID,
    agentWorldId: UUID,
    content: Content,
    messageId: UUID,
    inReplyToAgentMemoryId?: UUID,
    originalMessage?: MessageServiceMessage
  ) {
    try {
      const room = await this.runtime.getRoom(agentRoomId);
      const world = await this.runtime.getWorld(agentWorldId);

      const channelId = room?.channelId as UUID;
      const messageServerId = world?.messageServerId;

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

      // Resolve central reply-to id from agent memory (optional)
      let centralInReplyToRootMessageId: UUID | undefined;
      if (inReplyToAgentMemoryId) {
        const m = await this.runtime.getMemoryById(inReplyToAgentMemoryId);
        if (m?.metadata?.sourceId) {centralInReplyToRootMessageId = m.metadata.sourceId as UUID;}
      }

      const payloadToServer = {
        messageId, // passed straight through
        channel_id: channelId,
        message_server_id: messageServerId,
        author_id: this.runtime.agentId,
        content: content.text,
        in_reply_to_message_id: centralInReplyToRootMessageId,
        source_type: 'agent_action',
        raw_message: {
          text: content.text,
          thought: content.thought,
          actions: content.actions,
          ...content,
        },
        metadata: {
          agent_id: this.runtime.agentId,
          agentName: this.runtime.character.name,
          attachments: content.attachments,
          channelType: originalMessage?.metadata?.channelType || room?.type,
          isDm:
            originalMessage?.metadata?.isDm ||
            (originalMessage?.metadata?.channelType || room?.type) === ChannelType.DM,
        },
      };

      const baseUrl = this.getCentralMessageServerUrl();
      const submitUrl = new URL('/api/messaging/action', baseUrl).toString();

      logger.debug(
        { src: 'service:message-bus', agentId: this.runtime.agentId, messageId },
        'Sending action to central server'
      );

      const response = await fetch(submitUrl, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(payloadToServer),
      });

      if (!response.ok) {
        logger.error(
          {
            src: 'service:message-bus',
            agentId: this.runtime.agentId,
            agentName: this.runtime.character.name,
            status: response.status,
          },
          'POST /action failed'
```