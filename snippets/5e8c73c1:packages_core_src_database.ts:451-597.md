# 5e8c73c1:packages_core_src_database.ts:451-597

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/database.ts:451-597
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
    metadata?: Record<string, unknown>;
  }): Promise<boolean>;

  /**
   * Retrieves a relationship between two users if it exists.
   * @param params Object containing the entity IDs and agent ID
   * @returns A Promise that resolves to the Relationship object or null if not found.
   */
  abstract getRelationship(params: {
    sourceEntityId: UUID;
    targetEntityId: UUID;
  }): Promise<Relationship | null>;

  /**
   * Retrieves all relationships for a specific user.
   * @param params Object containing the user ID, agent ID and optional tags to filter by
   * @returns A Promise that resolves to an array of Relationship objects.
   */
  abstract getRelationships(params: { entityId: UUID; tags?: string[] }): Promise<Relationship[]>;

  /**
   * Updates an existing relationship between two users.
   * @param params Object containing the relationship details to update including entity IDs, agent ID, optional tags and metadata
   * @returns A Promise that resolves to a boolean indicating success or failure of the update.
   */
  abstract updateRelationship(params: {
    sourceEntityId: UUID;
    targetEntityId: UUID;
    tags?: string[];
    metadata?: Record<string, unknown>;
  }): Promise<void>;

  /**
   * Retrieves an agent by its ID.
   * @param agentId The UUID of the agent to retrieve.
   * @returns A Promise that resolves to the Agent object or null if not found.
   */
  abstract getAgent(agentId: UUID): Promise<Agent | null>;

  /**
   * Retrieves all agents from the database.
   * @returns A Promise that resolves to an array of Agent objects.
   */
  abstract getAgents(): Promise<Partial<Agent>[]>;

  /**
   * Creates a new agent in the database.
   * @param agent The agent object to create.
   * @returns A Promise that resolves to a boolean indicating success or failure of the creation.
   */
  abstract createAgent(agent: Partial<Agent>): Promise<boolean>;

  /**
   * Updates an existing agent in the database.
   * @param agentId The UUID of the agent to update.
   * @param agent The agent object with updated properties.
   * @returns A Promise that resolves to a boolean indicating success or failure of the update.
   */
  abstract updateAgent(agentId: UUID, agent: Partial<Agent>): Promise<boolean>;

  /**
   * Deletes an agent from the database.
   * @param agentId The UUID of the agent to delete.
   * @returns A Promise that resolves to a boolean indicating success or failure of the deletion.
   */
  abstract deleteAgent(agentId: UUID): Promise<boolean>;

  /**
   * Ensures an embedding dimension exists in the database.
   * @param dimension The dimension to ensure exists.
   * @returns A Promise that resolves when the embedding dimension has been ensured to exist.
   */
  abstract ensureEmbeddingDimension(dimension: number): Promise<void>;

  /**
   * Retrieves a cached value by key from the database.
   * @param key The key to look up in the cache
   * @returns Promise resolving to the cached string value
   */
  abstract getCache<T>(key: string): Promise<T | undefined>;

  /**
   * Sets a value in the cache with the given key.
   * @param key The key to store the value under
   * @param value The value to cache
   * @returns Promise resolving to true if the cache was set successfully
   */
  abstract setCache<T>(key: string, value: T): Promise<boolean>;

  /**
   * Deletes a value from the cache by key.
   * @param key The key to delete from the cache
   * @returns Promise resolving to true if the value was successfully deleted
   */
  abstract deleteCache(key: string): Promise<boolean>;

  /**
   * Creates a new task instance in the database.
   * @param task The task object to create
   * @returns Promise resolving to the UUID of the created task
   */
  abstract createTask(task: Task): Promise<UUID>;

  /**
   * Retrieves tasks based on specified parameters.
   * @param params Object containing optional roomId and tags to filter tasks
   * @returns Promise resolving to an array of Task objects
   */
  abstract getTasks(params: { roomId?: UUID; tags?: string[]; entityId?: UUID }): Promise<Task[]>;

  /**
   * Retrieves a specific task by its ID.
   * @param id The UUID of the task to retrieve
   * @returns Promise resolving to the Task object if found, null otherwise
   */
  abstract getTask(id: UUID): Promise<Task | null>;

  /**
   * Retrieves a specific task by its name.
   * @param name The name of the task to retrieve
   * @returns Promise resolving to the Task object if found, null otherwise
   */
  abstract getTasksByName(name: string): Promise<Task[]>;

  /**
   * Updates an existing task in the database.
   * @param id The UUID of the task to update
   * @param task Partial Task object containing the fields to update
   * @returns Promise resolving when the update is complete
   */
  abstract updateTask(id: UUID, task: Partial<Task>): Promise<void>;

  /**
   * Deletes a task from the database.
   * @param id The UUID of the task to delete
   * @returns Promise resolving when the deletion is complete
   */
  abstract deleteTask(id: UUID): Promise<void>;

  abstract getMemoriesByWorldId(params: {
    worldId: UUID;
    count?: number;
    tableName?: string;
  }): Promise<Memory[]>;

  abstract deleteRoomsByWorldId(worldId: UUID): Promise<void>;
}
```