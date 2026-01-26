# e5b94879:packages_api-client_src_types_sessions.ts:1-150

**Commit:** e5b9487968573e8dffa95b0ae56a956154c9ee51
**Author:** standujar
**Date:** Mon Dec 29 16:55:06 2025 +0100
**File:** packages/api-client/src/types/sessions.ts:1-150
**Novelty Score:** 78.02
**Concepts:** agent-system, testing

```
import type { UUID } from '@elizaos/core';
import type { PaginationParams } from './base';

/**
 * Attachment type for messages
 */
export interface MessageAttachment {
  type: 'image' | 'file' | 'audio' | 'video' | 'document';
  url: string;
  name?: string;
  size?: number;
  mimeType?: string;
}

/**
 * Session message metadata type
 */
export interface SessionMessageMetadata {
  source?: string;
  priority?: 'low' | 'normal' | 'high';
  tags?: string[];
  context?: Record<string, string | number | boolean>;
  thought?: string;
  actions?: string[];
  [key: string]:
    | string
    | number
    | boolean
    | string[]
    | Record<string, string | number | boolean>
    | undefined;
}

/**
 * Metadata associated with a session
 */
export interface SessionMetadata {
  platform?: string;
  username?: string;
  discriminator?: string;
  avatar?: string;
  [key: string]: string | number | boolean | undefined;
}

/**
 * Represents a messaging session between a user and an agent
 */
export interface Session {
  id: string;
  agentId: UUID;
  channelId: UUID;
  userId: UUID;
  metadata: SessionMetadata;
  createdAt: Date;
  lastActivity: Date;
}

/**
 * Request parameters for creating a session
 */
export interface CreateSessionParams {
  agentId: string;
  userId: string;
  metadata?: SessionMetadata;
}

/**
 * Response for session creation
 */
export interface CreateSessionResponse {
  sessionId: string;
  agentId: UUID;
  userId: UUID;
  createdAt: Date;
  metadata: SessionMetadata;
}

/**
 * Valid transport types for messaging API
 * - "http": Wait for complete agent response (HTTP request/response, no streaming)
 * - "sse": Server-Sent Events streaming response
 * - "websocket": Return immediately, agent response via WebSocket (default)
 */
export type TransportType = 'http' | 'sse' | 'websocket';

/**
 * @deprecated Use TransportType instead. Maps: sync→http, stream→sse, websocket→websocket
 */
export type ResponseMode = 'sync' | 'stream' | 'websocket';

/**
 * Request parameters for sending a message
 */
export interface SendMessageParams {
  content: string;
  attachments?: MessageAttachment[];
  metadata?: SessionMessageMetadata;
  /**
   * Transport type for the message
   * - "http": Wait for complete agent response (returns agentResponse)
   * - "sse": Server-Sent Events streaming response
   * - "websocket": Return immediately, agent response via WebSocket (default)
   */
  transport?: TransportType;
}

/**
 * Query parameters for retrieving messages
 */
export interface GetMessagesParams extends PaginationParams {
  before?: Date | string | number;
  after?: Date | string | number;
}

/**
 * Simplified message format for API responses
 */
export interface SimplifiedMessage {
  id: string;
  content: string;
  authorId: string;
  isAgent: boolean;
  createdAt: Date;
  metadata: SessionMessageMetadata;
}

/**
 * Response for message retrieval
 */
export interface GetMessagesResponse {
  messages: SimplifiedMessage[];
  hasMore: boolean;
}

/**
 * Session info response
 */
export interface SessionInfoResponse {
  sessionId: string;
  agentId: UUID;
  userId: UUID;
  createdAt: Date;
  lastActivity: Date;
  metadata: SessionMetadata;
}

/**
 * Health check response
 */
export interface SessionsHealthResponse {
```