# 5e8c73c1:packages_core_src_types_database.ts:301-450

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/types/database.ts:301-450
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
    status?: RunStatus | 'all';
    from?: number;
    to?: number;
    entityId?: UUID;
  }): Promise<AgentRunSummaryResult>;

  searchMemories(params: {
    embedding: number[];
    match_threshold?: number;
    count?: number;
    unique?: boolean;
    tableName: string;
    query?: string;
    roomId?: UUID;
    worldId?: UUID;
    entityId?: UUID;
  }): Promise<Memory[]>;

  createMemory(memory: Memory, tableName: string, unique?: boolean): Promise<UUID>;

  updateMemory(memory: Partial<Memory> & { id: UUID; metadata?: MemoryMetadata }): Promise<boolean>;

  deleteMemory(memoryId: UUID): Promise<void>;

  deleteManyMemories(memoryIds: UUID[]): Promise<void>;

  deleteAllMemories(roomId: UUID, tableName: string): Promise<void>;

  countMemories(roomId: UUID, unique?: boolean, tableName?: string): Promise<number>;

  createWorld(world: World): Promise<UUID>;

  getWorld(id: UUID): Promise<World | null>;

  removeWorld(id: UUID): Promise<void>;

  getAllWorlds(): Promise<World[]>;

  updateWorld(world: World): Promise<void>;

  getRoomsByIds(roomIds: UUID[]): Promise<Room[] | null>;

  createRooms(rooms: Room[]): Promise<UUID[]>;

  deleteRoom(roomId: UUID): Promise<void>;

  deleteRoomsByWorldId(worldId: UUID): Promise<void>;

  updateRoom(room: Room): Promise<void>;

  getRoomsForParticipant(entityId: UUID): Promise<UUID[]>;

  getRoomsForParticipants(userIds: UUID[]): Promise<UUID[]>;

  getRoomsByWorld(worldId: UUID): Promise<Room[]>;

  removeParticipant(entityId: UUID, roomId: UUID): Promise<boolean>;

  getParticipantsForEntity(entityId: UUID): Promise<Participant[]>;

  getParticipantsForRoom(roomId: UUID): Promise<UUID[]>;

  isRoomParticipant(roomId: UUID, entityId: UUID): Promise<boolean>;

  addParticipantsRoom(entityIds: UUID[], roomId: UUID): Promise<boolean>;

  getParticipantUserState(roomId: UUID, entityId: UUID): Promise<'FOLLOWED' | 'MUTED' | null>;

  setParticipantUserState(
    roomId: UUID,
    entityId: UUID,
    state: 'FOLLOWED' | 'MUTED' | null
  ): Promise<void>;

  /**
   * Creates a new relationship between two entities.
   * @param params Object containing the relationship details
   * @returns Promise resolving to boolean indicating success
   */
  createRelationship(params: {
    sourceEntityId: UUID;
    targetEntityId: UUID;
    tags?: string[];
    metadata?: Metadata;
  }): Promise<boolean>;

  /**
   * Updates an existing relationship between two entities.
   * @param relationship The relationship object with updated data
   * @returns Promise resolving to void
   */
  updateRelationship(relationship: Relationship): Promise<void>;

  /**
   * Retrieves a relationship between two entities if it exists.
   * @param params Object containing the entity IDs and agent ID
   * @returns Promise resolving to the Relationship object or null if not found
   */
  getRelationship(params: {
    sourceEntityId: UUID;
    targetEntityId: UUID;
  }): Promise<Relationship | null>;

  /**
   * Retrieves all relationships for a specific entity.
   * @param params Object containing the user ID, agent ID and optional tags to filter by
   * @returns Promise resolving to an array of Relationship objects
   */
  getRelationships(params: { entityId: UUID; tags?: string[] }): Promise<Relationship[]>;

  getCache<T>(key: string): Promise<T | undefined>;
  setCache<T>(key: string, value: T): Promise<boolean>;
  deleteCache(key: string): Promise<boolean>;

  // Only task instance methods - definitions are in-memory
  createTask(task: Task): Promise<UUID>;
  getTasks(params: { roomId?: UUID; tags?: string[]; entityId?: UUID }): Promise<Task[]>;
  getTask(id: UUID): Promise<Task | null>;
  getTasksByName(name: string): Promise<Task[]>;
  updateTask(id: UUID, task: Partial<Task>): Promise<void>;
  deleteTask(id: UUID): Promise<void>;

  getMemoriesByWorldId(params: {
    worldId: UUID;
    count?: number;
    tableName?: string;
  }): Promise<Memory[]>;
}

/**
 * Result interface for embedding similarity searches
 */
export interface EmbeddingSearchResult {
  embedding: number[];
  levenshtein_score: number;
}

/**
 * Options for memory retrieval operations
 */
export interface MemoryRetrievalOptions {
  roomId: UUID;
  count?: number;
  unique?: boolean;
  start?: number;
  end?: number;
  agentId?: UUID;
}

/**
```