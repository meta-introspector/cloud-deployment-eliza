# 5e8c73c1:packages_server_src_api_messaging_messageServers.ts:151-300

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/api/messaging/messageServers.ts:151-300
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
      }

      // RLS security: Only allow modifying agents for current server
      if (serverId !== serverInstance.messageServerId) {
        return res.status(403).json({
          success: false,
          error: 'Cannot modify agents for a different server',
        });
      }

      try {
        // Remove agent from message server association
        await serverInstance.removeAgentFromMessageServer(serverId, agentId);

        // Notify the agent's message bus service to stop listening for this message server
        internalMessageBus.emit('server_agent_update', {
          type: 'agent_removed_from_server' as const,
          messageServerId: serverId,
          agentId,
        });

        res.status(200).json({
          success: true,
          data: {
            serverId,
            agentId,
            message: 'Agent removed from server successfully',
          },
        });
      } catch (error) {
        logger.error(
          {
            src: 'http',
            path: req.path,
            serverId,
            agentId,
            error: error instanceof Error ? error.message : String(error),
          },
          'Error removing agent from server'
        );
        res.status(500).json({ success: false, error: 'Failed to remove agent from server' });
      }
    }
  );

  // GET /servers/:serverId/agents - List agents in server
  router.get('/servers/:serverId/agents', async (req: express.Request, res: express.Response) => {
    const serverId = validateUuid(req.params.serverId);

    if (!serverId) {
      return res.status(400).json({
        success: false,
        error: 'Invalid serverId format',
      });
    }

    // RLS security: Only allow accessing agents for current server
    if (serverId !== serverInstance.messageServerId) {
      return res.status(403).json({
        success: false,
        error: 'Cannot access agents for a different server',
      });
    }

    try {
      const agents = await serverInstance.getAgentsForMessageServer(serverId);
      res.json({
        success: true,
        data: {
          serverId,
          agents, // Array of agent IDs
        },
      });
    } catch (error) {
      logger.error(
        {
          src: 'http',
          path: req.path,
          serverId,
          error: error instanceof Error ? error.message : String(error),
        },
        'Error fetching agents for server'
      );
      res.status(500).json({ success: false, error: 'Failed to fetch server agents' });
    }
  });

  // GET /agents/:agentId/message-servers - List message servers agent belongs to
  router.get(
    '/agents/:agentId/message-servers',
    async (req: express.Request, res: express.Response) => {
      const agentId = validateUuid(req.params.agentId);

      if (!agentId) {
        return res.status(400).json({
          success: false,
          error: 'Invalid agentId format',
        });
      }

      try {
        const messageServers = await serverInstance.getMessageServersForAgent(agentId);
        res.json({
          success: true,
          data: {
            agentId,
            messageServers, // Array of message server IDs
          },
        });
      } catch (error) {
        logger.error(
          {
            src: 'http',
            path: req.path,
            agentId,
            error: error instanceof Error ? error.message : String(error),
          },
          'Error fetching message servers for agent'
        );
        res.status(500).json({ success: false, error: 'Failed to fetch agent message servers' });
      }
    }
  );

  // ============================================================================
  // DEPRECATED ROUTES - For backward compatibility only
  // ============================================================================

  /**
   * @deprecated Use GET /message-servers instead
   * Kept for backward compatibility. Will be removed in future versions.
   */
  router.get('/central-servers', async (_req: express.Request, res: express.Response) => {
    logger.warn(
      '[DEPRECATED] GET /central-servers is deprecated. Use GET /message-servers instead.'
    );

    try {
      const messageServers = await serverInstance.getServers();
      // Return with old key name for backward compatibility
      res.json({ success: true, data: { servers: messageServers } });
    } catch (error) {
      logger.error(
        '[Messages Router /central-servers] Error fetching servers:',
        error instanceof Error ? error.message : String(error)
      );
      res.status(500).json({ success: false, error: 'Failed to fetch servers' });
    }
  });

```