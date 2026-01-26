# a7046c18:packages_docs_plugin-registry_platform_twitter_timeline-flow.mdx:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/platform/twitter/timeline-flow.mdx:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
---
title: "Timeline Flow"
description: "This document provides a comprehensive breakdown of how the Twitter plugin processes timeline data and generates interactions."
---

This document provides a comprehensive breakdown of how the Twitter plugin processes timeline data and generates interactions.

## Complete Timeline Flow Diagram

```mermaid
flowchart TD
    Start([Timeline Processing]) --> A[Fetch Home Timeline]
    
    A --> B{Cache Valid?}
    B -->|Yes| C[Use Cached Data]
    B -->|No| D[API Request]
    
    D --> E[Rate Limit Check]
    E --> F{Within Limits?}
    F -->|No| G[Wait/Queue]
    F -->|Yes| H[Fetch Timeline]
    
    G --> H
    C --> I[Filter Tweets]
    H --> I
    
    I --> J{Remove Processed}
    J --> K[New Tweets Only]
    
    K --> L{Algorithm Type?}
    L -->|Weighted| M[Weighted Processing]
    L -->|Latest| N[Latest Processing]
    
    M --> O[Calculate Scores]
    O --> P[Sort by Score]
    
    N --> Q[Sort by Time]
    
    P --> R[Select Top Tweets]
    Q --> R
    
    R --> S[Process Each Tweet]
    S --> T{Should Interact?}
    
    T -->|Yes| U[Generate Response]
    T -->|No| V[Mark Processed]
    
    U --> W{Response Type}
    W -->|Reply| X[Post Reply]
    W -->|Quote| Y[Quote Tweet]
    W -->|Like| Z[Like Tweet]
    W -->|Retweet| AA[Retweet]
    
    X --> AB[Update Cache]
    Y --> AB
    Z --> AB
    AA --> AB
    V --> AB
    
    AB --> AC{More Tweets?}
    AC -->|Yes| S
    AC -->|No| AD[Schedule Next Run]
```

## Detailed Processing Flows

### 1. Timeline Fetching

```mermaid
sequenceDiagram
    participant C as Client
    participant Q as Request Queue
    participant R as Rate Limiter
    participant A as Twitter API
    participant Ca as Cache
    
    C->>Ca: Check cache validity
    alt Cache valid
        Ca->>C: Return cached timeline
    else Cache invalid
        C->>Q: Queue timeline request
        Q->>R: Check rate limits
        
        alt Within limits
            R->>A: GET /2/users/:id/timelines/home
            A->>R: Timeline data
            R->>Ca: Update cache
            Ca->>C: Return timeline
        else Rate limited
            R->>R: Calculate wait time
            R->>Q: Delay request
            Q->>C: Request queued
        end
    end
```

### 2. Weighted Algorithm Flow

```mermaid
flowchart TD
    A[Tweet List] --> B[For Each Tweet]
    
    B --> C[Calculate User Score]
    C --> D{Target User?}
    D -->|Yes| E[Score = 10]
    D -->|No| F[Base Score = 5]
    
    F --> G{Verified?}
    G -->|Yes| H[Score +2]
    G -->|No| I[Continue]
    
    H --> J{High Followers?}
    I --> J
    J -->|Yes| K[Score +1]
    J -->|No| L[Continue]
    
    K --> M[User Score Complete]
    L --> M
    E --> M
    
    B --> N[Calculate Time Score]
    N --> O[Age in Hours]
    O --> P[Score = 10 - (Age/2)]
    P --> Q[Cap at 0-10]
    
    B --> R[Calculate Relevance]
    R --> S[Analyze Content]
    S --> T{Keywords Match?}
    T -->|Yes| U[High Relevance]
    T -->|No| V[Low Relevance]
    
    U --> W[Relevance Score]
    V --> W
    
    M --> X[Combine Scores]
    Q --> X
    W --> X
    
    X --> Y[Final Score = (U*3 + T*2 + R*5)]
    Y --> Z[Add to Scored List]
```

### 3. Interaction Decision Flow

```mermaid
flowchart TD
    A[Tweet to Process] --> B{Is Reply?}
    
    B -->|Yes| C{To Me?}
    B -->|No| D{Mentions Me?}
```