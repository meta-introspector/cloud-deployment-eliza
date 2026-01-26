# a7046c18:packages_docs_plugin-registry_bootstrap_complete-documentation.mdx:751-900

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/bootstrap/complete-documentation.mdx:751-900
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      bio: ['An intelligent agent powered by elizaOS'],
  plugins: [
    '@elizaos/plugin-sql',
    '@elizaos/plugin-bootstrap',
  ],
};

// Create the agent
const agent: ProjectAgent = {
  character,
  // Custom plugins go here at agent level
  plugins: [],
};

// Export the project
export const project = {
  agents: [agent]
};
```

### 2. Custom Event Handlers

```typescript
// Add custom handling for existing events
runtime.on(EventType.MESSAGE_RECEIVED, async (payload) => {
  // Custom pre-processing
  await customPreProcessor(payload);

  // Call default handler
  await bootstrapPlugin.events[EventType.MESSAGE_RECEIVED][0](payload);

  // Custom post-processing
  await customPostProcessor(payload);
});
```

### 3. Extending Actions

```typescript
// Create custom action that extends REPLY
const customReplyAction = {
  ...replyAction,
  name: 'CUSTOM_REPLY',
  handler: async (...args) => {
    // Custom logic
    await customLogic();

    // Call original handler
    return replyAction.handler(...args);
  },
};
```

## Examples

### Example 1: Basic Message Flow

```typescript
// 1. Message arrives
const message = {
  id: 'msg-123',
  entityId: 'user-456',
  roomId: 'room-789',
  content: {
    text: 'Hello, how are you?',
  },
};

// 2. Bootstrap processes it
// - Saves to memory
// - Checks shouldRespond
// - Generates response
// - Executes REPLY action
// - Runs reflection evaluator

// 3. Response sent via callback
callback({
  text: "I'm doing well, thank you! How can I help you today?",
  actions: ['REPLY'],
  thought: 'User greeted me politely, responding in kind',
});
```

### Example 2: Multi-Action Response

```typescript
// Complex response with multiple actions
const response = {
  thought: 'User needs help with a technical issue in a specific room',
  text: "I'll help you with that issue.",
  actions: ['REPLY', 'FOLLOW_ROOM', 'UPDATE_SETTINGS'],
  providers: ['TECHNICAL_DOCS', 'ROOM_INFO'],
};
```

### Example 3: Task Scheduling

```typescript
// Register a task worker
runtime.registerTaskWorker({
  name: 'DAILY_SUMMARY',
  validate: async (runtime) => {
    const hour = new Date().getHours();
    return hour === 9; // Run at 9 AM
  },
  execute: async (runtime, options) => {
    // Generate and post daily summary
    await runtime.emitEvent(EventType.POST_GENERATED, {
      runtime,
      worldId: options.worldId,
      // ... other params
    });
  },
});

// Create the task
await runtime.createTask({
  name: 'DAILY_SUMMARY',
  metadata: {
    updateInterval: 1000 * 60 * 60, // Check hourly
  },
  tags: ['queue', 'repeat'],
});
```

## Best Practices

1. **Always check message validity** before processing
2. **Use providers** to gather context instead of direct database queries
3. **Chain actions** for complex behaviors
4. **Implement proper error handling** in custom components
5. **Respect rate limits** and response timeouts
6. **Test with different room types** and message formats
7. **Monitor reflection outputs** for agent learning

## Troubleshooting

### Common Issues

1. **Agent not responding**

   - Check room type and bypass settings
   - Verify agent isn't muted
   - Check shouldRespond logic

2. **Duplicate responses**

   - Ensure response ID tracking is working
   - Check for multiple handler registrations

```