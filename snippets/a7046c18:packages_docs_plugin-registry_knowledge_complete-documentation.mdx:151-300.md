# a7046c18:packages_docs_plugin-registry_knowledge_complete-documentation.mdx:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/knowledge/complete-documentation.mdx:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
}
```

### Document Processing

The service handles different file types with sophisticated processing logic:

```typescript
private async processDocument(options: AddKnowledgeOptions): Promise<{
  clientDocumentId: string;
  storedDocumentMemoryId: UUID;
  fragmentCount: number;
}> {
  let fileBuffer: Buffer | null = null;
  let extractedText: string;
  let documentContentToStore: string;
  const isPdfFile = contentType === 'application/pdf';

  if (isPdfFile) {
    // PDFs: Store original base64, extract text for fragments
    fileBuffer = Buffer.from(content, 'base64');
    extractedText = await extractTextFromDocument(fileBuffer, contentType, originalFilename);
    documentContentToStore = content; // Keep base64 for PDFs
  } else if (isBinaryContentType(contentType, originalFilename)) {
    // Other binary files: Extract and store as plain text
    fileBuffer = Buffer.from(content, 'base64');
    extractedText = await extractTextFromDocument(fileBuffer, contentType, originalFilename);
    documentContentToStore = extractedText; // Store extracted text
  } else {
    // Text files: Handle both base64 and plain text input
    if (looksLikeBase64(content)) {
      // Decode base64 text files
      const decodedBuffer = Buffer.from(content, 'base64');
      extractedText = decodedBuffer.toString('utf8');
      documentContentToStore = extractedText;
    } else {
      // Already plain text
      extractedText = content;
      documentContentToStore = content;
    }
  }

  // Create document memory with content-based ID
  const documentMemory = createDocumentMemory({
    text: documentContentToStore,
    agentId,
    clientDocumentId,
    originalFilename,
    contentType,
    worldId,
    fileSize: fileBuffer ? fileBuffer.length : extractedText.length,
    documentId: clientDocumentId,
    customMetadata: metadata,
  });

  // Store document and process fragments
  await this.runtime.createMemory(documentMemory, 'documents');
  
  const fragmentCount = await processFragmentsSynchronously({
    runtime: this.runtime,
    documentId: clientDocumentId,
    fullDocumentText: extractedText,
    agentId,
    contentType,
    roomId: roomId || agentId,
    entityId: entityId || agentId,
    worldId: worldId || agentId,
    documentTitle: originalFilename,
  });

  return { clientDocumentId, storedDocumentMemoryId, fragmentCount };
}
```

### Actions

The plugin provides two main actions:

#### PROCESS_KNOWLEDGE
Adds knowledge from files or text content:
- Supports file paths: `/path/to/document.pdf`
- Direct text: "Add this to your knowledge: ..."
- File types: PDF, DOCX, TXT, MD, CSV, etc.
- Automatically splits content into searchable fragments

#### SEARCH_KNOWLEDGE
Explicitly searches the knowledge base:
- Triggered by: "Search your knowledge for..."
- Returns top 3 most relevant results
- Displays formatted text snippets

### Knowledge Provider

Automatically injects relevant knowledge into agent responses:

- **Dynamic**: Runs on every message to find relevant context
- **Top 5 Results**: Retrieves up to 5 most relevant knowledge fragments
- **RAG Tracking**: Enriches conversation memories with knowledge usage metadata
- **Token Limit**: Caps knowledge at ~4000 tokens to prevent context overflow

The provider automatically:
1. Searches for relevant knowledge based on the user's message
2. Formats it with a "# Knowledge" header
3. Tracks which knowledge was used in the response
4. Enriches the conversation memory with RAG metadata

## Document Processing Pipeline

### 1. Document Ingestion

Knowledge can be added through multiple channels:

```typescript
// File upload (API endpoint sends base64-encoded content)
const result = await knowledgeService.addKnowledge({
  content: base64EncodedContent, // Base64 for binary files, can be plain text
  originalFilename: 'document.pdf',
  contentType: 'application/pdf',
  agentId: agentId, // Optional, defaults to runtime.agentId
  metadata: {
    tags: ['documentation', 'manual']
  }
});

// Direct text addition (internal use)
await knowledgeService._internalAddKnowledge({
  id: generateContentBasedId(content, agentId),
  content: { text: "Important information..." },
  metadata: {
    type: MemoryType.DOCUMENT,
    source: 'direct'
  }
});

// Character knowledge (loaded automatically from character definition)
await knowledgeService.processCharacterKnowledge([
  "Path: knowledge/facts.md\nKey facts about the product...",
  "Another piece of character knowledge..."
]);
```

### 2. Text Extraction

Supports multiple file formats:

```typescript
const supportedFormats = {
  'application/pdf': extractPDF,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': extractDOCX,
  'text/plain': (buffer) => buffer.toString('utf-8'),
```