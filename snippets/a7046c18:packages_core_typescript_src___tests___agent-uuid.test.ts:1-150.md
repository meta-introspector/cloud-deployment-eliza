# a7046c18:packages_core_typescript_src___tests___agent-uuid.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/agent-uuid.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { beforeEach, describe, expect, it, mock } from "bun:test";
import { v4 as uuidv4 } from "uuid";
import { AgentRuntime } from "../runtime";
import type { Agent, Character, IDatabaseAdapter, UUID } from "../types";

const stringToUuid = (id: string): UUID => id as UUID;

/**
 * Test suite to verify agent UUID identification behavior.
 * - Agents are uniquely identified by UUID
 * - Multiple agents with the same name are allowed when they have explicit different UUIDs
 * - For backward compatibility, agents without explicit IDs get deterministic UUIDs from their names
 */
describe("Agent UUID Identification", () => {
  let mockAdapter: IDatabaseAdapter;
  let adapterReady = false;
  const agentStore = new Map<UUID, Agent>();

  beforeEach(() => {
    mock.restore();
    adapterReady = false;
    agentStore.clear();

    // Create a mock adapter that stores agents by UUID
    mockAdapter = {
      db: {},
      init: mock().mockImplementation(async () => {
        adapterReady = true;
      }),
      initialize: mock().mockResolvedValue(undefined),
      runMigrations: mock().mockResolvedValue(undefined),
      isReady: mock().mockImplementation(async () => adapterReady),
      close: mock().mockImplementation(async () => {
        adapterReady = false;
      }),
      getConnection: mock().mockResolvedValue({}),
      getAgent: mock().mockImplementation(async (agentId: UUID) => {
        return agentStore.get(agentId) || null;
      }),
      getAgents: mock().mockImplementation(async () => {
        return Array.from(agentStore.values());
      }),
      createAgent: mock().mockImplementation(async (agent: Partial<Agent>) => {
        if (!agent.id) return false;
        const fullAgent: Agent = {
          id: agent.id,
          name: agent.name || "Unknown",
          username: agent.username,
          bio: agent.bio || "An AI agent",
          createdAt: agent.createdAt || Date.now(),
          updatedAt: agent.updatedAt || Date.now(),
        };
        agentStore.set(agent.id, fullAgent);
        return true;
      }),
      updateAgent: mock().mockImplementation(
        async (agentId: UUID, updates: Partial<Agent>) => {
          const existing = agentStore.get(agentId);
          if (!existing) return false;
          agentStore.set(agentId, {
            ...existing,
            ...updates,
            updatedAt: Date.now(),
          });
          return true;
        },
      ),
      deleteAgent: mock().mockImplementation(async (agentId: UUID) => {
        return agentStore.delete(agentId);
      }),
      ensureEmbeddingDimension: mock().mockResolvedValue(undefined),
      getEntitiesByIds: mock().mockImplementation(async (entityIds: UUID[]) => {
        // Return entities for the requested IDs
        return entityIds.map((id) => ({
          id,
          agentId: id,
          names: ["Test Entity"],
          metadata: {},
        }));
      }),
      createEntities: mock().mockResolvedValue(true),
      getMemories: mock().mockResolvedValue([]),
      getMemoryById: mock().mockResolvedValue(null),
      getMemoriesByRoomIds: mock().mockResolvedValue([]),
      getMemoriesByIds: mock().mockResolvedValue([]),
      getCachedEmbeddings: mock().mockResolvedValue([]),
      log: mock().mockResolvedValue(undefined),
      searchMemories: mock().mockResolvedValue([]),
      createMemory: mock().mockResolvedValue(stringToUuid(uuidv4())),
      deleteMemory: mock().mockResolvedValue(undefined),
      deleteManyMemories: mock().mockResolvedValue(undefined),
      deleteAllMemories: mock().mockResolvedValue(undefined),
      countMemories: mock().mockResolvedValue(0),
      getRoomsByIds: mock().mockResolvedValue([]),
      createRooms: mock().mockResolvedValue([stringToUuid(uuidv4())]),
      deleteRoom: mock().mockResolvedValue(undefined),
      getRoomsForParticipant: mock().mockResolvedValue([]),
      getRoomsForParticipants: mock().mockResolvedValue([]),
      addParticipantsRoom: mock().mockResolvedValue(true),
      removeParticipant: mock().mockResolvedValue(true),
      getParticipantsForEntity: mock().mockResolvedValue([]),
      getParticipantsForRoom: mock().mockResolvedValue([]),
      getParticipantUserState: mock().mockResolvedValue(null),
      setParticipantUserState: mock().mockResolvedValue(undefined),
      createRelationship: mock().mockResolvedValue(true),
      getRelationship: mock().mockResolvedValue(null),
      getRelationships: mock().mockResolvedValue([]),
      getEntitiesForRoom: mock().mockResolvedValue([]),
      updateEntity: mock().mockResolvedValue(undefined),
      getComponent: mock().mockResolvedValue(null),
      getComponents: mock().mockResolvedValue([]),
      createComponent: mock().mockResolvedValue(true),
      updateComponent: mock().mockResolvedValue(undefined),
      deleteComponent: mock().mockResolvedValue(undefined),
      createWorld: mock().mockResolvedValue(stringToUuid(uuidv4())),
      getWorld: mock().mockResolvedValue(null),
      getAllWorlds: mock().mockResolvedValue([]),
      updateWorld: mock().mockResolvedValue(undefined),
      updateRoom: mock().mockResolvedValue(undefined),
      getRoomsByWorld: mock().mockResolvedValue([]),
      updateRelationship: mock().mockResolvedValue(undefined),
      getCache: mock().mockResolvedValue(undefined),
      setCache: mock().mockResolvedValue(true),
      deleteCache: mock().mockResolvedValue(true),
      createTask: mock().mockResolvedValue(stringToUuid(uuidv4())),
      getTasks: mock().mockResolvedValue([]),
      getTask: mock().mockResolvedValue(null),
      getTasksByName: mock().mockResolvedValue([]),
      updateTask: mock().mockResolvedValue(undefined),
      deleteTask: mock().mockResolvedValue(undefined),
      updateMemory: mock().mockResolvedValue(true),
      getLogs: mock().mockResolvedValue([]),
      deleteLog: mock().mockResolvedValue(undefined),
      removeWorld: mock().mockResolvedValue(undefined),
      deleteRoomsByWorldId: mock().mockResolvedValue(undefined),
      getMemoriesByWorldId: mock().mockResolvedValue([]),
    } as IDatabaseAdapter;
  });

  it("should allow multiple agents with the same name but different UUIDs", async () => {
    const sharedName = "TestAgent";
    const agentId1 = stringToUuid(uuidv4());
    const agentId2 = stringToUuid(uuidv4());

    // Create first agent
    const character1: Character = {
      id: agentId1,
      name: sharedName,
      bio: ["First agent with this name"],
    };
```