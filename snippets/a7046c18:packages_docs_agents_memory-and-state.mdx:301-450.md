# a7046c18:packages_docs_agents_memory-and-state.mdx:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/agents/memory-and-state.mdx:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    this.buffer = [];
  }
}
```

### Long-term Memory

Persistent storage of important information:

```typescript
// Long-term memories are marked and preserved
interface LongTermMemory extends Memory {
  metadata: {
    type: 'long_term';
    importance: number;
    lastAccessed: number;
    accessCount: number;
  };
}

// Consolidation process
async function consolidateToLongTerm(
  runtime: IAgentRuntime,
  memory: Memory
): Promise<void> {
  if (shouldConsolidate(memory)) {
    await runtime.updateMemory({
      ...memory,
      metadata: {
        ...memory.metadata,
        type: 'long_term',
        importance: calculateImportance(memory),
        consolidatedAt: Date.now()
      }
    });
  }
}
```

### Knowledge Memory

Static and dynamic knowledge:

```typescript
// Knowledge loaded from character configuration
const staticKnowledge = character.knowledge || [];

// Dynamic knowledge learned during interactions
async function learnFact(runtime: IAgentRuntime, fact: string) {
  await runtime.createMemory({
    content: {
      text: fact,
      metadata: {
        type: 'knowledge',
        learned: true,
        confidence: 0.9
      }
    },
    roomId: 'knowledge-base',
    entityId: runtime.agentId
  });
}

// Retrieving knowledge
async function getKnowledge(runtime: IAgentRuntime, topic: string) {
  return await runtime.searchMemories({
    query: topic,
    filter: {
      'metadata.type': 'knowledge'
    },
    match_threshold: 0.7
  });
}
```

## Memory Operations

### Creating Memories

Best practices for memory creation:

```typescript
// Complete memory creation with all metadata
async function createRichMemory(
  runtime: IAgentRuntime,
  content: string,
  context: any
): Promise<UUID> {
  const memory: CreateMemory = {
    agentId: runtime.agentId,
    entityId: context.userId,
    roomId: context.roomId,
    content: {
      text: content,
      actions: context.actions || [],
      inReplyTo: context.replyTo,
      metadata: {
        source: context.source,
        platform: context.platform,
        sentiment: analyzeSentiment(content),
        topics: extractTopics(content),
        entities: extractEntities(content)
      }
    },
    // Pre-compute embedding for better performance
    embedding: await runtime.embed(content)
  };
  
  return await runtime.createMemory(memory);
}
```

### Retrieving Memories

Efficient retrieval patterns:

```typescript
// Paginated retrieval for large conversations
async function getPaginatedMemories(
  runtime: IAgentRuntime,
  roomId: UUID,
  page: number = 1,
  pageSize: number = 20
) {
  const offset = (page - 1) * pageSize;
  return await runtime.getMemories({
    roomId,
    count: pageSize,
    offset
  });
}

// Filtered retrieval
async function getFilteredMemories(
  runtime: IAgentRuntime,
  filters: MemoryFilters
) {
  return await runtime.getMemories({
    roomId: filters.roomId,
    entityId: filters.entityId,
    start: filters.startDate,
    end: filters.endDate,
    filter: {
      'content.actions': { $contains: filters.action },
      'metadata.sentiment': filters.sentiment
    }
  });
}
```

```