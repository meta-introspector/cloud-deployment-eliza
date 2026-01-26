# a7046c18:packages_docs_runtime_memory.mdx:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/runtime/memory.mdx:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  relationshipType: string;
  strength: number;
  metadata?: {
    firstInteraction?: Date;
    lastInteraction?: Date;
    interactionCount?: number;
    sentiment?: number;
  };
}
```

### Managing Relationships

```typescript
// Create relationship
await runtime.createRelationship({
  userId: user.id,
  targetEntityId: otherUser.id,
  relationshipType: 'friend',
  strength: 0.8
});

// Get user relationships
const relationships = await runtime.getRelationships(userId);

// Update relationship strength
await runtime.updateRelationship(relationshipId, {
  strength: 0.9,
  metadata: {
    lastInteraction: new Date(),
    interactionCount: prevCount + 1
  }
});
```

## State Cache

### Cache Architecture

The runtime maintains an in-memory cache for composed states:

```typescript
class StateCache {
  private cache: Map<UUID, State>;
  private timestamps: Map<UUID, number>;
  private maxSize: number;
  private ttl: number;
  
  constructor(maxSize = 1000, ttl = 300000) { // 5 min TTL
    this.cache = new Map();
    this.timestamps = new Map();
    this.maxSize = maxSize;
    this.ttl = ttl;
  }
  
  set(messageId: UUID, state: State): void {
    // Evict oldest if at capacity
    if (this.cache.size >= this.maxSize) {
      const oldest = this.getOldestEntry();
      if (oldest) {
        this.cache.delete(oldest);
        this.timestamps.delete(oldest);
      }
    }
    
    this.cache.set(messageId, state);
    this.timestamps.set(messageId, Date.now());
  }
  
  get(messageId: UUID): State | undefined {
    const timestamp = this.timestamps.get(messageId);
    
    // Check if expired
    if (timestamp && Date.now() - timestamp > this.ttl) {
      this.cache.delete(messageId);
      this.timestamps.delete(messageId);
      return undefined;
    }
    
    return this.cache.get(messageId);
  }
}
```

### Cache Management

```typescript
// Clear old cache entries
function cleanupCache(runtime: IAgentRuntime) {
  const now = Date.now();
  const maxAge = 5 * 60 * 1000; // 5 minutes
  
  for (const [messageId, timestamp] of runtime.stateCache.timestamps) {
    if (now - timestamp > maxAge) {
      runtime.stateCache.delete(messageId);
    }
  }
}

// Schedule periodic cleanup
setInterval(() => cleanupCache(runtime), 60000);
```

## Document Storage

### Document Memory

```typescript
interface DocumentMemory extends Memory {
  type: MemoryType.DOCUMENT;
  content: {
    text: string;
    title?: string;
    source?: string;
    chunks?: string[];
    summary?: string;
  };
  embedding?: number[];
  metadata?: {
    mimeType?: string;
    size?: number;
    hash?: string;
    tags?: string[];
  };
}
```

### Document Operations

```typescript
// Store document
await runtime.createDocument({
  title: 'User Manual',
  content: documentText,
  source: 'https://example.com/manual.pdf',
  chunks: splitIntoChunks(documentText),
  metadata: {
    mimeType: 'application/pdf',
    size: 1024000,
    tags: ['manual', 'reference']
  }
});

// Search documents
const relevantDocs = await runtime.searchDocuments(
  "how to configure settings",
  { limit: 5 }
);

// Get document chunks
```