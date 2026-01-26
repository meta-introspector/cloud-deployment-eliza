# a7046c18:packages_docs_plugin-registry_bootstrap_examples.mdx:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/bootstrap/examples.mdx:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      name: 'monitoring',
      providers: [systemStatusProvider],
    },
  ],
});
```

### Context-Aware Provider

```typescript
const userPreferencesProvider: Provider = {
  name: 'USER_PREFERENCES',
  description: 'User preferences and settings',

  get: async (runtime, message) => {
    const userId = message.entityId;
    const prefs = await runtime.getMemories({
      tableName: 'preferences',
      agentId: runtime.agentId,
      entityId: userId,
      count: 1,
    });

    if (!prefs.length) {
      return {
        data: {},
        values: {},
        text: 'No user preferences found.',
      };
    }

    const preferences = prefs[0].content;
    return {
      data: preferences,
      values: {
        language: preferences.language || 'en',
        timezone: preferences.timezone || 'UTC',
        notifications: preferences.notifications ?? true,
      },
      text: `User Preferences:
- Language: ${preferences.language || 'English'}
- Timezone: ${preferences.timezone || 'UTC'}
- Notifications: ${preferences.notifications ? 'Enabled' : 'Disabled'}`,
    };
  },
};
```

## Custom Evaluators

### Creating a Sentiment Analyzer

```typescript
import { Evaluator } from '@elizaos/core';

const sentimentEvaluator: Evaluator = {
  name: 'SENTIMENT_ANALYSIS',
  similes: ['ANALYZE_MOOD', 'CHECK_SENTIMENT'],
  description: 'Analyzes conversation sentiment and adjusts agent mood',

  validate: async (runtime, message) => {
    // Run every 5 messages
    const messages = await runtime.getMemories({
      tableName: 'messages',
      roomId: message.roomId,
      count: 5,
    });
    return messages.length >= 5;
  },

  handler: async (runtime, message, state) => {
    const prompt = `Analyze the sentiment of the recent conversation.

${state.recentMessages}

Provide a sentiment analysis with:
- Overall sentiment (positive/negative/neutral)
- Emotional tone
- Suggested agent mood adjustment`;

    const analysis = await runtime.useModel(ModelType.TEXT_SMALL, { prompt });

    // Store sentiment data
    await runtime.createMemory(
      {
        entityId: runtime.agentId,
        agentId: runtime.agentId,
        roomId: message.roomId,
        content: {
          type: 'sentiment_analysis',
          analysis: analysis,
          timestamp: Date.now(),
        },
      },
      'analysis'
    );

    // Adjust agent mood if needed
    if (analysis.suggestedMood) {
      await runtime.updateCharacterMood(analysis.suggestedMood);
    }

    return analysis;
  },
};
```

## Task Services

### Scheduled Daily Summary

```typescript
// Register a daily summary task
runtime.registerTaskWorker({
  name: 'DAILY_SUMMARY',

  validate: async (runtime, message, state) => {
    const hour = new Date().getHours();
    return hour === 9; // Run at 9 AM
  },

  execute: async (runtime, options) => {
    // Gather yesterday's data
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const messages = await runtime.getMemories({
      tableName: 'messages',
      startTime: yesterday.setHours(0, 0, 0, 0),
      endTime: yesterday.setHours(23, 59, 59, 999),
    });

    // Generate summary
    const summary = await generateDailySummary(messages);

    // Post to main channel
    await runtime.emitEvent(EventType.POST_GENERATED, {
      runtime,
      worldId: options.worldId,
      userId: runtime.agentId,
      roomId: options.mainChannelId,
      source: 'task',
      callback: async (content) => {
        // Handle posted summary
        console.log('Daily summary posted:', content.text);
      },
    });
  },
});

```