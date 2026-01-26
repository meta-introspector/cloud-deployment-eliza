# 5e8c73c1:packages_core_src___tests___roles.test.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/__tests__/roles.test.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
import { describe, it, expect, beforeEach, afterEach, type MockFunction } from 'bun:test';
import { mock, spyOn } from 'bun:test';
import { getUserServerRole, findWorldsForOwner } from '../roles';
import { Role, type IAgentRuntime, type UUID, type World } from '../types';
import * as entities from '../entities';
import * as logger_module from '../logger';

describe('roles utilities', () => {
  let mockRuntime: IAgentRuntime;
  let getWorldMock: MockFunction<(id: UUID) => Promise<World | null>>;
  let getAllWorldsMock: MockFunction<() => Promise<World[]>>;

  beforeEach(() => {
    mock.restore();

    // Set up scoped mocks for this test
    spyOn(entities, 'createUniqueUuid').mockImplementation(
      (_runtime: IAgentRuntime, serverId: string) => `unique-${serverId}` as UUID
    );

    // Mock logger if it doesn't have the methods
    if (logger_module.logger) {
      const methods = ['error', 'info', 'warn', 'debug'];
      methods.forEach((method) => {
        if (
          typeof logger_module.logger[method as keyof typeof logger_module.logger] === 'function'
        ) {
          spyOn(
            logger_module.logger,
            method as keyof typeof logger_module.logger
          ).mockImplementation(() => {});
        } else {
          logger_module.logger[method as keyof typeof logger_module.logger] = mock(
            () => {}
          ) as (typeof logger_module.logger)[keyof typeof logger_module.logger];
        }
      });
    }

    getWorldMock = mock<(id: UUID) => Promise<World | null>>();
    getAllWorldsMock = mock<() => Promise<World[]>>();

    mockRuntime = {
      agentId: 'agent-123' as UUID,
      character: {
        id: 'agent-123' as UUID,
        name: 'TestAgent',
        username: 'testagent',
        bio: [],
        messageExamples: [],
        postExamples: [],
        topics: [],
        style: { all: [], chat: [], post: [] },
        adjectives: [],
      },
      getWorld: getWorldMock,
      getAllWorlds: getAllWorldsMock,
    } as Partial<IAgentRuntime> as IAgentRuntime;
  });

  afterEach(() => {
    mock.restore();
  });

  describe('getUserServerRole', () => {
    it('should return role from world metadata', async () => {
      const mockWorld: World = {
        id: 'world-123' as UUID,
        name: 'Test World',
        agentId: 'agent-123' as UUID,
        messageServerId: 'server-123',
        metadata: {
          roles: {
            ['user-123-456-789-abc-def012345678' as UUID]: Role.ADMIN,
          },
        },
      };

      getWorldMock.mockResolvedValue(mockWorld);

      const role = await getUserServerRole(
        mockRuntime,
        'user-123-456-789-abc-def012345678',
        'server-123'
      );
      expect(role).toBe(Role.ADMIN);
    });

    it('should return Role.NONE when world is null', async () => {
      getWorldMock.mockResolvedValue(null);

      const role = await getUserServerRole(mockRuntime, 'user-123', 'server-123');
      expect(role).toBe(Role.NONE);
    });

    it('should return Role.NONE when world has no metadata', async () => {
      const mockWorld: World = {
        id: 'world-123' as UUID,
        name: 'Test World',
        agentId: 'agent-123' as UUID,
        messageServerId: 'server-123',
        metadata: {},
      };

      getWorldMock.mockResolvedValue(mockWorld);

      const role = await getUserServerRole(mockRuntime, 'user-123', 'server-123');
      expect(role).toBe(Role.NONE);
    });

    it('should return Role.NONE when world has no roles in metadata', async () => {
      const mockWorld: World = {
        id: 'world-123' as UUID,
        name: 'Test World',
        agentId: 'agent-123' as UUID,
        messageServerId: 'server-123',
        metadata: {
          someOtherData: 'value',
        },
      };

      getWorldMock.mockResolvedValue(mockWorld);

      const role = await getUserServerRole(mockRuntime, 'user-123', 'server-123');
      expect(role).toBe(Role.NONE);
    });

    it('should check original ID format when first check fails', async () => {
      const mockWorld: World = {
        id: 'world-123' as UUID,
        name: 'Test World',
        agentId: 'agent-123' as UUID,
        messageServerId: 'server-123',
        metadata: {
          roles: {
            ['user-456-789-abc-def-012345678901' as UUID]: Role.OWNER,
          },
        },
      };

      getWorldMock.mockResolvedValue(mockWorld);

      // Even though the code has duplicate checks for entityId, it should return NONE
      // since 'user-123' is not in the roles
      const role = await getUserServerRole(mockRuntime, 'user-123', 'server-123');
      expect(role).toBe(Role.NONE);
    });

    it('should return role for different role types', async () => {
      const mockWorld: World = {
```