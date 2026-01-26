# 5e8c73c1:packages_core_src___tests___ensure-agent-exists.test.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/__tests__/ensure-agent-exists.test.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
import { describe, it, expect, beforeEach, afterEach, mock } from 'bun:test';
import { AgentRuntime } from '../runtime';
import type { Character, IDatabaseAdapter, Agent, UUID } from '../types';
import { v4 as uuidv4 } from 'uuid';

// Helper type for bun:test mocks with additional methods
interface BunMockFunction<T extends (...args: never[]) => unknown> {
  (...args: Parameters<T>): ReturnType<T>;
  mockResolvedValueOnce: (value: Awaited<ReturnType<T>>) => BunMockFunction<T>;
  mockResolvedValue: (value: Awaited<ReturnType<T>>) => BunMockFunction<T>;
  mock: {
    calls: Parameters<T>[][];
    results: ReturnType<T>[];
  };
}

describe('ensureAgentExists - Settings Persistence', () => {
  let runtime: AgentRuntime;
  let mockAdapter: IDatabaseAdapter;
  let testCharacter: Character;
  let agentId: UUID;
  let getAgentMock: IDatabaseAdapter['getAgent'];
  let updateAgentMock: IDatabaseAdapter['updateAgent'];
  let getEntitiesByIdsMock: IDatabaseAdapter['getEntitiesByIds'];
  let getRoomsByIdsMock: IDatabaseAdapter['getRoomsByIds'];
  let getParticipantsForRoomMock: IDatabaseAdapter['getParticipantsForRoom'];
  let createEntitiesMock: IDatabaseAdapter['createEntities'];
  let createRoomsMock: IDatabaseAdapter['createRooms'];
  let addParticipantsRoomMock: IDatabaseAdapter['addParticipantsRoom'];

  beforeEach(() => {
    agentId = uuidv4() as UUID;

    testCharacter = {
      id: agentId,
      name: 'TestAgent',
      username: 'testagent',
      bio: [],
      messageExamples: [],
      postExamples: [],
      topics: [],
      style: { all: [], chat: [], post: [] },
      adjectives: [],
      settings: {
        MODEL: 'gpt-4',
        TEMPERATURE: '0.7',
      },
    };

    // Create mock adapter with proper types
    getAgentMock = mock<IDatabaseAdapter['getAgent']>(async () => null);
    updateAgentMock = mock<IDatabaseAdapter['updateAgent']>(async () => true);
    getEntitiesByIdsMock = mock<IDatabaseAdapter['getEntitiesByIds']>(async () => []);
    getRoomsByIdsMock = mock<IDatabaseAdapter['getRoomsByIds']>(async () => []);
    getParticipantsForRoomMock = mock<IDatabaseAdapter['getParticipantsForRoom']>(async () => []);
    createEntitiesMock = mock<IDatabaseAdapter['createEntities']>(async () => true);
    createRoomsMock = mock<IDatabaseAdapter['createRooms']>(async () => []);
    addParticipantsRoomMock = mock<IDatabaseAdapter['addParticipantsRoom']>(async () => true);

    mockAdapter = {
      db: {},
      init: mock(async () => {}),
      initialize: mock(async () => {}),
      close: mock(async () => {}),
      isReady: mock(async () => true),
      getConnection: mock(async () => ({})),
      getAgent: getAgentMock,
      getAgents: mock(async () => []),
      createAgent: mock(async () => true),
      updateAgent: updateAgentMock,
      deleteAgent: mock(async () => true),
      ensureEmbeddingDimension: mock(async () => {}),
      log: mock(async () => {}),
      runPluginMigrations: mock(async () => {}),
      getEntitiesByIds: getEntitiesByIdsMock,
      getRoomsByIds: getRoomsByIdsMock,
      getParticipantsForRoom: getParticipantsForRoomMock,
      createEntities: createEntitiesMock,
      addParticipantsRoom: addParticipantsRoomMock,
      createRooms: createRoomsMock,
      // Add other required methods with minimal implementations
      getEntitiesForRoom: mock(async () => []),
      updateEntity: mock(async () => {}),
      getComponent: mock(async () => null),
      getComponents: mock(async () => []),
      createComponent: mock(async () => true),
      updateComponent: mock(async () => {}),
      deleteComponent: mock(async () => {}),
      getMemories: mock(async () => []),
      getMemoryById: mock(async () => null),
      getMemoriesByIds: mock(async () => []),
      getMemoriesByRoomIds: mock(async () => []),
      getCachedEmbeddings: mock(async () => []),
      getLogs: mock(async () => []),
      deleteLog: mock(async () => {}),
      searchMemories: mock(async () => []),
      createMemory: mock(async () => 'memory-id' as UUID),
      updateMemory: mock(async () => true),
      deleteMemory: mock(async () => {}),
      deleteManyMemories: mock(async () => {}),
      deleteAllMemories: mock(async () => {}),
      countMemories: mock(async () => 0),
      createWorld: mock(async () => 'world-id' as UUID),
      getWorld: mock(async () => null),
      getAllWorlds: mock(async () => []),
      updateWorld: mock(async () => {}),
      removeWorld: mock(async () => {}),
      getRoomsByWorld: mock(async () => []),
      updateRoom: mock(async () => {}),
      deleteRoom: mock(async () => {}),
      deleteRoomsByWorldId: mock(async () => {}),
      getRoomsForParticipant: mock(async () => []),
      getRoomsForParticipants: mock(async () => []),
      removeParticipant: mock(async () => true),
      getParticipantsForEntity: mock(async () => []),
      isRoomParticipant: mock(async () => false),
      getParticipantUserState: mock(async () => null),
      setParticipantUserState: mock(async () => {}),
      createRelationship: mock(async () => true),
      getRelationship: mock(async () => null),
      getRelationships: mock(async () => []),
      updateRelationship: mock(async () => {}),
      getCache: mock(async () => undefined),
      setCache: mock(async () => true),
      deleteCache: mock(async () => true),
      createTask: mock(async () => 'task-id' as UUID),
      getTasks: mock(async () => []),
      getTask: mock(async () => null),
      getTasksByName: mock(async () => []),
      updateTask: mock(async () => {}),
      deleteTask: mock(async () => {}),
      getMemoriesByWorldId: mock(async () => []),
    } as IDatabaseAdapter;

    runtime = new AgentRuntime({
      character: testCharacter,
      adapter: mockAdapter,
    });
  });

  afterEach(() => {
    mock.restore();
  });

  it('should create a new agent when none exists in DB', async () => {
    const agent: Partial<Agent> = {
      id: agentId,
      name: 'TestAgent',
      settings: {
        MODEL: 'gpt-4',
```