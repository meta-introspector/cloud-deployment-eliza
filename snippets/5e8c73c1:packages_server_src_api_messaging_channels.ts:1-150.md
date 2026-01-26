# 5e8c73c1:packages_server_src_api_messaging_channels.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/api/messaging/channels.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

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
import { handleResponseMode } from '../shared/response-handlers';
import { validateResponseMode } from '../shared/validation';

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
  // Supports multiple response modes via the 'mode' parameter:
  // - "sync": Wait for complete agent response
  // - "stream": SSE streaming response
  // - "websocket": Return immediately, agent response via WebSocket (current default)
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
        mode,
      } = req.body;

      // Validate mode parameter with proper type checking
      const modeValidation = validateResponseMode(mode);
      if (!modeValidation.isValid) {
        return res.status(400).json({
          success: false,
          error: modeValidation.error,
        });
      }
      const responseMode = modeValidation.mode;

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
          serverInstance.getServers(),
        ]);
```