# 5e8c73c1:packages_plugin-bootstrap_src___tests___test-utils.ts:151-300

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-bootstrap/src/__tests__/test-utils.ts:151-300
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
    getRoom: mock().mockResolvedValue({
      id: 'room-id',
      name: 'Test Room',
      worldId: 'test-world-id',
      serverId: 'test-server-id',
    }),
    getRooms: mock().mockResolvedValue([
      { id: 'room-id', name: 'Test Room', worldId: 'test-world-id', serverId: 'test-server-id' },
    ]),
    getRoomsByIds: mock().mockResolvedValue([
      { id: 'room-id', name: 'Test Room', worldId: 'test-world-id', serverId: 'test-server-id' },
    ]),
    getWorld: mock().mockResolvedValue({
      id: 'test-world-id',
      name: 'Test World',
      serverId: 'test-server-id',
      metadata: {
        roles: {
          'test-entity-id': 'ADMIN',
          'test-agent-id': 'OWNER',
        },
        settings: [
          { name: 'setting1', value: 'value1', description: 'Description 1' },
          { name: 'setting2', value: 'value2', description: 'Description 2' },
        ],
      },
    }),
    addEmbeddingToMemory: mock().mockResolvedValue({
      id: 'memory-id',
      entityId: 'test-entity-id',
      roomId: 'test-room-id',
      content: { text: 'Test fact' },
    }),
    queueEmbeddingGeneration: mock().mockResolvedValue(undefined),
    getModel: mock().mockImplementation((modelType: string) => {
      // By default, return a mock handler for TEXT_EMBEDDING
      if (modelType === ModelType.TEXT_EMBEDDING) {
        return mock().mockResolvedValue([0.1, 0.2, 0.3, 0.4, 0.5]);
      }
      return mock().mockResolvedValue({});
    }),
    createRelationship: mock().mockResolvedValue(true),
    updateRelationship: mock().mockResolvedValue(true),
    getRelationships: mock().mockResolvedValue([]),
    addRelationship: mock().mockResolvedValue(true),
    getTasks: mock().mockResolvedValue([]),
    getTasksByName: mock().mockResolvedValue([]),
    createTask: mock().mockResolvedValue({ id: 'task-id' }),
    updateTasks: mock().mockResolvedValue([]),
    deleteTasks: mock().mockResolvedValue([]),
    deleteTask: mock().mockResolvedValue(true),
    emitEvent: mock().mockResolvedValue(undefined),
    registerEvent: mock(),
    getCache: mock().mockResolvedValue(null),
    setCache: mock().mockResolvedValue(true),
    log: mock().mockResolvedValue(undefined),

    // Task-related methods needed for TaskService tests
    registerTaskWorker: mock(),
    getTaskWorker: mock().mockReturnValue({
      name: 'test-worker',
      validate: mock().mockResolvedValue(true),
      execute: mock().mockResolvedValue({}),
    }),
    getParticipantUserState: mock().mockResolvedValue('ACTIVE'),
    setParticipantUserState: mock().mockResolvedValue(undefined),
    updateParticipantUserState: mock().mockResolvedValue(undefined),
    getUserServerRole: mock().mockResolvedValue('USER'),
    findEntityByName: mock().mockResolvedValue(null),
    getMemberRole: mock().mockResolvedValue('USER'),

    // Methods missing in the original implementation
    searchMemories: mock().mockResolvedValue([
      {
        id: 'memory-1' as UUID,
        entityId: 'entity-1' as UUID,
        agentId: 'agent-1' as UUID,
        roomId: 'room-1' as UUID,
        content: { text: 'User likes chocolate' },
        embedding: [0.1, 0.2, 0.3],
        createdAt: Date.now(),
        similarity: 0.95,
      },
    ]),
    getRoomsForParticipants: mock().mockResolvedValue([
      {
        id: 'room-id',
        name: 'Test Room',
        worldId: 'test-world-id',
        messageServerId: 'test-server-id',
      },
    ]),
    getRoomsForEntity: mock().mockResolvedValue([
      {
        id: 'room-id',
        name: 'Test Room',
        worldId: 'test-world-id',
        messageServerId: 'test-server-id',
      },
    ]),
    searchEntities: mock().mockResolvedValue([
      { id: 'test-entity-id', names: ['Test Entity'], worldId: 'test-world-id' },
    ]),
    searchRooms: mock().mockResolvedValue([
      { id: 'room-id', name: 'Test Room', worldId: 'test-world-id' },
    ]),
    getEntity: mock().mockResolvedValue({
      id: 'test-entity-id',
      names: ['Test Entity'],
      worldId: 'test-world-id',
    }),
    getWorldSettings: mock().mockResolvedValue([
      { name: 'setting1', value: 'value1', description: 'Description 1' },
      { name: 'setting2', value: 'value2', description: 'Description 2' },
    ]),
    findWorldsForOwner: mock().mockResolvedValue([
      { id: 'test-world-id', name: 'Test World', messageServerId: 'test-server-id' },
    ]),

    // File, PDF, and Image service methods
    uploadFile: mock().mockResolvedValue({ id: 'file-id', name: 'test.txt' }),
    getFile: mock().mockResolvedValue({ id: 'file-id', content: 'Test file content' }),
    listFiles: mock().mockResolvedValue([{ id: 'file-id', name: 'test.txt' }]),
    deleteFile: mock().mockResolvedValue(true),
    extractTextFromPDF: mock().mockResolvedValue('Extracted text from PDF'),
    describeImage: mock().mockResolvedValue('An image description'),

    // Added for recentMessages provider
    getMemoriesByRoomIds: mock().mockResolvedValue([
      {
        id: 'memory-1' as UUID,
        entityId: 'test-entity-id' as UUID,
        agentId: 'test-agent-id' as UUID,
        roomId: 'test-room-id' as UUID,
        content: {
          text: 'Hello there!',
          channelType: ChannelType.GROUP,
        },
        createdAt: Date.now() - 1000,
      },
      {
        id: 'memory-2' as UUID,
        entityId: 'test-agent-id' as UUID,
        agentId: 'test-agent-id' as UUID,
        roomId: 'test-room-id' as UUID,
        content: {
          text: 'How can I help you?',
          channelType: ChannelType.GROUP,
        },
        createdAt: Date.now(),
```