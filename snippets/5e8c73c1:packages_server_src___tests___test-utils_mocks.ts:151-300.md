# 5e8c73c1:packages_server_src___tests___test-utils_mocks.ts:151-300

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/server/src/__tests__/test-utils/mocks.ts:151-300
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
    createRelationship: jest.fn(() => Promise.resolve(true)),
    updateRelationship: jest.fn(() => Promise.resolve()),
    getRelationship: jest.fn(() => Promise.resolve(null)),
    getRelationships: jest.fn(() => Promise.resolve([])),
    getCache: jest.fn(() => Promise.resolve(undefined)),
    setCache: jest.fn(() => Promise.resolve(true)),
    deleteCache: jest.fn(() => Promise.resolve(true)),
    createTask: jest.fn(() => Promise.resolve('123e4567-e89b-12d3-a456-426614174000' as UUID)),
    getTasks: jest.fn(() => Promise.resolve([])),
    getTask: jest.fn(() => Promise.resolve(null)),
    getTasksByName: jest.fn(() => Promise.resolve([])),
    updateTask: jest.fn(() => Promise.resolve()),
    deleteTask: jest.fn(() => Promise.resolve()),
    getMemoriesByWorldId: jest.fn(() => Promise.resolve([])),

    ...overrides,
  };

  return baseRuntime as IAgentRuntime;
}

/**
 * Creates a mock DatabaseAdapter with message server methods
 */
