# a7046c18:packages_docs_plugin-registry_bootstrap_testing-guide.mdx:451-585

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/bootstrap/testing-guide.mdx:451-585
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
```typescript
describe('Room Type Handling', () => {
  it.each([
    [ChannelType.DM, true],
    [ChannelType.TEXT, false],
    [ChannelType.VOICE_DM, true],
  ])('should bypass shouldRespond for %s: %s', async (roomType, shouldBypass) => {
    setup.mockRuntime.getRoom.mockResolvedValue({
      id: 'room-123',
      type: roomType,
    });

    // Test behavior based on room type
  });
});
```

### Testing Provider Context

```typescript
it('should include all requested providers', async () => {
  const state = await setup.mockRuntime.composeState(setup.mockMessage, [
    'RECENT_MESSAGES',
    'ENTITIES',
    'RELATIONSHIPS',
  ]);

  expect(state.providerData).toHaveLength(3);
  expect(state.providerData[0].providerName).toBe('RECENT_MESSAGES');
});
```

### Testing Error Recovery

```typescript
it('should recover from provider errors', async () => {
  // Make one provider fail
  setup.mockRuntime.getMemories.mockRejectedValueOnce(new Error('DB error'));

  // Should still process message
  await messageReceivedHandler({...});

  // Verify graceful degradation
  expect(setup.callbackFn).toHaveBeenCalled();
});
```

## Running Tests

```bash
# Run all bootstrap tests
bun test

# Run specific test file
bun test packages/plugin-bootstrap/src/__tests__/actions.test.ts

# Run tests in watch mode
bun test --watch

# Run with coverage
bun test --coverage
```

## Bun Test Features

Bun's test runner provides several advantages:

1. **Fast execution** - Tests run directly in Bun's runtime
2. **Built-in TypeScript** - No compilation step needed
3. **Jest compatibility** - Familiar API for developers
4. **Built-in mocking** - The `mock()` function is built-in
5. **Snapshot testing** - Built-in support for snapshots
6. **Watch mode** - Automatic re-running on file changes

### Bun Mock API

```typescript
import { mock } from 'bun:test';

// Create a mock function
const mockFn = mock();

// Set return value
mockFn.mockReturnValue('value');
mockFn.mockResolvedValue('async value');

// Set implementation
mockFn.mockImplementation((arg) => arg * 2);

// Check calls
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith('arg');
expect(mockFn).toHaveBeenCalledTimes(2);

// Reset mocks
mock.restore(); // Reset all mocks
mockFn.mockReset(); // Reset specific mock
```

## Tips for Writing Tests

1. **Start with the happy path** - Test normal operation first
2. **Add edge cases** - Empty arrays, null values, errors
3. **Test async behavior** - Timeouts, retries, concurrent operations
4. **Verify side effects** - Database updates, event emissions
5. **Keep tests focused** - One concept per test
6. **Use descriptive names** - Should describe what is being tested
7. **Mock at boundaries** - Mock external services, not internal logic

## Debugging Tests

```typescript
// Add console logs to debug
it('should process correctly', async () => {
  setup.mockRuntime.useModel.mockImplementation(async (type, params) => {
    console.log('Model called with:', { type, params });
    return mockResponse;
  });

  // Step through with debugger
  debugger;
  await action.handler(...);
});
```

## Differences from Vitest

If you're familiar with Vitest, here are the key differences:

1. **Import from `bun:test`** instead of `vitest`
2. **No need for `vi` prefix** - Just use `mock()` directly
3. **No configuration file** - Bun test works out of the box
4. **Different CLI commands** - Use `bun test` instead of `vitest`

Remember: Good tests make development faster and more confident. The test suite is your safety net when making changes!
```