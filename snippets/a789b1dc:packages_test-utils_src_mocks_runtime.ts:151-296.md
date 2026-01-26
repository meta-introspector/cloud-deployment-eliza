# a789b1dc:packages_test-utils_src_mocks_runtime.ts:151-296

**Commit:** a789b1dcd507d69194402dc7d6c9218ec81fc42f
**Author:** Odilitime
**Date:** Thu Dec 18 17:01:58 2025 -0800
**File:** packages/test-utils/src/mocks/runtime.ts:151-296
**Novelty Score:** 19.96
**Concepts:** plugin-system, testing

```
      return defaultSettings[key];
    }),
    getConversationLength: mock().mockReturnValue(10),
    getActionResults: (messageId: UUID): ActionResult[] => {
      const cachedState = stateCache?.get(`${messageId}_action_results`);
      return (cachedState?.data?.actionResults as ActionResult[]) || [];
    },
    processActions: mock().mockResolvedValue(undefined),
    evaluate: mock().mockResolvedValue([]),
    registerProvider: mock(),
    registerAction: mock(),
    registerEvaluator: mock(),
    ensureConnection: mock().mockResolvedValue(undefined),
    ensureConnections: mock().mockResolvedValue(undefined),
    ensureParticipantInRoom: mock().mockResolvedValue(undefined),
    ensureWorldExists: mock().mockResolvedValue(undefined),
    ensureRoomExists: mock().mockResolvedValue(undefined),
    composeState: mock().mockResolvedValue({
      values: {},
      data: {},
      text: '',
    } as State),
    useModel: mock().mockResolvedValue('Mock response') as IAgentRuntime['useModel'],
    registerModel: mock(),
    getModel: mock().mockReturnValue(undefined),
    registerEvent: mock(),
    getEvent: mock().mockReturnValue(undefined),
    emitEvent: mock().mockResolvedValue(undefined),
    registerTaskWorker: mock(),
    getTaskWorker: mock().mockReturnValue(undefined),
    stop: mock().mockResolvedValue(undefined),
    addEmbeddingToMemory: mock().mockImplementation((memory: Memory) => Promise.resolve(memory)),
    queueEmbeddingGeneration: mock().mockResolvedValue(undefined),
    createRunId: mock().mockReturnValue('test-run-id' as UUID),
    startRun: mock().mockReturnValue('test-run-id' as UUID),
    endRun: mock(),
    getCurrentRunId: mock().mockReturnValue('test-run-id' as UUID),
    registerSendHandler: mock(),
    sendMessageToTarget: mock().mockResolvedValue(undefined),

    // Database Adapter Methods - Agent Management
    init: mock().mockResolvedValue(undefined),
    isReady: mock().mockResolvedValue(true),
    close: mock().mockResolvedValue(undefined),
    getAgent: mock().mockResolvedValue(null),
    getAgents: mock().mockResolvedValue([]),
    createAgent: mock().mockResolvedValue(true),
    updateAgent: mock().mockResolvedValue(true),
    deleteAgent: mock().mockResolvedValue(true),

    // Entity Management
    getEntityById: mock().mockResolvedValue(null),
    getEntitiesByIds: mock().mockResolvedValue([]),
    getEntitiesForRoom: mock().mockResolvedValue([]),
    createEntity: mock().mockResolvedValue('test-entity-id' as UUID),
    createEntities: mock().mockResolvedValue(true),
    updateEntity: mock().mockResolvedValue(undefined),

    // Component Management
    getComponent: mock().mockResolvedValue(null),
    getComponents: mock().mockResolvedValue([]),
    createComponent: mock().mockResolvedValue('test-component-id' as UUID),
    updateComponent: mock().mockResolvedValue(undefined),
    deleteComponent: mock().mockResolvedValue(undefined),

    // Memory Management
    getMemories: mock().mockResolvedValue([]),
    getAllMemories: overrides.getAllMemories || mock().mockResolvedValue([]),
    clearAllAgentMemories: mock().mockResolvedValue(undefined),
    getMemoryById: mock().mockResolvedValue(null),
    getMemoriesByIds: mock().mockResolvedValue([]),
    getMemoriesByRoomIds: mock().mockResolvedValue([]),
    getMemoriesByWorldId: mock().mockResolvedValue([]),
    getCachedEmbeddings: mock().mockResolvedValue([]),
    log: mock().mockResolvedValue(undefined),
    getLogs: mock().mockResolvedValue([]),
    deleteLog: mock().mockResolvedValue(undefined),
    searchMemories: mock().mockResolvedValue([]),
    createMemory: mock().mockResolvedValue('test-memory-id' as UUID),
    updateMemory: mock().mockResolvedValue(true),
    deleteMemory: mock().mockResolvedValue(undefined),
    deleteManyMemories: mock().mockResolvedValue(undefined),
    deleteAllMemories: mock().mockResolvedValue(undefined),
    countMemories: mock().mockResolvedValue(0),
    ensureEmbeddingDimension: mock().mockResolvedValue(undefined),

    // World Management
    createWorld: mock().mockResolvedValue('test-world-id' as UUID),
    getWorld: mock().mockResolvedValue(null),
    removeWorld: mock().mockResolvedValue(undefined),
    getAllWorlds: mock().mockResolvedValue([]),
    updateWorld: mock().mockResolvedValue(undefined),

    // Room Management
    getRoom: mock().mockResolvedValue(null),
    getRooms: mock().mockResolvedValue([]),
    getRoomsByIds: mock().mockResolvedValue([]),
    createRoom: mock().mockResolvedValue('test-room-id' as UUID),
    createRooms: mock().mockResolvedValue([]),
    deleteRoom: mock().mockResolvedValue(undefined),
    deleteRoomsByWorldId: mock().mockResolvedValue(undefined),
    updateRoom: mock().mockResolvedValue(undefined),
    getRoomsForParticipant: mock().mockResolvedValue([]),
    getRoomsForParticipants: mock().mockResolvedValue([]),
    getRoomsByWorld: mock().mockResolvedValue([]),

    // Participant Management
    addParticipant: mock().mockResolvedValue(true),
    removeParticipant: mock().mockResolvedValue(true),
    addParticipantsRoom: mock().mockResolvedValue(true),
    getParticipantsForEntity: mock().mockResolvedValue([]),
    getParticipantsForRoom: mock().mockResolvedValue([]),
    getParticipantUserState: mock().mockResolvedValue(null),
    setParticipantUserState: mock().mockResolvedValue(undefined),

    // Relationship Management
    createRelationship: mock().mockResolvedValue(true),
    updateRelationship: mock().mockResolvedValue(undefined),
    getRelationship: mock().mockResolvedValue(null),
    getRelationships: mock().mockResolvedValue([]),

    // Cache Management
    getCache: mock().mockResolvedValue(undefined),
    setCache: mock().mockResolvedValue(true),
    deleteCache: mock().mockResolvedValue(true),

    // Task Management
    createTask: mock().mockResolvedValue('test-task-id' as UUID),
    getTasks: mock().mockResolvedValue([]),
    getTask: mock().mockResolvedValue(null),
    getTasksByName: mock().mockResolvedValue([]),
    updateTask: mock().mockResolvedValue(undefined),
    deleteTask: mock().mockResolvedValue(undefined),

    // Text Generation (required by IAgentRuntime)
    generateText: mock().mockResolvedValue('Mock generated text'),

    // Room Participant Checks
    isRoomParticipant: mock().mockResolvedValue(false),

    // Apply overrides
    ...overrides,
  };

  return baseRuntime;
}
```