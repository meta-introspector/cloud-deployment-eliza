# 5e8c73c1:packages_plugin-sql_src_base.ts:751-900

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-sql/src/base.ts:751-900
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
  /**
   * Asynchronously ensures an entity exists, creating it if it doesn't
   * @param entity The entity to ensure exists
   * @returns Promise resolving to boolean indicating success
   */
  protected async ensureEntityExists(entity: Entity): Promise<boolean> {
    if (!entity.id) {
      logger.error({ src: 'plugin:sql' }, 'Entity ID is required for ensureEntityExists');
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
          src: 'plugin:sql',
          entityId: entity.id,
          error: error instanceof Error ? error.message : String(error),
        },
        'Failed to ensure entity exists'
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
      throw new Error('Entity ID is required for update');
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
            or(eq(componentTable.entityId, entityId), eq(componentTable.sourceEntityId, entityId))
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
  async getEntitiesByNames(params: { names: string[]; agentId: UUID }): Promise<Entity[]> {
    return this.withDatabase(async () => {
      const { names, agentId } = params;

      // Build a condition to match any of the names
      const nameConditions = names.map((name) => sql`${name} = ANY(${entityTable.names})`);

      const query = sql`
        SELECT * FROM ${entityTable}
        WHERE ${entityTable.agentId} = ${agentId}
        AND (${sql.join(nameConditions, sql` OR `)})
      `;

      const result = await this.db.execute(query);

      return result.rows.map((row: Record<string, unknown>) => ({
        id: row.id as UUID,
        agentId: row.agentId as UUID,
        names: row.names || [],
        metadata: row.metadata || {},
      }));
    });
  }

  /**
   * Asynchronously searches for entities by name with fuzzy matching.
   * @param {Object} params - The parameters for searching entities.
   * @param {string} params.query - The search query.
   * @param {UUID} params.agentId - The agent ID to filter by.
   * @param {number} params.limit - The maximum number of results to return.
   * @returns {Promise<Entity[]>} A Promise that resolves to an array of entities.
   */
  async searchEntitiesByName(params: {
    query: string;
    agentId: UUID;
    limit?: number;
  }): Promise<Entity[]> {
    return this.withDatabase(async () => {
      const { query, agentId, limit = 10 } = params;

      // If query is empty, return all entities up to limit
      if (!query || query.trim() === '') {
        const result = await this.db
          .select()
          .from(entityTable)
          .where(eq(entityTable.agentId, agentId))
          .limit(limit);

        return result.map((row: Record<string, unknown>) => ({
          id: row.id as UUID,
          agentId: row.agentId as UUID,
          names: row.names || [],
          metadata: row.metadata || {},
        }));
      }

      // Otherwise, search for entities with names containing the query (case-insensitive)
      const searchQuery = sql`
        SELECT * FROM ${entityTable}
        WHERE ${entityTable.agentId} = ${agentId}
        AND EXISTS (
          SELECT 1 FROM unnest(${entityTable.names}) AS name
          WHERE LOWER(name) LIKE LOWER(${'%' + query + '%'})
        )
        LIMIT ${limit}
      `;
```