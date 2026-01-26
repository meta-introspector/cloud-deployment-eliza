# a7046c18:packages_ts-plugin-starter_CLAUDE.md:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/ts-plugin-starter/CLAUDE.md:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
# elizaOS Plugin Development Guide for Claude

> **Optimized for Claude LLM** - Complete reference for building elizaOS plugins

## 📋 Project Overview

| Property            | Value                 |
| ------------------- | --------------------- |
| **Project Type**    | elizaOS Plugin        |
| **Package Manager** | `bun` (REQUIRED)      |
| **Language**        | TypeScript (Required) |
| **Testing**         | Bun test              |
| **Runtime**         | elizaOS Agent Runtime |

## 🏗️ Plugin Architecture

elizaOS plugins follow a **component-based architecture** with four main types:

### 🔄 **Services** (Required for External APIs)

**Purpose:** Handle stateful operations and external integrations

```typescript
export class ExampleService extends Service {
  static serviceType = 'example';
  private apiClient: ExternalAPI;

  constructor() {
    super();
  }

  async initialize(runtime: IAgentRuntime): Promise<void> {
    // Initialize SDK connections, databases, etc.
    this.apiClient = new ExternalAPI(process.env.API_KEY);
  }

  async processData(data: any): Promise<any> {
    // Your business logic here
    return await this.apiClient.process(data);
  }
}
```

**Services are for:**

- ✅ API connections and SDK management
- ✅ Database operations
- ✅ State management
- ✅ Authentication handling
- ❌ NOT for simple data formatting (use Providers)

### ⚡ **Actions** (Required for User Interactions)

**Purpose:** Handle user commands and generate responses

```typescript
import { Action, ActionResult } from '@elizaos/core';

export const exampleAction: Action = {
  name: 'EXAMPLE_ACTION',
  description: 'Processes user requests for example functionality',

  validate: async (runtime: IAgentRuntime, message: Memory) => {
    const text = message.content.text.toLowerCase();
    return text.includes('example') || text.includes('demo');
  },

  handler: async (runtime, message, state, options, callback): Promise<ActionResult> => {
    try {
      const service = runtime.getService<ExampleService>('example');
      const result = await service.processData(message.content);

      await callback({
        text: `Here's your result: ${result}`,
        action: 'EXAMPLE_ACTION',
      });

      return {
        success: true,
        text: `Successfully processed: ${result}`,
        values: {
          lastProcessed: result,
          processedAt: Date.now(),
        },
        data: {
          actionName: 'EXAMPLE_ACTION',
          result,
        },
      };
    } catch (error) {
      await callback({
        text: 'I encountered an error processing your request.',
        error: true,
      });

      return {
        success: false,
        text: 'Failed to process request',
        error: error instanceof Error ? error : new Error(String(error)),
        data: {
          actionName: 'EXAMPLE_ACTION',
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  },
};
```

**Actions handle:**

- ✅ User input validation
- ✅ Command parsing and routing
- ✅ Service coordination
- ✅ Response generation
- ❌ NOT direct API calls (use Services)

**Important: Callbacks vs ActionResult:**

- **`callback()`** → Sends messages to the user in chat
- **`ActionResult` return** → Passes data/state to next action in chain
- Both are used together: callback for user communication, return for action chaining

### 📊 **Providers** (Optional - Context Supply)

**Purpose:** Supply read-only contextual information

```typescript
export const exampleProvider: Provider = {
  get: async (runtime: IAgentRuntime, message: Memory) => {
    const service = runtime.getService<ExampleService>('example');
    const status = await service.getStatus();

    return `Current system status: ${status.state}
Available features: ${status.features.join(', ')}
Last updated: ${status.timestamp}`;
  },
};
```

**Providers supply:**

- ✅ Formatted contextual data
- ✅ Real-time information
- ✅ System state summaries
- ❌ NOT for state modification

### 🧠 **Evaluators** (Optional - Post-Processing)

**Purpose:** Learn from interactions and analyze outcomes
```