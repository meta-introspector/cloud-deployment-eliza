# a7046c18:packages_docs_runtime_core.mdx:601-750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/runtime/core.mdx:601-750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  // Start a run (optionally scoped to a room)
  startRun(roomId?: UUID): UUID;

  // End the current run
  endRun(): void;

  // Get the current active run ID
  getCurrentRunId(): UUID;
}
```

**Usage:**

```typescript
// Start tracking a run
const runId = runtime.startRun(roomId);

try {
  // Process messages, actions execute within this run
  await runtime.processActions(message, responses, state);

  // Get results from actions executed in this run
  const results = runtime.getActionResults(message.id);

} finally {
  // Always end the run
  runtime.endRun();
}
```

### Action Results

Retrieve results from executed actions for action chaining:

```typescript
// Get all action results for a specific message
getActionResults(messageId: UUID): ActionResult[];
```

**Example - Action chaining:**

```typescript
// First action generates data
const results = runtime.getActionResults(message.id);

// Second action uses results from first
const previousData = results.find(r => r.action === 'SEARCH_WEB');
if (previousData?.success) {
  // Use previousData.data in next action
}
```

### Embedding Generation

Queue memories for async embedding generation:

```typescript
// Non-blocking - queues for background processing
queueEmbeddingGeneration(
  memory: Memory,
  priority?: 'high' | 'normal' | 'low'
): Promise<void>;

// Blocking - adds embedding synchronously
addEmbeddingToMemory(memory: Memory): Promise<Memory>;
```

**Priority levels:**
- `high` - Immediate processing (user queries)
- `normal` - Default priority (conversations)
- `low` - Background processing (bulk imports)

```typescript
// Queue high-priority embedding for user query
await runtime.queueEmbeddingGeneration(userMessage, 'high');

// Queue low-priority for background knowledge
await runtime.queueEmbeddingGeneration(knowledgeDoc, 'low');
```

### Conversation Length

Get the current conversation length setting:

```typescript
getConversationLength(): number;
```

Returns the configured maximum conversation length from character settings.

### Service Management

Advanced service discovery and management:

```typescript
interface IAgentRuntime {
  // Get all registered services by type
  getAllServices(): Map<ServiceTypeName, Service[]>;

  // Get all registered service type names
  getRegisteredServiceTypes(): ServiceTypeName[];

  // Get multiple services of the same type
  getServicesByType<T extends Service>(type: ServiceTypeName): T[];

  // Wait for a service to finish loading
  getServiceLoadPromise(serviceType: ServiceTypeName): Promise<Service>;

  // Check if service exists
  hasService(serviceType: ServiceTypeName): boolean;
}
```

**Example - Wait for service:**

```typescript
// Wait for database service to be ready
const dbService = await runtime.getServiceLoadPromise(ServiceType.DATABASE);

// Get all speech services
const speechServices = runtime.getServicesByType(ServiceType.SPEECH);

// Check available service types
const types = runtime.getRegisteredServiceTypes();
// ['DATABASE', 'SPEECH', 'VIDEO', 'TRANSCRIPTION', ...]
```

### ElizaOS Type Guard

Check if the runtime has an ElizaOS instance attached:

```typescript
hasElizaOS(): this is IAgentRuntime & { elizaOS: IElizaOS };
```

**Usage:**

```typescript
if (runtime.hasElizaOS()) {
  // TypeScript knows runtime.elizaOS is defined here
  const elizaOS = runtime.elizaOS;

  // Send message to another agent
  await elizaOS.handleMessage(otherAgentId, {
    entityId: message.entityId,
    roomId: message.roomId,
    content: { text: 'Forwarded message', source: 'internal' }
  });
}
```
```