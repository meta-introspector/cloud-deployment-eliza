# a7046c18:packages_docs_plugin-registry_knowledge_complete-documentation.mdx:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/knowledge/complete-documentation.mdx:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  'text/markdown': (buffer) => buffer.toString('utf-8'),
  'application/json': (buffer) => JSON.stringify(JSON.parse(buffer.toString('utf-8')), null, 2)
};
```

### 3. Content-Based Deduplication

Uses deterministic IDs to prevent duplicates:

```typescript
// Generate content-based ID combining:
// - Content (first 2KB)
// - Agent ID
// - Filename (if available)
// - Content type
const contentBasedId = generateContentBasedId(content, agentId, {
  includeFilename: options.originalFilename,
  contentType: options.contentType,
  maxChars: 2000
});

// Check if document already exists
const existingDocument = await this.runtime.getMemoryById(contentBasedId);
if (existingDocument) {
  // Return existing document info instead of creating duplicate
  return { clientDocumentId: contentBasedId, ... };
}
```

### 4. Intelligent Chunking

Content-aware text splitting:

```typescript
const defaultChunkOptions = {
  chunkSize: 500,      // tokens
  overlapSize: 100,    // tokens
  separators: ['\n\n', '\n', '. ', ' '],
  keepSeparator: true
};

function chunkText(text: string, options: ChunkOptions): string[] {
  const chunks: string[] = [];
  let currentChunk = '';
  
  // Smart chunking logic that respects:
  // - Token limits
  // - Sentence boundaries
  // - Paragraph structure
  // - Code blocks
  
  return chunks;
}
```

### 5. Contextual Enrichment

Optional feature for better retrieval:

```typescript
// When CTX_KNOWLEDGE_ENABLED=true
async function enrichChunk(chunk: string, document: string): Promise<string> {
  const context = await generateContext(chunk, document);
  return `${context}\n\n${chunk}`;
}
```

### 6. Embedding Generation

Create vector embeddings:

```typescript
async function generateEmbeddings(chunks: string[]): Promise<number[][]> {
  const embeddings = await embedder.embedMany(chunks);
  return embeddings;
}

// Batch processing with rate limiting
const batchSize = 10;
for (let i = 0; i < chunks.length; i += batchSize) {
  const batch = chunks.slice(i, i + batchSize);
  const embeddings = await generateEmbeddings(batch);
  await storeEmbeddings(embeddings);
  
  // Rate limiting
  await sleep(1000);
}
```

### 7. Storage

Documents and embeddings are stored separately:

```typescript
// Document storage
{
  id: "doc_123",
  content: "Full document text",
  metadata: {
    source: "upload",
    filename: "report.pdf",
    createdAt: "2024-01-20T10:00:00Z",
    hash: "sha256_hash"
  }
}

// Vector storage
{
  id: "vec_456",
  documentId: "doc_123",
  chunkIndex: 0,
  embedding: [0.123, -0.456, ...],
  content: "Chunk text",
  metadata: {
    position: { start: 0, end: 500 }
  }
}
```

## Retrieval & RAG

### Semantic Search

Find relevant knowledge using vector similarity:

```typescript
async function searchKnowledge(query: string, limit: number = 10): Promise<KnowledgeItem[]> {
  // Generate query embedding
  const queryEmbedding = await embedder.embed(query);
  
  // Search vector store
  const results = await vectorStore.searchMemories({
    tableName: "knowledge_embeddings",
    agentId: runtime.agentId,
    embedding: queryEmbedding,
    match_threshold: 0.7,
    match_count: limit,
    unique: true
  });
  
  // Enrich with document metadata
  return results.map(result => ({
    id: result.id,
    content: result.content.text,
    score: result.similarity,
    metadata: result.metadata
  }));
}
```

```