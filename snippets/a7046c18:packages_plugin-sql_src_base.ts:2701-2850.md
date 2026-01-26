# a7046c18:packages_plugin-sql_src_base.ts:2701-2850

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/base.ts:2701-2850
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      }

      return result.map((row) => ({
        id: row.id as UUID,
        entity: entities[0],
      }));
    });
  }

  /**
   * Asynchronously retrieves all participants for a room from the database based on the provided parameters.
   * @param {UUID} roomId - The ID of the room to retrieve participants for.
   * @returns {Promise<UUID[]>} A Promise that resolves to an array of entity IDs.
   */
  async getParticipantsForRoom(roomId: UUID): Promise<UUID[]> {
    return this.withDatabase(async () => {
      const result = await this.db
        .select({ entityId: participantTable.entityId })
        .from(participantTable)
        .where(eq(participantTable.roomId, roomId));

      return result.map((row) => row.entityId as UUID);
    });
  }

  /**
   * Check if an entity is a participant in a specific room/channel.
   * More efficient than getParticipantsForRoom when only checking membership.
   * @param {UUID} roomId - The ID of the room to check.
   * @param {UUID} entityId - The ID of the entity to check.
   * @returns {Promise<boolean>} A Promise that resolves to true if entity is a participant.
   */
  async isRoomParticipant(roomId: UUID, entityId: UUID): Promise<boolean> {
    return this.withDatabase(async () => {
      const result = await this.db
        .select()
        .from(participantTable)
        .where(
          and(
            eq(participantTable.roomId, roomId),
            eq(participantTable.entityId, entityId),
          ),
        )
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
    entityId: UUID,
  ): Promise<"FOLLOWED" | "MUTED" | null> {
    return this.withDatabase(async () => {
      const result = await this.db
        .select({ roomState: participantTable.roomState })
        .from(participantTable)
        .where(
          and(
            eq(participantTable.roomId, roomId),
            eq(participantTable.entityId, entityId),
            eq(participantTable.agentId, this.agentId),
          ),
        )
        .limit(1);

      return (result[0]?.roomState as "FOLLOWED" | "MUTED" | null) ?? null;
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
    state: "FOLLOWED" | "MUTED" | null,
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
                eq(participantTable.agentId, this.agentId),
              ),
            );
        });
      } catch (error) {
        logger.error(
          {
            src: "plugin:sql",
            roomId,
            entityId,
            state,
            error: error instanceof Error ? error.message : String(error),
          },
          "Failed to set participant follow state",
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
            src: "plugin:sql",
```