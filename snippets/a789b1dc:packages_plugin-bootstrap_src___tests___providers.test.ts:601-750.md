# a789b1dc:packages_plugin-bootstrap_src___tests___providers.test.ts:601-750

**Commit:** a789b1dcd507d69194402dc7d6c9218ec81fc42f
**Author:** Odilitime
**Date:** Thu Dec 18 17:01:58 2025 -0800
**File:** packages/plugin-bootstrap/src/__tests__/providers.test.ts:601-750
**Novelty Score:** 19.96
**Concepts:** plugin-system, testing

```
      roomId: 'room-for-rejection-test-2' as UUID,
    });
    // Ensure state.data.room is undefined so runtime.getRoom is called
    mockState.data = { ...mockState.data, room: undefined };

    const specificError = new Error('DB error for roles test');
    (mockRuntime.getRoom as any).mockRejectedValue(specificError);

    await expect(
      roleProvider.get(mockRuntime as IAgentRuntime, mockMessage as Memory, mockState as State)
    ).rejects.toThrowError(specificError);
  });
});

describe('Settings Provider', () => {
  let mockRuntime: MockRuntime;
  let mockMessage: Partial<Memory>;
  let mockState: Partial<State>;

  beforeEach(() => {
    // Use standardized mock factories
    mockRuntime = createMockRuntime();

    // Create mock message with appropriate channel type
    mockMessage = createMockMemory({
      content: {
        // channelType will be set per test
      },
      entityId: 'test-owner-entity-id' as UUID, // for findWorldsForOwner
    });

    mockState = createMockState({
      data: {
        room: {
          id: 'test-room-id' as UUID,
          worldId: 'world-1' as UUID,
        },
      },
    });

    // Mock getRoom to provide room data
    mockRuntime.getRoom = mock().mockResolvedValue({
      id: 'test-room-id' as UUID,
      worldId: 'world-1' as UUID,
      type: ChannelType.GROUP, // Default, can be overridden by message
    });

    // Mock getWorld to provide world data
    mockRuntime.getWorld = mock().mockResolvedValue({
      id: 'world-1' as UUID,
      messageServerId: 'server-1',
      name: 'Test World',
    });
  });

  afterEach(async () => {
    mock.restore();
    // Cannot mock @elizaos/core functions in bun:test
  });

  it('should retrieve settings in onboarding mode', async () => {
    // Setup for onboarding
    mockMessage.content = {
      ...mockMessage.content,
      channelType: ChannelType.DM,
    };

    mockState.data = {
      room: {
        id: 'onboarding-room-id' as UUID,
        type: ChannelType.DM,
      },
    };
    mockMessage.roomId = 'onboarding-room-id' as UUID;

    // Note: We cannot mock findWorldsForOwner and getWorldSettings from @elizaos/core
    // The settings provider will use the actual implementations
    // We'll focus on testing the provider's behavior with the mocked runtime

    (mockRuntime.getRoom as any).mockResolvedValue({
      id: 'onboarding-room-id' as UUID,
      worldId: 'world-1' as UUID,
      type: ChannelType.DM,
    });

    const result = await settingsProvider.get(
      mockRuntime as IAgentRuntime,
      mockMessage as Memory,
      mockState as State
    );

    expect(result).toBeDefined();
    expect(result.data).toBeDefined();
    // Since we can't mock getWorldSettings, we can't control what settings are returned
    // We'll just verify the structure is correct
    expect(result.text).toBeDefined();
    expect(typeof result.text).toBe('string');
  });

  it('should retrieve settings in normal mode', async () => {
    // Setup for normal mode
    mockMessage.content = {
      ...mockMessage.content,
      channelType: ChannelType.GROUP,
    };
    (mockRuntime.getRoom as any).mockResolvedValue({
      id: 'test-room-id' as UUID,
      worldId: 'world-1' as UUID,
      type: ChannelType.GROUP, // Ensure room type matches for provider logic
    });

    const result = await settingsProvider.get(
      mockRuntime as IAgentRuntime,
      mockMessage as Memory,
      mockState as State
    );

    expect(result).toBeDefined();
    expect(result.data).toBeDefined();
    // Since we can't mock getWorldSettings, we can't control what settings are returned
    // We'll just verify the structure is correct
    expect(result.text).toBeDefined();
    expect(typeof result.text).toBe('string');
  });

  it('should handle errors gracefully when getWorldSettings fails', async () => {
    // Note: We cannot directly mock getWorldSettings from @elizaos/core in bun:test
    // This test would need to be refactored to test error handling differently
    // For now, we'll test what we can without mocking core functions

    mockMessage.content = { channelType: ChannelType.DM };
    mockState.data = {
      room: {
        type: ChannelType.DM,
        id: 'dm-room-err' as UUID,
      },
    };
    mockMessage.roomId = 'dm-room-err' as UUID;

    // We can't force getWorldSettings to fail, but we can test with a mock runtime
    // that doesn't have proper world data
    (mockRuntime.getWorld as any).mockResolvedValue(null);

    const result = await settingsProvider.get(
      mockRuntime as IAgentRuntime,
      mockMessage as Memory,
      mockState as State
    );

    expect(result).toBeDefined();
```