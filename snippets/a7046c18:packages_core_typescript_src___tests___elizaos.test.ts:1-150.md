# a7046c18:packages_core_typescript_src___tests___elizaos.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/elizaos.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { beforeEach, describe, expect, it, mock } from "bun:test";
import { v4 as uuidv4 } from "uuid";
import { elizaOS } from "../elizaos";
import { decryptObjectValues, getSalt } from "../settings";
import type {
  Character,
  IAgentRuntime,
  IDatabaseAdapter,
  Plugin,
  UUID,
} from "../types";

// Event detail interfaces for type-safe event handlers
interface AgentsAddedDetail {
  agentIds: UUID[];
  count: number;
}

interface AgentsStoppedDetail {
  agentIds: UUID[];
  count: number;
}

interface AgentsDeletedDetail {
  agentIds: UUID[];
  count: number;
}

// Mock database adapter with minimal implementation
const mockAdapter = new Proxy({} as IDatabaseAdapter, {
  get: (_target, prop) => {
    // Return async functions for all adapter methods
    if (prop === "init" || prop === "close") {
      return mock().mockResolvedValue(undefined);
    }
    // getAgents should return an empty array
    if (prop === "getAgents") {
      return mock().mockResolvedValue([]);
    }
    // createAgent returns true
    if (prop === "createAgent") {
      return mock().mockResolvedValue(true);
    }
    // createEntity returns an object with id
    if (prop === "createEntity") {
      return mock().mockResolvedValue({ id: uuidv4() });
    }
    // createEntities returns true
    if (prop === "createEntities") {
      return mock().mockResolvedValue(true);
    }
    // getParticipantsForRoom should return an array
    if (prop === "getParticipantsForRoom") {
      return mock().mockResolvedValue([]);
    }
    // getEntitiesByIds should return mock entities with the same IDs
    if (prop === "getEntitiesByIds") {
      return (ids: UUID[]) =>
        Promise.resolve(
          ids.map((id) => ({ id, name: "TestAgent", names: ["TestAgent"] })),
        );
    }
    // createRooms should return an array of room IDs
    if (prop === "createRooms") {
      return mock().mockResolvedValue([uuidv4()]);
    }
    // addParticipantsRoom should return true
    if (prop === "addParticipantsRoom") {
      return mock().mockResolvedValue(true);
    }
    return mock().mockResolvedValue(null);
  },
});

// Mock SQL plugin that provides the adapter
const mockSqlPlugin: Plugin = {
  name: "sql",
  description: "Mock SQL plugin for testing",
  adapter: mockAdapter,
};

describe("elizaOS", () => {
  let instance: elizaOS;

  beforeEach(() => {
    instance = new elizaOS();
  });

  describe("Agent Management", () => {
    const testCharacter: Character = {
      name: "TestAgent",
      bio: "A test agent",
      system: "You are a test agent",
    };

    it("should add multiple agents", async () => {
      const agentIds = await elizaOS.addAgents([
        { character: testCharacter, plugins: [mockSqlPlugin] },
        {
          character: { ...testCharacter, name: "TestAgent2" },
          plugins: [mockSqlPlugin],
        },
      ]);

      expect(agentIds).toHaveLength(2);
      expect(agentIds[0]).toBeTruthy();
      expect(agentIds[1]).toBeTruthy();
    });

    it("should start agents", async () => {
      const agentIds = await elizaOS.addAgents([
        { character: testCharacter, plugins: [mockSqlPlugin] },
      ]);
      await elizaOS.startAgents(agentIds);

      const agent = elizaOS.getAgent(agentIds[0]);
      expect(agent).toBeTruthy();
    });

    it("should stop agents", async () => {
      const agentIds = await elizaOS.addAgents([
        { character: testCharacter, plugins: [mockSqlPlugin] },
      ]);
      await elizaOS.startAgents(agentIds);
      await elizaOS.stopAgents(agentIds);

      // Agent should still exist but be stopped
      const agent = elizaOS.getAgent(agentIds[0]);
      expect(agent).toBeTruthy();
    });

    it("should delete agents", async () => {
      const agentIds = await elizaOS.addAgents([
        { character: testCharacter, plugins: [mockSqlPlugin] },
      ]);
      await elizaOS.deleteAgents(agentIds);

      const agent = elizaOS.getAgent(agentIds[0]);
      expect(agent).toBeUndefined();
    });

    it("should get all agents", async () => {
      const _agentIds = await elizaOS.addAgents([
        { character: testCharacter, plugins: [mockSqlPlugin] },
        {
          character: { ...testCharacter, name: "TestAgent2" },
          plugins: [mockSqlPlugin],
        },
      ]);

```