# a7046c18:packages_docs_agents_memory-and-state.mdx:901-1015

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/agents/memory-and-state.mdx:901-1015
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  }
  
  return await runtime.getMemories({
    spaceId,
    visibility: ['public', runtime.agentId]
  });
}

// Memory synchronization
async function syncMemories(
  runtime: IAgentRuntime,
  otherAgentId: UUID
) {
  const sharedSpace = await runtime.getSharedSpace(otherAgentId);
  const updates = await runtime.getMemoryUpdates(sharedSpace.lastSync);
  
  for (const update of updates) {
    await runtime.applyMemoryUpdate(update);
  }
  
  sharedSpace.lastSync = Date.now();
}
```

## Best Practices

1. **Always provide embeddings**: Pre-compute embeddings when creating memories for better search performance
2. **Use appropriate retrieval methods**: Semantic search for meaning, recency for context, filters for precision
3. **Implement memory hygiene**: Regular pruning and consolidation to maintain performance
4. **Cache strategically**: Multi-level caching for frequently accessed memories
5. **Batch operations**: Process multiple memories together when possible
6. **Index appropriately**: Create indexes for common query patterns
7. **Monitor memory growth**: Track memory usage and implement limits
8. **Preserve important memories**: Mark and protect critical information from pruning
9. **Version memory schemas**: Plan for memory structure evolution
10. **Test retrieval accuracy**: Regularly evaluate search relevance

## Troubleshooting

### Common Issues

#### Memory Search Not Finding Expected Results

```typescript
// Debug search issues
async function debugSearch(runtime: IAgentRuntime, query: string) {
  // Check embedding generation
  const embedding = await runtime.embed(query);
  console.log('Query embedding:', embedding.slice(0, 5));
  
  // Test with different thresholds
  const thresholds = [0.9, 0.8, 0.7, 0.6, 0.5];
  for (const threshold of thresholds) {
    const results = await runtime.searchMemories({
      embedding,
      match_threshold: threshold,
      count: 5
    });
    console.log(`Threshold ${threshold}: ${results.length} results`);
  }
  
  // Check if memories exist at all
  const allMemories = await runtime.getMemories({ count: 100 });
  console.log(`Total memories: ${allMemories.length}`);
}
```

#### Memory Leaks

```typescript
// Monitor memory usage
class MemoryMonitor {
  private metrics = {
    totalMemories: 0,
    averageSize: 0,
    growthRate: 0
  };
  
  async monitor(runtime: IAgentRuntime) {
    setInterval(async () => {
      const stats = await runtime.getMemoryStats();
      
      this.metrics = {
        totalMemories: stats.count,
        averageSize: stats.totalSize / stats.count,
        growthRate: (stats.count - this.metrics.totalMemories) / this.metrics.totalMemories
      };
      
      if (this.metrics.growthRate > 0.1) {  // 10% growth
        console.warn('High memory growth detected:', this.metrics);
      }
    }, 60000);  // Check every minute
  }
}
```

## See Also

<CardGroup cols={2}>
  <Card title="Character Interface" icon="code" href="/agents/character-interface">
    Define your agent's character configuration
  </Card>
  
  <Card title="Personality & Behavior" icon="user" href="/agents/personality-and-behavior">
    Craft unique agent personalities
  </Card>
  
  <Card title="Runtime & Lifecycle" icon="play" href="/agents/runtime-and-lifecycle">
    Learn how memory integrates with the runtime
  </Card>
  
  <Card title="Plugin Development" icon="puzzle" href="/plugins/development">
    Build providers that contribute to state
  </Card>
</CardGroup>
```