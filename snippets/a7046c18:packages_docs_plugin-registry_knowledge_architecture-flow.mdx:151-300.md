# a7046c18:packages_docs_plugin-registry_knowledge_architecture-flow.mdx:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/knowledge/architecture-flow.mdx:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    
    subgraph "Memory Types"
        M1[Document Memory]
        M2[Fragment Memory]
        M3[Context Memory]
    end
    
    VS1 --> M2
    DS1 --> M1
    M1 --> M3
    M2 --> M3
```

## Processing Pipeline Details

### Text Extraction Flow

```mermaid
graph TD
    File[Input File] --> Detect[Detect MIME Type]
    Detect --> PDF{PDF?}
    Detect --> DOCX{DOCX?}
    Detect --> Text{Text?}
    
    PDF -->|Yes| PDFLib[PDF Parser]
    DOCX -->|Yes| DOCXLib[DOCX Parser]
    Text -->|Yes| UTF8[UTF-8 Decode]
    
    PDFLib --> Clean[Clean Text]
    DOCXLib --> Clean
    UTF8 --> Clean
    
    Clean --> Output[Extracted Text]
```

### Chunking Strategy

```mermaid
graph TD
    Text[Full Text] --> Tokenize[Tokenize]
    Tokenize --> Window[Sliding Window]
    
    Window --> Chunk1[Chunk 1: 0-500]
    Window --> Chunk2[Chunk 2: 400-900]
    Window --> Chunk3[Chunk 3: 800-1300]
    Window --> More[...]
    
    Chunk1 --> Boundary1[Adjust to Boundaries]
    Chunk2 --> Boundary2[Adjust to Boundaries]
    Chunk3 --> Boundary3[Adjust to Boundaries]
    
    Boundary1 --> Final1[Final Chunk 1]
    Boundary2 --> Final2[Final Chunk 2]
    Boundary3 --> Final3[Final Chunk 3]
```

### Contextual Enrichment

```mermaid
graph TD
    Chunk[Text Chunk] --> Extract[Extract Key Info]
    Doc[Full Document] --> Summary[Generate Summary]
    
    Extract --> Combine[Combine Context]
    Summary --> Combine
    
    Combine --> Template[Apply Template]
    Template --> Enriched[Enriched Chunk]
    
    Template --> |Template| T["Context: {summary}<br/>Section: {title}<br/>Content: {chunk}"]
```

## Rate Limiting & Concurrency

```mermaid
graph TD
    subgraph "Request Queue"
        R1[Request 1]
        R2[Request 2]
        R3[Request 3]
        RN[Request N]
    end
    
    subgraph "Rate Limiter"
        RL1[Token Bucket<br/>150k tokens/min]
        RL2[Request Bucket<br/>60 req/min]
        RL3[Concurrent Limit<br/>30 operations]
    end
    
    subgraph "Processing Pool"
        P1[Worker 1]
        P2[Worker 2]
        P3[Worker 3]
        P30[Worker 30]
    end
    
    R1 --> RL1
    R2 --> RL1
    R3 --> RL1
    
    RL1 --> RL2
    RL2 --> RL3
    
    RL3 --> P1
    RL3 --> P2
    RL3 --> P3
```

## Caching Architecture

```mermaid
graph TD
    subgraph "Request Flow"
        Req[Embedding Request] --> Cache{In Cache?}
        Cache -->|Yes| Return[Return Cached]
        Cache -->|No| Generate[Generate New]
        Generate --> Store[Store in Cache]
        Store --> Return
    end
    
    subgraph "Cache Management"
        CM1[LRU Eviction]
        CM2[TTL: 24 hours]
        CM3[Max Size: 10k entries]
    end
    
    subgraph "Cost Savings"
        CS1[OpenRouter + Claude: 90% reduction]
        CS2[OpenRouter + Gemini: 90% reduction]
        CS3[Direct API: 0% reduction]
    end
```

## Web Interface Architecture

```mermaid
graph TD
    subgraph "Frontend"
        UI[React UI]
        UP[Upload Component]
        DL[Document List]
        SR[Search Results]
    end
    
    subgraph "API Layer"
        REST[REST Endpoints]
        MW[Middleware]
        Auth[Auth Check]
    end
    
```