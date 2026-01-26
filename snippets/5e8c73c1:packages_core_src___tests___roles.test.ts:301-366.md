# 5e8c73c1:packages_core_src___tests___roles.test.ts:301-366

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/__tests__/roles.test.ts:301-366
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
        },
        {
          id: 'world-2' as UUID,
          name: 'World 2',
          agentId: 'agent-123' as UUID,
          messageServerId: 'server-2',
          metadata: {
            ownership: {
              ownerId: 'other-user-2',
            },
          },
        },
      ];

      getAllWorldsMock.mockResolvedValue(mockWorlds);

      const result = await findWorldsForOwner(mockRuntime, 'user-123');

      expect(result).toBeNull();
    });

    it('should handle worlds without metadata', async () => {
      const mockWorlds: World[] = [
        {
          id: 'world-1' as UUID,
          name: 'World 1',
          agentId: 'agent-123' as UUID,
          messageServerId: 'server-1',
          metadata: {},
        },
        {
          id: 'world-2' as UUID,
          name: 'World 2',
          agentId: 'agent-123' as UUID,
          messageServerId: 'server-2',
        } as World,
      ];

      getAllWorldsMock.mockResolvedValue(mockWorlds);

      const result = await findWorldsForOwner(mockRuntime, 'user-123');

      expect(result).toBeNull();
    });

    it('should handle worlds without ownership in metadata', async () => {
      const mockWorlds: World[] = [
        {
          id: 'world-1' as UUID,
          name: 'World 1',
          agentId: 'agent-123' as UUID,
          messageServerId: 'server-1',
          metadata: {
            someOtherData: 'value',
          },
        },
      ];

      getAllWorldsMock.mockResolvedValue(mockWorlds);

      const result = await findWorldsForOwner(mockRuntime, 'user-123');

      expect(result).toBeNull();
    });
  });
});
```