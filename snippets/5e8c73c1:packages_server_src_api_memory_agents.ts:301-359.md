# 5e8c73c1:packages_server_src_api_memory_agents.ts:301-359

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/api/memory/agents.ts:301-359
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
          path: req.path,
          agentId: req.params.agentId,
          roomId: req.params.roomId,
          error: error instanceof Error ? error.message : String(error),
        },
        'Error deleting all memories'
      );
      sendError(
        res,
        500,
        'DELETE_ERROR',
        'Error deleting all memories',
        error instanceof Error ? error.message : String(error)
      );
    }
  });

  // Delete a specific memory for an agent
  router.delete('/:agentId/memories/:memoryId', async (req, res) => {
    try {
      const agentId = validateUuid(req.params.agentId);
      const memoryId = validateUuid(req.params.memoryId);

      if (!agentId || !memoryId) {
        return sendError(res, 400, 'INVALID_ID', 'Invalid agent ID or memory ID format');
      }

      const runtime = elizaOS.getAgent(agentId);
      if (!runtime) {
        return sendError(res, 404, 'NOT_FOUND', 'Agent not found');
      }

      // Delete the specific memory
      await runtime.deleteMemory(memoryId);

      sendSuccess(res, { message: 'Memory deleted successfully' });
    } catch (error) {
      logger.error(
        {
          src: 'http',
          path: req.path,
          agentId: req.params.agentId,
          memoryId: req.params.memoryId,
          error: error instanceof Error ? error.message : String(error),
        },
        'Error deleting memory'
      );
      sendError(
        res,
        500,
        'DELETE_ERROR',
        'Error deleting memory',
        error instanceof Error ? error.message : String(error)
      );
    }
  });

  return router;
}
```