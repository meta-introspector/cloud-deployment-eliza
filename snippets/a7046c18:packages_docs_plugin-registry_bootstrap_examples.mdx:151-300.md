# a7046c18:packages_docs_plugin-registry_bootstrap_examples.mdx:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/bootstrap/examples.mdx:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  description: 'Provides detailed help on a specific topic',

  validate: async (runtime) => {
    // Always available
    return true;
  },

  handler: async (runtime, message, state, options, callback) => {
    // Extract help topic from message
    const topic = extractHelpTopic(message.content.text);

    // Get relevant documentation
    const helpContent = await getHelpContent(topic);

    // Generate response
    const response = {
      thought: `User needs help with ${topic}`,
      text: helpContent,
      actions: ['HELP'],
      attachments: topic.includes('screenshot')
        ? [{ url: '/help/screenshots/' + topic + '.png' }]
        : [],
    };

    await callback(response);
    return true;
  },

  examples: [
    [
      {
        name: '{{user}}',
        content: { text: 'How do I reset my password?' },
      },
      {
        name: '{{agent}}',
        content: {
          text: "Here's how to reset your password:\n1. Click 'Forgot Password'\n2. Enter your email\n3. Check your inbox for reset link",
          actions: ['HELP'],
        },
      },
    ],
  ],
};

// Add to agent
const agentWithHelp = new AgentRuntime({
  character: {
    /* ... */
  },
  plugins: [
    bootstrapPlugin,
    {
      name: 'custom-help',
      actions: [helpAction],
    },
  ],
});
```

### Action that Calls External API

```typescript
const weatherAction: Action = {
  name: 'CHECK_WEATHER',
  similes: ['WEATHER', 'FORECAST'],
  description: 'Checks current weather for a location',

  validate: async (runtime) => {
    // Check if API key is configured
    return !!runtime.getSetting('WEATHER_API_KEY');
  },

  handler: async (runtime, message, state, options, callback) => {
    const location = extractLocation(message.content.text);
    const apiKey = runtime.getSetting('WEATHER_API_KEY');

    try {
      const response = await fetch(
        `https://api.weather.com/v1/current?location=${location}&key=${apiKey}`
      );
      const weather = await response.json();

      await callback({
        thought: `Checking weather for ${location}`,
        text: `Current weather in ${location}: ${weather.temp}°F, ${weather.condition}`,
        actions: ['CHECK_WEATHER'],
        metadata: { weather },
      });
    } catch (error) {
      await callback({
        thought: `Failed to get weather for ${location}`,
        text: "Sorry, I couldn't fetch the weather information right now.",
        actions: ['CHECK_WEATHER'],
        error: error.message,
      });
    }

    return true;
  },
};
```

## Custom Providers

### Creating a System Status Provider

```typescript
import { Provider } from '@elizaos/core';

const systemStatusProvider: Provider = {
  name: 'SYSTEM_STATUS',
  description: 'Provides current system status and metrics',
  position: 50,

  get: async (runtime, message) => {
    // Gather system metrics
    const metrics = await gatherSystemMetrics();

    // Format for prompt
    const statusText = `
# System Status
- CPU Usage: ${metrics.cpu}%
- Memory: ${metrics.memory}% used
- Active Users: ${metrics.activeUsers}
- Response Time: ${metrics.avgResponseTime}ms
- Uptime: ${metrics.uptime}
    `.trim();

    return {
      data: metrics,
      values: {
        cpuUsage: metrics.cpu,
        memoryUsage: metrics.memory,
        isHealthy: metrics.cpu < 80 && metrics.memory < 90,
      },
      text: statusText,
    };
  },
};

// Use in agent
const monitoringAgent = new AgentRuntime({
  character: {
    name: 'SystemMonitor',
    // ...
  },
  plugins: [
    bootstrapPlugin,
    {
```