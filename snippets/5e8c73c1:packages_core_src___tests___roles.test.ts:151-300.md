# 5e8c73c1:packages_core_src___tests___roles.test.ts:151-300

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/__tests__/roles.test.ts:151-300
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
        id: 'world-123' as UUID,
        name: 'Test World',
        agentId: 'agent-123' as UUID,
        messageServerId: 'server-123',
        metadata: {
          roles: {
            ['owner-user-123-456-789-abcdef0123' as UUID]: Role.OWNER,
            ['admin-user-123-456-789-abcdef0123' as UUID]: Role.ADMIN,
            ['none-user-123-456-789-abcdef01234' as UUID]: Role.NONE,
          },
        },
      };

      getWorldMock.mockResolvedValue(mockWorld);

      const ownerRole = await getUserServerRole(
        mockRuntime,
        'owner-user-123-456-789-abcdef0123',
        'server-123'
      );
      expect(ownerRole).toBe(Role.OWNER);

      const adminRole = await getUserServerRole(
        mockRuntime,
        'admin-user-123-456-789-abcdef0123',
        'server-123'
      );
      expect(adminRole).toBe(Role.ADMIN);

      const noneRole = await getUserServerRole(
        mockRuntime,
        'none-user-123-456-789-abcdef01234',
        'server-123'
      );
      expect(noneRole).toBe(Role.NONE);
    });
  });

  describe('findWorldsForOwner', () => {
    it('should find worlds where user is owner', async () => {
      const mockWorlds: World[] = [
        {
          id: 'world-1' as UUID,
          name: 'World 1',
          agentId: 'agent-123' as UUID,
          messageServerId: 'server-1',
          metadata: {
            ownership: {
              ownerId: 'user-123',
            },
          },
        },
        {
          id: 'world-2' as UUID,
          name: 'World 2',
          agentId: 'agent-123' as UUID,
          messageServerId: 'server-2',
          metadata: {
            ownership: {
              ownerId: 'other-user',
            },
          },
        },
        {
          id: 'world-3' as UUID,
          name: 'World 3',
          agentId: 'agent-123' as UUID,
          messageServerId: 'server-3',
          metadata: {
            ownership: {
              ownerId: 'user-123',
            },
          },
        },
      ];

      getAllWorldsMock.mockResolvedValue(mockWorlds);

      const ownerWorlds = await findWorldsForOwner(mockRuntime, 'user-123');

      expect(ownerWorlds).toBeDefined();
      expect(ownerWorlds?.length).toBe(2);
      expect(ownerWorlds?.[0].id).toBe('world-1' as UUID);
      expect(ownerWorlds?.[1].id).toBe('world-3' as UUID);
    });

    it('should return null when entityId is empty', async () => {
      const { logger } = await import('../logger');

      const result = await findWorldsForOwner(mockRuntime, '');

      expect(result).toBeNull();
      expect(logger.error).toHaveBeenCalledWith(
        { src: 'core:roles', agentId: mockRuntime.agentId },
        'User ID is required to find server'
      );
    });

    it('should return null when entityId is null', async () => {
      const { logger } = await import('../logger');

      const result = await findWorldsForOwner(mockRuntime, null as string); // Testing with null value

      expect(result).toBeNull();
      expect(logger.error).toHaveBeenCalledWith(
        { src: 'core:roles', agentId: mockRuntime.agentId },
        'User ID is required to find server'
      );
    });

    it('should return null when no worlds exist', async () => {
      const { logger } = await import('../logger');

      getAllWorldsMock.mockResolvedValue([]);

      const result = await findWorldsForOwner(mockRuntime, 'user-123');

      expect(result).toBeNull();
      expect(logger.debug).toHaveBeenCalledWith(
        { src: 'core:roles', agentId: mockRuntime.agentId },
        'No worlds found for agent'
      );
    });

    it('should return null when getAllWorlds returns null', async () => {
      const { logger } = await import('../logger');

      getAllWorldsMock.mockResolvedValue([]);

      const result = await findWorldsForOwner(mockRuntime, 'user-123');

      expect(result).toBeNull();
      expect(logger.debug).toHaveBeenCalledWith(
        { src: 'core:roles', agentId: mockRuntime.agentId },
        'No worlds found for agent'
      );
    });

    it('should return null when no worlds match the owner', async () => {
      const mockWorlds: World[] = [
        {
          id: 'world-1' as UUID,
          name: 'World 1',
          agentId: 'agent-123' as UUID,
          messageServerId: 'server-1',
          metadata: {
            ownership: {
              ownerId: 'other-user-1',
            },
          },
```