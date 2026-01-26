# a7046c18:packages_docs_runtime_types-reference.mdx:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/runtime/types-reference.mdx:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  roomId?: UUID;
  startTime: number;
  endTime?: number;
  status: 'started' | 'completed' | 'failed' | 'timeout';
  error?: string;
}
```

### ActionEventPayload

Emitted on action start/complete:

```typescript
interface ActionEventPayload extends EventPayload {
  action: string;
  content: Content;
  roomId: UUID;
  messageId: UUID;
  status: 'started' | 'completed' | 'failed';
  result?: ActionResult;
  error?: string;
  duration?: number;
}
```

### EvaluatorEventPayload

```typescript
interface EvaluatorEventPayload extends EventPayload {
  evaluator: string;
  roomId: UUID;
  messageId: UUID;
  status: 'started' | 'completed' | 'failed';
  result?: unknown;
  duration?: number;
}
```

### ModelEventPayload

Emitted on model usage:

```typescript
interface ModelEventPayload extends EventPayload {
  modelType: ModelTypeName;
  provider: string;
  model: string;
  tokens?: TokenUsage;
  duration?: number;
  cached?: boolean;
}
```

### EmbeddingGenerationPayload

```typescript
interface EmbeddingGenerationPayload extends EventPayload {
  memoryId: UUID;
  priority: 'high' | 'normal' | 'low';
  status: 'requested' | 'completed' | 'failed';
  error?: string;
}
```

---

## Database Types

### Log & LogBody

```typescript
interface Log {
  id: UUID;
  agentId: UUID;
  roomId?: UUID;
  entityId?: UUID;
  type: 'action' | 'evaluator' | 'model' | 'embedding';
  body: LogBody;
  createdAt: number;
}

// Discriminated union for log body types
type LogBody = ActionLogBody | EvaluatorLogBody | ModelLogBody | EmbeddingLogBody;

interface ActionLogBody {
  type: 'action';
  action: string;
  input: Content;
  output?: ActionResult;
  duration: number;
  success: boolean;
  error?: string;
}

interface ModelLogBody {
  type: 'model';
  modelType: ModelTypeName;
  provider: string;
  model: string;
  tokens: TokenUsage;
  duration: number;
  cached: boolean;
}
```

### AgentRunSummary

Analytics for agent runs:

```typescript
interface AgentRunSummary {
  runId: UUID;
  agentId: UUID;
  roomId?: UUID;
  startTime: number;
  endTime: number;
  status: RunStatus;
  actionsExecuted: number;
  messagesProcessed: number;
  tokensUsed: TokenUsage;
  errors: string[];
}

type RunStatus = 'completed' | 'failed' | 'timeout' | 'cancelled';
```

### Memory Options

```typescript
interface MemoryRetrievalOptions {
  roomId?: UUID;
  entityId?: UUID;
  limit?: number;
  before?: number;
  after?: number;
  types?: MemoryType[];
}

interface MemorySearchOptions extends MemoryRetrievalOptions {
  query: string;
  threshold?: number;  // Similarity threshold (0-1)
  embedding?: number[];
}

interface EmbeddingSearchResult {
  memory: Memory;
  similarity: number;
}
```

```