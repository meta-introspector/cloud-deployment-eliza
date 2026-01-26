# a7046c18:packages_docs_runtime_services.mdx:451-600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/runtime/services.mdx:451-600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    // Get Telegram service
    const telegram = this.runtime.getService('telegram');
    if (telegram) {
      await telegram.sendMessage(chatId, message);
    }
    
    // Get all services for broadcasting
    const services = this.runtime.getAllServices();
    for (const service of services) {
      if (service.supportsNotifications) {
        await service.notify(message);
      }
    }
  }
}
```

## Error Handling

### Graceful Initialization

Handle missing configuration gracefully:

```typescript
constructor(runtime: IAgentRuntime) {
  super(runtime);
  
  const token = runtime.getSetting("SERVICE_TOKEN");
  if (!token) {
    runtime.logger.warn("Service token not configured");
    this.client = null;
    return;
  }
  
  // Initialize with token
  this.initializeClient(token);
}
```

### Error Recovery

Implement retry logic and error recovery:

```typescript
private async connectWithRetry(maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await this.client.connect();
      this.runtime.logger.info('Service connected successfully');
      return;
    } catch (error) {
      this.runtime.logger.error(`Connection attempt ${i + 1} failed:`, error);
      
      if (i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000; // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
}
```

### Graceful Shutdown

Ensure proper cleanup on service stop:

```typescript
async stop() {
  try {
    // Stop accepting new work
    this.accepting = false;
    
    // Wait for ongoing work to complete
    await this.waitForCompletion();
    
    // Close connections
    await this.client?.disconnect();
    
    // Clear timers
    if (this.interval) {
      clearInterval(this.interval);
    }
    
    // Clear caches
    this.cache?.clear();
    
    this.runtime.logger.info('Service stopped gracefully');
  } catch (error) {
    this.runtime.logger.error('Error during service shutdown:', error);
    // Force cleanup
    this.forceCleanup();
  }
}
```

## Best Practices

### Service Design

- **Single Responsibility**: Each service should have one clear purpose
- **Stateless When Possible**: Avoid maintaining state that could be lost
- **Idempotent Operations**: Operations should be safe to retry
- **Resource Management**: Clean up resources properly
- **Error Isolation**: Errors shouldn't crash other services

### Configuration

- **Environment Variables**: Use for sensitive configuration
- **Graceful Defaults**: Provide sensible defaults
- **Validation**: Validate configuration on startup
- **Hot Reload**: Support configuration updates without restart

### Performance

- **Async Operations**: Use async/await for non-blocking operations
- **Connection Pooling**: Reuse connections when possible
- **Caching**: Cache frequently accessed data
- **Rate Limiting**: Respect external API limits
- **Monitoring**: Log performance metrics

### Reliability

- **Health Checks**: Implement health check endpoints
- **Circuit Breakers**: Prevent cascade failures
- **Retry Logic**: Handle transient failures
- **Graceful Degradation**: Continue with reduced functionality
- **Audit Logging**: Log important operations

## Common Services

| Service | Purpose | Example Plugin |
|---------|---------|----------------|
| Platform Services | Connect to chat platforms | Discord, Telegram, Twitter |
| Model Services | AI model providers | OpenAI, Anthropic, Ollama |
| Data Services | External data sources | Web search, SQL, APIs |
| Media Services | Process media | TTS, image generation, transcription |
| Background Services | Scheduled tasks | Task runner, cron jobs |
| Monitoring Services | System monitoring | Metrics, logging, alerting |

## Model Context Protocol (MCP) Services

MCP (Model Context Protocol) allows your ElizaOS agent to use external tools and services. Think of it as giving your agent abilities like web search, file access, or API connections.

### MCP Plugin Setup

```bash
bun add @elizaos/plugin-mcp
```
```