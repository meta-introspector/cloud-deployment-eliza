# a789b1dc:packages_plugin-bootstrap_src___tests___providers.test.ts:151-300

**Commit:** a789b1dcd507d69194402dc7d6c9218ec81fc42f
**Author:** Odilitime
**Date:** Thu Dec 18 17:01:58 2025 -0800
**File:** packages/plugin-bootstrap/src/__tests__/providers.test.ts:151-300
**Novelty Score:** 19.96
**Concepts:** plugin-system, testing

```
  let mockRuntime: MockRuntime;
  let mockMessage: Partial<Memory>;
  let mockState: Partial<State>;

  beforeEach(() => {
    // Use setupActionTest for consistent test setup
    const setup = setupActionTest();
    mockRuntime = setup.mockRuntime;
    mockMessage = setup.mockMessage;
    mockState = setup.mockState;

    // Mock for initial recent messages
    mockRuntime.getMemories = mock().mockResolvedValue([
      {
        id: 'msg-prev-1' as UUID,
        content: { text: 'Previous message 1' },
        createdAt: Date.now() - 1000,
      },
    ]);

    // Mock for useModel
    mockRuntime.useModel = mock().mockResolvedValue([0.1, 0.2, 0.3]); // Example embedding

    // Mock for searchMemories
    mockRuntime.searchMemories = mock().mockImplementation(async (params) => {
      if (params.tableName === 'facts' && params.count === 6) {
        // Could differentiate between the two calls if needed by params.entityId
        if (params.entityId === mockMessage.entityId) {
          // recentFactsData call
          return [
            {
              id: 'memory-2' as UUID,
              entityId: 'entity-1' as UUID,
              agentId: 'agent-1' as UUID,
              roomId: 'room-1' as UUID,
              content: { text: 'User dislikes spicy food' },
              embedding: [0.2, 0.3, 0.4],
              createdAt: Date.now(),
            },
          ];
        } else {
          // relevantFacts call
          return [
            {
              id: 'memory-1' as UUID,
              entityId: 'entity-1' as UUID, // Can be different or same based on test
              agentId: 'agent-1' as UUID,
              roomId: 'room-1' as UUID,
              content: { text: 'User likes chocolate' },
              embedding: [0.1, 0.2, 0.3],
              createdAt: Date.now(),
            },
          ];
        }
      }
      return [];
    });
  });

  afterEach(() => {
    mock.restore();
  });

  it('should retrieve facts about a user', async () => {
    const result = await factsProvider.get(
      mockRuntime as IAgentRuntime,
      mockMessage as Memory,
      mockState as State
    );

    expect(result).toBeDefined();
    expect(result.text).toContain('User likes chocolate');
    expect(result.text).toContain('User dislikes spicy food');
    expect(mockRuntime.getMemories).toHaveBeenCalledWith({
      tableName: 'messages',
      roomId: mockMessage.roomId,
      count: 10,
      unique: false,
    });
    expect(mockRuntime.useModel).toHaveBeenCalled();
    expect(mockRuntime.searchMemories).toHaveBeenCalledTimes(2);
  });

  it('should handle empty results gracefully', async () => {
    // Mock empty memories from searchMemories
    mockRuntime.searchMemories = mock().mockResolvedValue([]);

    const result = await factsProvider.get(
      mockRuntime as IAgentRuntime,
      mockMessage as Memory,
      mockState as State
    );

    expect(result).toBeDefined();
    expect(result.text).toContain('No facts available.');
  });

  it('should handle errors gracefully', async () => {
    // Mock error in getMemories (initial call)
    mockRuntime.getMemories = mock().mockRejectedValue(new Error('Database error'));

    const result = await factsProvider.get(
      mockRuntime as IAgentRuntime,
      mockMessage as Memory,
      mockState as State
    );

    expect(result).toBeDefined();
    expect(result.text).toContain('Error retrieving facts.');
    // Cannot check logger.error calls without mocking @elizaos/core
  });
});

describe('Providers Provider', () => {
  let mockRuntime: MockRuntime;
  let mockMessage: Partial<Memory>;
  let mockState: Partial<State>;

  beforeEach(() => {
    // Use standardized mock factories
    mockRuntime = createMockRuntime({
      providers: [
        { name: 'TEST_PROVIDER_1', description: 'Test provider 1', dynamic: true, get: mock() },
        { name: 'TEST_PROVIDER_2', description: 'Test provider 2', dynamic: true, get: mock() },
        {
          name: 'INTERNAL_PROVIDER',
          description: 'Internal provider',
          dynamic: false,
          get: mock(),
        },
      ],
    });
    mockMessage = createMockMemory();
    mockState = createMockState();
  });

  afterEach(() => {
    mock.restore();
  });

  it('should list all dynamic providers', async () => {
    const result = await providersProvider.get(
      mockRuntime as IAgentRuntime,
      mockMessage as Memory,
      mockState as State
    );

    expect(result).toBeDefined();
    expect(result.text).toContain('TEST_PROVIDER_1');
    expect(result.text).toContain('Test provider 1');
```