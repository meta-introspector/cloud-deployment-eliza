# 5e8c73c1:packages_server_src_api_messaging_core.ts:151-300

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/api/messaging/core.ts:151-300
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
      !content ||
      !source_type ||
      !raw_message
    ) {
      return res.status(400).json({
        success: false,
        error:
          'Missing required fields: channel_id, message_server_id, author_id, content, source_type, raw_message',
      });
    }

    // RLS security: Only allow access to current server's data
    if (!validateServerIdForRls(message_server_id, serverInstance)) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden: message_server_id does not match current server',
      });
    }

    if (in_reply_to_message_id && !validateUuid(in_reply_to_message_id)) {
      return res
        .status(400)
        .json({ success: false, error: 'Invalid in_reply_to_message_id format' });
    }

    if (messageId && !validateUuid(messageId)) {
      return res.status(400).json({ success: false, error: 'Invalid messageId format' });
    }

    try {
      const baseData = {
        messageId, // pass through directly, DB will use it or generate new UUID
        channelId: validateUuid(channel_id)!,
        authorId: validateUuid(author_id)!,
        content: content as string,
        rawMessage: raw_message,
        sourceType: source_type || 'agent_response',
        inReplyToRootMessageId: in_reply_to_message_id
          ? validateUuid(in_reply_to_message_id) || undefined
          : undefined,
        metadata,
      };

      const savedMessage = await serverInstance.createMessage(baseData);

      // Transform attachments for web client
      const transformedAttachments = attachmentsToApiUrls(
        metadata?.attachments ?? raw_message?.attachments
      );

      if (serverInstance.socketIO) {
        serverInstance.socketIO.to(channel_id).emit('messageBroadcast', {
          senderId: author_id,
          senderName: metadata?.agentName || 'Agent',
          text: savedMessage.content,
          roomId: channel_id,
          messageServerId: message_server_id as UUID,
          createdAt: new Date(savedMessage.createdAt).getTime(),
          source: savedMessage.sourceType,
          id: savedMessage.id,
          thought: raw_message?.thought,
          actions: raw_message?.actions,
          attachments: transformedAttachments,
          updatedAt: new Date(savedMessage.updatedAt).getTime(),
          rawMessage: raw_message,
        });
      }

      return res.status(201).json({ success: true, data: savedMessage });
    } catch (error) {
      logger.error(
        {
          src: 'http',
          path: '/action',
          channelId: channel_id,
          error: error instanceof Error ? error.message : String(error),
        },
        'Error creating action'
      );
      return res.status(500).json({ success: false, error: 'Failed to create action' });
    }
  });

  router.patch('/action/:id', async (req: express.Request, res: express.Response) => {
    const { id } = req.params;

    if (!validateUuid(id)) {
      return res.status(400).json({ success: false, error: 'Invalid message id' });
    }

    const {
      content,
      raw_message,
      source_type,
      in_reply_to_message_id,
      metadata,
      author_id,
      server_message_id,
    } = req.body ?? {};

    if (in_reply_to_message_id && !validateUuid(in_reply_to_message_id)) {
      return res
        .status(400)
        .json({ success: false, error: 'Invalid in_reply_to_message_id format' });
    }
    if (author_id && !validateUuid(author_id)) {
      return res.status(400).json({ success: false, error: 'Invalid author_id format' });
    }

    try {
      const updated = await serverInstance.updateMessage(id as UUID, {
        content,
        rawMessage: raw_message,
        sourceType: source_type,
        inReplyToRootMessageId: in_reply_to_message_id
          ? validateUuid(in_reply_to_message_id) || undefined
          : undefined,
        metadata,
      });

      if (!updated) {
        return res.status(404).json({ success: false, error: 'Message not found' });
      }

      // Transform attachments for web client
      const transformedAttachments = attachmentsToApiUrls(
        metadata?.attachments ?? raw_message?.attachments
      );

      if (serverInstance.socketIO) {
        serverInstance.socketIO.to(updated.channelId).emit('messageBroadcast', {
          senderId: author_id || updated.authorId,
          senderName: metadata?.agentName || 'Agent',
          text: updated.content,
          roomId: updated.channelId,
          messageServerId: server_message_id as UUID,
          createdAt: new Date(updated.createdAt).getTime(),
          source: updated.sourceType,
          id: updated.id,
          thought: raw_message?.thought,
          actions: raw_message?.actions,
          attachments: transformedAttachments,
          updatedAt: new Date(updated.updatedAt).getTime(),
          rawMessage: raw_message,
        });
      }

      return res.status(200).json({ success: true, data: updated });
    } catch (error) {
      logger.error(
```