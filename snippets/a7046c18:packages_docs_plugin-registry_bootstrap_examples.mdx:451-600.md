# a7046c18:packages_docs_plugin-registry_bootstrap_examples.mdx:451-600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/bootstrap/examples.mdx:451-600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
// Create the scheduled task
await runtime.createTask({
  name: 'DAILY_SUMMARY',
  description: 'Posts daily activity summary',
  metadata: {
    updateInterval: 1000 * 60 * 60, // Check hourly
    worldId: 'main-world',
    mainChannelId: 'general',
  },
  tags: ['queue', 'repeat'],
});
```

### Event-Driven Task

```typescript
// Task that triggers on specific events
runtime.registerTaskWorker({
  name: 'NEW_USER_WELCOME',

  execute: async (runtime, options) => {
    const { userId, userName } = options;

    // Send welcome message
    await runtime.sendMessage({
      roomId: options.roomId,
      content: {
        text: `Welcome ${userName}! 👋 I'm here to help you get started.`,
        actions: ['WELCOME'],
      },
    });

    // Schedule follow-up
    await runtime.createTask({
      name: 'WELCOME_FOLLOWUP',
      metadata: {
        userId,
        executeAt: Date.now() + 1000 * 60 * 60 * 24, // 24 hours later
      },
      tags: ['queue'],
    });
  },
});

// Trigger on new user
runtime.on(EventType.ENTITY_JOINED, async (payload) => {
  await runtime.createTask({
    name: 'NEW_USER_WELCOME',
    metadata: {
      userId: payload.entityId,
      userName: payload.entity.name,
      roomId: payload.roomId,
    },
    tags: ['queue', 'immediate'],
  });
});
```

## Complete Bot Example

### Support Bot with Custom Features

```typescript
import { AgentRuntime, Plugin, EventType, ChannelType } from '@elizaos/core';


// Custom support plugin
const supportPlugin: Plugin = {
  name: 'support-features',
  description: 'Custom support bot features',

  actions: [
    {
      name: 'CREATE_TICKET',
      similes: ['TICKET', 'ISSUE', 'REPORT'],
      description: 'Creates a support ticket',

      validate: async (runtime) => true,

      handler: async (runtime, message, state, options, callback) => {
        const ticket = {
          id: generateTicketId(),
          userId: message.entityId,
          issue: message.content.text,
          status: 'open',
          createdAt: Date.now(),
        };

        await runtime.createMemory(
          {
            entityId: runtime.agentId,
            agentId: runtime.agentId,
            roomId: message.roomId,
            content: {
              type: 'ticket',
              ...ticket,
            },
          },
          'tickets'
        );

        await callback({
          thought: 'Creating support ticket',
          text: `I've created ticket #${ticket.id} for your issue. Our team will review it shortly.`,
          actions: ['CREATE_TICKET'],
          metadata: { ticketId: ticket.id },
        });

        return true;
      },
    },
  ],

  providers: [
    {
      name: 'OPEN_TICKETS',
      description: 'Lists open support tickets',

      get: async (runtime, message) => {
        const tickets = await runtime.getMemories({
          tableName: 'tickets',
          agentId: runtime.agentId,
          filter: { status: 'open' },
          count: 10,
        });

        const ticketList = tickets
          .map((t) => `- #${t.content.id}: ${t.content.issue.substring(0, 50)}...`)
          .join('\n');

        return {
          data: { tickets },
          values: { openCount: tickets.length },
          text: `Open Tickets (${tickets.length}):\n${ticketList}`,
        };
      },
    },
  ],

  evaluators: [
    {
      name: 'TICKET_ESCALATION',
      description: 'Checks if tickets need escalation',

      validate: async (runtime, message) => {
        // Check every 10 messages
        return message.content.type === 'ticket';
      },

      handler: async (runtime, message, state) => {
```