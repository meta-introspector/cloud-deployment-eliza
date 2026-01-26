# a789b1dc:packages_plugin-bootstrap_src_actions_settings.ts:901-1050

**Commit:** a789b1dcd507d69194402dc7d6c9218ec81fc42f
**Author:** Odilitime
**Date:** Thu Dec 18 17:01:58 2025 -0800
**File:** packages/plugin-bootstrap/src/actions/settings.ts:901-1050
**Novelty Score:** 19.96
**Concepts:** plugin-system, testing

```
      // Check if there's an active settings state in world metadata
      const worldSettings = world?.metadata?.settings;

      if (!worldSettings) {
        logger.error(
          {
            src: 'plugin:bootstrap:action:settings',
            agentId: runtime.agentId,
            serverId: world?.messageServerId,
          },
          'No settings state found for server'
        );
        return false;
      }

      logger.debug(
        {
          src: 'plugin:bootstrap:action:settings',
          agentId: runtime.agentId,
          serverId: world.messageServerId,
        },
        'Found valid settings state for server'
      );
      return true;
    } catch (error) {
      logger.error(
        {
          src: 'plugin:bootstrap:action:settings',
          agentId: runtime.agentId,
          error: error instanceof Error ? error.message : String(error),
        },
        'Error validating settings action'
      );
      return false;
    }
  },

  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    state?: State,
    _options?: HandlerOptions,
    callback?: HandlerCallback
  ): Promise<ActionResult> => {
    try {
      if (!state) {
        logger.error(
          { src: 'plugin:bootstrap:action:settings', agentId: runtime.agentId },
          'State is required for settings handler'
        );
        if (callback) {
          await generateErrorResponse(runtime, state!, callback);
        }
        return {
          text: 'State is required for settings handler',
          values: {
            success: false,
            error: 'STATE_REQUIRED',
          },
          data: {
            actionName: 'UPDATE_SETTINGS',
            error: 'State is required',
          },
          success: false,
          error: new Error('State is required for settings handler'),
        };
      }

      if (!message) {
        logger.error(
          { src: 'plugin:bootstrap:action:settings', agentId: runtime.agentId },
          'Message is required for settings handler'
        );
        await generateErrorResponse(runtime, state, callback!);
        return {
          text: 'Message is required for settings handler',
          values: {
            success: false,
            error: 'MESSAGE_REQUIRED',
          },
          data: {
            actionName: 'UPDATE_SETTINGS',
            error: 'Message is required',
          },
          success: false,
          error: new Error('Message is required for settings handler'),
        };
      }

      if (!callback) {
        logger.error(
          { src: 'plugin:bootstrap:action:settings', agentId: runtime.agentId },
          'Callback is required for settings handler'
        );
        return {
          text: 'Callback is required for settings handler',
          values: {
            success: false,
            error: 'CALLBACK_REQUIRED',
          },
          data: {
            actionName: 'UPDATE_SETTINGS',
            error: 'Callback is required',
          },
          success: false,
          error: new Error('Callback is required for settings handler'),
        };
      }

      // Find the server where this user is the owner
      logger.info(
        {
          src: 'plugin:bootstrap:action:settings',
          agentId: runtime.agentId,
          entityId: message.entityId,
        },
        'Handler looking for server for user'
      );
      const worlds = await findWorldsForOwner(runtime, message.entityId);
      const serverOwnership = worlds?.find((world) => world.metadata?.settings);
      if (!serverOwnership) {
        logger.error(
          {
            src: 'plugin:bootstrap:action:settings',
            agentId: runtime.agentId,
            entityId: message.entityId,
          },
          'No server found for user in handler'
        );
        await generateErrorResponse(runtime, state, callback);
        return {
          text: 'No server found for user',
          values: {
            success: false,
            error: 'NO_SERVER_FOUND',
          },
          data: {
            actionName: 'UPDATE_SETTINGS',
            error: 'No server found where user is owner',
            entityId: message.entityId,
          },
          success: false,
        };
      }

      const worldId = serverOwnership.id;
      logger.info(
        { src: 'plugin:bootstrap:action:settings', agentId: runtime.agentId, worldId },
        'Using world ID'
      );
```