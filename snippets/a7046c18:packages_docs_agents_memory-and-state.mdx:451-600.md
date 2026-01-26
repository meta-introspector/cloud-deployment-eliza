# a7046c18:packages_docs_agents_memory-and-state.mdx:451-600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/agents/memory-and-state.mdx:451-600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
### Searching Memories

Advanced search capabilities:

```typescript
// Semantic search with embeddings
async function semanticSearch(
  runtime: IAgentRuntime,
  query: string,
  options: SearchOptions = {}
): Promise<Memory[]> {
  const embedding = await runtime.embed(query);

  // Signature: searchMemories(params: { embedding, query?, match_threshold?, count?, roomId? })
  return await runtime.searchMemories({
    embedding,
    match_threshold: options.threshold || 0.75,
    count: options.limit || 10,
    roomId: options.roomId
  });
}

// Hybrid search combining semantic and keyword
async function hybridSearch(
  runtime: IAgentRuntime,
  query: string
): Promise<Memory[]> {
  // Semantic search
  const semantic = await semanticSearch(runtime, query);
  
  // Keyword search
  const keywords = extractKeywords(query);
  const keyword = await runtime.searchMemories({
    text: keywords.join(' OR '),
    count: 10
  });
  
  // Combine and rank
  return rankSearchResults([...semantic, ...keyword]);
}
```

## Embeddings and Vectors

### Embedding Generation

How and when embeddings are created:

```typescript
// Automatic embedding generation
class EmbeddingManager {
  private model: EmbeddingModel;
  private cache = new Map<string, number[]>();
  
  async generateEmbedding(text: string): Promise<number[]> {
    // Check cache first
    const cached = this.cache.get(text);
    if (cached) return cached;
    
    // Generate new embedding
    const embedding = await this.model.embed(text);
    
    // Cache for reuse
    this.cache.set(text, embedding);
    
    return embedding;
  }
  
  // Batch processing for efficiency
  async generateBatch(texts: string[]): Promise<number[][]> {
    const uncached = texts.filter(t => !this.cache.has(t));
    
    if (uncached.length > 0) {
      const embeddings = await this.model.embedBatch(uncached);
      uncached.forEach((text, i) => {
        this.cache.set(text, embeddings[i]);
      });
    }
    
    return texts.map(t => this.cache.get(t)!);
  }
}
```

### Vector Search

Efficient similarity search:

```typescript
// Vector similarity calculation
function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Optimized vector search with indexing
class VectorIndex {
  private index: AnnoyIndex;  // Approximate nearest neighbor
  
  async search(
    query: number[],
    k: number = 10
  ): Promise<SearchResult[]> {
    const neighbors = await this.index.getNearestNeighbors(query, k);
    
    return neighbors.map(n => ({
      id: n.id,
      similarity: n.distance,
      memory: this.getMemory(n.id)
    }));
  }
  
  // Periodic index rebuilding for new memories
  async rebuild() {
    const memories = await this.getAllMemories();
    this.index = new AnnoyIndex(memories);
    await this.index.build();
  }
}
```

## State Management

### State Structure

The complete state object:

```typescript
// State is defined in packages/core/src/types/state.ts
interface State {
  [key: string]: unknown;       // Dynamic properties allowed

  values: {                     // Key-value store populated by providers
    [key: string]: unknown;
  };

  data: StateData;              // Structured data cache

  text: string;                 // Formatted text representation
}

```