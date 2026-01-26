# a7046c18:packages_docs_plugin-registry_bootstrap_message-flow.mdx:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/bootstrap/message-flow.mdx:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
---
title: "Message Processing Flow"
description: "Step-by-step breakdown of how messages flow through the bootstrap plugin system"
---

# Message Processing Flow - Detailed Breakdown

This document provides a step-by-step breakdown of how messages flow through the plugin-bootstrap system.

## Complete Message Flow Diagram

```mermaid
flowchart TD
    Start([Message Received]) --> A[Event: MESSAGE_RECEIVED]

    A --> B{Is from Self?}
    B -->|Yes| End1[Skip Processing]
    B -->|No| C[Generate Response ID]

    C --> D[Start Run Tracking]
    D --> E[Save to Memory & Embeddings]

    E --> F{Has Attachments?}
    F -->|Yes| G[Process Attachments]
    F -->|No| H[Check Agent State]
    G --> H

    H --> I{Is Agent Muted?}
    I -->|Yes & No Name Mention| End2[Ignore Message]
    I -->|No or Name Mentioned| J[Compose Initial State]

    J --> K{Should Bypass<br/>shouldRespond?}
    K -->|Yes| L[Skip to Response]
    K -->|No| M[Evaluate shouldRespond]

    M --> N[Generate shouldRespond Prompt]
    N --> O[LLM Decision]
    O --> P{Should Respond?}

    P -->|No| Q[Save Ignore Decision]
    Q --> End3[End Processing]

    P -->|Yes| L
    L --> R[Compose Full State]
    R --> S[Generate Response Prompt]
    S --> T[LLM Response Generation]

    T --> U{Valid Response?}
    U -->|No| V[Retry up to 3x]
    V --> T
    U -->|Yes| W[Parse XML Response]

    W --> X{Still Latest Response?}
    X -->|No| End4[Discard Response]
    X -->|Yes| Y[Create Response Message]

    Y --> Z{Is Simple Response?}
    Z -->|Yes| AA[Direct Callback]
    Z -->|No| AB[Process Actions]

    AA --> AC[Run Evaluators]
    AB --> AC

    AC --> AD[Reflection Evaluator]
    AD --> AE[Extract Facts]
    AE --> AF[Update Relationships]
    AF --> AG[Save Reflection State]

    AG --> AH[Emit RUN_ENDED]
    AH --> End5[Complete]
```

## Detailed Step Descriptions

### 1. Initial Message Reception

```typescript
// Event triggered by platform (Discord, Telegram, etc.)
EventType.MESSAGE_RECEIVED → messageReceivedHandler
```

### 2. Self-Check

```typescript
if (message.entityId === runtime.agentId) {
  logger.debug('Skipping message from self');
  return;
}
```

### 3. Response ID Generation

```typescript
// Prevents duplicate responses for rapid messages
const responseId = v4();
latestResponseIds.get(runtime.agentId).set(message.roomId, responseId);
```

### 4. Run Tracking

```typescript
const runId = runtime.startRun();
await runtime.emitEvent(EventType.RUN_STARTED, {...});
```

### 5. Memory Storage

```typescript
await Promise.all([
  runtime.addEmbeddingToMemory(message), // Vector embeddings
  runtime.createMemory(message, 'messages'), // Message history
]);
```

### 6. Attachment Processing

```typescript
if (message.content.attachments?.length > 0) {
  // Images: Generate descriptions
  // Documents: Extract text
  // Other: Process as configured
  message.content.attachments = await processAttachments(message.content.attachments, runtime);
}
```

### 7. Agent State Check

```typescript
const agentUserState = await runtime.getParticipantUserState(message.roomId, runtime.agentId);

if (
  agentUserState === 'MUTED' &&
  !message.content.text?.toLowerCase().includes(runtime.character.name.toLowerCase())
) {
  return; // Ignore if muted and not mentioned
}
```

### 8. Should Respond Evaluation

#### Bypass Conditions

```typescript
function shouldBypassShouldRespond(runtime, room, source) {
  // Default bypass types
  const bypassTypes = [ChannelType.DM, ChannelType.VOICE_DM, ChannelType.SELF, ChannelType.API];

  // Default bypass sources
  const bypassSources = ['client_chat'];

```