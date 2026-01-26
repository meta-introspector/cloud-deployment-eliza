# 5e8c73c1:packages_plugin-sql_src_base.ts:2551-2700

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-sql/src/base.ts:2551-2700
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
    return this.withDatabase(async () => {
      const result = await this.db
        .select()
        .from(participantTable)
        .where(and(eq(participantTable.roomId, roomId), eq(participantTable.entityId, entityId)))
        .limit(1);

      return result.length > 0;
    });
  }

  /**
   * Asynchronously retrieves the user state for a participant in a room from the database based on the provided parameters.
   * @param {UUID} roomId - The ID of the room to retrieve the participant's user state for.
   * @param {UUID} entityId - The ID of the entity to retrieve the user state for.
   * @returns {Promise<"FOLLOWED" | "MUTED" | null>} A Promise that resolves to the participant's user state.
   */
  async getParticipantUserState(
    roomId: UUID,
    entityId: UUID
  ): Promise<'FOLLOWED' | 'MUTED' | null> {
    return this.withDatabase(async () => {
      const result = await this.db
        .select({ roomState: participantTable.roomState })
        .from(participantTable)
        .where(
          and(
            eq(participantTable.roomId, roomId),
            eq(participantTable.entityId, entityId),
            eq(participantTable.agentId, this.agentId)
          )
        )
        .limit(1);

      return (result[0]?.roomState as 'FOLLOWED' | 'MUTED' | null) ?? null;
    });
  }

  /**
   * Asynchronously sets the user state for a participant in a room in the database based on the provided parameters.
   * @param {UUID} roomId - The ID of the room to set the participant's user state for.
   * @param {UUID} entityId - The ID of the entity to set the user state for.
   * @param {string} state - The state to set the participant's user state to.
   * @returns {Promise<void>} A Promise that resolves when the participant's user state is set.
   */
  async setParticipantUserState(
    roomId: UUID,
    entityId: UUID,
    state: 'FOLLOWED' | 'MUTED' | null
  ): Promise<void> {
    return this.withDatabase(async () => {
      try {
        await this.db.transaction(async (tx) => {
          await tx
            .update(participantTable)
            .set({ roomState: state })
            .where(
              and(
                eq(participantTable.roomId, roomId),
                eq(participantTable.entityId, entityId),
                eq(participantTable.agentId, this.agentId)
              )
            );
        });
      } catch (error) {
        logger.error(
          {
            src: 'plugin:sql',
            roomId,
            entityId,
            state,
            error: error instanceof Error ? error.message : String(error),
          },
          'Failed to set participant follow state'
        );
        throw error;
      }
    });
  }

  /**
   * Asynchronously creates a new relationship in the database based on the provided parameters.
   * @param {Object} params - The parameters for creating a new relationship.
   * @param {UUID} params.sourceEntityId - The ID of the source entity.
   * @param {UUID} params.targetEntityId - The ID of the target entity.
   * @param {string[]} [params.tags] - The tags for the relationship.
   * @param {Object} [params.metadata] - The metadata for the relationship.
   * @returns {Promise<boolean>} A Promise that resolves to a boolean indicating whether the relationship was created successfully.
   */
  async createRelationship(params: {
    sourceEntityId: UUID;
    targetEntityId: UUID;
    tags?: string[];
    metadata?: { [key: string]: unknown };
  }): Promise<boolean> {
    return this.withDatabase(async () => {
      const id = v4();
      const saveParams = {
        id,
        sourceEntityId: params.sourceEntityId,
        targetEntityId: params.targetEntityId,
        agentId: this.agentId,
        tags: params.tags || [],
        metadata: params.metadata || {},
      };
      try {
        await this.db.insert(relationshipTable).values(saveParams);
        return true;
      } catch (error) {
        logger.error(
          {
            src: 'plugin:sql',
            agentId: this.agentId,
            error: error instanceof Error ? error.message : String(error),
            saveParams,
          },
          'Error creating relationship'
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
            src: 'plugin:sql',
            agentId: this.agentId,
            error: error instanceof Error ? error.message : String(error),
            relationshipId: relationship.id,
          },
          'Error updating relationship'
        );
        throw error;
      }
```