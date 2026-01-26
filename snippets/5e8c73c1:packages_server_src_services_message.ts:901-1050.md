# 5e8c73c1:packages_server_src_services_message.ts:901-1050

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/services/message.ts:901-1050
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
        const originalAgentMemory = await this.runtime.getMemoryById(inReplyToAgentMemoryId);
        if (originalAgentMemory?.metadata?.sourceId) {
          centralInReplyToRootMessageId = originalAgentMemory.metadata.sourceId as UUID;
        }
      }

      const payloadToServer = {
        messageId: content.responseId as UUID | undefined,
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
        if (m?.metadata?.sourceId) {
          centralInReplyToRootMessageId = m.metadata.sourceId as UUID;
        }
      }

      // For ACTION_START, send text and full ToolPart data
      // The text response will stream to a SEPARATE message with different ID
      const payloadToServer = {
        messageId, // passed straight through - this is the actionId for the badge
        channel_id: channelId,
        message_server_id: messageServerId,
        author_id: this.runtime.agentId,
        content: content.text, // Action text (e.g., "Executing action: GET_TOKEN")
        in_reply_to_message_id: centralInReplyToRootMessageId,
        source_type: 'agent_action',
        raw_message: {
          // Full action metadata for ToolPart display
          text: content.text,
          thought: content.thought,
          actions: content.actions,
          actionId: content.actionId,
          actionStatus: content.actionStatus || 'executing',
          type: content.type,
          ...content, // Include all other content fields
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
```