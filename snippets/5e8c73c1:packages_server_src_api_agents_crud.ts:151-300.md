# 5e8c73c1:packages_server_src_api_agents_crud.ts:151-300

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/api/agents/crud.ts:151-300
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
        success: true,
        data: {
          id: newAgent.id,
          character,
        },
      });
      logger.success(
        { src: 'http', agentId: newAgent.id, agentName: character.name },
        'Agent created'
      );
    } catch (error) {
      logger.error({ src: 'http', error }, 'Error creating agent');
      res.status(400).json({
        success: false,
        error: {
          code: 'CREATE_ERROR',
          message: error instanceof Error ? error.message : 'Error creating agent',
          details: error instanceof Error ? error.message : String(error),
        },
      });
    }
  });

  // Update agent
  router.patch('/:agentId', async (req, res) => {
    const agentId = validateUuid(req.params.agentId);
    if (!agentId) {
      return sendError(res, 400, 'INVALID_ID', 'Invalid agent ID format');
    }
    if (!db) {
      return sendError(res, 500, 'DB_ERROR', 'Database not available');
    }

    const updates = req.body;

    try {
      // Get current agent state before update to detect critical changes
      const currentAgent = await db.getAgent(agentId);
      const activeRuntime = elizaOS.getAgent(agentId);

      // Encrypt secrets before saving to database
      const salt = getSalt();
      if (updates.settings?.secrets && typeof updates.settings.secrets === 'object') {
        updates.settings.secrets = encryptObjectValues(
          updates.settings.secrets as Record<string, any>,
          salt
        );
      }
      if (updates.secrets && typeof updates.secrets === 'object') {
        updates.secrets = encryptObjectValues(updates.secrets as Record<string, any>, salt) as {
          [key: string]: string | number | boolean;
        };
      }

      if (Object.keys(updates).length > 0) {
        await db.updateAgent(agentId, updates);
      }

      const updatedAgent = await db.getAgent(agentId);

      // Detect if plugins have changed - this requires a full restart
      let needsRestart = false;
      if (currentAgent && activeRuntime && updatedAgent) {
        // Validate plugins array structure
        if (updatedAgent.plugins && !Array.isArray(updatedAgent.plugins)) {
          throw new Error('plugins must be an array');
        }

        interface PluginWithName {
          name: string;
          [key: string]: unknown;
        }
        const currentPlugins = (currentAgent.plugins || [])
          .filter((p) => p !== null && p !== undefined)
          .map((p) => (typeof p === 'string' ? p : (p as PluginWithName).name))
          .filter((name) => typeof name === 'string')
          .sort();

        const updatedPlugins = (updatedAgent.plugins || [])
          .filter((p) => p !== null && p !== undefined)
          .map((p) => (typeof p === 'string' ? p : (p as PluginWithName).name))
          .filter((name) => typeof name === 'string')
          .sort();

        const pluginsChanged =
          currentPlugins.length !== updatedPlugins.length ||
          currentPlugins.some((plugin, idx) => plugin !== updatedPlugins[idx]);

        needsRestart = pluginsChanged;
      }

      // Check if agent is currently active
      if (activeRuntime && updatedAgent) {
        if (needsRestart) {
          // Plugins changed - need full restart
          try {
            await serverInstance?.unregisterAgent(agentId);

            const {
              enabled: _enabled,
              status: _status,
              createdAt: _createdAt,
              updatedAt: _updatedAt,
              ...characterData
            } = updatedAgent;
            const runtimes = await serverInstance?.startAgents([
              { character: characterData as Character },
            ]);
            if (!runtimes || runtimes.length === 0) {
              throw new Error('Failed to restart agent after configuration change');
            }
            logger.debug({ src: 'http', agentId }, 'Agent restarted after config change');
          } catch (restartError) {
            logger.error({ src: 'http', error: restartError, agentId }, 'Failed to restart agent');

            // Try to restore the agent with the previous configuration
            try {
              const { enabled, status, createdAt, updatedAt, ...previousCharacterData } =
                currentAgent!;
              await serverInstance?.startAgents([
                { character: previousCharacterData as Character },
              ]);
              logger.warn({ src: 'http', agentId }, 'Restored agent to previous state');
            } catch (restoreError) {
              logger.error(
                { src: 'http', error: restoreError, agentId },
                'Failed to restore agent - may be in broken state'
              );
            }

            throw restartError;
          }
        } else {
          // Only character properties changed - can update in-place
          const { enabled, status, createdAt, updatedAt, ...characterData } = updatedAgent;
          await elizaOS.updateAgent(agentId, characterData as Character);
        }
      }

      const runtime = elizaOS.getAgent(agentId);
      const status = runtime ? 'active' : 'inactive';

      sendSuccess(res, { ...updatedAgent, status });
    } catch (error) {
      logger.error({ src: 'http', error, agentId }, 'Error updating agent');
      sendError(
        res,
        500,
        'UPDATE_ERROR',
        'Error updating agent',
```