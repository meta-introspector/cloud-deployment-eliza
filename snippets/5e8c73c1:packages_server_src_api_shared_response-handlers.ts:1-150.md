# 5e8c73c1:packages_server_src_api_shared_response-handlers.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/api/shared/response-handlers.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
/**
 * Shared response handlers for messaging API endpoints
 * Handles sync, stream (SSE), and websocket response modes
 */

import type { Response } from 'express';
import type { ElizaOS, Memory } from '@elizaos/core';
import type { UUID, Content } from '@elizaos/core';
import { logger } from '@elizaos/core';
import { ResponseMode } from './constants';

/**
 * Message memory type for elizaOS.handleMessage
 * Re-export from core for convenience
 */
export type { Memory };

/**
 * Options for handling response modes
 */
export interface HandleResponseModeOptions {
  res: Response;
  mode: ResponseMode;
  elizaOS: ElizaOS;
  agentId: UUID;
  messageMemory: Partial<Memory> & { entityId: UUID; roomId: UUID; content: Content };
  userMessage: unknown;
  /** Additional data to include in sync/websocket JSON responses */
  additionalResponseData?: Record<string, unknown>;
  /** Callback for websocket mode - called before returning response */
  onWebSocketMode?: () => void | Promise<void>;
}

/**
 * SSE event names
 */
export const SSE_EVENTS = {
  USER_MESSAGE: 'user_message',
  CHUNK: 'chunk',
  DONE: 'done',
  ERROR: 'error',
} as const;

/**
 * Writes an SSE event to the response
 */
function writeSSEEvent(res: Response, event: string, data: unknown): void {
  res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

/**
 * Sets up SSE headers on the response
 */
function setupSSEHeaders(res: Response): void {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();
}

/**
 * Handles SSE streaming mode
 */
async function handleStreamMode(
  res: Response,
  elizaOS: ElizaOS,
  agentId: UUID,
  messageMemory: Partial<Memory> & { entityId: UUID; roomId: UUID; content: Content },
  userMessage: unknown
): Promise<void> {
  setupSSEHeaders(res);
  writeSSEEvent(res, SSE_EVENTS.USER_MESSAGE, userMessage);

  let chunkIndex = 0;

  try {
    await elizaOS.handleMessage(agentId, messageMemory, {
      onStreamChunk: async (chunk: string, messageId?: UUID) => {
        writeSSEEvent(res, SSE_EVENTS.CHUNK, {
          messageId,
          chunk,
          index: chunkIndex++,
        });
      },
      onResponse: async (responseContent: Content) => {
        writeSSEEvent(res, SSE_EVENTS.DONE, responseContent);
        res.end();
      },
      onError: async (error: Error) => {
        writeSSEEvent(res, SSE_EVENTS.ERROR, { error: error.message });
        res.end();
      },
    });
  } catch (streamError) {
    writeSSEEvent(res, SSE_EVENTS.ERROR, {
      error: streamError instanceof Error ? streamError.message : String(streamError),
    });
    res.end();
  }
}

/**
 * Handles sync mode - waits for complete response
 */
async function handleSyncMode(
  res: Response,
  elizaOS: ElizaOS,
  agentId: UUID,
  messageMemory: Partial<Memory> & { entityId: UUID; roomId: UUID; content: Content },
  userMessage: unknown,
  additionalResponseData?: Record<string, unknown>
): Promise<void> {
  try {
    const result = await elizaOS.handleMessage(agentId, messageMemory);
    res.status(201).json({
      success: true,
      userMessage,
      agentResponse: result.processing?.responseContent,
      ...additionalResponseData,
    });
  } catch (syncError) {
    logger.error({ src: 'http', agentId, error: syncError }, 'Error in sync mode message handling');
    res.status(500).json({
      success: false,
      error: 'Failed to process message in sync mode',
    });
  }
}

/**
 * Handles websocket mode - returns immediately
 */
function handleWebSocketMode(
  res: Response,
  userMessage: unknown,
  additionalResponseData?: Record<string, unknown>,
  onWebSocketMode?: () => void | Promise<void>
): void {
  // Execute callback if provided (e.g., emit to message bus)
  if (onWebSocketMode) {
    // Fire and forget - don't await
    Promise.resolve(onWebSocketMode()).catch((err) => {
      logger.error({ src: 'http', error: err }, 'Error in websocket mode callback');
    });
  }

  res.status(201).json({
    success: true,
    userMessage,
    ...additionalResponseData,
```