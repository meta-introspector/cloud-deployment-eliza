# a789b1dc:packages_plugin-bootstrap_src_actions_settings.ts:1201-1350

**Commit:** a789b1dcd507d69194402dc7d6c9218ec81fc42f
**Author:** Odilitime
**Date:** Thu Dec 18 17:01:58 2025 -0800
**File:** packages/plugin-bootstrap/src/actions/settings.ts:1201-1350
**Novelty Score:** 19.96
**Concepts:** plugin-system, testing

```
          agentId: runtime.agentId,
          error: error instanceof Error ? error.message : String(error),
        },
        'Error in settings handler'
      );
      if (state && callback) {
        await generateErrorResponse(runtime, state, callback);
      }
      return {
        text: 'Error in settings handler',
        values: {
          success: false,
          error: 'HANDLER_ERROR',
        },
        data: {
          actionName: 'UPDATE_SETTINGS',
          error: error instanceof Error ? error.message : String(error),
        },
        success: false,
        error: error instanceof Error ? error : new Error(String(error)),
      };
    }
  },
  examples: [
    [
      {
        name: '{{name1}}',
        content: {
          text: 'I want to set up the welcome channel to #general',
          source: 'discord',
        },
      },
      {
        name: '{{name2}}',
        content: {
          text: "Perfect! I've updated your welcome channel to #general. Next, we should configure the automated greeting message that new members will receive.",
          actions: ['SETTING_UPDATED'],
          source: 'discord',
        },
      },
    ],
    [
      {
        name: '{{name1}}',
        content: {
          text: "Let's set the bot prefix to !",
          source: 'discord',
        },
      },
      {
        name: '{{name2}}',
        content: {
          text: "Great choice! I've set the command prefix to '!'. Now you can use commands like !help, !info, etc.",
          actions: ['SETTING_UPDATED'],
          source: 'discord',
        },
      },
    ],
    [
      {
        name: '{{name1}}',
        content: {
          text: 'Enable auto-moderation for bad language',
          source: 'discord',
        },
      },
      {
        name: '{{name2}}',
        content: {
          text: "Auto-moderation for inappropriate language has been enabled. I'll now filter messages containing offensive content.",
          actions: ['SETTING_UPDATED'],
          source: 'discord',
        },
      },
    ],
    [
      {
        name: '{{name1}}',
        content: {
          text: 'For server logs, use the #server-logs channel',
          source: 'discord',
        },
      },
      {
        name: '{{name2}}',
        content: {
          text: "I've configured #server-logs as your logging channel. All server events like joins, leaves, and moderation actions will be recorded there.",
          actions: ['SETTING_UPDATED'],
          source: 'discord',
        },
      },
    ],
    [
      {
        name: '{{name1}}',
        content: {
          text: "I'd like to have role self-assignment in the #roles channel",
          source: 'discord',
        },
      },
      {
        name: '{{name2}}',
        content: {
          text: 'Role self-assignment has been set up in the #roles channel. Members can now assign themselves roles by interacting with messages there.',
          actions: ['SETTING_UPDATED'],
          source: 'discord',
        },
      },
    ],
    [
      {
        name: '{{name1}}',
        content: {
          text: 'Make music commands available in voice-text channels only',
          source: 'discord',
        },
      },
      {
        name: '{{name2}}',
        content: {
          text: "I've updated your music command settings - they'll now only work in voice-text channels. This helps keep other channels clear of music spam.",
          actions: ['SETTING_UPDATED'],
          source: 'discord',
        },
      },
    ],
    [
      {
        name: '{{name1}}',
        content: {
          text: 'For server timezone, set it to EST',
          source: 'discord',
        },
      },
      {
        name: '{{name2}}',
        content: {
          text: 'Server timezone has been set to Eastern Standard Time (EST). All scheduled events and timestamps will now display in this timezone.',
          actions: ['SETTING_UPDATED'],
          source: 'discord',
        },
      },
    ],
    [
      {
        name: '{{name1}}',
        content: {
          text: 'Set verification level to email verified users only',
          source: 'discord',
        },
```