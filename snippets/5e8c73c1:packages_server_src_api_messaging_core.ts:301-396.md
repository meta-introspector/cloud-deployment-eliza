# 5e8c73c1:packages_server_src_api_messaging_core.ts:301-396

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/api/messaging/core.ts:301-396
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
        {
          src: 'http',
          path: req.path,
          messageId: id,
          error: error instanceof Error ? error.message : String(error),
        },
        'Error updating action'
      );
      return res.status(500).json({ success: false, error: 'Failed to update action' });
    }
  });

  // Endpoint for INGESTING messages from EXTERNAL platforms (e.g., Discord plugin)
  router.post('/ingest-external', async (req: express.Request, res: express.Response) => {
    const messagePayload = req.body as Partial<MessageService>; // Partial because ID, created_at will be generated

    if (
      !messagePayload.channel_id ||
      !messagePayload.message_server_id ||
      !messagePayload.author_id ||
      !messagePayload.content
    ) {
      return res.status(400).json({ success: false, error: 'Invalid external message payload' });
    }

    try {
      const messageToCreate = {
        channelId: messagePayload.channel_id as UUID,
        authorId: messagePayload.author_id as UUID, // This is the original author's ID from the platform (needs mapping to central user ID later)
        content: messagePayload.content as string,
        rawMessage: messagePayload.raw_message,
        sourceId: messagePayload.source_id, // Original platform message ID
        sourceType: messagePayload.source_type,
        inReplyToRootMessageId: messagePayload.in_reply_to_message_id
          ? validateUuid(messagePayload.in_reply_to_message_id) || undefined
          : undefined,
        metadata: messagePayload.metadata,
      };
      const createdRootMessage = await serverInstance.createMessage(messageToCreate);

      // Prepare message for the internal bus (for agents to consume)
      const messageForBus: MessageService = {
        id: createdRootMessage.id!,
        channel_id: createdRootMessage.channelId,
        message_server_id: messagePayload.message_server_id as UUID, // Pass through the original message_server_id
        author_id: createdRootMessage.authorId, // This is the central ID used for storage
        author_display_name: messagePayload.author_display_name, // Pass through display name
        content: createdRootMessage.content,
        raw_message: createdRootMessage.rawMessage,
        source_id: createdRootMessage.sourceId,
        source_type: createdRootMessage.sourceType,
        in_reply_to_message_id: createdRootMessage.inReplyToRootMessageId,
        created_at: new Date(createdRootMessage.createdAt).getTime(),
        metadata: createdRootMessage.metadata,
      };

      internalMessageBus.emit('new_message', messageForBus);
      logger.debug(
        { src: 'http', path: '/ingest-external', messageId: createdRootMessage.id },
        'Published to internal message bus'
      );

      // Also emit to SocketIO for real-time GUI updates if anyone is watching this channel
      if (serverInstance.socketIO) {
        serverInstance.socketIO.to(messageForBus.channel_id).emit('messageBroadcast', {
          senderId: messageForBus.author_id,
          senderName: messageForBus.author_display_name || 'User',
          text: messageForBus.content,
          roomId: messageForBus.channel_id,
          messageServerId: messageForBus.message_server_id as UUID, // Client layer uses messageServerId
          createdAt: messageForBus.created_at,
          source: messageForBus.source_type,
          id: messageForBus.id,
        });
      }

      res.status(202).json({
        success: true,
        message: 'Message ingested and published to bus',
        data: { messageId: createdRootMessage.id },
      });
    } catch (error) {
      logger.error(
        {
          src: 'http',
          path: '/ingest-external',
          error: error instanceof Error ? error.message : String(error),
        },
        'Error ingesting external message'
      );
      res.status(500).json({ success: false, error: 'Failed to ingest message' });
    }
  });

  return router;
}
```