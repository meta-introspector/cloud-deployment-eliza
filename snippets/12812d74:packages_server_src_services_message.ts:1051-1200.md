# 12812d74:packages_server_src_services_message.ts:1051-1200

**Commit:** 12812d7441573a7a81c2c5d2ea28a46bd10f3d0c
**Author:** standujar
**Date:** Tue Dec 16 01:47:14 2025 +0100
**File:** packages/server/src/services/message.ts:1051-1200
**Novelty Score:** 30.22
**Concepts:** event-driven, plugin-system, testing

```
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

      const patchPayload = {
        // fields server’s PATCH /action/:id supports
        content: content.text,
        raw_message: {
          text: content.text,
          thought: content.thought,
          actions: content.actions,
          ...content,
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

    // Add authentication header if ELIZA_SERVER_AUTH_TOKEN is configured
    const serverAuthToken = process.env.ELIZA_SERVER_AUTH_TOKEN;
    if (serverAuthToken) {
      headers['X-API-KEY'] = serverAuthToken;
    }

    return headers;
  }

```