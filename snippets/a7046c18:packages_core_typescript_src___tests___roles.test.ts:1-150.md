# a7046c18:packages_core_typescript_src___tests___roles.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/roles.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  type MockFunction,
  mock,
  spyOn,
} from "bun:test";
import * as entities from "../entities";
import * as logger_module from "../logger";
import { findWorldsForOwner, getUserServerRole } from "../roles";
import { type IAgentRuntime, Role, type UUID, type World } from "../types";

describe("roles utilities", () => {
  let mockRuntime: IAgentRuntime;
  let getWorldMock: MockFunction<(id: UUID) => Promise<World | null>>;
  let getAllWorldsMock: MockFunction<() => Promise<World[]>>;

  beforeEach(() => {
    mock.restore();

    // Set up scoped mocks for this test
    spyOn(entities, "createUniqueUuid").mockImplementation(
      (_runtime: IAgentRuntime, serverId: string) =>
        `unique-${serverId}` as UUID,
    );

    // Mock logger if it doesn't have the methods
    if (logger_module.logger) {
      const methods = ["error", "info", "warn", "debug"];
      methods.forEach((method) => {
        if (
          typeof logger_module.logger[
            method as keyof typeof logger_module.logger
          ] === "function"
        ) {
          spyOn(
            logger_module.logger,
            method as keyof typeof logger_module.logger,
          ).mockImplementation(() => {});
        } else {
          logger_module.logger[method as keyof typeof logger_module.logger] =
            mock(
              () => {},
            ) as (typeof logger_module.logger)[keyof typeof logger_module.logger];
        }
      });
    }

    getWorldMock = mock<(id: UUID) => Promise<World | null>>();
    getAllWorldsMock = mock<() => Promise<World[]>>();

    mockRuntime = {
      agentId: "agent-123" as UUID,
      character: {
        id: "agent-123" as UUID,
        name: "TestAgent",
        username: "testagent",
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

  describe("getUserServerRole", () => {
    it("should return role from world metadata", async () => {
      const mockWorld: World = {
        id: "world-123" as UUID,
        name: "Test World",
        agentId: "agent-123" as UUID,
        messageServerId: "server-123",
        metadata: {
          roles: {
            ["user-123-456-789-abc-def012345678" as UUID]: Role.ADMIN,
          },
        },
      };

      getWorldMock.mockResolvedValue(mockWorld);

      const role = await getUserServerRole(
        mockRuntime,
        "user-123-456-789-abc-def012345678",
        "server-123",
      );
      expect(role).toBe(Role.ADMIN);
    });

    it("should return Role.NONE when world is null", async () => {
      getWorldMock.mockResolvedValue(null);

      const role = await getUserServerRole(
        mockRuntime,
        "user-123",
        "server-123",
      );
      expect(role).toBe(Role.NONE);
    });

    it("should return Role.NONE when world has no metadata", async () => {
      const mockWorld: World = {
        id: "world-123" as UUID,
        name: "Test World",
        agentId: "agent-123" as UUID,
        messageServerId: "server-123",
        metadata: {},
      };

      getWorldMock.mockResolvedValue(mockWorld);

      const role = await getUserServerRole(
        mockRuntime,
        "user-123",
        "server-123",
      );
      expect(role).toBe(Role.NONE);
    });

    it("should return Role.NONE when world has no roles in metadata", async () => {
      const mockWorld: World = {
        id: "world-123" as UUID,
        name: "Test World",
        agentId: "agent-123" as UUID,
        messageServerId: "server-123",
        metadata: {
          someOtherData: "value",
        },
      };

      getWorldMock.mockResolvedValue(mockWorld);

      const role = await getUserServerRole(
        mockRuntime,
        "user-123",
        "server-123",
      );
      expect(role).toBe(Role.NONE);
    });
```