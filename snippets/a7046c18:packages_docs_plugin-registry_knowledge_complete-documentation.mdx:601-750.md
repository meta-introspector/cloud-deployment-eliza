# a7046c18:packages_docs_plugin-registry_knowledge_complete-documentation.mdx:601-750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/knowledge/complete-documentation.mdx:601-750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  registerProcessor() {
    this.processors.set('application/custom', this.extractCustomFormat);
  }
}
```

### Performance Optimization

#### Rate Limiting

```typescript
const rateLimiter = {
  maxConcurrent: 5,
  requestsPerMinute: 60,
  tokensPerMinute: 40000
};
```

#### Batch Processing

```typescript
async function batchProcess(documents: Document[]) {
  const chunks = [];
  
  for (const batch of chunk(documents, 10)) {
    const results = await Promise.all(
      batch.map(doc => processDocument(doc))
    );
    chunks.push(...results);
    
    await sleep(1000); // Rate limiting
  }
  
  return chunks;
}
```

#### Memory Management

```typescript
// Clear cache periodically
setInterval(() => {
  knowledgeService.clearCache();
}, 3600000); // Every hour

// Stream large files
async function processLargeFile(path: string) {
  const stream = createReadStream(path);
  const chunks = [];
  
  for await (const chunk of stream) {
    chunks.push(await processChunk(chunk));
  }
  
  return chunks;
}
```

## Integration Patterns

### Basic Integration

```json
{
  "name": "SupportAgent",
  "plugins": ["@elizaos/plugin-knowledge"],
  "knowledge": [
    "Default knowledge statement 1",
    "Default knowledge statement 2"
  ]
}
```

### Configuration Options

```env
# Enable automatic document loading from agent's docs folder
LOAD_DOCS_ON_STARTUP=true

# Enable contextual embeddings for better retrieval
CTX_KNOWLEDGE_ENABLED=true

# Configure embedding provider (defaults to OpenAI)
EMBEDDING_PROVIDER=openai
TEXT_EMBEDDING_MODEL=text-embedding-3-small
```

### Using the Service

```typescript
// Get the knowledge service
const knowledgeService = runtime.getService<KnowledgeService>('knowledge');

// Add knowledge programmatically
const result = await knowledgeService.addKnowledge({
  content: documentContent, // Base64 or plain text
  originalFilename: 'guide.pdf',
  contentType: 'application/pdf',
  worldId: runtime.agentId,
  roomId: message.roomId,
  entityId: message.entityId
});

// Search for knowledge
const results = await knowledgeService.getKnowledge(message, {
  roomId: message.roomId,
  worldId: runtime.agentId
});
```

## Best Practices

<Tabs>
  <Tab title="Document Organization">
    <Steps>
      <Step title="Use clear, descriptive filenames">
        Choose names that clearly indicate the content (e.g., `product-guide-v2.pdf` instead of `doc1.pdf`)
      </Step>
      <Step title="Group related documents in folders">
        Create logical folder structures like `products/`, `support/`, `policies/`
      </Step>
      <Step title="Tag documents with metadata">
        Add categories, dates, and versions to improve searchability
      </Step>
      <Step title="Keep individual documents focused">
        One topic per document for better retrieval accuracy
      </Step>
    </Steps>
  </Tab>
  
  <Tab title="Performance">
    <Steps>
      <Step title="Enable caching for frequently accessed knowledge">
        Set `enableCache: true` for 90% cost reduction on repeated queries
      </Step>
      <Step title="Use appropriate chunk sizes">
        Start with 500 tokens, adjust based on your content type
      </Step>
      <Step title="Implement rate limiting">
        Respect API limits with batch processing and delays
      </Step>
      <Step title="Monitor memory usage">
        Clear cache periodically for large knowledge bases
      </Step>
    </Steps>
  </Tab>
  
  <Tab title="Security">
    <Warning>
      <Steps>
```