# a69475c0:packages_server_src_api_messaging_core.ts:1-150

**Commit:** a69475c084e9a6fb6fc85f19ea6742546b8e0476
**Author:** standujar
**Date:** Wed Dec 17 15:16:36 2025 +0100
**File:** packages/server/src/api/messaging/core.ts:1-150
**Novelty Score:** 29.11
**Concepts:** event-driven, testing

```
import { logger, validateUuid, type UUID } from '@elizaos/core';
import express from 'express';
import internalMessageBus from '../../services/message-bus'; // Import the bus
import type { AgentServer } from '../../index';
import type { MessageServiceStructure as MessageService } from '../../types/server';
import { attachmentsToApiUrls, validateServerIdForRls } from '../../utils';

/**
 * Core messaging functionality - message submission and ingestion
 */
export function createMessagingCoreRouter(serverInstance: AgentServer): express.Router {
  const router = express.Router();

  // Middleware to handle deprecated parameter names (backward compatibility)
  router.use((req, _res, next) => {
    // Map deprecated server_id to message_server_id
    if (req.body && req.body.server_id && !req.body.message_server_id) {
      logger.warn(
        '[DEPRECATED] Parameter "server_id" is deprecated. Use "message_server_id" instead.'
      );
      req.body.message_server_id = req.body.server_id;
    }
    next();
  });

  // Endpoint for AGENT REPLIES or direct submissions to the central bus FROM AGENTS/SYSTEM
  router.post('/submit', async (req: express.Request, res: express.Response) => {
    const {
      messageId,
      channel_id,
      message_server_id, // UUID of message_servers
      author_id, // This should be the agent's runtime.agentId or a dedicated central ID for the agent
      content,
      in_reply_to_message_id, // This is a root_message.id
      source_type,
      raw_message,
      metadata, // Should include agent_name if author_id is agent's runtime.agentId
    } = req.body;

    if (
      !validateUuid(channel_id) ||
      !validateUuid(message_server_id) ||
      !validateUuid(author_id) ||
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

    // Validate in_reply_to_message_id only if it's provided
    if (in_reply_to_message_id && !validateUuid(in_reply_to_message_id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid in_reply_to_message_id format',
      });
    }

    // Validate messageId if provided (for streaming coordination)
    if (messageId && !validateUuid(messageId)) {
      return res.status(400).json({ success: false, error: 'Invalid messageId format' });
    }

    try {
      const newRootMessageData = {
        messageId: messageId ? (validateUuid(messageId) || undefined) : undefined,
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
      // Use AgentServer's method to create the message in the DB
      const createdMessage = await serverInstance.createMessage(newRootMessageData);

      // Transform attachments for web client
      const transformedAttachments = attachmentsToApiUrls(
        metadata?.attachments ?? raw_message?.attachments
      );

      // Use provided messageId for streaming coordination, or fall back to DB-generated ID
      const broadcastId = messageId || createdMessage.id;

      // Emit to SocketIO for real-time GUI updates
      if (serverInstance.socketIO) {
        serverInstance.socketIO.to(channel_id).emit('messageBroadcast', {
          senderId: author_id, // This is the agent's ID
          senderName: metadata?.agentName || 'Agent',
          text: content,
          roomId: channel_id, // For SocketIO, room is the central channel_id
          serverId: message_server_id, // Client layer uses serverId (message_server_id)
          createdAt: new Date(createdMessage.createdAt).getTime(),
          source: createdMessage.sourceType,
          id: broadcastId, // Use streaming messageId for coordination
          thought: raw_message?.thought,
          actions: raw_message?.actions,
          attachments: transformedAttachments,
        });
      }
      // NO broadcast to internalMessageBus here, this endpoint is for messages ALREADY PROCESSED by an agent
      // or system messages that don't need further agent processing via the bus.

      res.status(201).json({ success: true, data: createdMessage });
    } catch (error) {
      logger.error(
        {
          src: 'http',
          path: '/submit',
          channelId: channel_id,
          error: error instanceof Error ? error.message : String(error),
        },
        'Error submitting agent message'
      );
      res.status(500).json({ success: false, error: 'Failed to submit agent message' });
    }
  });

  router.post('/action', async (req: express.Request, res: express.Response) => {
    const {
      messageId,
      channel_id,
      message_server_id,
      author_id,
      content,
      in_reply_to_message_id,
      source_type,
      raw_message,
      metadata,
    } = req.body;

    if (
      !validateUuid(channel_id) ||
      !validateUuid(message_server_id) ||
      !validateUuid(author_id) ||
```