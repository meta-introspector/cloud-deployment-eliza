# a789b1dc:packages_plugin-bootstrap_src_providers_settings.ts:151-300

**Commit:** a789b1dcd507d69194402dc7d6c9218ec81fc42f
**Author:** Odilitime
**Date:** Thu Dec 18 17:01:58 2025 -0800
**File:** packages/plugin-bootstrap/src/providers/settings.ts:151-300
**Novelty Score:** 19.96
**Concepts:** plugin-system, testing

```
        logger.error(
          {
            src: 'plugin:bootstrap:provider:settings',
            agentId: runtime.agentId,
            error: error instanceof Error ? error.message : String(error),
          },
          'Error fetching initial data'
        );
        throw new Error('Failed to retrieve room or user world information');
      });

      if (!room) {
        logger.error(
          { src: 'plugin:bootstrap:provider:settings', agentId: runtime.agentId },
          'No room found for settings provider'
        );
        return {
          data: {
            settings: [],
          },
          values: {
            settings: 'Error: Room not found',
          },
          text: 'Error: Room not found',
        };
      }

      if (!room.worldId) {
        logger.debug(
          { src: 'plugin:bootstrap:provider:settings', agentId: runtime.agentId },
          'No world found for settings provider -- settings provider will be skipped'
        );
        return {
          data: {
            settings: [],
          },
          values: {
            settings: 'Room does not have a worldId -- settings provider will be skipped',
          },
          text: 'Room does not have a worldId -- settings provider will be skipped',
        };
      }

      const type = room.type;
      const isOnboarding = type === ChannelType.DM;

      let world: World | null | undefined = null;
      let serverId: string | undefined = undefined;
      let worldSettings: WorldSettings | null = null;

      if (isOnboarding) {
        // In onboarding mode, use the user's world directly
        // Look for worlds with settings metadata, or create one if none exists
        world = userWorlds?.find((world) => world.metadata?.settings !== undefined);

        if (!world && userWorlds && userWorlds.length > 0) {
          // If user has worlds but none have settings, use the first one and initialize settings
          world = userWorlds[0];
          if (!world.metadata) {
            world.metadata = {};
          }
          world.metadata.settings = {};
          await runtime.updateWorld(world);
          logger.info(
            {
              src: 'plugin:bootstrap:provider:settings',
              agentId: runtime.agentId,
              worldId: world.id,
            },
            'Initialized settings for user world'
          );
        }

        if (!world) {
          logger.error(
            { src: 'plugin:bootstrap:provider:settings', agentId: runtime.agentId },
            'No world found for user during onboarding'
          );
          throw new Error('No server ownership found for onboarding');
        }

        serverId = world.messageServerId;

        // Get world settings directly from the world object we already have
        // Must decrypt secret values using unsaltWorldSettings (settings are stored encrypted)
        if (world.metadata?.settings) {
          const salt = getSalt();
          worldSettings = unsaltWorldSettings(world.metadata.settings as WorldSettings, salt);
        }
      } else {
        // For non-onboarding, we need to get the world associated with the room
        try {
          world = await runtime.getWorld(room.worldId);

          if (!world) {
            logger.error(
              {
                src: 'plugin:bootstrap:provider:settings',
                agentId: runtime.agentId,
                worldId: room.worldId,
              },
              'No world found for room'
            );
            throw new Error(`No world found for room ${room.worldId}`);
          }

          serverId = world.messageServerId;

          // Get world settings directly from the world object we already have
          // Must decrypt secret values using unsaltWorldSettings (settings are stored encrypted)
          if (world.metadata?.settings) {
            const salt = getSalt();
            worldSettings = unsaltWorldSettings(world.metadata.settings as WorldSettings, salt);
          } else if (!serverId) {
            logger.debug(
              {
                src: 'plugin:bootstrap:provider:settings',
                agentId: runtime.agentId,
                worldId: room.worldId,
              },
              'No server ID or settings found for world'
            );
          }
        } catch (error) {
          logger.error(
            {
              src: 'plugin:bootstrap:provider:settings',
              agentId: runtime.agentId,
              error: error instanceof Error ? error.message : String(error),
            },
            'Error processing world data'
          );
          throw new Error('Failed to process world information');
        }
      }

      // If no server found after recovery attempts
      if (!serverId) {
        logger.info(
          {
            src: 'plugin:bootstrap:provider:settings',
            agentId: runtime.agentId,
            entityId: message.entityId,
          },
          'No server ownership found for user after recovery attempt'
        );
        return isOnboarding
          ? {
            data: {
              settings: [],
```