# 5e8c73c1:packages_core_src_database.ts:151-300

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/database.ts:151-300
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
  /**
   * Retrieves memories based on the specified parameters.
   * @param params An object containing parameters for the memory retrieval.
   * @returns A Promise that resolves to an array of Memory objects.
   */
  abstract getMemories(params: {
    entityId?: UUID;
    agentId?: UUID;
    count?: number;
    offset?: number;
    unique?: boolean;
    tableName: string;
    start?: number;
    end?: number;
    roomId?: UUID;
    worldId?: UUID;
  }): Promise<Memory[]>;

  abstract getMemoriesByRoomIds(params: {
    roomIds: UUID[];
    tableName: string;
    limit?: number;
  }): Promise<Memory[]>;

  abstract getMemoryById(id: UUID): Promise<Memory | null>;

  /**
   * Retrieves multiple memories by their IDs
   * @param memoryIds Array of UUIDs of the memories to retrieve
   * @param tableName Optional table name to filter memories by type
   * @returns Promise resolving to array of Memory objects
   */
  abstract getMemoriesByIds(memoryIds: UUID[], tableName?: string): Promise<Memory[]>;

  /**
   * Retrieves cached embeddings based on the specified query parameters.
   * @param params An object containing parameters for the embedding retrieval.
   * @returns A Promise that resolves to an array of objects containing embeddings and levenshtein scores.
   */
  abstract getCachedEmbeddings({
    query_table_name,
    query_threshold,
    query_input,
    query_field_name,
    query_field_sub_name,
    query_match_count,
  }: {
    query_table_name: string;
    query_threshold: number;
    query_input: string;
    query_field_name: string;
    query_field_sub_name: string;
    query_match_count: number;
  }): Promise<
    {
      embedding: number[];
      levenshtein_score: number;
    }[]
  >;

  /**
   * Logs an event or action with the specified details.
   * @param params An object containing parameters for the log entry.
   * @returns A Promise that resolves when the log entry has been saved.
   */
  abstract log(params: {
    body: { [key: string]: unknown };
    entityId: UUID;
    roomId: UUID;
    type: string;
  }): Promise<void>;

  /**
   * Retrieves logs based on the specified parameters.
   * @param params An object containing parameters for the log retrieval.
   * @returns A Promise that resolves to an array of Log objects.
   */
  abstract getLogs(params: {
    entityId?: UUID;
    roomId?: UUID;
    type?: string;
    count?: number;
    offset?: number;
  }): Promise<Log[]>;

  /**
   * Deletes a log from the database.
   * @param logId The UUID of the log to delete.
   * @returns A Promise that resolves when the log has been deleted.
   */
  abstract deleteLog(logId: UUID): Promise<void>;

  /**
   * Searches for memories based on embeddings and other specified parameters.
   * @param params An object containing parameters for the memory search.
   * @returns A Promise that resolves to an array of Memory objects.
   */
  abstract searchMemories(params: {
    tableName: string;
    embedding: number[];
    match_threshold?: number;
    count?: number;
    unique?: boolean;
    query?: string;
    roomId?: UUID;
    worldId?: UUID;
    entityId?: UUID;
  }): Promise<Memory[]>;

  /**
   * Creates a new memory in the database.
   * @param memory The memory object to create.
   * @param tableName The table where the memory should be stored.
   * @param unique Indicates if the memory should be unique.
   * @returns A Promise that resolves when the memory has been created.
   */
  abstract createMemory(memory: Memory, tableName: string, unique?: boolean): Promise<UUID>;

  /**
   * Updates an existing memory in the database.
   * @param memory The memory object with updated content and optional embedding
   * @returns Promise resolving to boolean indicating success
   */
  abstract updateMemory(
    memory: Partial<Memory> & { id: UUID; metadata?: MemoryMetadata }
  ): Promise<boolean>;

  /**
   * Removes a specific memory from the database.
   * @param memoryId The UUID of the memory to remove.
   * @returns A Promise that resolves when the memory has been removed.
   */
  abstract deleteMemory(memoryId: UUID): Promise<void>;

  /**
   * Removes multiple memories from the database in a single batch operation.
   * @param memoryIds An array of UUIDs of the memories to remove.
   * @returns A Promise that resolves when all memories have been removed.
   */
  abstract deleteManyMemories(memoryIds: UUID[]): Promise<void>;

  /**
   * Removes all memories associated with a specific room.
   * @param roomId The UUID of the room whose memories should be removed.
   * @param tableName The table from which the memories should be removed.
   * @returns A Promise that resolves when all memories have been removed.
   */
  abstract deleteAllMemories(roomId: UUID, tableName: string): Promise<void>;

  /**
```