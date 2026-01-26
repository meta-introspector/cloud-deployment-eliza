# a7046c18:packages_docs_plugin-registry_knowledge_architecture-flow.mdx:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/knowledge/architecture-flow.mdx:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
---
title: Architecture & Flow Diagrams
description: Visual guide to the Knowledge plugin's internal architecture and data flows
---

This guide provides detailed visual representations of the Knowledge plugin's architecture, processing flows, and component interactions.

## High-Level Architecture

```mermaid
graph TB
    subgraph "User Interactions"
        U1[Chat Messages]
        U2[File Uploads]
        U3[URL Processing]
        U4[Direct Knowledge]
    end
    
    subgraph "Knowledge Plugin"
        KS[Knowledge Service]
        DP[Document Processor]
        EP[Embedding Provider]
        VS[Vector Store]
        DS[Document Store]
        WI[Web Interface]
    end
    
    subgraph "Core Runtime"
        AM[Agent Memory]
        AP[Action Processor]
        PR[Providers]
    end
    
    U1 --> AP
    U2 --> WI
    U3 --> AP
    U4 --> KS
    
    WI --> KS
    AP --> KS
    KS --> DP
    DP --> EP
    EP --> VS
    KS --> DS
    
    PR --> VS
    VS --> AM
    DS --> AM
```

## Document Processing Flow

```mermaid
flowchart TD
    Start([Document Input]) --> Type{Input Type?}
    
    Type -->|File Upload| Extract[Extract Text]
    Type -->|URL| Fetch[Fetch Content]
    Type -->|Direct Text| Validate[Validate Text]
    
    Extract --> Clean[Clean & Normalize]
    Fetch --> Clean
    Validate --> Clean
    
    Clean --> Hash[Generate Content Hash]
    Hash --> Dedupe{Duplicate?}
    
    Dedupe -->|Yes| End1([Skip Processing])
    Dedupe -->|No| Chunk[Chunk Text]
    
    Chunk --> Enrich{CTX Enabled?}
    Enrich -->|Yes| Context[Add Context]
    Enrich -->|No| Embed[Generate Embeddings]
    Context --> Embed
    
    Embed --> Store[Store Vectors]
    Store --> Meta[Store Metadata]
    Meta --> End2([Processing Complete])
```

## Retrieval Flow

```mermaid
flowchart TD
    Query([User Query]) --> Embed[Generate Query Embedding]
    Embed --> Search[Vector Similarity Search]
    
    Search --> Filter{Apply Filters?}
    Filter -->|Yes| ApplyF[Filter by Metadata]
    Filter -->|No| Rank[Rank Results]
    ApplyF --> Rank
    
    Rank --> Threshold{Score > 0.7?}
    Threshold -->|No| Discard[Discard Result]
    Threshold -->|Yes| Include[Include in Results]
    
    Include --> Limit{Result Count}
    Limit -->|< Limit| More[Get More Results]
    Limit -->|= Limit| Build[Build Context]
    More --> Search
    
    Build --> Inject[Inject into Agent Context]
    Inject --> Response([Agent Response])
```

## Component Interactions

```mermaid
sequenceDiagram
    participant User
    participant Agent
    participant KnowledgeService
    participant DocumentProcessor
    participant EmbeddingProvider
    participant VectorStore
    participant DocumentStore
    
    User->>Agent: Ask question
    Agent->>KnowledgeService: searchKnowledge(query)
    KnowledgeService->>EmbeddingProvider: embed(query)
    EmbeddingProvider-->>KnowledgeService: queryEmbedding
    
    KnowledgeService->>VectorStore: searchSimilar(queryEmbedding)
    VectorStore-->>KnowledgeService: matches[]
    
    KnowledgeService->>DocumentStore: getDocuments(ids)
    DocumentStore-->>KnowledgeService: documents[]
    
    KnowledgeService-->>Agent: relevantKnowledge[]
    Agent->>Agent: buildContext(knowledge)
    Agent-->>User: Informed response
```

## Data Flow Architecture

```mermaid
graph LR
    subgraph "Storage Layer"
        subgraph "Vector Store"
            VS1[Embeddings Table]
            VS2[Metadata Index]
            VS3[Similarity Index]
        end
        
        subgraph "Document Store"
            DS1[Documents Table]
            DS2[Content Hash Index]
            DS3[Timestamp Index]
        end
    end
```