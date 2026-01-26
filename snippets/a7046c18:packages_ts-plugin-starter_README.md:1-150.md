# a7046c18:packages_ts-plugin-starter_README.md:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/ts-plugin-starter/README.md:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
# elizaOS Plugin

This is an elizaOS plugin built with the official plugin starter template.

## Getting Started

```bash
# Create a new plugin (automatically adds "plugin-" prefix)
elizaos create --type plugin solana
# This creates: plugin-solana
# Dependencies are automatically installed and built

# Navigate to the plugin directory
cd plugin-solana

# Start development immediately
elizaos dev
```

## Development

```bash
# Start development with hot-reloading (recommended)
elizaos dev

# OR start without hot-reloading
elizaos start
# Note: When using 'start', you need to rebuild after changes:
# bun run build

# Test the plugin
elizaos test
```

## Testing

elizaOS uses a dual testing approach that combines Bun's native test runner for component tests with a custom E2E test runner for integration testing within a live elizaOS runtime.

### Test Structure

```
src/
  __tests__/              # All tests live inside src
    *.test.ts            # Component tests (use Bun test runner)
    e2e/                 # E2E tests (use elizaOS test runner)
      *.ts               # E2E test files
      README.md          # E2E testing documentation
```

### Two Types of Tests

#### 1. Component Tests (Bun Test Runner)

- **Purpose**: Test individual functions/classes in isolation
- **Location**: `src/__tests__/*.test.ts`
- **Runner**: Bun's built-in test runner
- **Command**: `bun test`
- **Features**: Fast, isolated, uses mocks

```typescript
// Example: src/__tests__/plugin.test.ts
import { describe, it, expect } from 'bun:test';
import { starterPlugin } from '../plugin';

describe('Plugin Configuration', () => {
  it('should have correct plugin metadata', () => {
    expect(starterPlugin.name).toBe('plugin-starter');
  });
});
```

#### 2. E2E Tests (elizaOS Test Runner)

- **Purpose**: Test plugin behavior within a real elizaOS runtime
- **Location**: `src/__tests__/e2e/*.ts`
- **Runner**: elizaOS custom test runner
- **Command**: `elizaos test --type e2e`
- **Features**: Real runtime, real database, full integration

```typescript
// Example: src/__tests__/e2e/starter-plugin.ts
import { type TestSuite } from '@elizaos/core';

export const StarterPluginTestSuite: TestSuite = {
  name: 'plugin_starter_test_suite',
  tests: [
    {
      name: 'hello_world_action_test',
      fn: async (runtime) => {
        // Test with real runtime - no mocks needed!
        const action = runtime.actions.find((a) => a.name === 'HELLO_WORLD');
        if (!action) {
          throw new Error('Action not found');
        }
        // Test real behavior...
      },
    },
  ],
};
```

### Running Tests

```bash
# Run all tests (both component and E2E)
elizaos test

# Run only component tests (fast, for TDD)
bun test
# or
elizaos test --type component

# Run only E2E tests (slower, full integration)
elizaos test --type e2e
```

### Key Differences

| Aspect          | Component Tests      | E2E Tests               |
| --------------- | -------------------- | ----------------------- |
| **Runner**      | Bun test             | elizaOS TestRunner      |
| **Environment** | Mocked               | Real runtime            |
| **Database**    | Mocked               | Real (PGLite)           |
| **Speed**       | Fast (ms)            | Slower (seconds)        |
| **Use Case**    | TDD, component logic | Integration, user flows |

### E2E Test Integration

E2E tests are integrated into your plugin by:

1. **Creating the test suite** in `src/__tests__/e2e/`
2. **Importing directly** in your plugin definition:

```typescript
// src/plugin.ts
import { StarterPluginTestSuite } from './__tests__/e2e/starter-plugin';

export const starterPlugin: Plugin = {
  name: 'plugin-starter',
  // ... other properties
  tests: [StarterPluginTestSuite], // Direct import, no tests.ts needed
};
```

### Writing Effective E2E Tests

E2E tests receive a real `IAgentRuntime` instance, allowing you to:

- Access real actions, providers, and services
- Interact with the actual database
```