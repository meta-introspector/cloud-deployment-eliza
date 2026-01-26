# 2d12b6ef:packages_server_src_api_messaging_channels.ts:751-900

**Commit:** 2d12b6ef6995c193e6c72750265969755d6be7d7
**Author:** standujar
**Date:** Tue Dec 30 19:46:54 2025 +0100
**File:** packages/server/src/api/messaging/channels.ts:751-900
**Novelty Score:** 35.43
**Concepts:** testing

```
          // TODO: Add agent-specific filtering when agent registry is available
        },
      });
    } catch (error) {
      logger.error(
        { src: 'http', channelId, error: error instanceof Error ? error.message : String(error) },
        'Error fetching channel agents'
      );
      res.status(500).json({
        success: false,
        error: 'Failed to fetch channel agents',
      });
    }
  });

  // Delete single message
  router.delete(
    '/channels/:channelId/messages/:messageId',
    async (req: express.Request, res: express.Response) => {
      const channelId = validateUuid(req.params.channelId);
      const messageId = validateUuid(req.params.messageId);
      if (!channelId || !messageId) {
        return res.status(400).json({ success: false, error: 'Invalid channelId or messageId' });
      }
      try {
        // Delete the message from central database
        await serverInstance.deleteMessage(messageId);

        // Emit message_deleted event to internal bus for agent memory cleanup
        const deletedMessagePayload = {
          messageId,
          channelId,
        };

        internalMessageBus.emit('message_deleted', deletedMessagePayload);
        logger.info({ src: 'http', messageId, channelId }, 'Message deleted');

        // Also, emit an event via SocketIO to inform clients about the deletion
        if (serverInstance.socketIO) {
          serverInstance.socketIO.to(channelId).emit('messageDeleted', {
            messageId,
            channelId,
          });
        }
        res.status(204).send();
      } catch (error) {
        logger.error(
          {
            src: 'http',
            messageId,
            channelId,
            error: error instanceof Error ? error.message : String(error),
          },
          'Error deleting message'
        );
        res.status(500).json({ success: false, error: 'Failed to delete message' });
      }
    }
  );

  // Clear all messages in channel
  router.delete(
    '/channels/:channelId/messages',
    async (req: express.Request, res: express.Response) => {
      const channelId = validateUuid(req.params.channelId);
      if (!channelId) {
        return res.status(400).json({ success: false, error: 'Invalid channelId' });
      }
      try {
        // Clear all messages from central database
        await serverInstance.clearChannelMessages(channelId);

        // Emit to internal bus for agent memory cleanup
        const channelClearedPayload = {
          channelId,
        };
        internalMessageBus.emit('channel_cleared', channelClearedPayload);
        logger.info({ src: 'http', channelId }, 'Channel messages cleared');

        // Also, emit an event via SocketIO to inform clients about the channel clear
        if (serverInstance.socketIO) {
          serverInstance.socketIO.to(channelId).emit('channelCleared', {
            channelId,
          });
        }
        res.status(204).send();
      } catch (error) {
        logger.error(
          { src: 'http', channelId, error: error instanceof Error ? error.message : String(error) },
          'Error clearing messages'
        );
        res.status(500).json({ success: false, error: 'Failed to clear messages' });
      }
    }
  );

  // Update channel
  router.patch('/channels/:channelId', async (req: express.Request, res: express.Response) => {
    const channelId = validateUuid(req.params.channelId);
    if (!channelId) {
      return res.status(400).json({ success: false, error: 'Invalid channelId' });
    }
    const { name, participantCentralUserIds, metadata } = req.body;
    try {
      const updatedChannel = await serverInstance.updateChannel(channelId, {
        name,
        participantCentralUserIds,
        metadata,
      });
      // Emit an event via SocketIO to inform clients about the channel update
      if (serverInstance.socketIO) {
        serverInstance.socketIO.to(channelId).emit('channelUpdated', {
          channelId,
          updates: updatedChannel,
        });
      }
      res.json({ success: true, data: updatedChannel });
    } catch (error) {
      logger.error(
        { src: 'http', channelId, error: error instanceof Error ? error.message : String(error) },
        'Error updating channel'
      );
      res.status(500).json({ success: false, error: 'Failed to update channel' });
    }
  });

  // Delete entire channel
  router.delete('/channels/:channelId', async (req: express.Request, res: express.Response) => {
    const channelId = validateUuid(req.params.channelId);
    if (!channelId) {
      return res.status(400).json({ success: false, error: 'Invalid channelId' });
    }
    try {
      // Get messages count before deletion for logging
      const messages = await serverInstance.getMessagesForChannel(channelId);
      const messageCount = messages.length;

      // Delete the entire channel
      await serverInstance.deleteChannel(channelId);

      // Emit to internal bus for agent memory cleanup (same as clear messages)
      const channelClearedPayload = {
        channelId,
      };
      internalMessageBus.emit('channel_cleared', channelClearedPayload);
      logger.info({ src: 'http', channelId, messageCount }, 'Channel deleted');

      // Emit an event via SocketIO to inform clients about the channel deletion
      if (serverInstance.socketIO) {
        serverInstance.socketIO.to(channelId).emit('channelDeleted', {
```