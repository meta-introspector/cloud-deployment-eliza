# a7046c18:packages_core_typescript_src_database.ts:451-600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/database.ts:451-600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
   * @returns A Promise that resolves to a boolean indicating if the entity is a participant.
   */
  abstract isRoomParticipant(roomId: UUID, entityId: UUID): Promise<boolean>;

  abstract getParticipantUserState(
    roomId: UUID,
    entityId: UUID,
  ): Promise<"FOLLOWED" | "MUTED" | null>;

  abstract setParticipantUserState(
    roomId: UUID,
    entityId: UUID,
    state: "FOLLOWED" | "MUTED" | null,
  ): Promise<void>;

  /**
   * Creates a new relationship between two users.
   * @param params Object containing the relationship details including entity IDs, agent ID, optional tags and metadata
   * @returns A Promise that resolves to a boolean indicating success or failure of the creation.
   */
  abstract createRelationship(params: {
    sourceEntityId: UUID;
    targetEntityId: UUID;
    tags?: string[];
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
  abstract getRelationships(params: {
    entityId: UUID;
    tags?: string[];
  }): Promise<Relationship[]>;

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
  abstract getTasks(params: {
    roomId?: UUID;
    tags?: string[];
    entityId?: UUID;
  }): Promise<Task[]>;

  /**
   * Retrieves a specific task by its ID.
   * @param id The UUID of the task to retrieve
   * @returns Promise resolving to the Task object if found, null otherwise
   */
  abstract getTask(id: UUID): Promise<Task | null>;

  /**
   * Retrieves a specific task by its name.
```