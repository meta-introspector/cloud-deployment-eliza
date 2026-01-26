# 2d12b6ef:packages_server_src_api_messaging_channels.ts:1-150

**Commit:** 2d12b6ef6995c193e6c72750265969755d6be7d7
**Author:** standujar
**Date:** Tue Dec 30 19:46:54 2025 +0100
**File:** packages/server/src/api/messaging/channels.ts:1-150
**Novelty Score:** 35.43
**Concepts:** testing

```
import {
  composePromptFromState,
  ElizaOS,
  ModelType,
  ChannelType,
  logger,
  validateUuid,
  type UUID,
  getUploadsChannelsDir,
} from '@elizaos/core';
import { transformMessageAttachments, validateServerIdForRls } from '../../utils';
import express from 'express';
import internalMessageBus from '../../services/message-bus';
import type { AgentServer } from '../../index';
import type {
  MessageServiceStructure as MessageService,
  AttachmentInput,
} from '../../types/server';
import { createUploadRateLimit, createFileSystemRateLimit } from '../../middleware';
import { MAX_FILE_SIZE, ALLOWED_MEDIA_MIME_TYPES } from '../shared/constants';
import { handleTransport } from '../shared/response-handlers';
import { validateTransport } from '../shared/validation';

import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Configure multer for channel uploads
const channelStorage = multer.memoryStorage();
const channelUploadMiddleware = multer({
  storage: channelStorage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1,
  },
  fileFilter: (_req, file, cb) => {
    // Check if mimetype is in the allowed list
    const isAllowed = ALLOWED_MEDIA_MIME_TYPES.some((allowed) => allowed === file.mimetype);
    if (isAllowed) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type. Only ${ALLOWED_MEDIA_MIME_TYPES.join(', ')} are allowed`));
    }
  },
});

// Helper function to save uploaded file
async function saveChannelUploadedFile(
  file: Express.Multer.File,
  channelId: string
): Promise<{ filename: string; url: string }> {
  const uploadDir = path.join(getUploadsChannelsDir(), channelId);

  // Ensure directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Generate unique filename
  const timestamp = Date.now();
  const random = Math.round(Math.random() * 1e9);
  const ext = path.extname(file.originalname);
  const filename = `${timestamp}-${random}${ext}`;
  const filePath = path.join(uploadDir, filename);

  // Write file to disk
  fs.writeFileSync(filePath, file.buffer);

  const url = `/media/uploads/channels/${channelId}/${filename}`;
  return { filename, url };
}

/**
 * Channel management functionality
 */
export function createChannelsRouter(
  elizaOS: ElizaOS,
  serverInstance: AgentServer
): express.Router {
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

  // GUI posts NEW messages from a user here
  // Supports multiple transport types via the 'transport' parameter:
  // - "http": Wait for complete agent response (sync)
  // - "sse": SSE streaming response
  // - "websocket": Return immediately, agent response via WebSocket (default)
  // Note: 'mode' parameter is deprecated but still supported for backward compatibility
  router.post(
    '/channels/:channelId/messages',
    async (req: express.Request, res: express.Response) => {
      const channelIdParam = validateUuid(req.params.channelId);
      const {
        author_id, // This is the GUI user's central ID
        content,
        in_reply_to_message_id, // Central root_message.id
        message_server_id, // UUID of the message server (message_servers.id)
        raw_message,
        metadata, // Should include user_display_name
        source_type, // Should be something like 'eliza_gui'
        transport: transportParam,
        mode, // @deprecated - use 'transport' instead
      } = req.body;

      // Validate transport parameter (supports both 'transport' and legacy 'mode')
      const transportValidation = validateTransport(transportParam ?? mode);
      if (!transportValidation.isValid) {
        return res.status(400).json({
          success: false,
          error: transportValidation.error,
        });
      }
      const transport = transportValidation.transport;

      if (
        !channelIdParam ||
        !validateUuid(author_id) ||
        !content ||
        !validateUuid(message_server_id)
      ) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: channelId, message_server_id, author_id, content',
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
        // Ensure the channel exists before creating the message
        // Fetch channel details and servers in parallel for better performance
        const [existingChannel, servers] = await Promise.all([
          serverInstance.getChannelDetails(channelIdParam).catch(() => null),
```