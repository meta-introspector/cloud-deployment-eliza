# 5e8c73c1:packages_server_src_api_memory_agents.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/api/memory/agents.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
import type { ElizaOS, UUID, Memory, MemoryMetadata } from '@elizaos/core';
import { MemoryType, createUniqueUuid } from '@elizaos/core';
import { validateUuid, logger } from '@elizaos/core';
import express from 'express';
import { sendError, sendSuccess } from '../shared/response-utils';

/**
 * Agent memory management functionality
 */
export function createAgentMemoryRouter(elizaOS: ElizaOS): express.Router {
  const router = express.Router();

  // Get memories for a specific room
  router.get('/:agentId/rooms/:roomId/memories', async (req, res) => {
    const agentId = validateUuid(req.params.agentId);
    const channelId = validateUuid(req.params.roomId); // Frontend passes channelId in roomId param

    if (!agentId || !channelId) {
      return sendError(res, 400, 'INVALID_ID', 'Invalid agent ID or channel ID format');
    }

    const runtime = elizaOS.getAgent(agentId);

    if (!runtime) {
      return sendError(res, 404, 'NOT_FOUND', 'Agent not found');
    }

    try {
      const limit = req.query.limit ? Number.parseInt(req.query.limit as string, 10) : 20;
      const before = req.query.before
        ? Number.parseInt(req.query.before as string, 10)
        : Date.now();
      const includeEmbedding = req.query.includeEmbedding === 'true';
      const tableName = (req.query.tableName as string) || 'messages';

      const entityId = validateUuid(req.headers['x-entity-id'] as string);

      // Convert channelId to agent's unique roomId
      const roomId = createUniqueUuid(runtime, channelId);
      logger.debug(
        { src: 'http', path: req.path, agentId, channelId, roomId },
        'Converting channelId to roomId'
      );

      const memories = await runtime.getMemories({
        tableName,
        roomId,
        count: limit,
        end: before,
        entityId: entityId || undefined,
      });

      const cleanMemories = includeEmbedding
        ? memories
        : memories.map((memory) => ({
            ...memory,
            embedding: undefined,
          }));

      sendSuccess(res, { memories: cleanMemories });
    } catch (error) {
      logger.error(
        {
          src: 'http',
          path: req.path,
          agentId,
          error: error instanceof Error ? error.message : String(error),
        },
        'Error retrieving memories for room'
      );
      sendError(
        res,
        500,
        '500',
        'Failed to retrieve memories',
        error instanceof Error ? error.message : String(error)
      );
    }
  });

  // Get all memories for an agent
  router.get('/:agentId/memories', async (req, res) => {
    const agentId = validateUuid(req.params.agentId);

    if (!agentId) {
      return sendError(res, 400, 'INVALID_ID', 'Invalid agent ID');
    }

    const runtime = elizaOS.getAgent(agentId);
    if (!runtime) {
      return sendError(res, 404, 'NOT_FOUND', 'Agent not found');
    }

    try {
      const tableName = (req.query.tableName as string) || 'messages';
      const includeEmbedding = req.query.includeEmbedding === 'true';

      // Get entityId from X-Entity-Id header for RLS context
      const entityId = validateUuid(req.headers['x-entity-id'] as string);

      // Handle both roomId and channelId parameters
      let roomIdToUse: UUID | undefined;

      if (req.query.channelId) {
        // Convert channelId to the agent's unique roomId
        const channelId = validateUuid(req.query.channelId as string);
        if (!channelId) {
          return sendError(res, 400, 'INVALID_ID', 'Invalid channel ID format');
        }
        // Use createUniqueUuid to generate the same roomId the agent uses
        roomIdToUse = createUniqueUuid(runtime, channelId);
        logger.debug(
          { src: 'http', path: req.path, agentId, channelId, roomId: roomIdToUse },
          'Converting channelId to roomId'
        );
      } else if (req.query.roomId) {
        // Backward compatibility: still accept roomId directly
        const roomId = validateUuid(req.query.roomId as string);
        if (!roomId) {
          return sendError(res, 400, 'INVALID_ID', 'Invalid room ID format');
        }
        roomIdToUse = roomId;
      }

      const memories = await runtime.getMemories({
        agentId,
        tableName,
        roomId: roomIdToUse,
        entityId: entityId || undefined,
      });

      const cleanMemories = includeEmbedding
        ? memories
        : memories.map((memory) => ({
            ...memory,
            embedding: undefined,
          }));
      sendSuccess(res, { memories: cleanMemories });
    } catch (error) {
      logger.error(
        {
          src: 'http',
          path: req.path,
          agentId,
          error: error instanceof Error ? error.message : String(error),
        },
        'Error retrieving agent memories'
      );
      sendError(
        res,
```