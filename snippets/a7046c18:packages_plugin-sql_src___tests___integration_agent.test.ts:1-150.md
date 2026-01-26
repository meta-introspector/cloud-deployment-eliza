# a7046c18:packages_plugin-sql_src___tests___integration_agent.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/agent.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "bun:test";
import { type Agent, stringToUuid, type UUID } from "@elizaos/core";
import { v4 as uuidv4 } from "uuid";
import type { PgDatabaseAdapter } from "../../pg/adapter";
import type { PgliteDatabaseAdapter } from "../../pglite/adapter";
import { agentTable } from "../../schema";
import { mockCharacter } from "../fixtures";
import { createIsolatedTestDatabase } from "../test-helpers";

describe("Agent Integration Tests", () => {
  let adapter: PgliteDatabaseAdapter | PgDatabaseAdapter;
  let cleanup: () => Promise<void>;
  let testAgentId: UUID;
  let testAgent: Agent;

  beforeAll(async () => {
    const setup = await createIsolatedTestDatabase("agent-tests");
    adapter = setup.adapter;
    cleanup = setup.cleanup;
    testAgentId = setup.testAgentId;
  });

  beforeEach(() => {
    // Reset or seed data before each test if needed
    testAgent = {
      id: testAgentId,
      name: "Test Agent",
      bio: "A test agent for running tests.",
      system: "You are a helpful assistant.",
      plugins: [],
      settings: { testSetting: "test value" },
      createdAt: Date.now(),
      updatedAt: Date.now(),
      enabled: true,
      username: "test_agent",
    };
  });

  afterAll(async () => {
    if (cleanup) {
      await cleanup();
    }
  });

  describe("Agent Tests", () => {
    beforeEach(async () => {
      // Clean up agents table before each test
      const db = adapter.getDatabase() as {
        delete: (table: typeof agentTable) => Promise<void>;
      };
      if (db && typeof db.delete === "function") {
        await db.delete(agentTable);
      }
      // Re-create the test agent
      await adapter.createAgent({
        id: testAgentId,
        ...mockCharacter,
      } as Agent);
    });

    describe("createAgent", () => {
      it("should successfully create an agent", async () => {
        const newAgentId = stringToUuid("new-test-agent-create");
        const newAgent: Agent = {
          id: newAgentId,
          name: "Integration Test Create",
          enabled: true,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          username: "integration-create",
          system: "System message",
          bio: ["Bio line 1"],
          messageExamples: [],
          postExamples: [],
          topics: [],
          adjectives: [],
          knowledge: [],
          plugins: [],
          settings: {},
          style: {},
        };

        const result = await adapter.createAgent(newAgent);
        expect(result).toBe(true);

        const createdAgent = await adapter.getAgent(newAgent.id as UUID);
        expect(createdAgent).not.toBeNull();
        expect(createdAgent?.name).toBe(newAgent.name);
      });

      it("should allow creating multiple agents with the same name (UUID-based identification)", async () => {
        const sharedName = "duplicate-name";
        const agent1Id = uuidv4() as UUID; // Use random UUID
        const agent1: Agent = {
          id: agent1Id,
          name: sharedName,
          enabled: true,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          username: "duplicate-name-1",
          system: "System message",
          bio: ["First agent with this name"],
          messageExamples: [],
          postExamples: [],
          topics: [],
          adjectives: [],
          knowledge: [],
          plugins: [],
          settings: {},
          style: {},
        };
        const result1 = await adapter.createAgent(agent1);
        expect(result1).toBe(true);

        const agent2Id = uuidv4() as UUID; // Use random UUID
        const agent2: Agent = {
          id: agent2Id,
          name: sharedName,
          enabled: true,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          username: "duplicate-name-2",
          system: "System message",
          bio: ["Second agent with this name"],
          messageExamples: [],
          postExamples: [],
          topics: [],
          adjectives: [],
          knowledge: [],
          plugins: [],
          settings: {},
          style: {},
        };
        const result2 = await adapter.createAgent(agent2);
        expect(result2).toBe(true);

        // Verify both agents exist with the same name but different IDs
        const retrievedAgent1 = await adapter.getAgent(agent1Id);
        const retrievedAgent2 = await adapter.getAgent(agent2Id);

        expect(retrievedAgent1).not.toBeNull();
        expect(retrievedAgent2).not.toBeNull();
        expect(retrievedAgent1?.name).toBe(sharedName);
```