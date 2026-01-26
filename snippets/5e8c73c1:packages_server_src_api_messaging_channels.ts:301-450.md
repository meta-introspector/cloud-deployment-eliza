# 5e8c73c1:packages_server_src_api_messaging_channels.ts:301-450

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/api/messaging/channels.ts:301-450
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
          res,
          mode: responseMode,
          elizaOS,
          agentId: agentId as UUID,
          messageMemory,
          userMessage: messageForBus,
          onWebSocketMode: () => {
            // Emit to internal bus for agent processing
            internalMessageBus.emit('new_message', messageForBus);
            logger.debug(
              { src: 'http', messageId: messageForBus.id, mode: responseMode },
              'GUI Message published to internal bus'
            );

            // Emit to SocketIO for real-time display in all connected GUIs
            if (serverInstance.socketIO) {
              serverInstance.socketIO.to(channelIdParam).emit('messageBroadcast', {
                senderId: author_id,
                senderName: metadata?.user_display_name || 'User',
                text: content,
                roomId: channelIdParam,
                messageServerId: message_server_id,
                createdAt: messageForBus.created_at,
                source: messageForBus.source_type,
                id: messageForBus.id,
              });
            }
          },
        });
      } catch (error) {
        logger.error(
          {
            src: 'http',
            channelId: channelIdParam,
            error: error instanceof Error ? error.message : String(error),
          },
          'Error processing GUI message'
        );
        res.status(500).json({ success: false, error: 'Failed to process message' });
      }
    }
  );

  // GET messages for a central channel
  router.get(
    '/channels/:channelId/messages',
    async (req: express.Request, res: express.Response) => {
      const channelId = validateUuid(req.params.channelId);
      const limit = req.query.limit ? Number.parseInt(req.query.limit as string, 10) : 50;
      const before = req.query.before ? Number.parseInt(req.query.before as string, 10) : undefined;
      const beforeDate = before ? new Date(before) : undefined;
      // TODO: Add 'after' parameter support when database layer is updated

      if (!channelId) {
        return res.status(400).json({ success: false, error: 'Invalid channelId' });
      }

      try {
        const messages = await serverInstance.getMessagesForChannel(channelId, limit, beforeDate);
        // Transform to MessageService structure if GUI expects timestamps as numbers, or align types
        const messagesForGui = messages.map((msg) => {
          // Extract thought and actions from rawMessage for historical messages
          interface ParsedRawMessage {
            thought?: string;
            actions?: string[];
            attachments?: AttachmentInput;
            [key: string]: unknown;
          }
          let rawMessage: ParsedRawMessage = {};
          try {
            const parsed =
              typeof msg.rawMessage === 'string' ? JSON.parse(msg.rawMessage) : msg.rawMessage;
            if (parsed && typeof parsed === 'object') {
              rawMessage = parsed as ParsedRawMessage;
            }
          } catch (_e) {
            // rawMessage parsing failed, continue with empty object
          }

          // Transform only content and metadata to handle attachments, preserving all other message fields
          const { content, metadata } = transformMessageAttachments({
            content: msg.content,
            metadata: {
              ...msg.metadata,
              thought: rawMessage?.thought,
              actions: rawMessage?.actions,
              attachments: rawMessage?.attachments ?? msg.metadata?.attachments,
            },
          });

          return {
            ...msg,
            content,
            metadata,
            created_at: new Date(msg.createdAt).getTime(), // Ensure timestamp number
            updated_at: new Date(msg.updatedAt).getTime(),
          };
        });
        res.json({ success: true, data: { messages: messagesForGui } });
      } catch (error) {
        logger.error(
          { src: 'http', channelId, error: error instanceof Error ? error.message : String(error) },
          'Error fetching messages'
        );
        res.status(500).json({ success: false, error: 'Failed to fetch messages' });
      }
    }
  );

  // GET /message-servers/:messageServerId/channels
  router.get(
    '/message-servers/:messageServerId/channels',
    async (req: express.Request, res: express.Response) => {
      const messageServerId = validateUuid(req.params.messageServerId);
      if (!messageServerId) {
        return res.status(400).json({ success: false, error: 'Invalid messageServerId' });
      }
      try {
        const channels = await serverInstance.getChannelsForMessageServer(messageServerId);
        res.json({ success: true, data: { channels } });
      } catch (error) {
        logger.error(
          {
            src: 'http',
            messageServerId,
            error: error instanceof Error ? error.message : String(error),
          },
          'Error fetching channels'
        );
        res.status(500).json({ success: false, error: 'Failed to fetch channels' });
      }
    }
  );

  // GET /dm-channel?targetUserId=<target_user_id>
  router.get('/dm-channel', async (req: express.Request, res: express.Response) => {
    const targetUserId = validateUuid(req.query.targetUserId as string);
    const currentUserId = validateUuid(req.query.currentUserId as string);
    const providedDmServerId = validateUuid(req.query.dmServerId as string);

    if (!targetUserId || !currentUserId) {
      res.status(400).json({ success: false, error: 'Missing targetUserId or currentUserId' });
      return;
    }
    if (targetUserId === currentUserId) {
      res.status(400).json({ success: false, error: 'Cannot create DM channel with oneself' });
      return;
    }

    let dmServerIdToUse: UUID = serverInstance.messageServerId;
```