# a7046c18:packages_core_typescript_src___tests___database.test.ts:601-750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/database.test.ts:601-750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    query_field_sub_name: string;
    query_match_count: number;
  }): Promise<
    {
      embedding: number[];
      levenshtein_score: number;
    }[]
  > {
    return [
      {
        embedding: [0.1, 0.2, 0.3],
        levenshtein_score: 0.4,
      },
    ];
  }

  // Mock method for searching memories
  /**
   * Asynchronously searches for memories based on the provided parameters.
   *
   * @param {Object} params - The parameters for the memory search.
   * @param {string} params.tableName - The name of the table to search memories in.
   * @param {string} params.roomId - The room ID to search memories related to.
   * @param {number[]} params.embedding - The memory embedding for similarity matching.
   * @param {number} params.match_threshold - The threshold for match similarity.
   * @param {number} params.count - The number of memories to retrieve.
   * @param {boolean} params.unique - Flag to retrieve unique memories only.
   * @returns {Promise<Array<Memory>>} The list of memories that match the search criteria.
   */
  async searchMemories(params: {
    tableName: string;
    roomId: `${string}-${string}-${string}-${string}-${string}`;
    embedding: number[];
    match_threshold: number;
    count: number;
    unique: boolean;
  }): Promise<Memory[]> {
    return [
      {
        id: "memory-id" as UUID,
        content: { text: "Test Memory" },
        roomId: params.roomId,
        entityId: "user-id" as UUID,
        agentId: "agent-id" as UUID,
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
        username: "testuser",
        name: "Test Entity",
      },
      names: ["Test Entity"],
      agentId: "agent-id" as UUID,
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
        id: "memory-id" as UUID,
        content: { text: "Test Memory" },
        roomId: params.roomId,
        entityId: "user-id" as UUID,
        agentId: "agent-id" as UUID,
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
        id: "actor-id" as UUID,
        names: ["Test Entity"],
        metadata: { username: "testactor" },
        agentId: "agent-id" as UUID,
      },
    ];
  }
}

describe("DatabaseAdapter Tests", () => {
  let adapter: MockDatabaseAdapter;
  const roomId = "room-id" as UUID;

  beforeEach(() => {
    adapter = new MockDatabaseAdapter();
  });

  it("should return memories by room ID", async () => {
    const memories = await adapter.getMemoriesByRoomIds({
      roomIds: [
        "room-id" as `${string}-${string}-${string}-${string}-${string}`,
      ],
      tableName: "test_table",
    });
    expect(memories).toHaveLength(1);
    expect(memories[0].roomId).toBe("room-id" as UUID);
  });

  it("should return cached embeddings", async () => {
    const embeddings = await adapter.getCachedEmbeddings({
      query_table_name: "test_table",
      query_threshold: 0.5,
      query_input: "test query",
      query_field_name: "field",
      query_field_sub_name: "subfield",
      query_match_count: 5,
```