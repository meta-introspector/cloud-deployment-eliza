# a7046c18:packages_docs_agents_memory-and-state.mdx:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/agents/memory-and-state.mdx:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  
  // Dynamically adjust based on token limits
  // Actual signature: composeState(message: Memory, includeList?: string[], onlyInclude?: boolean, skipCache?: boolean)
  async composeState(message: Memory): Promise<State> {
    const memories = await this.getMemories({
      roomId,
      count: this.#conversationLength
    });
    
    // Token counting and pruning
    let tokenCount = 0;
    const maxTokens = 4000; // Leave room for response
    const prunedMemories = [];
    
    for (const memory of memories) {
      const tokens = estimateTokens(memory.content.text);
      if (tokenCount + tokens > maxTokens) break;
      tokenCount += tokens;
      prunedMemories.push(memory);
    }
    
    return this.composeState(prunedMemories);
  }
}
```

### Context Selection Strategies

#### Recency-Based

Most recent messages are most relevant:

```typescript
const recentContext = await runtime.getMemories({
  roomId: roomId,
  count: 20,
  orderBy: 'createdAt',
  direction: 'DESC'
});
```

#### Importance-Based

Prioritize important memories:

```typescript
// Importance scoring based on:
// - User reactions
// - Agent actions taken
// - Explicit markers
const importantMemories = await runtime.searchMemories({
  roomId: roomId,
  filter: {
    importance: { $gte: 0.8 }
  },
  count: 10
});
```

#### Hybrid Approach

Combine recent and important:

```typescript
async function getHybridContext(runtime: IAgentRuntime, roomId: UUID) {
  // Get recent messages for immediate context
  const recent = await runtime.getMemories({
    roomId,
    count: 10
  });
  
  // Get important historical context
  const important = await runtime.searchMemories({
    roomId,
    query: "important decisions, key information, user preferences",
    match_threshold: 0.7,
    count: 5
  });
  
  // Combine and deduplicate
  const combined = [...recent, ...important];
  return deduplicateMemories(combined);
}
```

### State Composition

State composition brings together memories and provider data:

```typescript
// The runtime's state composition pipeline
interface State {
  [key: string]: unknown;       // Dynamic properties
  values: {                     // Key-value store for state variables
    [key: string]: unknown;
  };
  data: StateData;              // Structured data cache (room, world, entity, providers)
  text: string;                 // String representation of context
}

interface StateData {
  room?: Room;                  // Cached room data
  world?: World;                // Cached world data
  entity?: Entity;              // Cached entity data
  providers?: Record<string, Record<string, unknown>>; // Provider results
  actionPlan?: ActionPlan;      // Current action plan
  actionResults?: ActionResult[]; // Previous action results
  [key: string]: unknown;       // Allow dynamic properties
}

// Provider contribution to state
export const userContextProvider: Provider = {
  name: 'userContext',
  get: async (runtime, message, state) => {
    const userProfile = await runtime.getEntity(message.entityId);
    return {
      text: `User: ${userProfile.name}`,
      data: {
        preferences: userProfile.metadata?.preferences,
        history: userProfile.metadata?.interactionCount
      }
    };
  }
};
```

## Memory Types

### Short-term Memory

Working memory for immediate tasks:

```typescript
// Short-term memory is typically the current conversation
class WorkingMemory {
  private buffer: Memory[] = [];
  private maxSize = 50;
  
  add(memory: Memory) {
    this.buffer.push(memory);
    if (this.buffer.length > this.maxSize) {
      this.buffer.shift(); // Remove oldest
    }
  }
  
  getRecent(count: number): Memory[] {
    return this.buffer.slice(-count);
  }
  
  clear() {
```