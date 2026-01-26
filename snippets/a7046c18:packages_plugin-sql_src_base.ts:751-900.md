# a7046c18:packages_plugin-sql_src_base.ts:751-900

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/base.ts:751-900
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
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
            src: "plugin:sql",
            entityId: entities[0]?.id,
            error: error instanceof Error ? error.message : String(error),
          },
          "Failed to create entities",
        );
        return false;
      }
    });
  }

  /**
   * Asynchronously ensures an entity exists, creating it if it doesn't
   * @param entity The entity to ensure exists
   * @returns Promise resolving to boolean indicating success
   */
  protected async ensureEntityExists(entity: Entity): Promise<boolean> {
    if (!entity.id) {
      logger.error(
        { src: "plugin:sql" },
        "Entity ID is required for ensureEntityExists",
      );
      return false;
    }

    try {
      const existingEntities = await this.getEntitiesByIds([entity.id]);

      if (!existingEntities || !existingEntities.length) {
        return await this.createEntities([entity]);
      }

      return true;
    } catch (error) {
      logger.error(
        {
          src: "plugin:sql",
          entityId: entity.id,
          error: error instanceof Error ? error.message : String(error),
        },
        "Failed to ensure entity exists",
      );
      return false;
    }
  }

  /**
   * Asynchronously updates an entity in the database.
   * @param {Entity} entity - The entity object to be updated.
   * @returns {Promise<void>} A Promise that resolves when the entity is updated.
   */
  async updateEntity(entity: Entity): Promise<void> {
    if (!entity.id) {
      throw new Error("Entity ID is required for update");
    }
    return this.withDatabase(async () => {
      // Normalize entity data to ensure names is a proper array
      const normalizedEntity = {
        ...entity,
        names: this.normalizeEntityNames(entity.names),
        metadata: entity.metadata || {},
      };

      await this.db
        .update(entityTable)
        .set(normalizedEntity)
        .where(eq(entityTable.id, entity.id as string));
    });
  }

  /**
   * Asynchronously deletes an entity from the database based on the provided ID.
   * @param {UUID} entityId - The ID of the entity to delete.
   * @returns {Promise<void>} A Promise that resolves when the entity is deleted.
   */
  async deleteEntity(entityId: UUID): Promise<void> {
    return this.withDatabase(async () => {
      await this.db.transaction(async (tx) => {
        // Delete related components first
        await tx
          .delete(componentTable)
          .where(
            or(
              eq(componentTable.entityId, entityId),
              eq(componentTable.sourceEntityId, entityId),
            ),
          );

        // Delete the entity
        await tx.delete(entityTable).where(eq(entityTable.id, entityId));
      });
    });
  }

  /**
   * Asynchronously retrieves entities by their names and agentId.
   * @param {Object} params - The parameters for retrieving entities.
   * @param {string[]} params.names - The names to search for.
   * @param {UUID} params.agentId - The agent ID to filter by.
   * @returns {Promise<Entity[]>} A Promise that resolves to an array of entities.
   */
  async getEntitiesByNames(params: {
    names: string[];
    agentId: UUID;
```