# a7046c18:packages_docs_agents_memory-and-state.mdx:751-900

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/agents/memory-and-state.mdx:751-900
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  }
}
```

### Database Optimization

Query optimization techniques:

```typescript
// Indexed queries
interface MemoryIndexes {
  roomId: BTreeIndex;
  entityId: BTreeIndex;
  createdAt: BTreeIndex;
  embedding: IVFIndex;  // Inverted file index for vectors
}

// Batch operations
async function batchCreateMemories(
  runtime: IAgentRuntime,
  memories: CreateMemory[]
): Promise<UUID[]> {
  // Generate embeddings in batch
  const texts = memories.map(m => m.content.text);
  const embeddings = await runtime.embedBatch(texts);
  
  // Prepare batch insert
  const enriched = memories.map((m, i) => ({
    ...m,
    embedding: embeddings[i]
  }));
  
  // Single database transaction
  return await runtime.batchCreateMemories(enriched);
}
```

## Advanced Patterns

### Memory Networks

Building relationships between memories:

```typescript
// Memory graph structure
interface MemoryNode {
  memory: Memory;
  connections: {
    causes: UUID[];      // Memories that led to this
    effects: UUID[];     // Memories caused by this
    related: UUID[];     // Thematically related
    references: UUID[];  // Explicit references
  };
}

// Building memory graphs
async function buildMemoryGraph(
  runtime: IAgentRuntime,
  rootMemoryId: UUID
): Promise<MemoryGraph> {
  const visited = new Set<UUID>();
  const graph = new Map<UUID, MemoryNode>();
  
  async function traverse(memoryId: UUID, depth: number = 0) {
    if (visited.has(memoryId) || depth > 3) return;
    visited.add(memoryId);
    
    const memory = await runtime.getMemory(memoryId);
    const connections = await findConnections(runtime, memory);
    
    graph.set(memoryId, {
      memory,
      connections
    });
    
    // Recursively traverse connections
    for (const connectedId of Object.values(connections).flat()) {
      await traverse(connectedId, depth + 1);
    }
  }
  
  await traverse(rootMemoryId);
  return graph;
}
```

### Temporal Patterns

Time-aware memory retrieval:

```typescript
// Temporal memory windows
async function getTemporalContext(
  runtime: IAgentRuntime,
  timestamp: number,
  windowSize: number = 60 * 60 * 1000  // 1 hour
) {
  return await runtime.getMemories({
    start: timestamp - windowSize / 2,
    end: timestamp + windowSize / 2,
    orderBy: 'createdAt'
  });
}

// Memory decay modeling
function calculateMemoryRelevance(
  memory: Memory,
  currentTime: number
): number {
  const age = currentTime - memory.createdAt;
  const halfLife = 7 * 24 * 60 * 60 * 1000;  // 1 week
  
  // Exponential decay with importance modifier
  const decay = Math.exp(-age / halfLife);
  const importance = memory.metadata?.importance || 0.5;
  
  return decay * importance;
}
```

### Multi-agent Memory

Shared memory spaces between agents:

```typescript
// Shared memory pool
interface SharedMemorySpace {
  id: UUID;
  agents: UUID[];
  visibility: 'public' | 'private' | 'selective';
  permissions: {
    [agentId: string]: {
      read: boolean;
      write: boolean;
      delete: boolean;
    };
  };
}

// Accessing shared memories
async function getSharedMemories(
  runtime: IAgentRuntime,
  spaceId: UUID
): Promise<Memory[]> {
  // Check permissions
  const space = await runtime.getSharedSpace(spaceId);
  const permissions = space.permissions[runtime.agentId];
  
  if (!permissions?.read) {
    throw new Error('No read access to shared space');
```