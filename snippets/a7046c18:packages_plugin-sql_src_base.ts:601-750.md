# a7046c18:packages_plugin-sql_src_base.ts:601-750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/base.ts:601-750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
            src: "plugin:sql",
            agentId,
            error: error instanceof Error ? error.message : String(error),
          },
          "Failed to delete agent",
        );
        throw error;
      }
    });
  }

  /**
   * Count all agents in the database
   * Used primarily for maintenance and cleanup operations
   */
  /**
   * Asynchronously counts the number of agents in the database.
   * @returns {Promise<number>} A Promise that resolves to the number of agents in the database.
   */
  async countAgents(): Promise<number> {
    return this.withDatabase(async () => {
      try {
        const result = await this.db
          .select({ count: count() })
          .from(agentTable);

        return result[0]?.count || 0;
      } catch (error) {
        logger.error(
          {
            src: "plugin:sql",
            error: error instanceof Error ? error.message : String(error),
          },
          "Failed to count agents",
        );
        return 0;
      }
    });
  }

  /**
   * Clean up the agents table by removing all agents
   * This is used during server startup to ensure no orphaned agents exist
   * from previous crashes or improper shutdowns
   */
  async cleanupAgents(): Promise<void> {
    return this.withDatabase(async () => {
      try {
        await this.db.delete(agentTable);
      } catch (error) {
        logger.error(
          {
            src: "plugin:sql",
            error: error instanceof Error ? error.message : String(error),
          },
          "Failed to clean up agent table",
        );
        throw error;
      }
    });
  }

  /**
   * Asynchronously retrieves an entity and its components by entity IDs.
   * @param {UUID[]} entityIds - The unique identifiers of the entities to retrieve.
   * @returns {Promise<Entity[] | null>} A Promise that resolves to the entity with its components if found, null otherwise.
   */
  async getEntitiesByIds(entityIds: UUID[]): Promise<Entity[] | null> {
    return this.withDatabase(async () => {
      const result = await this.db
        .select({
          entity: entityTable,
          components: componentTable,
        })
        .from(entityTable)
        .leftJoin(componentTable, eq(componentTable.entityId, entityTable.id))
        .where(inArray(entityTable.id, entityIds));

      if (result.length === 0) return [];

      // Group components by entity
      const entities: Record<UUID, Entity> = {};
      const entityComponents: Record<UUID, Entity["components"]> = {};
      for (const e of result) {
        const key = e.entity.id;
        entities[key] = e.entity;
        if (entityComponents[key] === undefined) entityComponents[key] = [];
        if (e.components) {
          // Handle both single component and array of components
          const componentsArray = Array.isArray(e.components)
            ? e.components
            : [e.components];
          entityComponents[key] = [
            ...entityComponents[key],
            ...componentsArray,
          ];
        }
      }
      for (const k of Object.keys(entityComponents)) {
        entities[k].components = entityComponents[k];
      }

      return Object.values(entities);
    });
  }

  /**
   * Asynchronously retrieves all entities for a given room, optionally including their components.
   * @param {UUID} roomId - The unique identifier of the room to get entities for
   * @param {boolean} [includeComponents] - Whether to include component data for each entity
   * @returns {Promise<Entity[]>} A Promise that resolves to an array of entities in the room
   */
  async getEntitiesForRoom(
    roomId: UUID,
    includeComponents?: boolean,
  ): Promise<Entity[]> {
    return this.withDatabase(async () => {
      const query = this.db
        .select({
          entity: entityTable,
          ...(includeComponents && { components: componentTable }),
        })
        .from(participantTable)
        .leftJoin(
          entityTable,
          and(
            eq(participantTable.entityId, entityTable.id),
            eq(entityTable.agentId, this.agentId),
          ),
        );

      if (includeComponents) {
        query.leftJoin(
          componentTable,
          eq(componentTable.entityId, entityTable.id),
        );
      }

      const result = await query.where(eq(participantTable.roomId, roomId));

      // Group components by entity if includeComponents is true
      const entitiesByIdMap = new Map<UUID, Entity>();

      for (const row of result) {
        if (!row.entity) continue;

        const entityId = row.entity.id as UUID;
        if (!entitiesByIdMap.has(entityId)) {
          const entity: Entity = {
            ...row.entity,
```