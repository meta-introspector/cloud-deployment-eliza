# a7046c18:packages_docs_runtime_events.mdx:601-712

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/runtime/events.mdx:601-712
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      this.flushType(eventType);
    }
  }
  
  private flushType(eventType: EventType) {
    const events = this.batch.get(eventType);
    if (!events || events.length === 0) return;
    
    // Emit batch event
    this.runtime.emit(`${eventType}:batch` as EventType, {
      runtime: this.runtime,
      events,
      count: events.length
    });
    
    this.batch.set(eventType, []);
  }
  
  flush() {
    for (const eventType of this.batch.keys()) {
      this.flushType(eventType);
    }
  }
  
  stop() {
    clearInterval(this.timer);
    this.flush();
  }
}
```

### Event Throttling

```typescript
// Throttle high-frequency events
function throttleEvents(eventType: EventType, delay: number) {
  let lastEmit = 0;
  let pending: any = null;
  let timer: NodeJS.Timeout;
  
  return (payload: any) => {
    const now = Date.now();
    
    if (now - lastEmit >= delay) {
      // Emit immediately
      runtime.emit(eventType, payload);
      lastEmit = now;
    } else {
      // Store for later
      pending = payload;
      
      // Schedule emit
      if (!timer) {
        timer = setTimeout(() => {
          if (pending) {
            runtime.emit(eventType, pending);
            lastEmit = Date.now();
            pending = null;
          }
          timer = null;
        }, delay - (now - lastEmit));
      }
    }
  };
}
```

## Best Practices

### Event Design

- **Specific Events**: Create specific events rather than generic ones
- **Consistent Payloads**: Use consistent payload structures
- **Event Naming**: Use clear, hierarchical naming (domain:action:status)
- **Documentation**: Document event types and payloads
- **Versioning**: Version events when making breaking changes

### Performance

- **Async Handlers**: Always use async handlers
- **Non-Blocking**: Don't block the event loop
- **Batching**: Batch high-frequency events
- **Throttling**: Throttle rapid events
- **Cleanup**: Remove unused listeners

### Error Handling

- **Graceful Failures**: Don't crash on handler errors
- **Error Events**: Emit error events for monitoring
- **Timeouts**: Set timeouts for long operations
- **Retries**: Implement retry logic for transient failures
- **Logging**: Log errors with context

## See Also

<CardGroup cols={2}>
  <Card title="Providers" icon="database" href="/runtime/providers">
    Learn how providers use events
  </Card>
  
  <Card title="Models" icon="robot" href="/runtime/models">
    Explore AI model management
  </Card>
  
  <Card title="Services" icon="server" href="/runtime/services">
    Build services that emit and handle events
  </Card>
  
  <Card title="Messaging" icon="message" href="/runtime/messaging">
    Understand real-time event streaming
  </Card>
</CardGroup>
```