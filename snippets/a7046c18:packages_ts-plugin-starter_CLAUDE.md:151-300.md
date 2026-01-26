# a7046c18:packages_ts-plugin-starter_CLAUDE.md:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/ts-plugin-starter/CLAUDE.md:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

```typescript
export const exampleEvaluator: Evaluator = {
  name: 'EXAMPLE_EVALUATOR',

  evaluate: async (runtime: IAgentRuntime, message: Memory, state?: any) => {
    // Analyze the interaction outcome
    const success = state?.lastActionSuccess || false;

    if (success) {
      // Store successful patterns
      await runtime.addMemory({
        content: { text: 'Successful example interaction pattern' },
        type: 'learning',
      });
    }

    return { success, confidence: 0.8 };
  },
};
```

## 📁 Project Structure

```
src/
├── 📂 actions/           # User command handlers
│   ├── exampleAction.ts
│   └── index.ts
├── 📂 services/          # External integrations (REQUIRED)
│   ├── ExampleService.ts
│   └── index.ts
├── 📂 providers/         # Context suppliers (optional)
│   ├── exampleProvider.ts
│   └── index.ts
├── 📂 evaluators/        # Learning components (optional)
│   ├── exampleEvaluator.ts
│   └── index.ts
├── 📂 types/            # TypeScript definitions
│   └── index.ts
├── 📄 index.ts          # Plugin export
└── 📄 package.json      # Dependencies and metadata
```

## 📦 Plugin Export Pattern

```typescript
// src/index.ts
import { Plugin } from '@elizaos/core';
import { ExampleService } from './services';
import { exampleAction } from './actions';
import { exampleProvider } from './providers';
import { exampleEvaluator } from './evaluators';

export const plugin: Plugin = {
  name: 'example-plugin',
  description: 'Demonstrates elizaOS plugin patterns',

  // Core components
  services: [ExampleService],
  actions: [exampleAction],

  // Optional components
  providers: [exampleProvider],
  evaluators: [exampleEvaluator],
};

export default plugin;

// Re-export components for external use
export { ExampleService } from './services';
export * from './types';
```

## 🚀 Development Workflow

### Quick Start Commands

```bash
# Install dependencies
bun install

# Start development with hot reload
elizaos dev

# Run tests
bun test

# Build for production
bun run build
```

### 🧪 Testing Your Plugin

#### **Method 1: Dev Mode (Recommended)**

```bash
elizaos dev
```

This automatically:

- Loads your plugin from current directory
- Creates a test character with your plugin
- Starts interactive chat interface
- Enables hot reloading

#### **Method 2: Unit Testing**

```typescript
// tests/actions.test.ts
import { describe, it, expect } from 'bun:test';
import { exampleAction } from '../src/actions';

describe('ExampleAction', () => {
  it('validates trigger words correctly', async () => {
    const mockMessage = {
      content: { text: 'show me an example' },
    };

    const isValid = await exampleAction.validate(mockRuntime, mockMessage);

    expect(isValid).toBe(true);
  });
});
```

## 🎯 Best Practices

### ✅ **DO**

- **Use Services for APIs**: All external calls go through services
- **Validate User Input**: Always validate in action handlers
- **Handle Errors Gracefully**: Provide meaningful error messages
- **Follow TypeScript**: Use strict typing throughout
- **Test Thoroughly**: Write tests for core functionality

### ❌ **DON'T**

- **API Calls in Actions**: Use services instead
- **State in Providers**: Keep providers read-only
- **Parse Input in Evaluators**: Use actions for input handling
- **Hardcode Credentials**: Use environment variables
- **Skip Error Handling**: Always handle potential failures

### 🔧 **Common Patterns**

#### Error Handling Pattern

```typescript
```