# a7046c18:packages_plugin-sql_src_base.d.ts:601-750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/base.d.ts:601-750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
   * @param {UUID} roomId - The ID of the room to check.
   * @param {UUID} entityId - The ID of the entity to check.
   * @returns {Promise<boolean>} A Promise that resolves to true if entity is a participant.
   */
  isRoomParticipant(roomId: UUID, entityId: UUID): Promise<boolean>;
  /**
   * Asynchronously retrieves the user state for a participant in a room from the database based on the provided parameters.
   * @param {UUID} roomId - The ID of the room to retrieve the participant's user state for.
   * @param {UUID} entityId - The ID of the entity to retrieve the user state for.
   * @returns {Promise<"FOLLOWED" | "MUTED" | null>} A Promise that resolves to the participant's user state.
   */
  getParticipantUserState(
    roomId: UUID,
    entityId: UUID,
  ): Promise<"FOLLOWED" | "MUTED" | null>;
  /**
   * Asynchronously sets the user state for a participant in a room in the database based on the provided parameters.
   * @param {UUID} roomId - The ID of the room to set the participant's user state for.
   * @param {UUID} entityId - The ID of the entity to set the user state for.
   * @param {string} state - The state to set the participant's user state to.
   * @returns {Promise<void>} A Promise that resolves when the participant's user state is set.
   */
  setParticipantUserState(
    roomId: UUID,
    entityId: UUID,
    state: "FOLLOWED" | "MUTED" | null,
  ): Promise<void>;
  /**
   * Asynchronously creates a new relationship in the database based on the provided parameters.
   * @param {Object} params - The parameters for creating a new relationship.
   * @param {UUID} params.sourceEntityId - The ID of the source entity.
   * @param {UUID} params.targetEntityId - The ID of the target entity.
   * @param {string[]} [params.tags] - The tags for the relationship.
   * @param {Object} [params.metadata] - The metadata for the relationship.
   * @returns {Promise<boolean>} A Promise that resolves to a boolean indicating whether the relationship was created successfully.
   */
  createRelationship(params: {
    sourceEntityId: UUID;
    targetEntityId: UUID;
    tags?: string[];
    metadata?: {
      [key: string]: unknown;
    };
  }): Promise<boolean>;
  /**
   * Asynchronously updates an existing relationship in the database based on the provided parameters.
   * @param {Relationship} relationship - The relationship object to update.
   * @returns {Promise<void>} A Promise that resolves when the relationship is updated.
   */
  updateRelationship(relationship: Relationship): Promise<void>;
  /**
   * Asynchronously retrieves a relationship from the database based on the provided parameters.
   * @param {Object} params - The parameters for retrieving a relationship.
   * @param {UUID} params.sourceEntityId - The ID of the source entity.
   * @param {UUID} params.targetEntityId - The ID of the target entity.
   * @returns {Promise<Relationship | null>} A Promise that resolves to the relationship if found, null otherwise.
   */
  getRelationship(params: {
    sourceEntityId: UUID;
    targetEntityId: UUID;
  }): Promise<Relationship | null>;
  /**
   * Asynchronously retrieves relationships from the database based on the provided parameters.
   * @param {Object} params - The parameters for retrieving relationships.
   * @param {UUID} params.entityId - The ID of the entity to retrieve relationships for.
   * @param {string[]} [params.tags] - The tags to filter relationships by.
   * @returns {Promise<Relationship[]>} A Promise that resolves to an array of relationships.
   */
  getRelationships(params: {
    entityId: UUID;
    tags?: string[];
  }): Promise<Relationship[]>;
  /**
   * Asynchronously retrieves a cache value from the database based on the provided key.
   * @param {string} key - The key to retrieve the cache value for.
   * @returns {Promise<T | undefined>} A Promise that resolves to the cache value if found, undefined otherwise.
   */
  getCache<T>(key: string): Promise<T | undefined>;
  /**
   * Asynchronously sets a cache value in the database based on the provided key and value.
   * @param {string} key - The key to set the cache value for.
   * @param {T} value - The value to set in the cache.
   * @returns {Promise<boolean>} A Promise that resolves to a boolean indicating whether the cache value was set successfully.
   */
  setCache<T>(key: string, value: T): Promise<boolean>;
  /**
   * Asynchronously deletes a cache value from the database based on the provided key.
   * @param {string} key - The key to delete the cache value for.
   * @returns {Promise<boolean>} A Promise that resolves to a boolean indicating whether the cache value was deleted successfully.
   */
  deleteCache(key: string): Promise<boolean>;
  /**
   * Asynchronously creates a new world in the database based on the provided parameters.
   * @param {World} world - The world object to create.
   * @returns {Promise<UUID>} A Promise that resolves to the ID of the created world.
   */
  createWorld(world: World): Promise<UUID>;
  /**
   * Asynchronously retrieves a world from the database based on the provided parameters.
   * @param {UUID} id - The ID of the world to retrieve.
   * @returns {Promise<World | null>} A Promise that resolves to the world if found, null otherwise.
   */
  getWorld(id: UUID): Promise<World | null>;
  /**
   * Asynchronously retrieves all worlds from the database based on the provided parameters.
   * @returns {Promise<World[]>} A Promise that resolves to an array of worlds.
   */
  getAllWorlds(): Promise<World[]>;
  /**
   * Asynchronously updates an existing world in the database based on the provided parameters.
   * @param {World} world - The world object to update.
   * @returns {Promise<void>} A Promise that resolves when the world is updated.
   */
  updateWorld(world: World): Promise<void>;
  /**
   * Asynchronously removes a world from the database based on the provided parameters.
   * @param {UUID} id - The ID of the world to remove.
   * @returns {Promise<void>} A Promise that resolves when the world is removed.
   */
  removeWorld(id: UUID): Promise<void>;
  /**
   * Asynchronously creates a new task in the database based on the provided parameters.
   * @param {Task} task - The task object to create.
   * @returns {Promise<UUID>} A Promise that resolves to the ID of the created task.
   */
  createTask(task: Task): Promise<UUID>;
  /**
   * Asynchronously retrieves tasks based on specified parameters.
   * @param params Object containing optional roomId, tags, and entityId to filter tasks
   * @returns Promise resolving to an array of Task objects
   */
  getTasks(params: {
    roomId?: UUID;
    tags?: string[];
    entityId?: UUID;
  }): Promise<Task[]>;
  /**
   * Asynchronously retrieves a specific task by its name.
   * @param name The name of the task to retrieve
   * @returns Promise resolving to the Task object if found, null otherwise
   */
  getTasksByName(name: string): Promise<Task[]>;
  /**
   * Asynchronously retrieves a specific task by its ID.
   * @param id The UUID of the task to retrieve
   * @returns Promise resolving to the Task object if found, null otherwise
   */
  getTask(id: UUID): Promise<Task | null>;
  /**
   * Asynchronously updates an existing task in the database.
```