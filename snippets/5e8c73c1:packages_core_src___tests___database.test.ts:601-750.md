# 5e8c73c1:packages_core_src___tests___database.test.ts:601-750

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/__tests__/database.test.ts:601-750
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
    match_threshold: number;
    count: number;
    unique: boolean;
  }): Promise<Memory[]> {
    return [
      {
        id: 'memory-id' as UUID,
        content: { text: 'Test Memory' },
        roomId: params.roomId,
        entityId: 'user-id' as UUID,
        agentId: 'agent-id' as UUID,
      },
    ];
  }

  // Mock method for getting account by ID
  /**
   * Asynchronously retrieves an Entity by its unique ID.
   *
   * @param {UUID} entityId - The unique identifier of the Entity to retrieve.
   * @returns {Promise<Entity | null>} A Promise that resolves with the Entity object if found, otherwise null.
   */
  async getEntityById(entityId: UUID): Promise<Entity | null> {
    return {
      id: entityId,
      metadata: {
        username: 'testuser',
        name: 'Test Entity',
      },
      names: ['Test Entity'],
      agentId: 'agent-id' as UUID,
    } as Entity;
  }

  // Other methods stay the same...
  /**
   * Asynchronously creates a new entity for a given account.
   *
   * @param {Entity} _account - The account for which the entity is being created.
   * @returns {Promise<boolean>} A Promise that resolves to true if entity creation is successful.
   */
  async createEntity(_account: Entity): Promise<boolean> {
    return true;
  }

  /**
   * Retrieves memories based on the specified parameters.
   *
   * @param {Object} params - The parameters for fetching memories.
   * @param {UUID} params.roomId - The ID of the room to fetch memories from.
   * @param {number} [params.count] - The number of memories to fetch.
   * @param {boolean} [params.unique] - Whether to fetch unique memories.
   * @param {string} params.tableName - The name of the table storing the memories.
   * @returns {Promise<Memory[]>} - A Promise that resolves to an array of Memory objects.
   */
  async getMemories(params: {
    roomId: UUID;
    count?: number;
    unique?: boolean;
    tableName: string;
  }): Promise<Memory[]> {
    return [
      {
        id: 'memory-id' as UUID,
        content: { text: 'Test Memory' },
        roomId: params.roomId,
        entityId: 'user-id' as UUID,
        agentId: 'agent-id' as UUID,
      },
    ];
  }

  /**
   * Asynchronously retrieves a list of entities based on the provided roomId.
   * @param {Object} _params - The parameters object.
   * @param {UUID} _params.roomId - The roomId to filter entities by.
   * @returns {Promise<Entity[]>} - A promise that resolves to an array of Entity objects.
   */
  async getEntities(_params: { roomId: UUID }): Promise<Entity[]> {
    return [
      {
        id: 'actor-id' as UUID,
        names: ['Test Entity'],
        metadata: { username: 'testactor' },
        agentId: 'agent-id' as UUID,
      },
    ];
  }
}

describe('DatabaseAdapter Tests', () => {
  let adapter: MockDatabaseAdapter;
  const roomId = 'room-id' as UUID;

  beforeEach(() => {
    adapter = new MockDatabaseAdapter();
  });

  it('should return memories by room ID', async () => {
    const memories = await adapter.getMemoriesByRoomIds({
      roomIds: ['room-id' as `${string}-${string}-${string}-${string}-${string}`],
      tableName: 'test_table',
    });
    expect(memories).toHaveLength(1);
    expect(memories[0].roomId).toBe('room-id' as UUID);
  });

  it('should return cached embeddings', async () => {
    const embeddings = await adapter.getCachedEmbeddings({
      query_table_name: 'test_table',
      query_threshold: 0.5,
      query_input: 'test query',
      query_field_name: 'field',
      query_field_sub_name: 'subfield',
      query_match_count: 5,
    });
    expect(embeddings).toHaveLength(1);
    expect(embeddings[0].embedding).toEqual([0.1, 0.2, 0.3]);
  });

  it('should search memories based on embedding', async () => {
    const memories = await adapter.searchMemories({
      tableName: 'test_table',
      roomId: 'room-id' as `${string}-${string}-${string}-${string}-${string}`,
      embedding: [0.1, 0.2, 0.3],
      match_threshold: 0.5,
      count: 3,
      unique: true,
    });
    expect(memories).toHaveLength(1);
    expect(memories[0].roomId).toBe('room-id' as UUID);
  });

  it('should get an account by user ID', async () => {
    const account = await adapter.getEntityById('test-user-id' as UUID);
    expect(account).not.toBeNull();
    expect(account?.metadata?.username).toBe('testuser');
  });

  it('should create a new account', async () => {
    const newEntity: Entity = {
      id: 'new-user-id' as UUID,
      names: ['New Entity'],
      metadata: {
        username: 'newuser',
        name: 'New Entity',
      },
      agentId: 'agent-id' as UUID,
    };
    const result = await adapter.createEntity(newEntity);
```