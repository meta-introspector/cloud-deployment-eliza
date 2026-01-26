# a7046c18:packages_docs_plugin-registry_platform_twitter_timeline-flow.mdx:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/platform/twitter/timeline-flow.mdx:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    
    C -->|Yes| E[Should Reply = Yes]
    C -->|No| F{In Thread?}
    
    D -->|Yes| E
    D -->|No| G{Target User?}
    
    F -->|Yes| H[Check Context]
    F -->|No| I[Skip]
    
    G -->|Yes| J[Check Relevance]
    G -->|No| K{High Score?}
    
    H --> L{Relevant?}
    L -->|Yes| E
    L -->|No| I
    
    J --> M{Above Threshold?}
    M -->|Yes| E
    M -->|No| I
    
    K -->|Yes| N[Maybe Reply]
    K -->|No| I
    
    E --> O[Generate Response]
    N --> P[Probability Check]
    P --> Q{Random < 0.3?}
    Q -->|Yes| O
    Q -->|No| I
```

### 4. Response Generation Flow

```mermaid
sequenceDiagram
    participant T as Tweet
    participant P as Processor
    participant C as Context Builder
    participant L as LLM
    participant V as Validator
    
    T->>P: Tweet to respond to
    P->>C: Build context
    
    C->>C: Get thread history
    C->>C: Get user history
    C->>C: Get recent interactions
    
    C->>L: Generate response
    Note over L: System: Character personality<br/>Context: Thread + history<br/>Task: Generate reply
    
    L->>V: Generated text
    
    V->>V: Check length
    V->>V: Check appropriateness
    V->>V: Remove duplicates
    
    alt Valid response
        V->>P: Approved response
    else Invalid
        V->>L: Regenerate
    end
```

### 5. Action Processing Flow

```mermaid
flowchart TD
    A[Timeline Tweets] --> B[Evaluate Each Tweet]
    
    B --> C{Like Candidate?}
    C -->|Yes| D[Calculate Like Score]
    C -->|No| E{Retweet Candidate?}
    
    D --> F[Add to Actions]
    
    E -->|Yes| G[Calculate RT Score]
    E -->|No| H{Quote Candidate?}
    
    G --> F
    
    H -->|Yes| I[Calculate Quote Score]
    H -->|No| J[Next Tweet]
    
    I --> F
    
    F --> K[Action List]
    J --> K
    
    K --> L[Sort by Score]
    L --> M[Select Top Action]
    
    M --> N{Action Type}
    N -->|Like| O[POST /2/users/:id/likes]
    N -->|Retweet| P[POST /2/users/:id/retweets]
    N -->|Quote| Q[Generate Quote Text]
    
    Q --> R[POST /2/tweets]
    
    O --> S[Log Action]
    P --> S
    R --> S
```

## Timeline State Management

### Cache Structure

```typescript
interface TimelineCache {
  tweets: Tweet[];
  users: Map<string, TwitterUser>;
  timestamp: number;
  etag?: string;
}

interface ProcessingState {
  processedTweets: Set<string>;
  lastProcessTime: number;
  interactionCount: number;
  rateLimitStatus: RateLimitInfo;
}
```

### Scoring Components

```typescript
interface ScoringWeights {
  user: number;      // Default: 3
  time: number;      // Default: 2
  relevance: number; // Default: 5
}

interface TweetScore {
  tweetId: string;
  userScore: number;
  timeScore: number;
  relevanceScore: number;
  totalScore: number;
  factors: {
    isTargetUser: boolean;
    isVerified: boolean;
    followerCount: number;
    hasKeywords: boolean;
    age: number;
  };
}
```

## Error Handling in Timeline Flow
```