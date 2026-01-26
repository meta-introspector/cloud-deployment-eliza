# a7046c18:packages_docs_runtime_memory.mdx:451-600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/runtime/memory.mdx:451-600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
const chunks = await runtime.getDocumentChunks(
  documentId,
  { relevant_to: "specific query" }
);
```

## Memory Cleanup

### Automatic Cleanup

```typescript
class MemoryCleanupService {
  private readonly MAX_MESSAGE_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days
  private readonly MAX_FACTS_PER_ROOM = 1000;
  
  async cleanup(runtime: IAgentRuntime) {
    // Remove old messages
    await this.cleanupOldMessages(runtime);
    
    // Consolidate facts
    await this.consolidateFacts(runtime);
    
    // Remove orphaned relationships
    await this.cleanupOrphanedRelationships(runtime);
  }
  
  private async cleanupOldMessages(runtime: IAgentRuntime) {
    const cutoffDate = new Date(Date.now() - this.MAX_MESSAGE_AGE);
    
    await runtime.deleteMemories({
      type: MemoryType.MESSAGE,
      before: cutoffDate
    });
  }
  
  private async consolidateFacts(runtime: IAgentRuntime) {
    const rooms = await runtime.getAllRooms();
    
    for (const room of rooms) {
      const facts = await runtime.getFacts({ roomId: room.id });
      
      if (facts.length > this.MAX_FACTS_PER_ROOM) {
        // Keep only high-confidence recent facts
        const toKeep = facts
          .sort((a, b) => {
            const scoreA = a.confidence * (1 / (Date.now() - a.createdAt));
            const scoreB = b.confidence * (1 / (Date.now() - b.createdAt));
            return scoreB - scoreA;
          })
          .slice(0, this.MAX_FACTS_PER_ROOM);
        
        const toDelete = facts.filter(f => !toKeep.includes(f));
        for (const fact of toDelete) {
          await runtime.deleteMemory(fact.id);
        }
      }
    }
  }
}
```

### Manual Cleanup

```typescript
// Delete specific memories
await runtime.deleteMemory(memoryId);

// Bulk delete
await runtime.deleteMemories({
  type: MemoryType.MESSAGE,
  roomId: roomId,
  before: cutoffDate
});

// Clear room memories
await runtime.clearRoomMemories(roomId);
```

## Memory Optimization

### Indexing Strategies

```typescript
// Database indexes for performance
CREATE INDEX idx_memories_room_type ON memories(roomId, type);
CREATE INDEX idx_memories_user_created ON memories(userId, createdAt);
CREATE INDEX idx_memories_embedding ON memories USING ivfflat (embedding);
CREATE INDEX idx_facts_subject_predicate ON facts(subject, predicate);
```

### Batch Operations

```typescript
// Batch insert memories
await runtime.createMemoriesBatch([
  { type: MemoryType.MESSAGE, content: { text: "Message 1" }, roomId },
  { type: MemoryType.MESSAGE, content: { text: "Message 2" }, roomId },
  // ... more memories
]);

// Batch embedding generation
const texts = memories.map(m => m.content.text);
const embeddings = await runtime.useModel(
  ModelType.TEXT_EMBEDDING,
  { input: texts, batch: true }
);
```

### Memory Compression

```typescript
// Compress old memories
async function compressMemories(runtime: IAgentRuntime, roomId: UUID) {
  const messages = await runtime.getMemories({
    type: MemoryType.MESSAGE,
    roomId,
    before: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days
  });
  
  // Generate summary
  const summary = await runtime.useModel(
    ModelType.TEXT_LARGE,
    {
      prompt: `Summarize these messages: ${messages.map(m => m.content.text).join('\n')}`,
      maxTokens: 500
    }
  );
  
  // Store summary
  await runtime.createMemory({
    type: MemoryType.DOCUMENT,
    content: {
      text: summary,
      title: 'Conversation Summary',
      source: 'compressed_messages'
    },
    roomId,
    metadata: {
      originalCount: messages.length,
      dateRange: {
        start: messages[0].createdAt,
        end: messages[messages.length - 1].createdAt
      }
    }
  });
  
  // Delete original messages
  for (const message of messages) {
    await runtime.deleteMemory(message.id);
  }
```