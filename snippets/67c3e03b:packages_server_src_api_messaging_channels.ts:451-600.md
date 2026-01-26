# 67c3e03b:packages_server_src_api_messaging_channels.ts:451-600

**Commit:** 67c3e03bee617d71dd385d437f6266aa2bec9068
**Author:** standujar
**Date:** Mon Dec 29 17:34:05 2025 +0100
**File:** packages/server/src/api/messaging/channels.ts:451-600
**Novelty Score:** 14.99
**Concepts:** testing

```

    try {
      if (providedDmServerId) {
        // Check if the provided server ID exists
        const existingServer = await serverInstance.getServerById(providedDmServerId);
        if (existingServer) {
          dmServerIdToUse = providedDmServerId;
        } else {
          logger.warn(
            { src: 'http', dmServerId: providedDmServerId },
            'Provided dmServerId not found, using current server'
          );
          // Use current server if provided ID is invalid
          dmServerIdToUse = serverInstance.messageServerId;
        }
      }

      const channel = await serverInstance.findOrCreateCentralDmChannel(
        currentUserId,
        targetUserId,
        dmServerIdToUse
      );
      res.json({ success: true, data: channel });
    } catch (error: unknown) {
      logger.error(
        {
          src: 'http',
          currentUserId,
          targetUserId,
          error: error instanceof Error ? error.message : String(error),
        },
        'Error finding/creating DM channel'
      );
      res.status(500).json({ success: false, error: 'Failed to find or create DM channel' });
    }
  });

  // POST /channels (for creating group channels)
  router.post('/channels', async (req: express.Request, res: express.Response) => {
    const {
      name,
      participantCentralUserIds,
      type = ChannelType.GROUP,
      message_server_id,
      metadata,
    } = req.body;

    // Validate server ID format
    if (!validateUuid(message_server_id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid message_server_id format',
      });
    }

    if (
      !name ||
      !Array.isArray(participantCentralUserIds) ||
      participantCentralUserIds.some((id) => !validateUuid(id))
    ) {
      return res.status(400).json({
        success: false,
        error:
          'Invalid payload. Required: name, message_server_id (UUID), participantCentralUserIds (array of UUIDs). Optional: type, metadata.',
      });
    }

    // RLS security: Only allow access to current server's data
    if (!validateServerIdForRls(message_server_id, serverInstance)) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: message_server_id does not match current server',
      });
    }

    try {
      const channelData = {
        messageServerId: message_server_id as UUID,
        name,
        type: type as ChannelType,
        metadata: {
          ...(metadata || {}),
          // participantIds are now handled by the separate table via createChannel's second argument
        },
      };
      // Pass participant IDs to createChannel
      const newChannel = await serverInstance.createChannel(
        channelData,
        participantCentralUserIds as UUID[]
      );

      res.status(201).json({ success: true, data: newChannel });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(
        { src: 'http', messageServerId: message_server_id, error: errorMessage },
        'Error creating group channel'
      );
      res
        .status(500)
        .json({ success: false, error: 'Failed to create group channel', details: errorMessage });
    }
  });

  // Get channel details
  router.get(
    '/channels/:channelId/details',
    async (req: express.Request, res: express.Response) => {
      const channelId = validateUuid(req.params.channelId);
      if (!channelId) {
        return res.status(400).json({ success: false, error: 'Invalid channelId' });
      }
      try {
        const channelDetails = await serverInstance.getChannelDetails(channelId);
        if (!channelDetails) {
          return res.status(404).json({ success: false, error: 'Channel not found' });
        }
        res.json({ success: true, data: channelDetails });
      } catch (error) {
        logger.error(
          { src: 'http', channelId, error: error instanceof Error ? error.message : String(error) },
          'Error fetching channel details'
        );
        res.status(500).json({ success: false, error: 'Failed to fetch channel details' });
      }
    }
  );

  // Get channel participants
  router.get(
    '/channels/:channelId/participants',
    async (req: express.Request, res: express.Response) => {
      const channelId = validateUuid(req.params.channelId);
      if (!channelId) {
        return res.status(400).json({ success: false, error: 'Invalid channelId' });
      }
      try {
        const participants = await serverInstance.getChannelParticipants(channelId);
        res.json({ success: true, data: participants });
      } catch (error) {
        logger.error(
          { src: 'http', channelId, error: error instanceof Error ? error.message : String(error) },
          'Error fetching channel participants'
        );
        res.status(500).json({ success: false, error: 'Failed to fetch channel participants' });
      }
    }
  );

  // POST /channels/:channelId/agents - Add agent to channel
```