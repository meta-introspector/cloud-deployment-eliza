# a7046c18:packages_docs_plugin-registry_bootstrap_testing-guide.mdx:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/bootstrap/testing-guide.mdx:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    expect(onComplete).toHaveBeenCalled();
  });
});
```

### Testing Services

```typescript
import { TaskService } from '../services/task';

describe('Task Service', () => {
  it('should execute repeating tasks', async () => {
    const setup = setupActionTest();

    // Create task
    const task = {
      id: 'task-123',
      name: 'TEST_TASK',
      metadata: {
        updateInterval: 1000,
        updatedAt: Date.now() - 2000,
      },
      tags: ['queue', 'repeat'],
    };

    // Register worker
    const worker = {
      name: 'TEST_TASK',
      execute: mock(),
    };
    setup.mockRuntime.registerTaskWorker(worker);
    setup.mockRuntime.getTaskWorker.mockReturnValue(worker);
    setup.mockRuntime.getTasks.mockResolvedValue([task]);

    // Start service
    const service = await TaskService.start(setup.mockRuntime);

    // Wait for tick
    await new Promise((resolve) => setTimeout(resolve, 1100));

    // Verify execution
    expect(worker.execute).toHaveBeenCalled();
    expect(setup.mockRuntime.updateTask).toHaveBeenCalledWith(
      'task-123',
      expect.objectContaining({
        metadata: expect.objectContaining({
          updatedAt: expect.any(Number),
        }),
      })
    );

    // Cleanup
    await service.stop();
  });
});
```

## Testing Best Practices

### 1. Use Standard Test Setup

Always use the provided test utilities for consistency:

```typescript
const setup = setupActionTest({
  messageOverrides: {
    /* custom message props */
  },
  stateOverrides: {
    /* custom state */
  },
  runtimeOverrides: {
    /* custom runtime behavior */
  },
});
```

### 2. Test Edge Cases

```typescript
it('should handle missing attachments gracefully', async () => {
  setup.mockMessage.content.attachments = undefined;
  // Test continues without error
});

it('should handle network failures', async () => {
  setup.mockRuntime.useModel.mockRejectedValue(new Error('Network error'));
  // Verify graceful error handling
});
```

### 3. Mock External Dependencies

```typescript
// Mock fetch for external APIs
import { mock } from 'bun:test';

// Create mock for fetch
globalThis.fetch = mock().mockResolvedValue({
  ok: true,
  arrayBuffer: () => Promise.resolve(Buffer.from('test')),
  headers: new Map([['content-type', 'image/png']]),
});
```

### 4. Test Async Operations

```typescript
it('should handle concurrent messages', async () => {
  const messages = [
    createMockMemory({ content: { text: 'Message 1' } }),
    createMockMemory({ content: { text: 'Message 2' } }),
  ];

  // Process messages concurrently
  await Promise.all(
    messages.map((msg) =>
      messageReceivedHandler({
        runtime: setup.mockRuntime,
        message: msg,
        callback: setup.callbackFn,
      })
    )
  );

  // Verify both processed correctly
  expect(setup.callbackFn).toHaveBeenCalledTimes(2);
});
```

### 5. Verify State Changes

```typescript
it('should update agent state correctly', async () => {
  // Initial state
  expect(setup.mockRuntime.getMemories).toHaveBeenCalledTimes(0);

  // Action that modifies state
  await action.handler(...);

  // Verify state changes
  expect(setup.mockRuntime.createMemory).toHaveBeenCalled();
  expect(setup.mockRuntime.updateRelationship).toHaveBeenCalled();
});
```

## Common Testing Scenarios

### Testing Room Type Behavior

```