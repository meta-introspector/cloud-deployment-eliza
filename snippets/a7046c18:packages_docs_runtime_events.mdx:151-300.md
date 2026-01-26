# a7046c18:packages_docs_runtime_events.mdx:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/runtime/events.mdx:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  runtime: IAgentRuntime;
  modelType: ModelTypeName;
  provider: string;
  params: any;
  result?: any;
  error?: Error;
  duration: number;
}
```

## Event Handlers

### Handler Registration

Event handlers are registered during plugin initialization:

```typescript
const myPlugin: Plugin = {
  name: 'my-plugin',
  events: {
    [EventType.MESSAGE_RECEIVED]: [
      handleMessageReceived,
      logMessage
    ],
    [EventType.ACTION_COMPLETED]: [
      processActionResult
    ],
    [EventType.RUN_COMPLETED]: [
      cleanupRun
    ]
  }
};
```

### Handler Implementation

```typescript
// Message handler
async function handleMessageReceived(payload: MessagePayload) {
  const { runtime, message, room, user, callback } = payload;
  
  // Process the message
  const state = await runtime.composeState(message);
  
  // Check if we should respond
  if (shouldRespond(message, state)) {
    await runtime.processActions(message, [], state);
  }
  
  // Call callback if provided
  if (callback) {
    await callback({
      text: 'Message processed',
      metadata: { processed: true }
    });
  }
}

// Action handler
async function processActionResult(payload: ActionPayload) {
  const { runtime, action, result, error } = payload;
  
  if (error) {
    runtime.logger.error(`Action ${action.name} failed:`, error);
    // Handle error
    return;
  }
  
  // Process successful result
  runtime.logger.info(`Action ${action.name} completed:`, result);
  
  // Store result in memory
  await runtime.createMemory({
    type: MemoryType.ACTION,
    content: {
      text: `Action ${action.name} completed`,
      action: action.name,
      result
    },
    roomId: payload.message.roomId
  });
}
```

## Event Emission

### Emitting Events

```typescript
// Emit an event from the runtime
await runtime.emit(EventType.MESSAGE_RECEIVED, {
  runtime,
  message,
  room,
  user,
  callback
});

// Emit from a service
class CustomService extends Service {
  async processData(data: any) {
    await this.runtime.emit(EventType.CUSTOM_EVENT, {
      runtime: this.runtime,
      data,
      timestamp: Date.now()
    });
  }
}

// Emit from an action
const customAction: Action = {
  name: 'CUSTOM_ACTION',
  handler: async (runtime, message, state) => {
    // Do work
    const result = await performAction();
    
    // Emit completion event
    await runtime.emit(EventType.ACTION_COMPLETED, {
      runtime,
      action: customAction,
      message,
      state,
      result
    });
    
    return result;
  }
};
```

## Event Listeners

### Adding Event Listeners

```typescript
// Add listener to runtime
runtime.on(EventType.MESSAGE_RECEIVED, async (payload) => {
  console.log('Message received:', payload.message.content.text);
});

// Add multiple listeners
runtime.on(EventType.ACTION_STARTED, logActionStart);
runtime.on(EventType.ACTION_STARTED, trackActionMetrics);
runtime.on(EventType.ACTION_STARTED, notifyActionStart);

// One-time listener
runtime.once(EventType.SERVICE_STARTED, async (payload) => {
  console.log('Service started:', payload.service.name);
});
```
```