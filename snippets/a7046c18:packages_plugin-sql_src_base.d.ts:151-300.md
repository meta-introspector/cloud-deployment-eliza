# a7046c18:packages_plugin-sql_src_base.d.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/base.d.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
   * @param agentId - The ID of the agent
   * @param updatedSettings - The settings object with updates
   * @returns The merged settings object
   * @private
   */
  private mergeAgentSettings;
  /**
   * Asynchronously deletes an agent with the specified UUID and all related entries.
   *
   * @param {UUID} agentId - The UUID of the agent to be deleted.
   * @returns {Promise<boolean>} - A boolean indicating if the deletion was successful.
   */
  deleteAgent(agentId: UUID): Promise<boolean>;
  /**
   * Count all agents in the database
   * Used primarily for maintenance and cleanup operations
   */
  /**
   * Asynchronously counts the number of agents in the database.
   * @returns {Promise<number>} A Promise that resolves to the number of agents in the database.
   */
  countAgents(): Promise<number>;
  /**
   * Clean up the agents table by removing all agents
   * This is used during server startup to ensure no orphaned agents exist
   * from previous crashes or improper shutdowns
   */
  cleanupAgents(): Promise<void>;
  /**
   * Asynchronously retrieves an entity and its components by entity IDs.
   * @param {UUID[]} entityIds - The unique identifiers of the entities to retrieve.
   * @returns {Promise<Entity[] | null>} A Promise that resolves to the entity with its components if found, null otherwise.
   */
  getEntitiesByIds(entityIds: UUID[]): Promise<Entity[] | null>;
  /**
   * Asynchronously retrieves all entities for a given room, optionally including their components.
   * @param {UUID} roomId - The unique identifier of the room to get entities for
   * @param {boolean} [includeComponents] - Whether to include component data for each entity
   * @returns {Promise<Entity[]>} A Promise that resolves to an array of entities in the room
   */
  getEntitiesForRoom(
    roomId: UUID,
    includeComponents?: boolean,
  ): Promise<Entity[]>;
  /**
   * Asynchronously creates new entities in the database.
   * @param {Entity[]} entities - The entity objects to be created.
   * @returns {Promise<boolean>} A Promise that resolves to a boolean indicating the success of the operation.
   */
  createEntities(entities: Entity[]): Promise<boolean>;
  /**
   * Asynchronously ensures an entity exists, creating it if it doesn't
   * @param entity The entity to ensure exists
   * @returns Promise resolving to boolean indicating success
   */
  protected ensureEntityExists(entity: Entity): Promise<boolean>;
  /**
   * Asynchronously updates an entity in the database.
   * @param {Entity} entity - The entity object to be updated.
   * @returns {Promise<void>} A Promise that resolves when the entity is updated.
   */
  updateEntity(entity: Entity): Promise<void>;
  /**
   * Asynchronously deletes an entity from the database based on the provided ID.
   * @param {UUID} entityId - The ID of the entity to delete.
   * @returns {Promise<void>} A Promise that resolves when the entity is deleted.
   */
  deleteEntity(entityId: UUID): Promise<void>;
  /**
   * Asynchronously retrieves entities by their names and agentId.
   * @param {Object} params - The parameters for retrieving entities.
   * @param {string[]} params.names - The names to search for.
   * @param {UUID} params.agentId - The agent ID to filter by.
   * @returns {Promise<Entity[]>} A Promise that resolves to an array of entities.
   */
  getEntitiesByNames(params: {
    names: string[];
    agentId: UUID;
  }): Promise<Entity[]>;
  /**
   * Asynchronously searches for entities by name with fuzzy matching.
   * @param {Object} params - The parameters for searching entities.
   * @param {string} params.query - The search query.
   * @param {UUID} params.agentId - The agent ID to filter by.
   * @param {number} params.limit - The maximum number of results to return.
   * @returns {Promise<Entity[]>} A Promise that resolves to an array of entities.
   */
  searchEntitiesByName(params: {
    query: string;
    agentId: UUID;
    limit?: number;
  }): Promise<Entity[]>;
  getComponent(
    entityId: UUID,
    type: string,
    worldId?: UUID,
    sourceEntityId?: UUID,
  ): Promise<Component | null>;
  /**
   * Asynchronously retrieves all components for a given entity, optionally filtered by world and source entity.
   * @param {UUID} entityId - The unique identifier of the entity to retrieve components for
   * @param {UUID} [worldId] - Optional world ID to filter components by
   * @param {UUID} [sourceEntityId] - Optional source entity ID to filter components by
   * @returns {Promise<Component[]>} A Promise that resolves to an array of components
   */
  getComponents(
    entityId: UUID,
    worldId?: UUID,
    sourceEntityId?: UUID,
  ): Promise<Component[]>;
  /**
   * Asynchronously creates a new component in the database.
   * @param {Component} component - The component object to be created.
   * @returns {Promise<boolean>} A Promise that resolves to a boolean indicating the success of the operation.
   */
  createComponent(component: Component): Promise<boolean>;
  /**
   * Asynchronously updates an existing component in the database.
   * @param {Component} component - The component object to be updated.
   * @returns {Promise<void>} A Promise that resolves when the component is updated.
   */
  updateComponent(component: Component): Promise<void>;
  /**
   * Asynchronously deletes a component from the database.
   * @param {UUID} componentId - The unique identifier of the component to delete.
   * @returns {Promise<void>} A Promise that resolves when the component is deleted.
   */
  deleteComponent(componentId: UUID): Promise<void>;
  /**
   * Asynchronously retrieves memories from the database based on the provided parameters.
   * @param {Object} params - The parameters for retrieving memories.
   * @param {UUID} params.roomId - The ID of the room to retrieve memories for.
   * @param {number} [params.count] - The maximum number of memories to retrieve.
   * @param {number} [params.offset] - The offset for pagination.
   * @param {boolean} [params.unique] - Whether to retrieve unique memories only.
   * @param {string} [params.tableName] - The name of the table to retrieve memories from.
   * @param {number} [params.start] - The start date to retrieve memories from.
   * @param {number} [params.end] - The end date to retrieve memories from.
   * @returns {Promise<Memory[]>} A Promise that resolves to an array of memories.
   */
  getMemories(params: {
    entityId?: UUID;
    agentId?: UUID;
    count?: number;
    offset?: number;
    unique?: boolean;
    tableName: string;
    start?: number;
    end?: number;
    roomId?: UUID;
```