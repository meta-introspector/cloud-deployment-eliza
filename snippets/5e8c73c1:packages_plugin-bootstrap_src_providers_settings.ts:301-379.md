# 5e8c73c1:packages_plugin-bootstrap_src_providers_settings.ts:301-379

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-bootstrap/src/providers/settings.ts:301-379
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
                settings: [],
              },
              values: {
                settings:
                  "The user doesn't appear to have ownership of any servers. They should make sure they're using the correct account.",
              },
              text: "The user doesn't appear to have ownership of any servers. They should make sure they're using the correct account.",
            }
          : {
              data: {
                settings: [],
              },
              values: {
                settings: 'Error: No configuration access',
              },
              text: 'Error: No configuration access',
            };
      }

      if (!worldSettings) {
        logger.info(
          { src: 'plugin:bootstrap:provider:settings', agentId: runtime.agentId, serverId },
          'No settings state found for server'
        );
        return isOnboarding
          ? {
              data: {
                settings: [],
              },
              values: {
                settings:
                  "The user doesn't appear to have any settings configured for this server. They should configure some settings for this server.",
              },
              text: "The user doesn't appear to have any settings configured for this server. They should configure some settings for this server.",
            }
          : {
              data: {
                settings: [],
              },
              values: {
                settings: 'Configuration has not been completed yet.',
              },
              text: 'Configuration has not been completed yet.',
            };
      }

      // Generate the status message based on the settings
      const output = generateStatusMessage(runtime, worldSettings, isOnboarding, state);

      return {
        data: {
          settings: worldSettings,
        },
        values: {
          settings: output,
        },
        text: output,
      };
    } catch (error) {
      logger.error(
        {
          src: 'plugin:bootstrap:provider:settings',
          agentId: runtime.agentId,
          error: error instanceof Error ? error.message : String(error),
        },
        'Critical error in settings provider'
      );
      return {
        data: {
          settings: [],
        },
        values: {
          settings: 'Error retrieving configuration information. Please try again later.',
        },
        text: 'Error retrieving configuration information. Please try again later.',
      };
    }
  },
};
```