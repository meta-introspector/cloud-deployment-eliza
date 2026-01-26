# a7046c18:packages_docs_runtime_core.mdx:751-879

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/runtime/core.mdx:751-879
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

### Connection Management

Batch setup of entities, rooms, and connections:

```typescript
// Setup multiple connections at once
ensureConnections(
  entities: Entity[],
  rooms: Room[],
  source: string,
  world: World
): Promise<void>;

// Setup single connection with full options
ensureConnection({
  entityId: UUID;
  roomId: UUID;
  userName?: string;
  name?: string;
  worldName?: string;
  source?: string;
  channelId?: string;
  messageServerId?: UUID;
  type?: ChannelType | string;
  worldId: UUID;
  userId?: UUID;
  metadata?: Record<string, unknown>;
}): Promise<void>;
```

**Example - Platform integration:**

```typescript
// Setup Discord server connection
await runtime.ensureConnection({
  entityId: discordUserId,
  roomId: channelRoomId,
  userName: 'user#1234',
  source: 'discord',
  channelId: discordChannelId,
  type: ChannelType.GROUP,
  worldId: serverWorldId,
  metadata: { roles: ['member', 'admin'] }
});
```

### World Management

Update world configuration:

```typescript
updateWorld(world: World): Promise<void>;
```

```typescript
// Update world settings
await runtime.updateWorld({
  id: worldId,
  name: 'Updated Server Name',
  metadata: {
    settings: { allowBots: true },
    features: ['voice', 'threads']
  }
});
```

### Message Routing

Register custom message handlers for different platforms:

```typescript
// Register a send handler for a platform
registerSendHandler(source: string, handler: SendHandlerFunction): void;

// Send message to a specific target
sendMessageToTarget(target: TargetInfo, content: Content): Promise<void>;
```

```typescript
// Register Discord message handler
// Handler signature: (runtime, target, content) => Promise<void>
runtime.registerSendHandler('discord', async (runtime, target, content) => {
  const channel = await discordClient.channels.fetch(target.channelId);
  await channel.send(content.text);
});

// Send message to target
await runtime.sendMessageToTarget(
  { source: 'discord', channelId: '123456', roomId },
  { text: 'Hello from agent!' }
);
```

## See Also

<CardGroup cols={2}>
  <Card title="Memory System" icon="brain" href="/runtime/memory">
    Learn about the fundamental storage layer
  </Card>

  <Card title="Events" icon="bolt" href="/runtime/events">
    Understand the communication backbone
  </Card>

  <Card title="Providers" icon="database" href="/runtime/providers">
    Explore how to supply data to the runtime
  </Card>

  <Card title="Models" icon="robot" href="/runtime/models">
    Discover AI model management
  </Card>

  <Card title="Streaming Responses" icon="wave-pulse" href="/guides/streaming-responses">
    Implement real-time streaming with SSE/WebSocket
  </Card>

  <Card title="Action Planning" icon="list-check" href="/guides/action-planning">
    Build multi-step action workflows
  </Card>

  <Card title="Background Tasks" icon="clock" href="/guides/background-tasks">
    Run async operations with task workers
  </Card>

  <Card title="Deploy to Cloud" icon="cloud" href="/guides/deploy-to-cloud">
    Ship your agent to production in minutes
  </Card>
</CardGroup>
```