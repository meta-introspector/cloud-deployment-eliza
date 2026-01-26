# a7046c18:packages_docs_runtime_core.mdx:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/runtime/core.mdx:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
---
title: "Core Runtime"
description: "Build AI agents that actually work - without the infrastructure headaches"
---

## The Problem

Building production AI agents is hard. You're juggling:
- **Plugin management** across multiple providers and capabilities
- **State persistence** that doesn't break between restarts
- **Multi-agent orchestration** without race conditions
- **Deployment complexity** from local dev to serverless edge

Most frameworks give you primitives. You still wire everything together yourself.

<Tip>
**5 minutes to your first agent.** No infrastructure setup, no config files to manage. Just code.
</Tip>

## Quick Start with ElizaOS

The `ElizaOS` class handles configuration, plugin resolution, and multi-agent orchestration automatically.

```typescript
import { ElizaOS } from '@elizaos/core';

// Create the orchestrator
const elizaOS = new ElizaOS();

// Add agents with character and plugins
const agentIds = await elizaOS.addAgents([
  {
    character: {
      name: 'Assistant',
      bio: ['A helpful AI assistant'],
      system: 'You are a helpful assistant.',
    },
    plugins: ['@elizaos/plugin-sql', '@elizaos/plugin-openai'],
  }
]);

// Start all agents
await elizaOS.startAgents();

// Send a message and get response
const result = await elizaOS.handleMessage(agentIds[0], {
  entityId: userId,
  roomId: roomId,
  content: { text: 'Hello!', source: 'web' }
});

console.log(result.processing?.text);
```

<CardGroup cols={2}>
  <Card title="Add Capabilities" icon="puzzle-piece" href="/plugins/components">
    Actions, Providers, and Evaluators
  </Card>
  <Card title="Define Personality" icon="user" href="/agents/character-interface">
    Character configuration
  </Card>
  <Card title="Deploy Anywhere" icon="cloud" href="/guides/deploy-a-project">
    Local, Docker, Serverless, Edge
  </Card>
  <Card title="Connect Platforms" icon="plug" href="/plugin-registry/overview">
    Discord, Telegram, Twitter, and more
  </Card>
</CardGroup>

---

## Deployment Patterns

### Serverless / Edge Deployment

For serverless environments, use ephemeral mode:

```typescript
// Ephemeral mode - runtime not stored in registry
const [runtime] = await elizaOS.addAgents([{
  character,
  plugins,
  databaseAdapter: cachedAdapter, // Pre-initialized DB
}], {
  ephemeral: true,
  skipMigrations: true,
  autoStart: true,
  returnRuntimes: true,
});

// Use runtime directly (no registry lookup)
const result = await elizaOS.handleMessage(runtime, {
  entityId: userId,
  roomId: roomId,
  content: { text: 'Hello!', source: 'lambda' }
});
```

### Async Mode with Callbacks

For WebSocket or streaming scenarios:

```typescript
await elizaOS.handleMessage(agentId, message, {
  onResponse: async (content) => {
    await socket.emit('message', content.text);
  },
  onStreamChunk: async (chunk, messageId) => {
    await socket.emit('chunk', { chunk, messageId });
  },
  onError: async (error) => {
    console.error('Agent error:', error);
  },
  onComplete: async () => {
    console.log('Processing complete');
  }
});
```

### Multi-Agent Communication

Send messages to multiple agents in parallel:

```typescript
const results = await elizaOS.handleMessages([
  {
    agentId: researchAgent,
    message: { entityId, roomId, content: { text: 'Research topic X', source: 'internal' } }
  },
  {
    agentId: writerAgent,
    message: { entityId, roomId, content: { text: 'Prepare outline', source: 'internal' } }
  }
]);
```

### Agent Discovery

```typescript
// By ID
const agent = elizaOS.getAgent(agentId);

// By name
const assistant = elizaOS.getAgentByName('Assistant');

// All agents
const allAgents = elizaOS.getAgents();

// Multiple by IDs
const selected = elizaOS.getAgentsByIds([id1, id2]);
```