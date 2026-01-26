# 12812d74:packages_server_src_services_message.ts:151-300

**Commit:** 12812d7441573a7a81c2c5d2ea28a46bd10f3d0c
**Author:** standujar
**Date:** Tue Dec 16 01:47:14 2025 +0100
**File:** packages/server/src/services/message.ts:151-300
**Novelty Score:** 30.22
**Concepts:** event-driven, plugin-system, testing

```
      for (const messageServerId of messageServersToCheck) {
        try {
          // Use URL constructor for safe URL building
          const channelsUrl = new URL(
            `/api/messaging/message-servers/${encodeURIComponent(messageServerId)}/channels`,
            serverApiUrl
          );
          const response = await fetch(channelsUrl.toString(), {
            headers: this.getAuthHeaders(),
          });
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.data?.channels && Array.isArray(data.data.channels)) {
              // Add channel IDs to the set
              data.data.channels.forEach((channel: Record<string, unknown>) => {
                if (channel.id && validateUuid(channel.id)) {
                  this.validChannelIds.add(channel.id as UUID);
                }
              });
              logger.info(
                {
                  src: 'service:message-bus',
                  agentId: this.runtime.agentId,
                  messageServerId,
                  channelCount: data.data.channels.length,
                },
                'Fetched channels from server'
              );
            }
          } else {
            logger.warn(
              {
                src: 'service:message-bus',
                agentId: this.runtime.agentId,
                messageServerId,
                status: response.status,
              },
              'Failed to fetch channels from server'
            );
          }
        } catch (serverError) {
          logger.error(
            {
              src: 'service:message-bus',
              agentId: this.runtime.agentId,
              agentName: this.runtime.character.name,
              messageServerId,
              error: serverError instanceof Error ? serverError.message : String(serverError),
            },
            'Error fetching channels from server'
          );
        }
      }

      logger.info(
        {
          src: 'service:message-bus',
          agentId: this.runtime.agentId,
          channelCount: this.validChannelIds.size,
          serverCount: messageServersToCheck.size,
        },
        'Loaded valid channel IDs from servers'
      );
    } catch (error) {
      logger.error(
        {
          src: 'service:message-bus',
          agentId: this.runtime.agentId,
          agentName: this.runtime.character.name,
          error: error instanceof Error ? error.message : String(error),
        },
        'Error fetching valid channel IDs'
      );
    }
  }

  private async getChannelParticipants(channelId: UUID): Promise<string[]> {
    try {
      const serverApiUrl = this.getCentralMessageServerUrl();

      if (!validateUuid(channelId)) {
        logger.warn(
          { src: 'service:message-bus', agentId: this.runtime.agentId, channelId },
          'Invalid channel ID format'
        );
        return [];
      }

      // First check if channel is in our cached set
      if (!this.validChannelIds.has(channelId)) {
        // Try to verify the channel exists by fetching its details
        // Use URL constructor for safe URL building
        const detailsUrl = new URL(
          `/api/messaging/channels/${encodeURIComponent(channelId)}/details`,
          serverApiUrl
        );
        const detailsResponse = await fetch(detailsUrl.toString(), {
          headers: this.getAuthHeaders(),
        });

        if (detailsResponse.ok) {
          // Channel exists, add it to our valid set for future use
          this.validChannelIds.add(channelId);
          logger.info(
            { src: 'service:message-bus', agentId: this.runtime.agentId, channelId },
            'Discovered new channel'
          );
        } else {
          logger.warn(
            { src: 'service:message-bus', agentId: this.runtime.agentId, channelId },
            'Channel does not exist or is not accessible'
          );
          return [];
        }
      }

      // Now fetch the participants
      // Use URL constructor for safe URL building
      const participantsUrl = new URL(
        `/api/messaging/channels/${encodeURIComponent(channelId)}/participants`,
        serverApiUrl
      );
      const response = await fetch(participantsUrl.toString(), {
        headers: this.getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          return data.data;
        }
      }
      return [];
    } catch (error) {
      logger.error(
        {
          src: 'service:message-bus',
          agentId: this.runtime.agentId,
          agentName: this.runtime.character.name,
          channelId,
          error: error instanceof Error ? error.message : String(error),
        },
        'Error fetching channel participants'
      );
      return [];
    }
  }

  private async fetchAgentMessageServers() {
    try {
```