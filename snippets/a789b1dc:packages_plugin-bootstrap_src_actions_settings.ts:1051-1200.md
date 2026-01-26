# a789b1dc:packages_plugin-bootstrap_src_actions_settings.ts:1051-1200

**Commit:** a789b1dcd507d69194402dc7d6c9218ec81fc42f
**Author:** Odilitime
**Date:** Thu Dec 18 17:01:58 2025 -0800
**File:** packages/plugin-bootstrap/src/actions/settings.ts:1051-1200
**Novelty Score:** 19.96
**Concepts:** plugin-system, testing

```

      // Get settings state directly from the world object we already have
      // Must decrypt secret values (settings are stored encrypted)
      const rawSettings = serverOwnership.metadata?.settings as WorldSettings | undefined;
      const worldSettings = rawSettings ? unsaltWorldSettings(rawSettings, getSalt()) : undefined;

      if (!worldSettings) {
        logger.error(
          { src: 'plugin:bootstrap:action:settings', agentId: runtime.agentId, worldId },
          'No settings state found for world in handler'
        );
        await generateErrorResponse(runtime, state, callback);
        return {
          text: 'No settings state found',
          values: {
            success: false,
            error: 'NO_SETTINGS_STATE',
          },
          data: {
            actionName: 'UPDATE_SETTINGS',
            error: 'No settings state found for world',
            worldId,
          },
          success: false,
        };
      }

      // Extract setting values from message
      logger.info(
        {
          src: 'plugin:bootstrap:action:settings',
          agentId: runtime.agentId,
          text: message.content.text,
        },
        'Extracting settings from message'
      );
      const extractedSettings = await extractSettingValues(runtime, message, state, worldSettings);
      logger.info(
        {
          src: 'plugin:bootstrap:action:settings',
          agentId: runtime.agentId,
          count: extractedSettings.length,
        },
        'Extracted settings'
      );

      // Process extracted settings
      const updateResults = await processSettingUpdates(
        runtime,
        worldId,
        worldSettings,
        extractedSettings
      );

      // Generate appropriate response
      if (updateResults.updatedAny) {
        logger.info(
          {
            src: 'plugin:bootstrap:action:settings',
            agentId: runtime.agentId,
            messages: updateResults.messages,
          },
          'Successfully updated settings'
        );

        // Get updated settings state
        const updatedWorldSettings = await getWorldSettings(runtime, worldId);
        if (!updatedWorldSettings) {
          logger.error(
            { src: 'plugin:bootstrap:action:settings', agentId: runtime.agentId },
            'Failed to retrieve updated settings state'
          );
          await generateErrorResponse(runtime, state, callback);
          return {
            text: 'Failed to retrieve updated settings state',
            values: {
              success: false,
              error: 'RETRIEVE_FAILED',
            },
            data: {
              actionName: 'UPDATE_SETTINGS',
              error: 'Failed to retrieve updated settings state',
              worldId,
            },
            success: false,
          };
        }

        await generateSuccessResponse(
          runtime,
          updatedWorldSettings,
          state,
          updateResults.messages,
          callback
        );

        // Check if all required settings are configured
        const { requiredUnconfigured } = categorizeSettings(updatedWorldSettings);
        const allConfigured = requiredUnconfigured.length === 0;

        return {
          text: 'Settings updated successfully',
          values: {
            success: true,
            settingsUpdated: extractedSettings.length,
            updatedSettings: extractedSettings.map((s) => s.key),
            remainingRequired: requiredUnconfigured.length,
            allConfigured,
            worldId,
          },
          data: {
            actionName: 'UPDATE_SETTINGS',
            updatedSettings: extractedSettings,
            messages: updateResults.messages,
            remainingRequired: requiredUnconfigured.map(([key, _]) => key),
            allConfigured,
            worldId,
          },
          success: true,
        };
      } else {
        logger.info(
          { src: 'plugin:bootstrap:action:settings', agentId: runtime.agentId },
          'No settings were updated'
        );
        await generateFailureResponse(runtime, worldSettings, state, callback);

        const { requiredUnconfigured } = categorizeSettings(worldSettings);

        return {
          text: 'No settings were updated',
          values: {
            success: false,
            error: 'NO_UPDATES',
            remainingRequired: requiredUnconfigured.length,
            worldId,
          },
          data: {
            actionName: 'UPDATE_SETTINGS',
            error: 'No valid settings found in message',
            remainingRequired: requiredUnconfigured.map(([key, _]) => key),
            worldId,
          },
          success: false,
        };
      }
    } catch (error) {
      logger.error(
        {
          src: 'plugin:bootstrap:action:settings',
```