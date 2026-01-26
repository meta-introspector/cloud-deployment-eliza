# 5e8c73c1:packages_server_src_services_message.ts:1051-1200

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/services/message.ts:1051-1200
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
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
        );
      }
      return response;
    } catch (error) {
      logger.error(
        {
          src: 'service:message-bus',
          agentId: this.runtime.agentId,
          agentName: this.runtime.character.name,
          error: error instanceof Error ? error.message : String(error),
        },
        'Error in notifyActionStart'
      );
    }
  }

  async notifyActionUpdate(
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

      // Optional: keep reply-to behavior consistent
      let centralInReplyToRootMessageId: UUID | undefined;
      if (inReplyToAgentMemoryId) {
        const m = await this.runtime.getMemoryById(inReplyToAgentMemoryId);
        if (m?.metadata?.sourceId) {
          centralInReplyToRootMessageId = m.metadata.sourceId as UUID;
        }
      }

      // Update badge with final result for debug (text goes in collapsible details)
      // The streamed text is in a SEPARATE message with different ID
      const patchPayload = {
        raw_message: {
          thought: content.thought,
          actions: content.actions,
          actionStatus: content.actionStatus,
          actionResult: content.actionResult,
          type: content.type,
          text: content.text, // Final result text shown in badge details for debug
        },
        source_type: 'agent_action',
        in_reply_to_message_id: centralInReplyToRootMessageId,
        metadata: {
          agent_id: this.runtime.agentId,
          agentName: this.runtime.character.name,
          attachments: content.attachments,
          channelType: originalMessage?.metadata?.channelType || room?.type,
          isDm:
            originalMessage?.metadata?.isDm ||
            (originalMessage?.metadata?.channelType || room?.type) === ChannelType.DM,
          actionStatus: content.actionStatus,
        },
      };

      const baseUrl = this.getCentralMessageServerUrl();
      const patchUrl = new URL(`/api/messaging/action/${messageId}`, baseUrl).toString();

      logger.debug(
        { src: 'service:message-bus', agentId: this.runtime.agentId, messageId },
        'Sending action update to central server'
      );

      const response = await fetch(patchUrl, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(patchPayload),
      });

      if (!response.ok) {
        logger.error(
          {
            src: 'service:message-bus',
            agentId: this.runtime.agentId,
            agentName: this.runtime.character.name,
            messageId,
            status: response.status,
          },
          'PATCH /action failed'
        );
      }
      return response;
    } catch (error) {
      logger.error(
        {
          src: 'service:message-bus',
          agentId: this.runtime.agentId,
          agentName: this.runtime.character.name,
          error: error instanceof Error ? error.message : String(error),
        },
        'Error in notifyActionUpdate'
      );
    }
  }

  private async notifyMessageComplete(channelId?: UUID, messageServerId?: UUID) {
    if (!channelId || !messageServerId) {
      return;
    }

    try {
      const completeUrl = new URL('/api/messaging/complete', this.getCentralMessageServerUrl());
      await fetch(completeUrl.toString(), {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ channel_id: channelId, message_server_id: messageServerId }),
      });
    } catch (error) {
      logger.warn(
        {
          src: 'service:message-bus',
          agentId: this.runtime.agentId,
          error: error instanceof Error ? error.message : String(error),
        },
```