# 5e8c73c1:packages_server_src_services_message.ts:301-450

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/services/message.ts:301-450
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
      const serverApiUrl = this.getCentralMessageServerUrl();
      // Use URL constructor for safe URL building
      const agentServersUrl = new URL(
        `/api/messaging/agents/${encodeURIComponent(this.runtime.agentId)}/message-servers`,
        serverApiUrl
      );
      const response = await fetch(agentServersUrl.toString(), {
        headers: this.getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data?.messageServers) {
          this.subscribedMessageServers = new Set(data.data.messageServers);
          // Always include the server
          this.subscribedMessageServers.add(this.serverInstance.messageServerId);
          logger.info(
            {
              src: 'service:message-bus',
              agentId: this.runtime.agentId,
              agentName: this.runtime.character.name,
              serverCount: this.subscribedMessageServers.size,
              messageServerId: this.serverInstance.messageServerId,
            },
            'Agent subscribed to servers'
          );
        }
      } else {
        // Even if the request fails, ensure we're subscribed to the server
        this.subscribedMessageServers.add(this.serverInstance.messageServerId);
        logger.warn(
          {
            src: 'service:message-bus',
            agentId: this.runtime.agentId,
            agentName: this.runtime.character.name,
            messageServerId: this.serverInstance.messageServerId,
          },
          'Failed to fetch agent servers, added default server'
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
        'Error fetching agent servers'
      );
      // Even on error, ensure we're subscribed to the server
      this.subscribedMessageServers.add(this.serverInstance.messageServerId);
      logger.info(
        {
          src: 'service:message-bus',
          agentId: this.runtime.agentId,
          agentName: this.runtime.character.name,
          messageServerId: this.serverInstance.messageServerId,
        },
        'Added default server after error'
      );
    }
  }

  private async handleServerAgentUpdate(data: ServerAgentUpdatePayload) {
    if (data.agentId !== this.runtime.agentId) {
      return; // Not for this agent
    }

    if (data.type === 'agent_added_to_server') {
      this.subscribedMessageServers.add(data.messageServerId);
      logger.info(
        {
          src: 'service:message-bus',
          agentId: this.runtime.agentId,
          agentName: this.runtime.character.name,
          messageServerId: data.messageServerId,
        },
        'Agent added to server'
      );
      // Refresh channel IDs to include channels from the new server
      await this.fetchValidChannelIds();
    } else if (data.type === 'agent_removed_from_server') {
      this.subscribedMessageServers.delete(data.messageServerId);
      logger.info(
        {
          src: 'service:message-bus',
          agentId: this.runtime.agentId,
          agentName: this.runtime.character.name,
          messageServerId: data.messageServerId,
        },
        'Agent removed from server'
      );
      // Refresh channel IDs to remove channels from the removed server
      await this.fetchValidChannelIds();
    }
  }

  private async validateMessageServerSubscription(
    message: MessageServiceMessage
  ): Promise<boolean> {
    if (!this.subscribedMessageServers.has(message.message_server_id)) {
      logger.debug(
        {
          src: 'service:message-bus',
          agentId: this.runtime.agentId,
          agentName: this.runtime.character.name,
          messageServerId: message.message_server_id,
        },
        'Agent not subscribed to server, ignoring message'
      );
      return false;
    }
    logger.debug(
      {
        src: 'service:message-bus',
        agentId: this.runtime.agentId,
        agentName: this.runtime.character.name,
        messageServerId: message.message_server_id,
      },
      'Passed server subscription check'
    );
    return true;
  }

  private async validateNotSelfMessage(message: MessageServiceMessage): Promise<boolean> {
    if (message.author_id === this.runtime.agentId) {
      logger.debug(
        { src: 'service:message-bus', agentId: this.runtime.agentId },
        'Agent is author, ignoring message'
      );
      return false;
    }
    return true;
  }

  private async ensureWorldAndRoomExist(
    message: MessageServiceMessage
  ): Promise<{ agentWorldId: UUID; agentRoomId: UUID }> {
    const agentWorldId = createUniqueUuid(this.runtime, message.message_server_id);
    const agentRoomId = createUniqueUuid(this.runtime, message.channel_id);

    try {
      await this.runtime.ensureWorldExists({
        id: agentWorldId,
        name: message.metadata?.serverName || `Server ${message.message_server_id.substring(0, 8)}`,
        agentId: this.runtime.agentId,
        messageServerId: message.message_server_id,
        metadata: {
          ...(message.metadata?.serverMetadata || {}),
```