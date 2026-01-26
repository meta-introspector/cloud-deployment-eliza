# 5e8c73c1:packages_server_src_api_messaging_jobs.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/api/messaging/jobs.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
/**
 * Jobs API Router
 -
 * Provides one-off messaging capabilities for agents with comprehensive security controls:
 *
 * Security Features:
 * - API key authentication required for all job operations
 * - Request size validation (content max 50KB, metadata max 10KB)
 * - Timeout bounds validation (1s min, 5min max for jobs; absolute 5min for cleanup)
 * - Resource exhaustion protection via absolute timeout caps
 * - Memory leak prevention via per-instance state scoping
 * - Rate limiting applied at API router level
 * - Input validation for all UUIDs and content
 * - Global error boundary for unhandled rejections
 *
 * All state (jobs, metrics, timeouts) is scoped per-router instance to prevent
 * memory leaks and cross-instance contamination.
 */
import { logger, validateUuid, type UUID, type ElizaOS, ChannelType } from '@elizaos/core';
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import type { AgentServer } from '../../index';
import {
  JobStatus,
  JobValidation,
  type CreateJobResponse,
  type JobDetailsResponse,
  type JobHealthResponse,
  type JobErrorResponse,
  type Job,
  // CreateJobRequest and JobPersistenceConfig are available for future enhancements
} from '../../types/jobs';
import internalMessageBus from '../../services/message-bus';
import { apiKeyAuthMiddleware } from '../../middleware';

const DEFAULT_SERVER_ID = '00000000-0000-0000-0000-000000000000' as UUID;
const JOB_CLEANUP_INTERVAL_MS = 60000; // 1 minute

// Security: Resource exhaustion fix - absolutely cap max timeout for cleanup of listeners to 5 minutes
const ABSOLUTE_MAX_LISTENER_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes
const MAX_JOBS_IN_MEMORY = 10000; // Prevent memory leaks

// Security: All mutable state is scoped per-router instance inside createJobsRouter

/**
 * Helper to send standardized error response
 */
function sendErrorResponse(
  res: express.Response,
  statusCode: number,
  error: string,
  details?: Record<string, unknown>
): void {
  const response: JobErrorResponse = {
    success: false,
    error,
    details,
  };
  res.status(statusCode).json(response);
}

// cleanupExpiredJobs/startCleanupInterval/stopCleanupInterval are defined per-router below

/**
 * Convert Job to JobDetailsResponse
 */
function jobToResponse(job: Job): JobDetailsResponse {
  return {
    jobId: job.id,
    status: job.status,
    agentId: job.agentId,
    userId: job.userId,
    prompt: job.content,
    createdAt: job.createdAt,
    expiresAt: job.expiresAt,
    result: job.result,
    error: job.error,
    metadata: job.metadata,
  };
}

/**
 * Validate CreateJobRequest with size limits
 */
function validateCreateJobRequest(obj: unknown): {
  valid: boolean;
  error?: string;
} {
  if (!obj || typeof obj !== 'object') {
    return { valid: false, error: 'Request body must be an object' };
  }

  const req = obj as Record<string, unknown>;

  // Validate agentId if provided
  if (req.agentId !== undefined && typeof req.agentId !== 'string') {
    return { valid: false, error: 'agentId must be a valid UUID string' };
  }

  // Validate userId
  if (typeof req.userId !== 'string') {
    return { valid: false, error: 'userId is required and must be a valid UUID string' };
  }

  // Validate content
  if (typeof req.content !== 'string') {
    return { valid: false, error: 'content is required and must be a string' };
  }

  if (req.content.length === 0) {
    return { valid: false, error: 'content cannot be empty' };
  }

  if (req.content.length > JobValidation.MAX_CONTENT_LENGTH) {
    return {
      valid: false,
      error: `content exceeds maximum length of ${JobValidation.MAX_CONTENT_LENGTH} characters`,
    };
  }

  // Validate metadata size if provided
  if (req.metadata !== undefined) {
    if (typeof req.metadata !== 'object' || req.metadata === null) {
      return { valid: false, error: 'metadata must be an object' };
    }

    const metadataSize = JSON.stringify(req.metadata).length;
    if (metadataSize > JobValidation.MAX_METADATA_SIZE) {
      return {
        valid: false,
        error: `metadata exceeds maximum size of ${JobValidation.MAX_METADATA_SIZE} bytes`,
      };
    }
  }

  // Validate timeoutMs if provided
  if (req.timeoutMs !== undefined) {
    if (typeof req.timeoutMs !== 'number' || req.timeoutMs < 0) {
      return { valid: false, error: 'timeoutMs must be a positive number' };
    }

    if (req.timeoutMs < JobValidation.MIN_TIMEOUT_MS) {
      return {
        valid: false,
        error: `timeoutMs must be at least ${JobValidation.MIN_TIMEOUT_MS}ms`,
      };
    }

    if (req.timeoutMs > JobValidation.MAX_TIMEOUT_MS) {
      return {
```