# a7046c18:packages_core_typescript_src_types_database.ts:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/types/database.ts:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  }): Promise<{ embedding: number[]; levenshtein_score: number }[]>;

  log(params: {
    body: { [key: string]: unknown };
    entityId: UUID;
    roomId: UUID;
    type: string;
  }): Promise<void>;

  getLogs(params: {
    entityId?: UUID;
    roomId?: UUID;
    type?: string;
    count?: number;
    offset?: number;
  }): Promise<Log[]>;

  deleteLog(logId: UUID): Promise<void>;

  getAgentRunSummaries?(params: {
    limit?: number;
    roomId?: UUID;
    status?: RunStatus | "all";
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

  createMemory(
    memory: Memory,
    tableName: string,
    unique?: boolean,
  ): Promise<UUID>;

  updateMemory(
    memory: Partial<Memory> & { id: UUID; metadata?: MemoryMetadata },
  ): Promise<boolean>;

  deleteMemory(memoryId: UUID): Promise<void>;

  deleteManyMemories(memoryIds: UUID[]): Promise<void>;

  deleteAllMemories(roomId: UUID, tableName: string): Promise<void>;

  countMemories(
    roomId: UUID,
    unique?: boolean,
    tableName?: string,
  ): Promise<number>;

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

  getParticipantUserState(
    roomId: UUID,
    entityId: UUID,
  ): Promise<"FOLLOWED" | "MUTED" | null>;

  setParticipantUserState(
    roomId: UUID,
    entityId: UUID,
    state: "FOLLOWED" | "MUTED" | null,
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
  getRelationships(params: {
    entityId: UUID;
    tags?: string[];
  }): Promise<Relationship[]>;

  getCache<T>(key: string): Promise<T | undefined>;
  setCache<T>(key: string, value: T): Promise<boolean>;
```