# 5e8c73c1:packages_server_src_api_memory_agents.ts:151-300

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/api/memory/agents.ts:151-300
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
        500,
        'MEMORY_ERROR',
        'Error retrieving agent memories',
        error instanceof Error ? error.message : String(error)
      );
    }
  });

  // Update a specific memory for an agent
  router.patch('/:agentId/memories/:memoryId', async (req, res) => {
    const agentId = validateUuid(req.params.agentId);
    const memoryId = validateUuid(req.params.memoryId);

    const { id: _idFromData, ...restOfMemoryData } = req.body;

    if (!agentId || !memoryId) {
      return sendError(res, 400, 'INVALID_ID', 'Invalid agent ID or memory ID format');
    }

    const runtime = elizaOS.getAgent(agentId);
    if (!runtime) {
      return sendError(res, 404, 'NOT_FOUND', 'Agent not found');
    }

    try {
      // Construct memoryToUpdate ensuring it satisfies Partial<Memory> & { id: UUID }
      const memoryToUpdate: Partial<Memory> & { id: UUID; metadata?: MemoryMetadata } = {
        // Explicitly set the required id using the validated path parameter
        id: memoryId,
        // Spread other properties from the request body.
        // Cast to Partial<Memory> to align with the base type.
        ...(restOfMemoryData as Partial<Memory>),
        // If specific fields from restOfMemoryData need type assertion (e.g., to UUID),
        // they should be handled here or ensured by upstream validation.
        // For example, if agentId from body is always expected as UUID:
        agentId: restOfMemoryData.agentId
          ? validateUuid(restOfMemoryData.agentId as string) || undefined
          : agentId,
        roomId: restOfMemoryData.roomId
          ? validateUuid(restOfMemoryData.roomId as string) || undefined
          : undefined,
        entityId: restOfMemoryData.entityId
          ? validateUuid(restOfMemoryData.entityId as string) || undefined
          : undefined,
        worldId: restOfMemoryData.worldId
          ? validateUuid(restOfMemoryData.worldId as string) || undefined
          : undefined,
        // Ensure metadata, if provided, conforms to MemoryMetadata
        metadata: restOfMemoryData.metadata as MemoryMetadata | undefined,
      };

      // Remove undefined fields that might have been explicitly set to undefined by casting above,
      // if the updateMemory implementation doesn't handle them gracefully.
      Object.keys(memoryToUpdate).forEach((key) => {
        const value = (memoryToUpdate as Record<string, unknown>)[key];
        if (value === undefined) {
          delete (memoryToUpdate as Record<string, unknown>)[key];
        }
      });

      await runtime.updateMemory(memoryToUpdate);

      logger.success({ src: 'http', path: req.path, agentId, memoryId }, 'Memory updated');
      sendSuccess(res, { id: memoryId, message: 'Memory updated successfully' });
    } catch (error) {
      logger.error(
        {
          src: 'http',
          path: req.path,
          agentId,
          memoryId,
          error: error instanceof Error ? error.message : String(error),
        },
        'Error updating memory'
      );
      sendError(
        res,
        500,
        'UPDATE_ERROR',
        'Failed to update memory',
        error instanceof Error ? error.message : String(error)
      );
    }
  });

  // Delete all memories for an agent
  router.delete('/:agentId/memories', async (req, res) => {
    try {
      const agentId = validateUuid(req.params.agentId);

      if (!agentId) {
        return sendError(res, 400, 'INVALID_ID', 'Invalid agent ID');
      }

      const runtime = elizaOS.getAgent(agentId);
      if (!runtime) {
        return sendError(res, 404, 'NOT_FOUND', 'Agent not found');
      }

      const deleted = (await runtime.getAllMemories()).length;
      await runtime.clearAllAgentMemories();

      sendSuccess(res, { deleted, message: 'All agent memories cleared successfully' });
    } catch (error) {
      logger.error(
        {
          src: 'http',
          path: req.path,
          agentId: req.params.agentId,
          error: error instanceof Error ? error.message : String(error),
        },
        'Error deleting all agent memories'
      );
      sendError(
        res,
        500,
        'DELETE_ERROR',
        'Error deleting all agent memories',
        error instanceof Error ? error.message : String(error)
      );
    }
  });

  // Delete all memories for a room
  router.delete('/:agentId/memories/all/:roomId', async (req, res) => {
    try {
      const agentId = validateUuid(req.params.agentId);
      const roomId = validateUuid(req.params.roomId);

      if (!agentId) {
        return sendError(res, 400, 'INVALID_ID', 'Invalid agent ID');
      }

      if (!roomId) {
        return sendError(res, 400, 'INVALID_ID', 'Invalid room ID');
      }

      const runtime = elizaOS.getAgent(agentId);
      if (!runtime) {
        return sendError(res, 404, 'NOT_FOUND', 'Agent not found');
      }

      await runtime.deleteAllMemories(roomId, MemoryType.MESSAGE);
      await runtime.deleteAllMemories(roomId, MemoryType.DOCUMENT);

      res.status(204).send();
    } catch (error) {
      logger.error(
        {
          src: 'http',
```