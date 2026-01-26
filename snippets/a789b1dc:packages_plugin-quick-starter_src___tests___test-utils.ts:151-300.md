# a789b1dc:packages_plugin-quick-starter_src___tests___test-utils.ts:151-300

**Commit:** a789b1dcd507d69194402dc7d6c9218ec81fc42f
**Author:** Odilitime
**Date:** Thu Dec 18 17:01:58 2025 -0800
**File:** packages/plugin-quick-starter/src/__tests__/test-utils.ts:151-300
**Novelty Score:** 19.96
**Concepts:** plugin-system, testing

```

    // Entity methods
    getEntitiesByIds: mock().mockResolvedValue([]),
    getEntitiesForRoom: mock().mockResolvedValue([]),
    createEntities: mock().mockResolvedValue(true),
    updateEntity: mock().mockResolvedValue(undefined),
    createEntity: mock().mockResolvedValue(true),
    getEntityById: mock().mockResolvedValue(null),

    // Room methods
    createRoom: mock().mockImplementation(async () => createUUID()),
    createRooms: mock().mockImplementation(async () => [createUUID()]),
    getRoom: mock().mockResolvedValue(null),
    getRooms: mock().mockResolvedValue([]),
    getRoomsByIds: mock().mockResolvedValue([]),
    getRoomsByWorld: mock().mockResolvedValue([]),
    updateRoom: mock().mockResolvedValue(undefined),
    deleteRoom: mock().mockResolvedValue(undefined),
    deleteRoomsByWorldId: mock().mockResolvedValue(undefined),
    addParticipant: mock().mockResolvedValue(true),
    addParticipantsRoom: mock().mockResolvedValue(true),
    removeParticipant: mock().mockResolvedValue(true),
    getRoomsForParticipant: mock().mockResolvedValue([]),
    getRoomsForParticipants: mock().mockResolvedValue([]),
    getParticipantsForEntity: mock().mockResolvedValue([]),
    getParticipantsForRoom: mock().mockResolvedValue([]),
    getParticipantUserState: mock().mockResolvedValue(null),
    setParticipantUserState: mock().mockResolvedValue(undefined),

    // Service methods
    getService: mock().mockReturnValue(null),
    getServicesByType: mock().mockReturnValue([]),
    getAllServices: mock().mockReturnValue(new Map()),
    registerService: mock().mockResolvedValue(undefined),
    getRegisteredServiceTypes: mock().mockReturnValue([]),
    hasService: mock().mockReturnValue(false),
    getServiceLoadPromise: mock().mockResolvedValue(null),

    // Plugin/Action/Provider methods
    registerPlugin: mock().mockResolvedValue(undefined),
    registerProvider: mock().mockReturnValue(undefined),
    registerAction: mock().mockReturnValue(undefined),
    registerEvaluator: mock().mockReturnValue(undefined),

    // Model methods
    registerModel: mock().mockReturnValue(undefined),
    getModel: mock().mockReturnValue(undefined),
    useModel: mock().mockImplementation(async (modelType: string) => {
      if (modelType === ModelType.TEXT_SMALL) {
        return 'Never gonna give you up, never gonna let you down';
      } else if (modelType === ModelType.TEXT_LARGE) {
        return 'Never gonna make you cry, never gonna say goodbye';
      }
      return 'Default model response';
    }),

    // Event methods
    registerEvent: mock().mockReturnValue(undefined),
    getEvent: mock().mockReturnValue(undefined),
    emitEvent: mock().mockResolvedValue(undefined),

    // Settings methods
    setSetting: mock().mockReturnValue(undefined),
    getSetting: mock().mockImplementation((key: string) => {
      if (key === 'EXAMPLE_PLUGIN_VARIABLE') return 'test-value';
      return null;
    }),

    // Other methods
    processActions: mock().mockResolvedValue(undefined),
    evaluate: mock().mockResolvedValue(null),
    ensureConnections: mock().mockResolvedValue(undefined),
    ensureConnection: mock().mockResolvedValue(undefined),
    getConversationLength: mock().mockReturnValue(10),
    composeState: mock().mockImplementation(async () => createTestState()),
    // Task methods
    getTasks: mock().mockResolvedValue([]),
    getTask: mock().mockResolvedValue(null),
    getTasksByName: mock().mockResolvedValue([]),
    createTask: mock().mockImplementation(async () => createUUID()),
    updateTask: mock().mockResolvedValue(undefined),
    deleteTask: mock().mockResolvedValue(undefined),
    registerTaskWorker: mock().mockReturnValue(undefined),
    getTaskWorker: mock().mockReturnValue(undefined),
    stop: mock().mockResolvedValue(undefined),
    createRunId: mock().mockImplementation(() => createUUID()),
    startRun: mock().mockImplementation(() => createUUID()),
    endRun: mock().mockReturnValue(undefined),
    getCurrentRunId: mock().mockImplementation(() => createUUID()),
    registerSendHandler: mock().mockReturnValue(undefined),
    sendMessageToTarget: mock().mockResolvedValue(undefined),
    registerDatabaseAdapter: mock().mockReturnValue(undefined),
    log: mock().mockResolvedValue(undefined),
    getLogs: mock().mockResolvedValue([]),
    deleteLog: mock().mockResolvedValue(undefined),

    // Component methods (from IDatabaseAdapter)
    getComponent: mock().mockResolvedValue(null),
    getComponents: mock().mockResolvedValue([]),
    createComponent: mock().mockResolvedValue(true),
    updateComponent: mock().mockResolvedValue(undefined),
    deleteComponent: mock().mockResolvedValue(undefined),

    // Relationship methods
    createRelationship: mock().mockResolvedValue(true),
    getRelationships: mock().mockResolvedValue([]),
    getRelationship: mock().mockResolvedValue(null),
    updateRelationship: mock().mockResolvedValue(undefined),

    // Embedding methods
    ensureEmbeddingDimension: mock().mockResolvedValue(undefined),
    getCachedEmbeddings: mock().mockResolvedValue([]),

    // World methods
    getWorld: mock().mockResolvedValue(null),
    createWorld: mock().mockImplementation(async () => createUUID()),
    updateWorld: mock().mockResolvedValue(undefined),
    removeWorld: mock().mockResolvedValue(undefined),
    getAllWorlds: mock().mockResolvedValue([]),

    // Required method that was missing
    ensureParticipantInRoom: mock().mockResolvedValue(undefined),
    ensureWorldExists: mock().mockResolvedValue(undefined),
    ensureRoomExists: mock().mockResolvedValue(undefined),

    // Cache methods
    getCache: mock().mockResolvedValue(undefined),
    setCache: mock().mockResolvedValue(true),
    deleteCache: mock().mockResolvedValue(true),

    // Other missing database methods
    getMemoriesByWorldId: mock().mockResolvedValue([]),

    // Apply any overrides
    ...overrides,
  };

  // Setup logger spies if not already overridden
  if (!overrides.logger) {
    spyOn(logger, 'info').mockImplementation(() => {});
    spyOn(logger, 'warn').mockImplementation(() => {});
    spyOn(logger, 'error').mockImplementation(() => {});
    spyOn(logger, 'debug').mockImplementation(() => {});
  }

  return mockRuntime;
}

/**
 * Creates test fixtures for event payloads
```