# 67c3e03b:packages_server_src_api_messaging_sessions.ts:1-150

**Commit:** 67c3e03bee617d71dd385d437f6266aa2bec9068
**Author:** standujar
**Date:** Mon Dec 29 17:34:05 2025 +0100
**File:** packages/server/src/api/messaging/sessions.ts:1-150
**Novelty Score:** 14.99
**Concepts:** testing

```
import {
  logger,
  validateUuid,
  type UUID,
  type ElizaOS,
  type IAgentRuntime,
  ChannelType,
} from '@elizaos/core';
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { type TransportType } from '../shared/constants';
import { handleTransport } from '../shared/response-handlers';
import { validateTransport } from '../shared/validation';
import type { AgentServer, CentralRootMessage } from '../../index';
import { transformMessageAttachments } from '../../utils';
import type {
  Session,
  SessionTimeoutConfig,
  CreateSessionRequest,
  CreateSessionResponse,
  SendMessageRequest,
  GetMessagesQuery,
  SimplifiedMessage,
  GetMessagesResponse,
  SessionInfoResponse,
  HealthCheckResponse,
} from '../../types/sessions';
import {
  SessionNotFoundError,
  SessionExpiredError,
  SessionCreationError,
  AgentNotFoundError,
  InvalidUuidError,
  MissingFieldsError,
  InvalidContentError,
  InvalidMetadataError,
  InvalidPaginationError,
  InvalidTimeoutConfigError,
  SessionRenewalError,
  MessageSendError,
  createErrorHandler,
} from './errors/SessionErrors';

/**
 * Extended Router interface with cleanup method
 */
export interface SessionRouter extends express.Router {
  /**
   * Cleanup function to properly dispose of resources
   * Should be called when the router is being destroyed or replaced
   */
  cleanup: () => void;
}

/**
 * Safely parses an integer from a string with fallback
 * Handles NaN, undefined, and invalid inputs gracefully
 * @param value - The value to parse
 * @param fallback - Default value if parsing fails
 * @param min - Optional minimum value (inclusive)
 * @param max - Optional maximum value (inclusive)
 * @returns Parsed integer or fallback value
 */
function safeParseInt(
  value: string | undefined,
  fallback: number,
  min?: number,
  max?: number
): number {
  if (!value) {
    return fallback;
  }

  const parsed = parseInt(value, 10);

  // Check for NaN or invalid number
  if (isNaN(parsed) || !isFinite(parsed)) {
    logger.warn({ src: 'http', value, fallback }, 'Invalid integer value, using fallback');
    return fallback;
  }

  // Apply bounds if specified
  let result = parsed;
  if (min !== undefined && result < min) {
    logger.warn({ src: 'http', value: result, min }, 'Value below minimum, clamping');
    result = min;
  }
  if (max !== undefined && result > max) {
    logger.warn({ src: 'http', value: result, max }, 'Value above maximum, clamping');
    result = max;
  }

  return result;
}

// Session configuration constants with safe parsing
const DEFAULT_TIMEOUT_MINUTES = safeParseInt(
  process.env.SESSION_DEFAULT_TIMEOUT_MINUTES,
  30,
  1,
  10080 // 7 days max
);
const MIN_TIMEOUT_MINUTES = safeParseInt(process.env.SESSION_MIN_TIMEOUT_MINUTES, 5, 1, 60);
const MAX_TIMEOUT_MINUTES = safeParseInt(
  process.env.SESSION_MAX_TIMEOUT_MINUTES,
  1440, // 24 hours
  60,
  10080 // 7 days max
);
const DEFAULT_MAX_DURATION_MINUTES = safeParseInt(
  process.env.SESSION_MAX_DURATION_MINUTES,
  720, // 12 hours
  60,
  20160 // 14 days max
);
const DEFAULT_WARNING_THRESHOLD_MINUTES = safeParseInt(
  process.env.SESSION_WARNING_THRESHOLD_MINUTES,
  5,
  1,
  60
);
const CLEANUP_INTERVAL_MS =
  safeParseInt(process.env.SESSION_CLEANUP_INTERVAL_MINUTES, 5, 1, 60) * 60 * 1000;

// Session storage
const sessions = new Map<string, Session>();

// Agent-specific timeout configurations (cached from agent settings)
const agentTimeoutConfigs = new Map<UUID, SessionTimeoutConfig>();

// Track active cleanup intervals and handlers to prevent memory leaks
const activeCleanupIntervals = new Set<NodeJS.Timeout>();
let processHandlersRegistered = false;

/**
 * Type guard to check if an object is a valid Session
 */
function isValidSession(obj: unknown): obj is Session {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  const session = obj as Record<string, unknown>;

  return (
    typeof session.id === 'string' &&
    typeof session.agentId === 'string' &&
    typeof session.channelId === 'string' &&
    typeof session.userId === 'string' &&
    session.createdAt instanceof Date &&
```