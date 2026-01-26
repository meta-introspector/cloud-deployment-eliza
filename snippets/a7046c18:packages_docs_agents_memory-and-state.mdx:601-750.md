# a7046c18:packages_docs_agents_memory-and-state.mdx:601-750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/agents/memory-and-state.mdx:601-750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
interface StateData {
  room?: Room;                  // Cached room data
  world?: World;                // Cached world data
  entity?: Entity;              // Cached entity data
  providers?: Record<string, Record<string, unknown>>; // Provider results cache
  actionPlan?: ActionPlan;      // Current multi-step action plan
  actionResults?: ActionResult[]; // Previous action results
  [key: string]: unknown;       // Dynamic properties
}
```

### State Updates

Managing state changes:

```typescript
class StateManager {
  private currentState: State;
  private stateHistory: State[] = [];
  private maxHistory = 10;
  
  async updateState(runtime: IAgentRuntime, trigger: Memory) {
    // Save current state to history
    this.stateHistory.push(this.currentState);
    if (this.stateHistory.length > this.maxHistory) {
      this.stateHistory.shift();
    }
    
    // Build new state
    this.currentState = await this.buildState(runtime, trigger);
    
    // Notify listeners
    this.emitStateChange(this.currentState);
    
    return this.currentState;
  }
  
  private async buildState(
    runtime: IAgentRuntime,
    trigger: Memory
  ): Promise<State> {
    // Get relevant memories
    const memories = await runtime.getMemories({
      roomId: trigger.roomId,
      count: 20
    });
    
    // Get provider data
    const providers = await this.gatherProviderData(runtime, trigger);
    
    // Compose final state
    return runtime.composeState({
      messages: memories,
      providers,
      trigger
    });
  }
}
```

## Performance Optimization

### Memory Pruning

Strategies for managing memory size:

```typescript
// Time-based pruning
async function pruneOldMemories(
  runtime: IAgentRuntime,
  maxAge: number = 30 * 24 * 60 * 60 * 1000 // 30 days
) {
  const cutoff = Date.now() - maxAge;
  
  await runtime.deleteMemories({
    filter: {
      createdAt: { $lt: cutoff },
      'metadata.type': { $ne: 'long_term' }  // Preserve long-term
    }
  });
}

// Importance-based pruning
async function pruneByImportance(
  runtime: IAgentRuntime,
  maxMemories: number = 10000
) {
  const memories = await runtime.getAllMemories();
  
  if (memories.length <= maxMemories) return;
  
  // Score and sort memories
  const scored = memories.map(m => ({
    memory: m,
    score: calculateImportanceScore(m)
  }));
  
  scored.sort((a, b) => b.score - a.score);
  
  // Keep top memories, delete rest
  const toDelete = scored.slice(maxMemories);
  for (const item of toDelete) {
    await runtime.deleteMemory(item.memory.id);
  }
}
```

### Caching Strategies

Multi-level caching for performance:

```typescript
class MemoryCache {
  private l1Cache = new Map<UUID, Memory>();    // Hot cache (in-memory)
  private l2Cache = new LRUCache<UUID, Memory>({  // Warm cache
    max: 1000,
    ttl: 5 * 60 * 1000  // 5 minutes
  });
  
  async get(id: UUID): Promise<Memory | null> {
    // Check L1
    if (this.l1Cache.has(id)) {
      return this.l1Cache.get(id);
    }
    
    // Check L2
    const l2Result = this.l2Cache.get(id);
    if (l2Result) {
      this.l1Cache.set(id, l2Result);  // Promote to L1
      return l2Result;
    }
    
    // Fetch from database
    const memory = await this.fetchFromDB(id);
    if (memory) {
      this.cache(memory);
    }
    
    return memory;
  }
  
  private cache(memory: Memory) {
    this.l1Cache.set(memory.id, memory);
    this.l2Cache.set(memory.id, memory);
    
    // Manage L1 size
    if (this.l1Cache.size > 100) {
      const oldest = this.l1Cache.keys().next().value;
      this.l1Cache.delete(oldest);
    }
```