# a7046c18:packages_docs_runtime_events.mdx:451-600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/runtime/events.mdx:451-600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
```typescript
// Extend EventType with custom events
declare module '@elizaos/core' {
  interface EventTypeRegistry {
    CUSTOM_DATA_RECEIVED: 'custom:data:received';
    CUSTOM_PROCESS_COMPLETE: 'custom:process:complete';
    CUSTOM_ERROR_OCCURRED: 'custom:error:occurred';
  }
}

// Define custom payload
interface CustomDataPayload {
  runtime: IAgentRuntime;
  data: any;
  source: string;
  timestamp: number;
}
```

### Using Custom Events

```typescript
const customPlugin: Plugin = {
  name: 'custom-plugin',
  
  events: {
    'custom:data:received': [
      async (payload: CustomDataPayload) => {
        // Process custom data
        const processed = await processCustomData(payload.data);
        
        // Emit completion
        await payload.runtime.emit('custom:process:complete', {
          runtime: payload.runtime,
          original: payload.data,
          processed,
          duration: Date.now() - payload.timestamp
        });
      }
    ]
  },
  
  actions: [{
    name: 'RECEIVE_DATA',
    handler: async (runtime, message, state) => {
      // Emit custom event
      await runtime.emit('custom:data:received', {
        runtime,
        data: message.content,
        source: 'user',
        timestamp: Date.now()
      });
    }
  }]
};
```

## Event Middleware

### Creating Event Middleware

```typescript
// Middleware to log all events
function loggingMiddleware(eventType: EventType, payload: any) {
  console.log(`[Event] ${eventType}:`, {
    timestamp: new Date().toISOString(),
    type: eventType,
    payload: JSON.stringify(payload).slice(0, 200)
  });
}

// Middleware to filter events
function filterMiddleware(allowedEvents: EventType[]) {
  return (eventType: EventType, payload: any, next: Function) => {
    if (allowedEvents.includes(eventType)) {
      next(payload);
    }
  };
}

// Middleware to transform payload
function transformMiddleware(eventType: EventType, payload: any, next: Function) {
  const transformed = {
    ...payload,
    timestamp: Date.now(),
    eventType
  };
  next(transformed);
}
```

## Error Handling

### Event Error Handling

```typescript
// Global error handler for events
runtime.on('error', (error: Error, eventType: EventType, payload: any) => {
  console.error(`Error in event ${eventType}:`, error);
  
  // Log to monitoring service
  monitoringService.logError({
    error: error.message,
    stack: error.stack,
    eventType,
    payload: JSON.stringify(payload).slice(0, 1000)
  });
});

// Handler with error handling
async function safeEventHandler(payload: any) {
  try {
    await riskyOperation(payload);
  } catch (error) {
    // Emit error event
    await payload.runtime.emit(EventType.SERVICE_ERROR, {
      runtime: payload.runtime,
      error,
      originalEvent: payload
    });
    
    // Don't throw - allow other handlers to run
  }
}
```

## Performance Considerations

### Event Batching

```typescript
class EventBatcher {
  private batch: Map<EventType, any[]> = new Map();
  private batchSize = 100;
  private flushInterval = 1000;
  private timer: NodeJS.Timer;
  
  constructor(private runtime: IAgentRuntime) {
    this.timer = setInterval(() => this.flush(), this.flushInterval);
  }
  
  add(eventType: EventType, payload: any) {
    if (!this.batch.has(eventType)) {
      this.batch.set(eventType, []);
    }
    
    const events = this.batch.get(eventType);
    events.push(payload);
    
    if (events.length >= this.batchSize) {
```