# a7046c18:packages_docs_runtime_services.mdx:751-900

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/runtime/services.mdx:751-900
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  
  async start(runtime: IAgentRuntime) {
    const mcpConfig = runtime.getSetting('mcp');
    
    for (const [name, config] of Object.entries(mcpConfig.servers)) {
      if (config.type === 'stdio') {
        await this.startSTDIOServer(name, config);
      } else if (config.type === 'sse') {
        await this.startSSEServer(name, config);
      }
    }
  }
  
  private async startSTDIOServer(name: string, config: STDIOConfig) {
    const server = spawn(config.command, config.args, {
      env: { ...process.env, ...config.env }
    });
    
    this.servers.set(name, server);
    
    // Handle tool responses
    server.stdout.on('data', (data) => {
      this.handleToolResponse(name, data);
    });
  }
  
  private async startSSEServer(name: string, config: SSEConfig) {
    const eventSource = new EventSource(config.url);
    
    eventSource.onmessage = (event) => {
      this.handleToolResponse(name, event.data);
    };
    
    this.servers.set(name, eventSource);
  }
  
  async stop() {
    for (const [name, server] of this.servers) {
      if (server instanceof ChildProcess) {
        server.kill();
      } else if (server instanceof EventSource) {
        server.close();
      }
    }
  }
}
```

## Service Testing

### Unit Testing

Test services in isolation:

```typescript
describe('SearchService', () => {
  let service: SearchService;
  let runtime: MockRuntime;
  
  beforeEach(async () => {
    runtime = createMockRuntime();
    service = await SearchService.start(runtime);
  });
  
  afterEach(async () => {
    await service.stop();
  });
  
  it('should cache search results', async () => {
    const results1 = await service.search('test');
    const results2 = await service.search('test');
    
    expect(results1).toBe(results2); // Same object reference
  });
});
```

### Integration Testing

Test service interactions:

```typescript
it('should notify through multiple channels', async () => {
  const notificationService = runtime.getService('notification');
  const discordSpy = jest.spyOn(discordService, 'sendMessage');
  const telegramSpy = jest.spyOn(telegramService, 'sendMessage');
  
  await notificationService.notify('Test message');
  
  expect(discordSpy).toHaveBeenCalled();
  expect(telegramSpy).toHaveBeenCalled();
});
```

## Task Worker System

Task workers enable background task execution with scheduling, validation, and lifecycle management. Tasks are persisted in the database while workers are registered in-memory.

### Task Interface

```typescript
interface Task {
  id?: UUID;
  name: string;                    // Must match a registered TaskWorker.name
  description: string;
  roomId?: UUID;
  worldId?: UUID;
  entityId?: UUID;
  tags: string[];                  // Control tags: 'queue', 'repeat', etc.
  metadata?: TaskMetadata;
  updatedAt?: number;
}

interface TaskMetadata {
  updateInterval?: number;         // For recurring tasks (milliseconds)
  options?: { name: string; description: string }[];
  [key: string]: unknown;
}
```

### TaskWorker Interface

```typescript
interface TaskWorker {
  name: string;                    // Unique identifier

  execute: (
    runtime: IAgentRuntime,
    options: { [key: string]: unknown },
    task: Task
  ) => Promise<void>;

  validate?: (
    runtime: IAgentRuntime,
    message: Memory,
    state: State
  ) => Promise<boolean>;
}
```

### Registering Task Workers

```typescript
// In your plugin or service initialization
runtime.registerTaskWorker({
  name: 'SEND_DAILY_REPORT',

  validate: async (runtime, message, state) => {
    // Optional: Check if task should run
    return true;
```