# a7046c18:packages_plugin-sql_src_base.ts:901-1050

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/base.ts:901-1050
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  }): Promise<Entity[]> {
    return this.withDatabase(async () => {
      const { names, agentId } = params;

      // Build a condition to match any of the names
      const nameConditions = names.map(
        (name) => sql`${name} = ANY(${entityTable.names})`,
      );

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
      if (!query || query.trim() === "") {
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
          WHERE LOWER(name) LIKE LOWER(${`%${query}%`})
        )
        LIMIT ${limit}
      `;

      const result = await this.db.execute(searchQuery);

      return result.rows.map((row: Record<string, unknown>) => ({
        id: row.id as UUID,
        agentId: row.agentId as UUID,
        names: row.names || [],
        metadata: row.metadata || {},
      }));
    });
  }

  async getComponent(
    entityId: UUID,
    type: string,
    worldId?: UUID,
    sourceEntityId?: UUID,
  ): Promise<Component | null> {
    return this.withDatabase(async () => {
      const conditions = [
        eq(componentTable.entityId, entityId),
        eq(componentTable.type, type),
      ];

      if (worldId) {
        conditions.push(eq(componentTable.worldId, worldId));
      }

      if (sourceEntityId) {
        conditions.push(eq(componentTable.sourceEntityId, sourceEntityId));
      }

      const result = await this.db
        .select()
        .from(componentTable)
        .where(and(...conditions));

      if (result.length === 0) return null;

      const component = result[0];

      return {
        ...component,
        id: component.id as UUID,
        entityId: component.entityId as UUID,
        agentId: component.agentId as UUID,
        roomId: component.roomId as UUID,
        worldId: (component.worldId ?? "") as UUID,
        sourceEntityId: (component.sourceEntityId ?? "") as UUID,
        data: component.data as Record<string, unknown>,
        createdAt: component.createdAt.getTime(),
      };
    });
  }

  /**
   * Asynchronously retrieves all components for a given entity, optionally filtered by world and source entity.
   * @param {UUID} entityId - The unique identifier of the entity to retrieve components for
   * @param {UUID} [worldId] - Optional world ID to filter components by
   * @param {UUID} [sourceEntityId] - Optional source entity ID to filter components by
   * @returns {Promise<Component[]>} A Promise that resolves to an array of components
   */
  async getComponents(
    entityId: UUID,
    worldId?: UUID,
    sourceEntityId?: UUID,
  ): Promise<Component[]> {
    return this.withDatabase(async () => {
      const conditions = [eq(componentTable.entityId, entityId)];

      if (worldId) {
        conditions.push(eq(componentTable.worldId, worldId));
      }

      if (sourceEntityId) {
        conditions.push(eq(componentTable.sourceEntityId, sourceEntityId));
      }

      const result = await this.db
        .select({
          id: componentTable.id,
          entityId: componentTable.entityId,
```