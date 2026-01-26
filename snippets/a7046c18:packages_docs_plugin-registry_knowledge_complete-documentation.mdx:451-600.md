# a7046c18:packages_docs_plugin-registry_knowledge_complete-documentation.mdx:451-600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/knowledge/complete-documentation.mdx:451-600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
## API Reference

### REST Endpoints

#### Upload Documents

```http
POST /knowledge/upload
Content-Type: multipart/form-data

{
  "file": <binary>,
  "metadata": {
    "tags": ["product", "documentation"]
  }
}

Response: {
  "id": "doc_123",
  "status": "processing",
  "message": "Document uploaded successfully"
}
```

#### List Documents

```http
GET /knowledge/documents?page=1&limit=20

Response: {
  "documents": [
    {
      "id": "doc_123",
      "filename": "product-guide.pdf",
      "size": 1024000,
      "createdAt": "2024-01-20T10:00:00Z",
      "chunkCount": 15
    }
  ],
  "total": 45,
  "page": 1,
  "pages": 3
}
```

#### Delete Document

```http
DELETE /knowledge/documents/doc_123

Response: {
  "success": true,
  "message": "Document and associated embeddings deleted"
}
```

#### Search Knowledge

```http
GET /knowledge/search?q=pricing&limit=5

Response: {
  "results": [
    {
      "id": "chunk_456",
      "content": "Our pricing starts at $99/month...",
      "score": 0.92,
      "metadata": {
        "source": "pricing.pdf",
        "page": 3
      }
    }
  ]
}
```

### TypeScript Interfaces

```typescript
interface AddKnowledgeOptions {
  agentId?: UUID; // Optional, defaults to runtime.agentId
  worldId: UUID;
  roomId: UUID;
  entityId: UUID;
  clientDocumentId: UUID;
  contentType: string; // MIME type
  originalFilename: string;
  content: string; // Base64 for binary, plain text for text files
  metadata?: Record<string, unknown>;
}

interface KnowledgeConfig {
  CTX_KNOWLEDGE_ENABLED: boolean;
  LOAD_DOCS_ON_STARTUP: boolean;
  MAX_INPUT_TOKENS?: string | number;
  MAX_OUTPUT_TOKENS?: string | number;
  EMBEDDING_PROVIDER?: string;
  TEXT_PROVIDER?: string;
  TEXT_EMBEDDING_MODEL?: string;
}

interface TextGenerationOptions {
  provider?: 'anthropic' | 'openai' | 'openrouter' | 'google';
  modelName?: string;
  maxTokens?: number;
  cacheDocument?: string; // For OpenRouter caching
  cacheOptions?: { type: 'ephemeral' };
  autoCacheContextualRetrieval?: boolean;
}
```

## Advanced Features

### Contextual Embeddings

Enable for 50% better retrieval accuracy:

```env
CTX_KNOWLEDGE_ENABLED=true
```

This feature:
- Adds document context to each chunk
- Improves semantic understanding
- Reduces false positives
- Enables better cross-reference retrieval

### Document Caching

With OpenRouter, enable caching for 90% cost reduction:

```typescript
const config = {
  provider: 'openrouter',
  enableCache: true,
  cacheExpiry: 86400 // 24 hours
};
```

### Custom Document Processors

Extend for special formats:

```typescript
class CustomProcessor extends DocumentProcessor {
  async extractCustomFormat(buffer: Buffer): Promise<string> {
    // Custom extraction logic
    return extractedText;
  }
  
```