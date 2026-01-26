# 5e8c73c1:packages_server_src_api_runtime_logging.ts:151-216

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/api/runtime/logging.ts:151-216
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
              agentIdMatch = log.agentId === requestedAgentId;
            } else {
              // If log has no agentId but most logs lack agentIds, show all logs
              agentIdMatch = isAgentIdDataSparse;
            }
          }

          return timeMatch && levelMatch && agentNameMatch && agentIdMatch;
        })
        .slice(-limit);

      // Log debug information for troubleshooting
      logger.debug(
        {
          src: 'http',
          path: '/logs',
          count: filtered.length,
          total: logEntries.length,
          level: requestedLevel,
          agentName: requestedAgentName,
        },
        'Logs request processed'
      );

      res.json({
        logs: filtered,
        count: filtered.length,
        total: logEntries.length,
        requestedLevel,
        agentName: requestedAgentName,
        agentId: requestedAgentId,
        levels: Object.keys(LOG_LEVELS),
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to retrieve logs',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  // GET and POST endpoints for logs
  router.get('/logs', logsHandler);
  router.post('/logs', logsHandler);

  // Handler for clearing logs
  const logsClearHandler = (_req: express.Request, res: express.Response) => {
    try {
      // Clear the logs using the logger's clear method
      logger.clear();

      logger.debug({ src: 'http', path: '/logs' }, 'Logs cleared via API endpoint');
      res.json({ status: 'success', message: 'Logs cleared successfully' });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to clear logs',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };

  // DELETE endpoint for clearing logs
  router.delete('/logs', logsClearHandler);

  return router;
}
```