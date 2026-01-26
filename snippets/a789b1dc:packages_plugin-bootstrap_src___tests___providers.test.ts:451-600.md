# a789b1dc:packages_plugin-bootstrap_src___tests___providers.test.ts:451-600

**Commit:** a789b1dcd507d69194402dc7d6c9218ec81fc42f
**Author:** Odilitime
**Date:** Thu Dec 18 17:01:58 2025 -0800
**File:** packages/plugin-bootstrap/src/__tests__/providers.test.ts:451-600
**Novelty Score:** 19.96
**Concepts:** plugin-system, testing

```
    });

    (mockRuntime.getEntityById as any).mockResolvedValue(null);

    // Setup mockState.data.room for the provider to use preferentially
    mockState.data = {
      room: {
        id: 'state-room-id' as UUID,
        messageServerId: 'state-server-id' as UUID,
        type: ChannelType.GROUP,
        source: 'discord', // Added source
      },
    };
    mockMessage = createMockMemory({ roomId: 'state-room-id' as UUID });
  });

  afterEach(() => {
    mock.restore();
  });

  it('should retrieve and format role hierarchy', async () => {
    const serverId = 'server-with-roles-simple' as UUID;
    const ownerId = 'owner-simple-test-id' as UUID;
    const worldId = 'world-for-roles-simple-test' as UUID;

    mockState.data = {
      room: {
        id: 'room-for-roles-simple-test' as UUID,
        worldId: worldId,
        messageServerId: serverId,
        type: ChannelType.GROUP,
        source: 'discord',
      },
    };

    mockMessage.roomId = 'room-for-roles-simple-test' as UUID;

    // Setup getWorld mock to return world data for any ID
    (mockRuntime.getWorld as any).mockImplementation(async (id) => {
      // Return world data for any world ID since we can't control createUniqueUuid
      return {
        id,
        messageServerId: serverId,
        name: 'Role Test World Simple',
        metadata: {
          ownership: { ownerId: 'any-owner-simple' as UUID },
          roles: { [ownerId]: 'OWNER' }, // Simplified to one owner
        },
      };
    });

    // Setup getEntityById mock
    (mockRuntime.getEntityById as any).mockImplementation(async (id) => {
      if (id === ownerId) {
        return {
          id: ownerId,
          names: ['Simple Owner'],
          metadata: { name: 'SimpleOwnerName', username: 'simple_owner_discord' },
        };
      }
      return null;
    });

    const result = await roleProvider.get(
      mockRuntime as IAgentRuntime,
      mockMessage as Memory,
      mockState as State
    );

    expect(result).toBeDefined();
    // Simpler assertions
    expect(result.text).toContain('# Server Role Hierarchy');
    expect(result.text).toContain('## Owners');
    expect(result.text).toContain('SimpleOwnerName (Simple Owner)');
    expect(result.text).not.toContain('## Administrators'); // Ensure other sections aren't there
    expect(result.text).not.toContain('## Members');

    // createUniqueUuid is not directly mockable in bun:test
    expect(mockRuntime.getWorld).toHaveBeenCalled();
    expect(mockRuntime.getEntityById).toHaveBeenCalledWith(ownerId);
  });

  // This test might need to be re-evaluated based on provider's handling of individual missing entities
  it('should handle missing entity gracefully (now expecting rejection)', async () => {
    mockMessage = createMockMemory({
      entityId: otherEntityId,
      roomId: 'room-for-rejection-test-1' as UUID,
    });
    // Ensure state.data.room is undefined so runtime.getRoom is called
    mockState.data = { ...mockState.data, room: undefined };

    (mockRuntime.getRoom as any).mockRejectedValue(new Error('Simulated DB error getting room'));

    await expect(
      roleProvider.get(mockRuntime as IAgentRuntime, mockMessage as Memory, mockState as State)
    ).rejects.toThrowError('Simulated DB error getting room');
  });

  it('should handle missing roles gracefully', async () => {
    const entityMissingRolesId = 'entity-no-roles' as UUID;
    mockMessage = createMockMemory({ entityId: entityMissingRolesId });

    const mockRoomId = 'room-with-server' as UUID;
    const mockServerId = 'server-for-roles' as UUID;
    const mockWorldId = 'world-for-no-roles-test' as UUID;

    mockMessage.roomId = mockRoomId;
    mockState.data = {
      room: {
        id: mockRoomId,
        worldId: mockWorldId,
        messageServerId: mockServerId,
        type: ChannelType.GROUP,
        source: 'discord',
      },
    };

    // Setup getWorld mock to return world data for any ID
    (mockRuntime.getWorld as any).mockImplementation(async (id) => {
      // Return world data for any world ID since we can't control createUniqueUuid
      return {
        id,
        messageServerId: mockServerId,
        name: 'Test World No Roles',
        metadata: {
          ownership: { ownerId: 'some-owner' as UUID },
          roles: {}, // Empty roles
        },
      };
    });

    const result = await roleProvider.get(
      mockRuntime as IAgentRuntime,
      mockMessage as Memory,
      mockState as State // mockState now includes room for the provider
    );

    expect(result).toBeDefined();
    expect(result.text).toBeDefined();
    expect(typeof result.text).toBe('string');
    if (typeof result.text === 'string') {
      expect(result.text).toContain('No role information available for this server.');
    }
    // Optionally, check that getEntityById was not called, or called 0 times if roles object was empty
    expect(mockRuntime.getEntityById).not.toHaveBeenCalled();
  });

  it('should handle errors gracefully (now expecting rejection)', async () => {
    mockMessage = createMockMemory({
      entityId: testEntityId,
```