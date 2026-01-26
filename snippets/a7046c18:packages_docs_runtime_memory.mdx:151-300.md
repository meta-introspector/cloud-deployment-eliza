# a7046c18:packages_docs_runtime_memory.mdx:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/runtime/memory.mdx:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
});
```

### Searching Memories

```typescript
// Text search with embeddings
const memories = await runtime.searchMemories(
  "previous conversation about colors",
  10 // limit
);

// Search with filters
const facts = await runtime.searchMemories({
  query: "user preferences",
  type: MemoryType.FACT,
  roomId: currentRoom.id,
  limit: 5
});

// Search by time range
const recentMessages = await runtime.searchMemories({
  type: MemoryType.MESSAGE,
  roomId: currentRoom.id,
  after: new Date(Date.now() - 3600000), // Last hour
  limit: 20
});
```

### Memory Retrieval

```typescript
// Get specific memory
const memory = await runtime.getMemoryById(memoryId);

// Get memories by room
const roomMemories = await runtime.getMemoriesByRoom(
  roomId,
  { type: MemoryType.MESSAGE, limit: 50 }
);

// Get user memories
const userMemories = await runtime.getMemoriesByUser(
  userId,
  { type: MemoryType.FACT }
);
```

## Embeddings and Similarity

### Creating Embeddings

```typescript
// Generate embedding for text
const embedding = await runtime.useModel(
  ModelType.TEXT_EMBEDDING,
  { input: "Text to embed" }
);

// Store with embedding
await runtime.createMemory({
  type: MemoryType.MESSAGE,
  content: { text: "Important message" },
  embedding: embedding,
  roomId: message.roomId
});
```

### Similarity Search

```typescript
// Search by semantic similarity
const similarMemories = await runtime.searchMemoriesBySimilarity(
  embedding,
  {
    threshold: 0.8,  // Similarity threshold (0-1)
    limit: 10,
    type: MemoryType.MESSAGE
  }
);

// Find related facts
const queryEmbedding = await runtime.useModel(
  ModelType.TEXT_EMBEDDING,
  { input: "What does the user like?" }
);

const relatedFacts = await runtime.searchMemoriesBySimilarity(
  queryEmbedding,
  {
    type: MemoryType.FACT,
    threshold: 0.7,
    limit: 5
  }
);
```

## Facts and Knowledge

### Fact Extraction

Facts are automatically extracted from conversations:

```typescript
interface Fact extends Memory {
  type: MemoryType.FACT;
  content: {
    text: string;
    subject?: string;    // Entity the fact is about
    predicate?: string;  // Relationship or property
    object?: string;     // Value or related entity
    confidence?: number; // Extraction confidence
    source?: string;     // Source message ID
  };
}
```

### Fact Management

```typescript
// Create a fact
await runtime.createFact({
  subject: 'user',
  predicate: 'works_at',
  object: 'TechCorp',
  confidence: 0.95,
  source: message.id
});

// Query facts
const userFacts = await runtime.getFacts({
  subject: 'user',
  limit: 10
});

// Update fact confidence
await runtime.updateFact(factId, {
  confidence: 0.98
});
```

## Relationships

### Relationship Storage

```typescript
interface Relationship extends Memory {
  type: MemoryType.RELATIONSHIP;
  userId: UUID;
  targetEntityId: UUID;
```