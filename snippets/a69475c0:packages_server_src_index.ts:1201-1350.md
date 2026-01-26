# a69475c0:packages_server_src_index.ts:1201-1350

**Commit:** a69475c084e9a6fb6fc85f19ea6742546b8e0476
**Author:** standujar
**Date:** Wed Dec 17 15:16:36 2025 +0100
**File:** packages/server/src/index.ts:1201-1350
**Novelty Score:** 29.11
**Concepts:** event-driven, testing

```
          // Use the resolved clientPath (prefer local variable, fallback to instance variable)
          const resolvedClientPath = clientPath || this.clientPath;

          if (resolvedClientPath) {
            const indexFilePath = path.join(resolvedClientPath, 'index.html');

            // Verify the file exists before attempting to serve it
            if (!existsSync(indexFilePath)) {
              res.status(404).send('Client application not found');
              return;
            }

            // Use sendFile with the directory as root and filename separately
            // This approach is more reliable for Express
            res.sendFile('index.html', { root: resolvedClientPath }, (err) => {
              if (err && !res.headersSent) {
                logger.warn({ src: 'http', error: err.message }, 'Failed to serve index.html');
                res.status(404).send('Client application not found');
              }
            });
          } else {
            res.status(404).send('Client application not found');
          }
        });
      } else {
        // Return 403 Forbidden for non-API routes when UI is disabled
        this.app.use((_req: express.Request, res: express.Response) => {
          res.sendStatus(403); // Standard HTTP 403 Forbidden
        });
      }

      // Create HTTP server for Socket.io
      this.server = http.createServer(this.app);

      // Configure server timeouts for optimal performance:
      // - timeout: Max time for entire request/response cycle (30s allows for LLM calls)
      // - keepAliveTimeout: Idle connection timeout (5s balances reuse vs resources)
      // - headersTimeout: Max time to receive headers (10s protects against slow clients)
      // - requestTimeout: Max time for request body (30s matches timeout for consistency)
      this.server.timeout = 30000;
      this.server.keepAliveTimeout = 5000;
      this.server.headersTimeout = 10000;
      this.server.requestTimeout = 30000;

      // Initialize Socket.io, passing the AgentServer instance
      this.socketIO = setupSocketIO(this.server, this.elizaOS!, this);

      logger.success({ src: 'http' }, 'HTTP server and Socket.IO initialized');
    } catch (error) {
      logger.error({ src: 'http', error }, 'Failed to complete server initialization');
      throw error;
    }
  }

  /**
   * Registers an agent with the provided runtime.
   * Note: Agents should ideally be created through ElizaOS.addAgent() for proper orchestration.
   * This method exists primarily for backward compatibility.
   *
   * @param {IAgentRuntime} runtime - The runtime object containing agent information.
   * @throws {Error} if the runtime is null/undefined, if agentId is missing, if character configuration is missing,
   * or if there are any errors during registration.
   */
  public async registerAgent(runtime: IAgentRuntime) {
    try {
      if (!runtime) {
        throw new Error('Attempted to register null/undefined runtime');
      }
      if (!runtime.agentId) {
        throw new Error('Runtime missing agentId');
      }
      if (!runtime.character) {
        throw new Error('Runtime missing character configuration');
      }

      // Auto-register the MessageBusConnector plugin for server-side communication
      try {
        if (messageBusConnectorPlugin) {
          await runtime.registerPlugin(messageBusConnectorPlugin);
        } else {
          logger.error(
            { src: 'agent', agentId: runtime.agentId },
            'MessageBusConnector plugin not found'
          );
        }
      } catch (e) {
        logger.error(
          { src: 'agent', error: e, agentId: runtime.agentId },
          'Failed to register MessageBusConnector'
        );
      }

      // Register TEE plugin if present
      const teePlugin = runtime.plugins.find((p) => p.name === 'phala-tee-plugin');
      if (teePlugin) {
        if (teePlugin.providers) {
          for (const provider of teePlugin.providers) {
            runtime.registerProvider(provider);
          }
        }
        if (teePlugin.actions) {
          for (const action of teePlugin.actions) {
            runtime.registerAction(action);
          }
        }
      }

      logger.info(
        { src: 'agent', agentId: runtime.agentId, agentName: runtime.character.name },
        'Successfully registered agent with core services'
      );

      await this.addAgentToMessageServer(this.messageServerId, runtime.agentId);
      logger.info(
        {
          src: 'agent',
          agentId: runtime.agentId,
          agentName: runtime.character.name,
          messageServerId: this.messageServerId,
        },
        'Auto-associated agent with message server'
      );
    } catch (error) {
      logger.error({ src: 'agent', error }, 'Failed to register agent');
      throw error;
    }
  }

  /**
   * Unregisters an agent from the system.
   *
   * @param {UUID} agentId - The unique identifier of the agent to unregister.
   * @returns {void}
   */
  public async unregisterAgent(agentId: UUID) {
    if (!agentId) {
      logger.warn({ src: 'agent' }, 'Attempted to unregister invalid agent');
      return;
    }

    try {
      const agent = this.elizaOS?.getAgent(agentId);

      if (agent) {
        try {
          await agent.stop();
        } catch (stopError) {
          logger.error(
            { src: 'agent', error: stopError, agentId },
            'Error stopping agent services'
```