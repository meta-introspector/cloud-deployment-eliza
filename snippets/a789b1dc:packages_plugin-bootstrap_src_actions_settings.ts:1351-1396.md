# a789b1dc:packages_plugin-bootstrap_src_actions_settings.ts:1351-1396

**Commit:** a789b1dcd507d69194402dc7d6c9218ec81fc42f
**Author:** Odilitime
**Date:** Thu Dec 18 17:01:58 2025 -0800
**File:** packages/plugin-bootstrap/src/actions/settings.ts:1351-1396
**Novelty Score:** 19.96
**Concepts:** plugin-system, testing

```
      },
      {
        name: '{{name2}}',
        content: {
          text: "I've updated the verification requirement to email verified accounts only. This adds an extra layer of security to your server.",
          actions: ['SETTING_UPDATED'],
          source: 'discord',
        },
      },
    ],
    [
      {
        name: '{{name1}}',
        content: {
          text: 'I want to turn off level-up notifications',
          source: 'discord',
        },
      },
      {
        name: '{{name2}}',
        content: {
          text: "Level-up notifications have been disabled. Members will still earn experience and level up, but there won't be any automatic announcements. You can still view levels with the appropriate commands.",
          actions: ['SETTING_UPDATED'],
          source: 'discord',
        },
      },
    ],
    [
      {
        name: '{{name1}}',
        content: {
          text: "My server name is 'Gaming Lounge'",
          source: 'discord',
        },
      },
      {
        name: '{{name2}}',
        content: {
          text: "Great! I've saved 'Gaming Lounge' as your server name. This helps me personalize responses and know how to refer to your community. We've completed all the required settings! Your server is now fully configured and ready to use. You can always adjust these settings later if needed.",
          actions: ['ONBOARDING_COMPLETE'],
          source: 'discord',
        },
      },
    ],
  ] as ActionExample[][],
};
```