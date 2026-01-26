# a7046c18:packages_docs_runtime_providers.mdx:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/runtime/providers.mdx:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
---
title: "Providers"
description: "Real data, real-time - give your agent situational awareness"
---

## Why Providers?

Your agent needs to understand the world around it. Without context, it's flying blind:

- Who is the user? What's their history?
- What actions are available right now?
- What does the agent know about this topic?

Providers are the **senses** of your agent. They gather data from memory, services, and external sources, then feed it into the LLM prompt.

<Tip>
**Think of providers as context injectors.** Each provider contributes a piece of the puzzle - conversation history, user facts, available actions - assembled into the prompt at runtime.
</Tip>

## Provider Interface

Providers supply contextual information that forms the agent's understanding of the current situation. They gather data from various sources to build comprehensive state.

### Core Interface

```typescript
interface Provider {
  name: string;
  description: string;
  dynamic?: boolean;    // Only executed when explicitly requested
  private?: boolean;    // Internal-only, not included in default state
  position?: number;    // Execution order (lower runs first)
  
  get: (
    runtime: IAgentRuntime,
    message: Memory,
    state?: State
  ) => Promise<ProviderResult>;
}

interface ProviderResult {
  values: Record<string, any>;  // Key-value pairs for templates
  data: Record<string, any>;    // Structured data
  text: string;                 // Textual context
}
```

### Provider Types

- **Standard Providers**: Included by default in state composition
- **Dynamic Providers**: Only executed when explicitly requested
- **Private Providers**: Internal use only, not exposed in default state

## Built-in Providers

### Provider Summary Table

| Provider Name       | Dynamic | Position | Default Included | Purpose                    |
| ------------------- | ------- | -------- | ---------------- | -------------------------- |
| **ACTIONS**         | No      | -1       | Yes              | Lists available actions    |
| **ACTION_STATE**    | No      | 150      | Yes              | Action execution state     |
| **ANXIETY**         | No      | Default  | Yes              | Response style guidelines  |
| **ATTACHMENTS**     | Yes     | Default  | No               | File/media attachments     |
| **CAPABILITIES**    | No      | Default  | Yes              | Service capabilities       |
| **CHARACTER**       | No      | Default  | Yes              | Agent personality          |
| **CHOICE**          | No      | Default  | Yes              | Pending user choices       |
| **ENTITIES**        | Yes     | Default  | No               | Conversation participants  |
| **EVALUATORS**      | No      | Default  | No (private)     | Post-processing options    |
| **FACTS**           | Yes     | Default  | No               | Stored knowledge           |
| **PROVIDERS**       | No      | Default  | Yes              | Available providers list   |
| **RECENT_MESSAGES** | No      | 100      | Yes              | Conversation history       |
| **RELATIONSHIPS**   | Yes     | Default  | No               | Social connections         |
| **ROLES**           | No      | Default  | Yes              | Server roles (groups only) |
| **SETTINGS**        | No      | Default  | Yes              | Configuration state        |
| **TIME**            | No      | Default  | Yes              | Current UTC time           |
| **WORLD**           | Yes     | Default  | No               | Server/world context       |

### Provider Details

#### Actions Provider (`ACTIONS`)

Lists all available actions the agent can execute.

- **Position**: -1 (runs early)
- **Dynamic**: No (included by default)
- **Data Provided**:
  - `actionNames`: Comma-separated list of action names
  - `actionsWithDescriptions`: Formatted action details
  - `actionExamples`: Example usage for each action
  - `actionsData`: Raw action objects

```typescript
{
  values: {
    actionNames: "Possible response actions: 'SEND_MESSAGE', 'SEARCH', 'CALCULATE'",
    actionExamples: "..."
  },
  data: { actionsData: [...] },
  text: "# Available Actions\n..."
}
```

#### Action State Provider (`ACTION_STATE`)

Shares execution state between chained actions.

- **Position**: 150 (runs later)
- **Dynamic**: No (included by default)
- **Data Provided**:
  - `actionResults`: Previous action execution results
  - `actionPlan`: Multi-step action execution plan
  - `workingMemory`: Temporary data shared between actions
  - `recentActionMemories`: Historical action executions

#### Character Provider (`CHARACTER`)

Core personality and behavior definition.

- **Dynamic**: No (included by default)
- **Data Provided**:
  - `agentName`: Character name
  - `bio`: Character background
  - `topics`: Current interests
  - `adjective`: Current mood/state
  - `directions`: Style guidelines
  - `examples`: Example conversations/posts

```typescript
{
  values: {
    agentName: "Alice",
    bio: "AI assistant focused on...",
    topics: "technology, science, education",
    adjective: "helpful"
  },
  data: { character: {...} },
  text: "# About Alice\n..."
}
```

#### Recent Messages Provider (`RECENT_MESSAGES`)

Provides conversation history and context.

- **Position**: 100 (runs later to access other data)
- **Dynamic**: No (included by default)
- **Data Provided**:
  - `recentMessages`: Formatted conversation history
  - `recentInteractions`: Previous interactions
  - `actionResults`: Results from recent actions
```