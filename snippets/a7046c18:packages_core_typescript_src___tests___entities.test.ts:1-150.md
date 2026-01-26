# a7046c18:packages_core_typescript_src___tests___entities.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/entities.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { beforeEach, describe, expect, it, mock, spyOn } from "bun:test";
import {
  createUniqueUuid,
  findEntityByName,
  formatEntities,
  getEntityDetails,
} from "../entities";
import * as index from "../index";
import * as logger_module from "../logger";
import type { Entity, Memory, State, UUID } from "../types";
import type { IAgentRuntime } from "../types/runtime";
import * as utils from "../utils";

describe("entities", () => {
  let mockRuntime: IAgentRuntime;
  let mockMemory: Memory;
  let mockState: State;

  beforeEach(() => {
    mock.restore();

    // Mock logger methods to prevent undefined function errors
    // Mock both the index-exported logger and direct logger module
    const loggerInstances = [index.logger, logger_module.logger].filter(
      Boolean,
    );

    loggerInstances.forEach((loggerInstance) => {
      if (loggerInstance) {
        // Always ensure these methods exist and are mocked
        const methods = ["warn", "error", "info", "debug"];
        methods.forEach((method) => {
          if (typeof loggerInstance[method] === "function") {
            spyOn(loggerInstance, method).mockImplementation(() => {});
          } else {
            loggerInstance[method] = mock(() => {});
          }
        });
      }
    });

    // Create a comprehensive mock runtime
    mockRuntime = {
      agentId: "agent-id-123" as UUID,
      character: {
        id: "agent-id-123" as UUID,
        name: "TestAgent",
        username: "testagent",
        bio: [],
        messageExamples: [],
        postExamples: [],
        topics: [],
        style: { all: [], chat: [], post: [] },
        adjectives: [],
      },
      getRoom: mock(),
      getWorld: mock(),
      getEntitiesForRoom: mock(),
      getRelationships: mock(),
      getEntityById: mock(),
      useModel: mock(),
      getMemories: mock(),
    } as Partial<IAgentRuntime> as IAgentRuntime;

    // Create mock memory
    mockMemory = {
      id: "memory-123" as UUID,
      entityId: "entity-456" as UUID,
      roomId: "room-789" as UUID,
      content: {},
    } as Memory;

    // Create mock state
    mockState = {
      data: {
        room: null,
      },
      values: {},
      text: "",
    };
  });

  describe("findEntityByName", () => {
    it("should find entity by exact name match", async () => {
      const mockRoom = {
        id: "room-789" as UUID,
        name: "Test Room",
        worldId: "world-123" as UUID,
        createdAt: Date.now(),
      };

      const mockWorld = {
        id: "world-123" as UUID,
        name: "Test World",
        agentId: "agent-id-123" as UUID,
        messageServerId: "server-123" as UUID,
        metadata: {
          roles: {},
        },
        createdAt: Date.now(),
        entities: [],
      };

      const mockEntity: Entity = {
        id: "entity-123" as UUID,
        names: ["Alice", "Alice Smith"],
        agentId: "agent-id-123" as UUID,
        metadata: {},
        components: [],
      };

      mockRuntime.getRoom = mock().mockResolvedValue(mockRoom);
      mockRuntime.getWorld = mock().mockResolvedValue(mockWorld);
      mockRuntime.getEntitiesForRoom = mock().mockResolvedValue([mockEntity]);
      mockRuntime.getRelationships = mock().mockResolvedValue([]);
      mockRuntime.getMemories = mock().mockResolvedValue([]);
      mockRuntime.useModel = mock().mockResolvedValue("mocked model response");
      mockRuntime.getEntityById = mock().mockResolvedValue(mockEntity);

      // Mock the parseKeyValueXml to return the expected resolution
      const parseXmlSpy = spyOn(utils, "parseKeyValueXml");
      parseXmlSpy.mockReturnValue({
        type: "EXACT_MATCH",
        entityId: "entity-123",
        matches: {
          match: [{ name: "Alice", reason: "Exact match found" }],
        },
      });

      const result = await findEntityByName(mockRuntime, mockMemory, mockState);

      expect(result).toEqual(mockEntity);
      expect(mockRuntime.getRoom).toHaveBeenCalledWith("room-789");
      expect(mockRuntime.getEntitiesForRoom).toHaveBeenCalledWith(
        "room-789",
        true,
      );
      parseXmlSpy.mockRestore();
    });

    it("should return null when room not found", async () => {
      mockRuntime.getRoom = mock().mockResolvedValue(null);

      const result = await findEntityByName(mockRuntime, mockMemory, mockState);

      expect(result).toBeNull();
      expect(mockRuntime.getEntitiesForRoom).not.toHaveBeenCalled();
    });

    it("should filter components based on permissions", async () => {
```