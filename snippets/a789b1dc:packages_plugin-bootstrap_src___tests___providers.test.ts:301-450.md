# a789b1dc:packages_plugin-bootstrap_src___tests___providers.test.ts:301-450

**Commit:** a789b1dcd507d69194402dc7d6c9218ec81fc42f
**Author:** Odilitime
**Date:** Thu Dec 18 17:01:58 2025 -0800
**File:** packages/plugin-bootstrap/src/__tests__/providers.test.ts:301-450
**Novelty Score:** 19.96
**Concepts:** plugin-system, testing

```
    expect(result.text).toContain('TEST_PROVIDER_2');
    expect(result.text).toContain('Test provider 2');
    expect(result.text).not.toContain('INTERNAL_PROVIDER');

    // Check data format
    expect(result.data).toBeDefined();
    expect(result?.data?.dynamicProviders).toHaveLength(2);
    expect(result?.data?.dynamicProviders?.[0]?.name).toBe('TEST_PROVIDER_1');
    expect(result?.data?.dynamicProviders?.[1]?.name).toBe('TEST_PROVIDER_2');
  });

  it('should handle empty provider list gracefully', async () => {
    // Mock empty providers
    mockRuntime.providers = [];

    const result = await providersProvider.get(
      mockRuntime as IAgentRuntime,
      mockMessage as Memory,
      mockState as State
    );

    expect(result).toBeDefined();
    expect(result.text).toContain('No dynamic providers are currently available');
    expect(result.data).toBeDefined();
    expect(result.data?.dynamicProviders).toHaveLength(0);
    expect(result.data?.allProviders).toHaveLength(0);
  });
});

describe('Recent Messages Provider', () => {
  let mockRuntime: MockRuntime;
  let mockMessage: Partial<Memory>;
  let mockState: Partial<State>;
  let mockMessages: Array<Partial<Memory>>;

  beforeEach(() => {
    // Create sample messages
    mockMessages = [
      createMockMemory({
        id: 'msg-1' as UUID,
        content: { text: 'Hello there!', channelType: ChannelType.GROUP },
        createdAt: Date.now() - 3000,
      }),
      createMockMemory({
        id: 'msg-2' as UUID,
        content: { text: 'How are you?', channelType: ChannelType.GROUP },
        createdAt: Date.now() - 2000,
      }),
      createMockMemory({
        id: 'msg-3' as UUID,
        content: { text: 'I am doing well.', channelType: ChannelType.GROUP },
        createdAt: Date.now() - 1000,
      }),
    ];

    // Use standardized mock factories
    mockRuntime = createMockRuntime();
    mockMessage = createMockMemory();
    mockState = createMockState();

    // Mock getMemories to return sample messages
    mockRuntime.getMemories = mock().mockResolvedValue(mockMessages);
  });

  afterEach(() => {
    mock.restore();
  });

  it('should retrieve recent messages', async () => {
    const result = await recentMessagesProvider.get(
      mockRuntime as IAgentRuntime,
      mockMessage as Memory,
      mockState as State
    );

    expect(result).toBeDefined();
    expect(result.text).toContain('Hello there!');
    expect(result.text).toContain('How are you?');
    expect(result.text).toContain('I am doing well.');
    expect(mockRuntime.getMemories).toHaveBeenCalledWith({
      tableName: 'messages',
      roomId: mockMessage.roomId,
      count: 10,
      unique: false,
    });
  });

  it('should handle empty message list gracefully', async () => {
    // Mock empty messages for this specific test
    mockRuntime.getMemories = mock().mockResolvedValue([]);
    // Ensure the current message content is also empty for the provider's specific check
    mockMessage.content = { ...mockMessage.content, text: '' };

    const result = await recentMessagesProvider.get(
      mockRuntime as IAgentRuntime,
      mockMessage as Memory, // Now message.content.text is empty
      mockState as State
    );

    expect(result).toBeDefined();
    // Corrected expected text to match provider output
    expect(result.text).toContain('No recent messages available');
  });

  it('should handle errors gracefully', async () => {
    // Mock error in getMemories
    mockRuntime.getMemories = mock().mockRejectedValue(new Error('Database error'));

    const result = await recentMessagesProvider.get(
      mockRuntime as IAgentRuntime,
      mockMessage as Memory,
      mockState as State
    );

    expect(result).toBeDefined();
    expect(result.text).toContain('Error retrieving recent messages.');
    // Cannot check logger.error calls without mocking @elizaos/core
  });
});

describe('Role Provider', () => {
  let mockRuntime: MockRuntime;
  let mockMessage: Partial<Memory>;
  let mockState: Partial<State>;

  const testEntityId = 'test-entity-id' as UUID;
  const otherEntityId = 'other-entity-id' as UUID;

  beforeEach(async () => {
    mockRuntime = createMockRuntime();
    mockState = createMockState();

    // Reset mocks
    mock.restore();

    (mockRuntime.getRoom as any).mockResolvedValue({
      id: 'default-room' as UUID,
      messageServerId: 'default-server' as UUID,
      type: ChannelType.GROUP,
      source: 'discord', // Added source for entity metadata access
    });

    (mockRuntime.getWorld as any).mockResolvedValue({
      id: 'default-world' as UUID,
      messageServerId: 'default-server' as UUID,
      name: 'Default Test World',
      metadata: {
        ownership: { ownerId: 'owner-user-id' as UUID },
        roles: {},
      },
```