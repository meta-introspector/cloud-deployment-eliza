# a7046c18:packages_docs_runtime_events.mdx:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/runtime/events.mdx:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

### Removing Event Listeners

```typescript
// Remove specific listener
runtime.off(EventType.MESSAGE_RECEIVED, messageHandler);

// Remove all listeners for an event
runtime.removeAllListeners(EventType.MESSAGE_RECEIVED);

// Remove all listeners
runtime.removeAllListeners();
```

## Event Patterns

### Request-Response Pattern

```typescript
// Emit event and wait for response
async function requestWithResponse(runtime: IAgentRuntime, data: any) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Response timeout'));
    }, 5000);
    
    // Listen for response
    runtime.once(EventType.RESPONSE_RECEIVED, (payload) => {
      clearTimeout(timeout);
      resolve(payload.response);
    });
    
    // Emit request
    runtime.emit(EventType.REQUEST_SENT, {
      runtime,
      data,
      requestId: generateId()
    });
  });
}
```

### Event Chaining

```typescript
// Chain events for complex workflows
const workflowPlugin: Plugin = {
  name: 'workflow',
  events: {
    [EventType.MESSAGE_RECEIVED]: [
      async (payload) => {
        // Step 1: Process message
        const processed = await processMessage(payload);
        
        // Emit next event
        await payload.runtime.emit(EventType.MESSAGE_PROCESSED, {
          ...payload,
          processed
        });
      }
    ],
    
    [EventType.MESSAGE_PROCESSED]: [
      async (payload) => {
        // Step 2: Generate response
        const response = await generateResponse(payload);
        
        // Emit next event
        await payload.runtime.emit(EventType.RESPONSE_GENERATED, {
          ...payload,
          response
        });
      }
    ],
    
    [EventType.RESPONSE_GENERATED]: [
      async (payload) => {
        // Step 3: Send response
        await sendResponse(payload);
      }
    ]
  }
};
```

### Event Aggregation

```typescript
// Aggregate multiple events
class EventAggregator {
  private events: Map<string, any[]> = new Map();
  private flushInterval: NodeJS.Timer;
  
  constructor(private runtime: IAgentRuntime) {
    // Listen for events to aggregate
    runtime.on(EventType.MODEL_USED, this.aggregate.bind(this));
    
    // Flush periodically
    this.flushInterval = setInterval(() => this.flush(), 60000);
  }
  
  private aggregate(payload: ModelPayload) {
    const key = `${payload.modelType}:${payload.provider}`;
    
    if (!this.events.has(key)) {
      this.events.set(key, []);
    }
    
    this.events.get(key).push({
      timestamp: Date.now(),
      duration: payload.duration,
      params: payload.params
    });
  }
  
  private async flush() {
    for (const [key, events] of this.events.entries()) {
      const [modelType, provider] = key.split(':');
      
      // Calculate metrics
      const metrics = {
        count: events.length,
        avgDuration: events.reduce((sum, e) => sum + e.duration, 0) / events.length,
        totalDuration: events.reduce((sum, e) => sum + e.duration, 0)
      };
      
      // Emit aggregated event
      await this.runtime.emit(EventType.METRICS_AGGREGATED, {
        runtime: this.runtime,
        modelType,
        provider,
        metrics,
        period: 60000
      });
    }
    
    // Clear events
    this.events.clear();
  }
  
  stop() {
    clearInterval(this.flushInterval);
  }
}
```

## Custom Events

### Defining Custom Events

```