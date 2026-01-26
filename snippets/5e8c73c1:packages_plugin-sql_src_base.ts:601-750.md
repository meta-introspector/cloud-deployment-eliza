# 5e8c73c1:packages_plugin-sql_src_base.ts:601-750

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-sql/src/base.ts:601-750
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
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
          { src: 'plugin:sql', error: error instanceof Error ? error.message : String(error) },
          'Failed to clean up agent table'
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
      const entityComponents: Record<UUID, Entity['components']> = {};
      for (const e of result) {
        const key = e.entity.id;
        entities[key] = e.entity;
        if (entityComponents[key] === undefined) entityComponents[key] = [];
        if (e.components) {
          // Handle both single component and array of components
          const componentsArray = Array.isArray(e.components) ? e.components : [e.components];
          entityComponents[key] = [...entityComponents[key], ...componentsArray];
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
  async getEntitiesForRoom(roomId: UUID, includeComponents?: boolean): Promise<Entity[]> {
    return this.withDatabase(async () => {
      const query = this.db
        .select({
          entity: entityTable,
          ...(includeComponents && { components: componentTable }),
        })
        .from(participantTable)
        .leftJoin(
          entityTable,
          and(eq(participantTable.entityId, entityTable.id), eq(entityTable.agentId, this.agentId))
        );

      if (includeComponents) {
        query.leftJoin(componentTable, eq(componentTable.entityId, entityTable.id));
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
            id: entityId,
            agentId: row.entity.agentId as UUID,
            metadata: row.entity.metadata as Record<string, unknown>,
            components: includeComponents ? [] : undefined,
          };
          entitiesByIdMap.set(entityId, entity);
        }

        if (includeComponents && row.components) {
          const entity = entitiesByIdMap.get(entityId);
          if (entity) {
            if (!entity.components) {
              entity.components = [];
            }
            entity.components.push(row.components);
          }
        }
      }

      return Array.from(entitiesByIdMap.values());
    });
  }

  /**
   * Asynchronously creates new entities in the database.
   * @param {Entity[]} entities - The entity objects to be created.
   * @returns {Promise<boolean>} A Promise that resolves to a boolean indicating the success of the operation.
   */
  async createEntities(entities: Entity[]): Promise<boolean> {
    return this.withDatabase(async () => {
      try {
        return await this.db.transaction(async (tx) => {
          // Normalize entity data to ensure names is a proper array
          const normalizedEntities = entities.map((entity) => ({
            ...entity,
            names: this.normalizeEntityNames(entity.names),
            metadata: entity.metadata || {},
          }));

          await tx.insert(entityTable).values(normalizedEntities);

          return true;
        });
      } catch (error) {
        logger.error(
          {
            src: 'plugin:sql',
            entityId: entities[0]?.id,
            error: error instanceof Error ? error.message : String(error),
          },
          'Failed to create entities'
        );
        return false;
      }
    });
  }

```