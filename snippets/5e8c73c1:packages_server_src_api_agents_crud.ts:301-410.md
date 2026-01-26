# 5e8c73c1:packages_server_src_api_agents_crud.ts:301-410

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/api/agents/crud.ts:301-410
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
        error instanceof Error ? error.message : String(error)
      );
    }
  });

  // Delete agent
  router.delete('/:agentId', async (req, res) => {
    const agentId = validateUuid(req.params.agentId);
    if (!agentId) {
      return sendError(res, 400, 'INVALID_ID', 'Invalid agent ID format');
    }
    if (!db) {
      return sendError(res, 500, 'DB_ERROR', 'Database not available');
    }

    try {
      const agent = await db.getAgent(agentId);
      if (!agent) {
        return sendError(res, 404, 'NOT_FOUND', 'Agent not found');
      }
    } catch (checkError) {
      logger.error({ src: 'http', error: checkError, agentId }, 'Error checking if agent exists');
    }

    const timeoutId = setTimeout(() => {
      logger.warn({ src: 'http', agentId }, 'Agent deletion taking longer than expected');
      if (!res.headersSent) {
        res.status(202).json({
          success: true,
          partial: true,
          message:
            'Agent deletion initiated but taking longer than expected. The operation will continue in the background.',
        });
      }
    }, 10000);

    const MAX_RETRIES = 2;
    let retryCount = 0;
    let lastError: unknown = null;

    while (retryCount <= MAX_RETRIES) {
      try {
        const runtime = elizaOS.getAgent(agentId);
        if (runtime) {
          try {
            await serverInstance?.unregisterAgent(agentId);
          } catch (stopError) {
            logger.error({ src: 'http', error: stopError, agentId }, 'Error stopping agent');
          }
        }

        await db.deleteAgent(agentId);
        clearTimeout(timeoutId);

        logger.success({ src: 'http', agentId }, 'Agent deleted');

        if (!res.headersSent) {
          res.status(204).send();
        }

        return;
      } catch (error) {
        lastError = error;
        retryCount++;

        logger.error(
          { src: 'http', error, agentId, attempt: retryCount, maxRetries: MAX_RETRIES + 1 },
          'Error deleting agent'
        );

        if (retryCount > MAX_RETRIES) {
          break;
        }

        const delay = 1000 * Math.pow(2, retryCount - 1);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    clearTimeout(timeoutId);

    if (!res.headersSent) {
      let statusCode = 500;
      let errorMessage = 'Error deleting agent';

      if (lastError instanceof Error) {
        const message = lastError.message;

        if (message.includes('foreign key constraint')) {
          errorMessage = 'Cannot delete agent because it has active references in the system';
          statusCode = 409;
        } else if (message.includes('timed out')) {
          errorMessage = 'Agent deletion operation timed out';
          statusCode = 408;
        }
      }

      res.status(statusCode).json({
        success: false,
        error: {
          code: 'DELETE_ERROR',
          message: errorMessage,
          details: lastError instanceof Error ? lastError.message : String(lastError),
        },
      });
    }
  });

  return router;
}
```