# a7046c18:packages_plugin-sql_src_base.ts:2851-3000

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/base.ts:2851-3000
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
            agentId: this.agentId,
            error: error instanceof Error ? error.message : String(error),
            saveParams,
          },
          "Error creating relationship",
        );
        return false;
      }
    });
  }

  /**
   * Asynchronously updates an existing relationship in the database based on the provided parameters.
   * @param {Relationship} relationship - The relationship object to update.
   * @returns {Promise<void>} A Promise that resolves when the relationship is updated.
   */
  async updateRelationship(relationship: Relationship): Promise<void> {
    return this.withDatabase(async () => {
      try {
        await this.db
          .update(relationshipTable)
          .set({
            tags: relationship.tags || [],
            metadata: relationship.metadata || {},
          })
          .where(eq(relationshipTable.id, relationship.id));
      } catch (error) {
        logger.error(
          {
            src: "plugin:sql",
            agentId: this.agentId,
            error: error instanceof Error ? error.message : String(error),
            relationshipId: relationship.id,
          },
          "Error updating relationship",
        );
        throw error;
      }
    });
  }

  /**
   * Asynchronously retrieves a relationship from the database based on the provided parameters.
   * @param {Object} params - The parameters for retrieving a relationship.
   * @param {UUID} params.sourceEntityId - The ID of the source entity.
   * @param {UUID} params.targetEntityId - The ID of the target entity.
   * @returns {Promise<Relationship | null>} A Promise that resolves to the relationship if found, null otherwise.
   */
  async getRelationship(params: {
    sourceEntityId: UUID;
    targetEntityId: UUID;
  }): Promise<Relationship | null> {
    return this.withDatabase(async () => {
      const { sourceEntityId, targetEntityId } = params;
      const result = await this.db
        .select()
        .from(relationshipTable)
        .where(
          and(
            eq(relationshipTable.sourceEntityId, sourceEntityId),
            eq(relationshipTable.targetEntityId, targetEntityId),
          ),
        );
      if (result.length === 0) return null;
      const relationship = result[0];
      return {
        ...relationship,
        id: relationship.id as UUID,
        sourceEntityId: relationship.sourceEntityId as UUID,
        targetEntityId: relationship.targetEntityId as UUID,
        agentId: relationship.agentId as UUID,
        tags: relationship.tags ?? [],
        metadata: (relationship.metadata as Record<string, unknown>) ?? {},
        createdAt: relationship.createdAt.toISOString(),
      };
    });
  }

  /**
   * Asynchronously retrieves relationships from the database based on the provided parameters.
   * @param {Object} params - The parameters for retrieving relationships.
   * @param {UUID} params.entityId - The ID of the entity to retrieve relationships for.
   * @param {string[]} [params.tags] - The tags to filter relationships by.
   * @returns {Promise<Relationship[]>} A Promise that resolves to an array of relationships.
   */
  async getRelationships(params: {
    entityId: UUID;
    tags?: string[];
  }): Promise<Relationship[]> {
    return this.withDatabase(async () => {
      const { entityId, tags } = params;

      let query: SQL;

      if (tags && tags.length > 0) {
        query = sql`
          SELECT * FROM ${relationshipTable}
          WHERE (${relationshipTable.sourceEntityId} = ${entityId} OR ${relationshipTable.targetEntityId} = ${entityId})
          AND ${relationshipTable.tags} && CAST(ARRAY[${sql.join(tags, sql`, `)}] AS text[])
        `;
      } else {
        query = sql`
          SELECT * FROM ${relationshipTable}
          WHERE ${relationshipTable.sourceEntityId} = ${entityId} OR ${relationshipTable.targetEntityId} = ${entityId}
        `;
      }

      const result = await this.db.execute(query);

      return result.rows.map((relationship: Record<string, unknown>) => ({
        ...relationship,
        id: relationship.id as UUID,
        sourceEntityId: (relationship.source_entity_id ||
          relationship.sourceEntityId) as UUID,
        targetEntityId: (relationship.target_entity_id ||
          relationship.targetEntityId) as UUID,
        agentId: (relationship.agent_id || relationship.agentId) as UUID,
        tags: relationship.tags ?? [],
        metadata: (relationship.metadata as Record<string, unknown>) ?? {},
        createdAt:
          relationship.created_at || relationship.createdAt
            ? (relationship.created_at || relationship.createdAt) instanceof
              Date
              ? (
                  (relationship.created_at || relationship.createdAt) as Date
                ).toISOString()
              : new Date(
                  (relationship.created_at as string) ||
                    (relationship.createdAt as string),
                ).toISOString()
            : new Date().toISOString(),
      }));
    });
  }

  /**
   * Asynchronously retrieves a cache value from the database based on the provided key.
   * @param {string} key - The key to retrieve the cache value for.
   * @returns {Promise<T | undefined>} A Promise that resolves to the cache value if found, undefined otherwise.
   */
  async getCache<T>(key: string): Promise<T | undefined> {
    return this.withDatabase(async () => {
      try {
        const result = await this.db
          .select({ value: cacheTable.value })
          .from(cacheTable)
          .where(
            and(eq(cacheTable.agentId, this.agentId), eq(cacheTable.key, key)),
          )
          .limit(1);
```