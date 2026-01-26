# a7046c18:packages_docs_guides_streaming-responses.mdx:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/guides/streaming-responses.mdx:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
---
title: "Streaming Responses"
description: "Real-time token streaming for responsive AI conversations"
---

## The Problem

Users hate waiting. A 3-second response feels like an eternity when you're staring at a blank screen.

Traditional request/response patterns make your agent feel sluggish, even when the LLM is fast. The UI waits for the entire response before showing anything.

<Tip>
**Streaming changes everything.** Users see tokens appear in real-time, making responses feel instant even when they take seconds to complete.
</Tip>

## Quick Start

ElizaOS supports three response modes out of the box:

| Mode | Latency | Use Case |
|------|---------|----------|
| **Sync** | Wait for complete response | Simple integrations, batch processing |
| **Stream** | Tokens appear in real-time | Chat UIs, interactive experiences |
| **WebSocket** | Bidirectional, persistent | Voice conversations, multi-turn |

### HTTP Streaming

Send a message with `stream: true` to get Server-Sent Events:

```typescript
const response = await fetch(`/api/agents/${agentId}/message`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    entityId: 'user-123',
    roomId: 'room-456',
    content: { text: 'Hello!', source: 'api' },
    stream: true // Enable streaming
  })
});

// Process SSE stream
const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const chunk = decoder.decode(value);
  const lines = chunk.split('\n').filter(line => line.startsWith('data: '));

  for (const line of lines) {
    const data = JSON.parse(line.slice(6));
    if (data.type === 'chunk') {
      process.stdout.write(data.text); // Display token immediately
    }
  }
}
```

### WebSocket Connection

For bidirectional communication and voice conversations:

```typescript
const socket = new WebSocket(`ws://localhost:3000/api/agents/${agentId}/ws`);

socket.onopen = () => {
  socket.send(JSON.stringify({
    type: 'message',
    entityId: 'user-123',
    roomId: 'room-456',
    content: { text: 'Hello!', source: 'websocket' }
  }));
};

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);

  switch (data.type) {
    case 'chunk':
      process.stdout.write(data.text);
      break;
    case 'complete':
      console.log('\n--- Response complete ---');
      break;
    case 'error':
      console.error('Error:', data.message);
      break;
  }
};
```

## Stream Events

The streaming API emits these event types:

| Event | Description |
|-------|-------------|
| `chunk` | A token or text fragment to display |
| `complete` | Response finished, includes full text and actions |
| `error` | Something went wrong |
| `control` | Backend control messages (typing indicators, etc.) |

### Chunk Event

```typescript
{
  type: 'chunk',
  text: 'Hello',      // Text fragment to append
  timestamp: 1703001234567
}
```

### Complete Event

```typescript
{
  type: 'complete',
  text: 'Hello! How can I help you today?',  // Full response
  actions: ['REPLY'],                         // Executed actions
  messageId: 'msg-uuid',
  timestamp: 1703001234890
}
```

## Custom Stream Extractors

ElizaOS uses **stream extractors** to filter LLM output for streaming. The framework provides several built-in extractors:

### PassthroughExtractor

Streams everything as-is. Use for plain text responses.

```typescript
import { PassthroughExtractor } from '@elizaos/core';

const extractor = new PassthroughExtractor();
extractor.push('Hello ');  // Returns: 'Hello '
extractor.push('world!');  // Returns: 'world!'
```

### XmlTagExtractor

Extracts content from a specific XML tag. Use when LLM outputs structured XML.

```typescript
import { XmlTagExtractor } from '@elizaos/core';

```