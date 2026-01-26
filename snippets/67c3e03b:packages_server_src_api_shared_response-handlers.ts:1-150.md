# 67c3e03b:packages_server_src_api_shared_response-handlers.ts:1-150

**Commit:** 67c3e03bee617d71dd385d437f6266aa2bec9068
**Author:** standujar
**Date:** Mon Dec 29 17:34:05 2025 +0100
**File:** packages/server/src/api/shared/response-handlers.ts:1-150
**Novelty Score:** 14.99
**Concepts:** testing

```
/**
 * Shared response handlers for messaging API endpoints
 * Handles http (sync), sse (streaming), and websocket response modes
 */

import type { Response } from 'express';
import type { ElizaOS, Memory } from '@elizaos/core';
import type { UUID, Content } from '@elizaos/core';
import { logger } from '@elizaos/core';
import { type TransportType } from './constants';

/**
 * Message memory type for elizaOS.handleMessage
 * Re-export from core for convenience
 */
export type { Memory };

/**
 * Options for handling transport types
 */
export interface HandleTransportOptions {
  res: Response;
  transport: TransportType;
  elizaOS: ElizaOS;
  agentId: UUID;
  messageMemory: Partial<Memory> & { entityId: UUID; roomId: UUID; content: Content };
  userMessage: unknown;
  /** Additional data to include in http/websocket JSON responses */
  additionalResponseData?: Record<string, unknown>;
  /** Callback for websocket transport - called before returning response */
  onWebSocketMode?: () => void | Promise<void>;
}

/**
 * @deprecated Use HandleTransportOptions instead
 */
export interface HandleResponseModeOptions {
  res: Response;
  mode: TransportType;
  elizaOS: ElizaOS;
  agentId: UUID;
  messageMemory: Partial<Memory> & { entityId: UUID; roomId: UUID; content: Content };
  userMessage: unknown;
  additionalResponseData?: Record<string, unknown>;
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
```