# a7046c18:packages_docs_plugin-registry_bootstrap_testing-guide.mdx:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/bootstrap/testing-guide.mdx:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    );

    // Verify runtime methods were called
    expect(setup.mockRuntime.updateParticipantUserState).toHaveBeenCalledWith(
      'room-123',
      setup.mockRuntime.agentId,
      'FOLLOWED'
    );

    // Verify callback
    expect(setup.callbackFn).toHaveBeenCalledWith({
      text: expect.stringContaining('followed'),
      actions: ['FOLLOW_ROOM'],
    });
  });
});
```

### Testing Providers

```typescript
import { recentMessagesProvider } from '../providers/recentMessages';

describe('Recent Messages Provider', () => {
  it('should format conversation history', async () => {
    const setup = setupActionTest();

    // Mock recent messages
    const recentMessages = [
      createMockMemory({
        content: { text: 'Hello' },
        entityId: 'user-123',
        createdAt: Date.now() - 60000,
      }),
      createMockMemory({
        content: { text: 'Hi there!' },
        entityId: setup.mockRuntime.agentId,
        createdAt: Date.now() - 30000,
      }),
    ];

    setup.mockRuntime.getMemories.mockResolvedValue(recentMessages);
    setup.mockRuntime.getEntityById.mockResolvedValue({
      id: 'user-123',
      names: ['Alice'],
      metadata: { userName: 'alice' },
    });

    // Get provider data
    const result = await recentMessagesProvider.get(setup.mockRuntime, setup.mockMessage as Memory);

    // Verify structure
    expect(result).toHaveProperty('data');
    expect(result).toHaveProperty('values');
    expect(result).toHaveProperty('text');

    // Verify content
    expect(result.data.recentMessages).toHaveLength(2);
    expect(result.text).toContain('Alice: Hello');
    expect(result.text).toContain('Hi there!');
  });
});
```

### Testing Evaluators

```typescript
import { reflectionEvaluator } from '../evaluators/reflection';

describe('Reflection Evaluator', () => {
  it('should extract facts from conversation', async () => {
    const setup = setupActionTest();

    // Mock LLM response with facts
    setup.mockRuntime.useModel.mockResolvedValue({
      thought: 'Learned new information about user',
      facts: [
        {
          claim: 'User likes coffee',
          type: 'fact',
          in_bio: false,
          already_known: false,
        },
      ],
      relationships: [],
    });

    // Execute evaluator
    const result = await reflectionEvaluator.handler(
      setup.mockRuntime,
      setup.mockMessage as Memory,
      setup.mockState as State
    );

    // Verify facts were saved
    expect(setup.mockRuntime.createMemory).toHaveBeenCalledWith(
      expect.objectContaining({
        content: { text: 'User likes coffee' },
      }),
      'facts',
      true
    );
  });
});
```

### Testing Message Processing

```typescript
import { messageReceivedHandler } from '../index';

describe('Message Processing', () => {
  it('should process message end-to-end', async () => {
    const setup = setupActionTest();
    const onComplete = mock();

    // Setup room and state
    setup.mockRuntime.getRoom.mockResolvedValue({
      id: 'room-123',
      type: ChannelType.TEXT,
    });

    // Mock shouldRespond decision
    setup.mockRuntime.useModel
      .mockResolvedValueOnce('<action>REPLY</action>') // shouldRespond
      .mockResolvedValueOnce({
        // response generation
        thought: 'Responding to greeting',
        actions: ['REPLY'],
        text: 'Hello!',
        simple: true,
      });

    // Process message
    await messageReceivedHandler({
      runtime: setup.mockRuntime,
      message: setup.mockMessage as Memory,
      callback: setup.callbackFn,
      onComplete,
    });

    // Verify flow
    expect(setup.mockRuntime.addEmbeddingToMemory).toHaveBeenCalled();
    expect(setup.mockRuntime.createMemory).toHaveBeenCalled();
    expect(setup.callbackFn).toHaveBeenCalledWith(
      expect.objectContaining({
        text: 'Hello!',
        actions: ['REPLY'],
      })
    );
```