# 5e8c73c1:packages_server_src_api_agents_runs.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/api/agents/runs.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
import type {
  ElizaOS,
  UUID,
  Log,
  IDatabaseAdapter,
  IAgentRuntime,
  RunStatus,
  ActionLogBody,
  ModelLogBody,
  EvaluatorLogBody,
  EmbeddingLogBody,
} from '@elizaos/core';
import { validateUuid } from '@elizaos/core';
import express from 'express';
import { sendError, sendSuccess } from '../shared/response-utils';

/**
 * Agent runs management
 */
export function createAgentRunsRouter(elizaOS: ElizaOS): express.Router {
  const router = express.Router();

  const RUNS_CACHE_TTL = 15_000; // 15 seconds to smooth polling bursts
  const runsCache = new Map<
    string,
    { expiresAt: number; payload: { runs: unknown[]; total: number; hasMore: boolean } }
  >();

  const buildCacheKey = (
    agentId: UUID,
    query: {
      roomId?: unknown;
      status?: unknown;
      limit?: unknown;
      from?: unknown;
      to?: unknown;
      entityId?: unknown;
    }
  ) =>
    JSON.stringify({
      agentId,
      roomId: query.roomId || null,
      status: query.status || null,
      limit: query.limit || null,
      from: query.from || null,
      to: query.to || null,
      entityId: query.entityId || null,
    });

  // List Agent Runs
  router.get('/:agentId/runs', async (req, res) => {
    const agentId = validateUuid(req.params.agentId);
    if (!agentId) {
      return sendError(res, 400, 'INVALID_ID', 'Invalid agent ID format');
    }

    const runtime = elizaOS.getAgent(agentId);
    if (!runtime) {
      return sendError(res, 404, 'NOT_FOUND', 'Agent not found');
    }

    const { roomId, status, limit = 20, from, to } = req.query;

    if (roomId && !validateUuid(roomId as string)) {
      return sendError(res, 400, 'INVALID_ID', 'Invalid room ID format');
    }

    try {
      const limitNum = Math.min(Number(limit) || 20, 100); // Cap at 100
      const fromTime = from ? Number(from) : undefined;
      const toTime = to ? Number(to) : undefined;

      // Get entityId from X-Entity-Id header for RLS context
      const entityId = validateUuid(req.headers['x-entity-id'] as string) || undefined;

      // Try cache for the common polling path (no explicit time filters)
      // Include entityId in cache key since results are user-specific with RLS
      const cacheKey =
        !fromTime && !toTime
          ? buildCacheKey(agentId, { roomId, status, limit: limitNum, entityId })
          : null;
      if (cacheKey) {
        const cached = runsCache.get(cacheKey);
        if (cached && cached.expiresAt > Date.now()) {
          return sendSuccess(res, cached.payload);
        }
      }

      // Runtime has an internal adapter property for database operations
      const adapter =
        (runtime as IAgentRuntime & { adapter?: IDatabaseAdapter }).adapter ?? runtime;
      const allowedStatuses: Array<RunStatus | 'all'> = [
        'started',
        'completed',
        'timeout',
        'error',
        'all',
      ];
      const statusFilter =
        typeof status === 'string' && allowedStatuses.includes(status as RunStatus | 'all')
          ? (status as RunStatus | 'all')
          : undefined;

      if (adapter?.getAgentRunSummaries) {
        try {
          const fastResult = await adapter.getAgentRunSummaries({
            limit: limitNum,
            roomId: roomId ? (roomId as UUID) : undefined,
            status: statusFilter,
            from: fromTime,
            to: toTime,
            entityId,
          });

          if (cacheKey) {
            runsCache.set(cacheKey, {
              payload: fastResult,
              expiresAt: Date.now() + RUNS_CACHE_TTL,
            });
          }

          return sendSuccess(res, fastResult);
        } catch (error) {
          runtime.logger?.warn?.(
            `Optimized run summary query failed, falling back to log aggregation: ${
              error instanceof Error ? error.message : String(error)
            }`
          );
        }
      }

      // 1) Fetch run events
      // With RLS (entityId present): get only that entity's run_events
      // Without RLS (entityId absent): get all run_events in the room
      const directRunEvents = await runtime
        .getLogs({
          entityId,
          roomId: roomId ? (roomId as UUID) : undefined,
          type: 'run_event',
          count: 1000,
        })
        .catch(() => []);

      type RunListItem = {
        runId: string;
        status: 'started' | 'completed' | 'timeout' | 'error';
        startedAt: number | null;
        endedAt: number | null;
        durationMs: number | null;
        messageId?: UUID;
```