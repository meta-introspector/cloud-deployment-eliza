# a69475c0:packages_server_src_services_message.ts:1051-1200

**Commit:** a69475c084e9a6fb6fc85f19ea6742546b8e0476
**Author:** standujar
**Date:** Wed Dec 17 15:16:36 2025 +0100
**File:** packages/server/src/services/message.ts:1051-1200
**Novelty Score:** 29.11
**Concepts:** event-driven, testing

```
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
        if (m?.metadata?.sourceId) {centralInReplyToRootMessageId = m.metadata.sourceId as UUID;}
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
    if (!channelId || !messageServerId) {return;}

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
        'Failed to notify completion'
      );
    }
  }

  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

```