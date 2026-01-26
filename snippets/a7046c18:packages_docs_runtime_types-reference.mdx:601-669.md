# a7046c18:packages_docs_runtime_types-reference.mdx:601-669

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/runtime/types-reference.mdx:601-669
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  cachedTokens?: number;
}
```

### TextStreamResult

```typescript
interface TextStreamResult {
  text: string;
  usage?: TokenUsage;

  // Async iterator for streaming
  [Symbol.asyncIterator](): AsyncIterator<TextStreamChunk>;
}

interface TextStreamChunk {
  text: string;
  isFirst?: boolean;
  isLast?: boolean;
}
```

### Model Settings

```typescript
const MODEL_SETTINGS = {
  TEXT_SMALL: {
    maxTokens: 4096,
    temperature: 0.7,
  },
  TEXT_LARGE: {
    maxTokens: 8192,
    temperature: 0.7,
  },
  TEXT_REASONING: {
    maxTokens: 16384,
    temperature: 0.3,
  },
  // ...
} as const;
```

### isStreamableModelType

Type guard for streaming-capable models:

```typescript
function isStreamableModelType(type: ModelTypeName): boolean;
// Returns true for: TEXT_SMALL, TEXT_LARGE, TEXT_REASONING_*
```

---

## See Also

<CardGroup cols={2}>
  <Card title="Core Runtime" icon="microchip" href="/runtime/core">
    Runtime interface and lifecycle
  </Card>
  <Card title="Events" icon="bolt" href="/runtime/events">
    Event system and payloads
  </Card>
  <Card title="Services" icon="server" href="/runtime/services">
    Service types and patterns
  </Card>
  <Card title="Plugin Reference" icon="puzzle-piece" href="/plugins/reference">
    Plugin interface definitions
  </Card>
</CardGroup>
```