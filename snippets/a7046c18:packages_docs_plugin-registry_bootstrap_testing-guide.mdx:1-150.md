# a7046c18:packages_docs_plugin-registry_bootstrap_testing-guide.mdx:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/bootstrap/testing-guide.mdx:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
---
title: "Testing Guide"
description: "Testing patterns and best practices for the bootstrap plugin"
---

This guide covers testing patterns and best practices for developing with the plugin-bootstrap package.

## Overview

The plugin-bootstrap package includes a comprehensive test suite that demonstrates how to test:

- <Icon icon="wrench" /> Actions
- <Icon icon="chart-bar" /> Providers
- <Icon icon="brain" /> Evaluators
- <Icon icon="clock" /> Services
- <Icon icon="envelope" /> Event Handlers
- <Icon icon="refresh" /> Message Processing Logic

## Test Setup

### Test Framework

This plugin uses **Bun's built-in test runner**, not Vitest. Bun provides a Jest-compatible testing API with excellent TypeScript support and fast execution.

### Using the Standard Test Utilities

The package provides robust test utilities in `src/__tests__/test-utils.ts`:

```typescript
import { setupActionTest } from '@elizaos/plugin-bootstrap/test-utils';

describe('My Component', () => {
  let mockRuntime: MockRuntime;
  let mockMessage: Partial<Memory>;
  let mockState: Partial<State>;
  let callbackFn: ReturnType<typeof mock>;

  beforeEach(() => {
    const setup = setupActionTest();
    mockRuntime = setup.mockRuntime;
    mockMessage = setup.mockMessage;
    mockState = setup.mockState;
    callbackFn = setup.callbackFn;
  });
});
```

### Available Mock Factories

```typescript
// Create a mock runtime with all methods
const runtime = createMockRuntime();

// Create a mock memory/message
const message = createMockMemory({
  content: { text: 'Hello world' },
  entityId: 'user-123',
  roomId: 'room-456',
});

// Create a mock state
const state = createMockState({
  values: {
    customKey: 'customValue',
  },
});

// Create a mock service
const service = createMockService({
  serviceType: ServiceType.TASK,
});
```

## Testing Patterns

### Testing Actions

#### Basic Action Test

```typescript
import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { replyAction } from '../actions/reply';
import { setupActionTest } from '../test-utils';

describe('Reply Action', () => {
  let mockRuntime: MockRuntime;
  let mockMessage: Partial<Memory>;
  let mockState: Partial<State>;
  let callbackFn: ReturnType<typeof mock>;

  beforeEach(() => {
    const setup = setupActionTest();
    mockRuntime = setup.mockRuntime;
    mockMessage = setup.mockMessage;
    mockState = setup.mockState;
    callbackFn = setup.callbackFn;
  });

  it('should validate successfully', async () => {
    const result = await replyAction.validate(mockRuntime);
    expect(result).toBe(true);
  });

  it('should generate appropriate response', async () => {
    // Setup LLM response
    mockRuntime.useModel.mockResolvedValue({
      thought: 'User greeted me',
      message: 'Hello! How can I help you?',
    });

    // Execute action
    await replyAction.handler(
      mockRuntime,
      mockMessage as Memory,
      mockState as State,
      {},
      callbackFn
    );

    // Verify callback was called with correct content
    expect(callbackFn).toHaveBeenCalledWith({
      thought: 'User greeted me',
      text: 'Hello! How can I help you?',
      actions: ['REPLY'],
    });
  });
});
```

#### Testing Action with Dependencies

```typescript
describe('Follow Room Action', () => {
  it('should update participation status', async () => {
    const setup = setupActionTest();

    // Setup room data
    setup.mockRuntime.getRoom.mockResolvedValue({
      id: 'room-123',
      type: ChannelType.TEXT,
      participants: ['user-123'],
    });

    // Execute action
    await followRoomAction.handler(
      setup.mockRuntime,
      setup.mockMessage as Memory,
      setup.mockState as State,
      {},
      setup.callbackFn
```