export function createMockDatabaseAdapter(overrides?: any): DatabaseAdapter & any {
  const baseAdapter = {
    // Core DatabaseAdapter methods
    db: { execute: jest.fn(() => Promise.resolve([])) },
    init: jest.fn(() => Promise.resolve()),
    initialize: jest.fn(() => Promise.resolve()),
    isReady: jest.fn(() => Promise.resolve(true)),
    runMigrations: jest.fn(() => Promise.resolve()),
    close: jest.fn(() => Promise.resolve()),
    getConnection: jest.fn(() => Promise.resolve({ execute: jest.fn(() => Promise.resolve([])) })),

    // Agent methods
    getAgent: jest.fn(() => Promise.resolve(null)),
    getAgents: jest.fn(() => Promise.resolve([])),
    createAgent: jest.fn(() => Promise.resolve(true)),
    updateAgent: jest.fn(() => Promise.resolve(true)),
    deleteAgent: jest.fn(() => Promise.resolve(true)),

    // Entity methods
    getEntitiesByIds: jest.fn(() => Promise.resolve(null)),
    getEntitiesForRoom: jest.fn(() => Promise.resolve([])),
    createEntities: jest.fn(() => Promise.resolve(true)),
    updateEntity: jest.fn(() => Promise.resolve()),

    // Component methods
    getComponent: jest.fn(() => Promise.resolve(null)),
    getComponents: jest.fn(() => Promise.resolve([])),
    createComponent: jest.fn(() => Promise.resolve(true)),
    updateComponent: jest.fn(() => Promise.resolve()),
    deleteComponent: jest.fn(() => Promise.resolve()),

    // Memory methods
    getMemories: jest.fn(() => Promise.resolve([])),
    getMemoryById: jest.fn(() => Promise.resolve(null)),
    getMemoriesByIds: jest.fn(() => Promise.resolve([])),
    getMemoriesByRoomIds: jest.fn(() => Promise.resolve([])),
    getCachedEmbeddings: jest.fn(() => Promise.resolve([])),
    searchMemories: jest.fn(() => Promise.resolve([])),
    createMemory: jest.fn(() => Promise.resolve('123e4567-e89b-12d3-a456-426614174000' as UUID)),
    updateMemory: jest.fn(() => Promise.resolve(true)),
    deleteMemory: jest.fn(() => Promise.resolve()),
    deleteManyMemories: jest.fn(() => Promise.resolve()),
    deleteAllMemories: jest.fn(() => Promise.resolve()),
    countMemories: jest.fn(() => Promise.resolve(0)),
    getMemoriesByWorldId: jest.fn(() => Promise.resolve([])),
    ensureEmbeddingDimension: jest.fn(() => Promise.resolve()),

    // Log methods
    log: jest.fn(() => Promise.resolve()),
    getLogs: jest.fn(() => Promise.resolve([])),
    deleteLog: jest.fn(() => Promise.resolve()),

    // World methods
    createWorld: jest.fn(() => Promise.resolve('123e4567-e89b-12d3-a456-426614174000' as UUID)),
    getWorld: jest.fn(() => Promise.resolve(null)),
    removeWorld: jest.fn(() => Promise.resolve()),
    getAllWorlds: jest.fn(() => Promise.resolve([])),
    updateWorld: jest.fn(() => Promise.resolve()),

    // Room methods
    getRoomsByIds: jest.fn(() => Promise.resolve(null)),
    createRooms: jest.fn(() => Promise.resolve([])),
    deleteRoom: jest.fn(() => Promise.resolve()),
    deleteRoomsByWorldId: jest.fn(() => Promise.resolve()),
    updateRoom: jest.fn(() => Promise.resolve()),
    getRoomsForParticipant: jest.fn(() => Promise.resolve([])),
    getRoomsForParticipants: jest.fn(() => Promise.resolve([])),
    getRoomsByWorld: jest.fn(() => Promise.resolve([])),

    // Participant methods
    removeParticipant: jest.fn(() => Promise.resolve(true)),
    getParticipantsForEntity: jest.fn(() => Promise.resolve([])),
    getParticipantsForRoom: jest.fn(() => Promise.resolve([])),
    addParticipantsRoom: jest.fn(() => Promise.resolve(true)),
    getParticipantUserState: jest.fn(() => Promise.resolve(null)),
    setParticipantUserState: jest.fn(() => Promise.resolve()),

    // Relationship methods
    createRelationship: jest.fn(() => Promise.resolve(true)),
    updateRelationship: jest.fn(() => Promise.resolve()),
    getRelationship: jest.fn(() => Promise.resolve(null)),
    getRelationships: jest.fn(() => Promise.resolve([])),

    // Cache methods
    getCache: jest.fn(() => Promise.resolve(undefined)),
    setCache: jest.fn(() => Promise.resolve(true)),
    deleteCache: jest.fn(() => Promise.resolve(true)),

    // Task methods
    createTask: jest.fn(() => Promise.resolve('123e4567-e89b-12d3-a456-426614174000' as UUID)),
    getTasks: jest.fn(() => Promise.resolve([])),
    getTask: jest.fn(() => Promise.resolve(null)),
    getTasksByName: jest.fn(() => Promise.resolve([])),
    updateTask: jest.fn(() => Promise.resolve()),
    deleteTask: jest.fn(() => Promise.resolve()),

    // Message server methods (for AgentServer tests)
    createMessageServer: jest.fn(() =>
      Promise.resolve({ id: '00000000-0000-0000-0000-000000000000' })
    ),
    getMessageServers: jest.fn(() =>
      Promise.resolve([{ id: '00000000-0000-0000-0000-000000000000', name: 'Default Server' }])
    ),
    getMessageServerById: jest.fn(() =>
      Promise.resolve({ id: '00000000-0000-0000-0000-000000000000', name: 'Default Server' })
    ),
    addAgentToServer: jest.fn(() => Promise.resolve()),
    removeAgentFromServer: jest.fn(() => Promise.resolve()),
    getAgentsForServer: jest.fn(() => Promise.resolve([])),

    // Channel methods
    createChannel: jest.fn(() => Promise.resolve({ id: '123e4567-e89b-12d3-a456-426614174000' })),
    getChannelsForServer: jest.fn(() => Promise.resolve([])),
    getChannelDetails: jest.fn(() => Promise.resolve(null)),
    getChannelParticipants: jest.fn(() => Promise.resolve([])),
    addChannelParticipants: jest.fn(() => Promise.resolve()),
    updateChannel: jest.fn(() => Promise.resolve()),
    deleteChannel: jest.fn(() => Promise.resolve()),

    // Message methods
    createMessage: jest.fn(() => Promise.resolve({ id: 'message-id' })),
    getMessagesForChannel: jest.fn(() => Promise.resolve([])),
    deleteMessage: jest.fn(() => Promise.resolve()),

    // DM methods
    findOrCreateDmChannel: jest.fn(() => Promise.resolve({ id: 'dm-channel-id' })),
```