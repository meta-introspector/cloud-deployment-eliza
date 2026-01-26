# a7046c18:packages_plugin-sql_src_base.ts:2551-2700

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/base.ts:2551-2700
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
          ),
        );

      return result.map((row) => row.roomId as UUID);
    });
  }

  /**
   * Asynchronously retrieves all rooms for a list of participants from the database based on the provided parameters.
   * @param {UUID[]} entityIds - The IDs of the entities to retrieve rooms for.
   * @returns {Promise<UUID[]>} A Promise that resolves to an array of room IDs.
   */
  async getRoomsForParticipants(entityIds: UUID[]): Promise<UUID[]> {
    return this.withDatabase(async () => {
      const result = await this.db
        .selectDistinct({ roomId: participantTable.roomId })
        .from(participantTable)
        .innerJoin(roomTable, eq(participantTable.roomId, roomTable.id))
        .where(
          and(
            inArray(participantTable.entityId, entityIds),
            eq(roomTable.agentId, this.agentId),
          ),
        );

      return result.map((row) => row.roomId as UUID);
    });
  }

  /**
   * Asynchronously adds a participant to a room in the database based on the provided parameters.
   * @param {UUID} entityId - The ID of the entity to add to the room.
   * @param {UUID} roomId - The ID of the room to add the entity to.
   * @returns {Promise<boolean>} A Promise that resolves to a boolean indicating whether the participant was added successfully.
   */
  async addParticipant(entityId: UUID, roomId: UUID): Promise<boolean> {
    return this.withDatabase(async () => {
      try {
        await this.db
          .insert(participantTable)
          .values({
            entityId,
            roomId,
            agentId: this.agentId,
          })
          .onConflictDoNothing();
        return true;
      } catch (error) {
        logger.error(
          {
            src: "plugin:sql",
            entityId,
            roomId,
            agentId: this.agentId,
            error: error instanceof Error ? error.message : String(error),
          },
          "Failed to add participant to room",
        );
        return false;
      }
    });
  }

  async addParticipantsRoom(entityIds: UUID[], roomId: UUID): Promise<boolean> {
    return this.withDatabase(async () => {
      try {
        const values = entityIds.map((id) => ({
          entityId: id,
          roomId,
          agentId: this.agentId,
        }));
        await this.db
          .insert(participantTable)
          .values(values)
          .onConflictDoNothing()
          .execute();
        return true;
      } catch (error) {
        logger.error(
          {
            src: "plugin:sql",
            roomId,
            agentId: this.agentId,
            error: error instanceof Error ? error.message : String(error),
          },
          "Failed to add participants to room",
        );
        return false;
      }
    });
  }

  /**
   * Asynchronously removes a participant from a room in the database based on the provided parameters.
   * @param {UUID} entityId - The ID of the entity to remove from the room.
   * @param {UUID} roomId - The ID of the room to remove the entity from.
   * @returns {Promise<boolean>} A Promise that resolves to a boolean indicating whether the participant was removed successfully.
   */
  async removeParticipant(entityId: UUID, roomId: UUID): Promise<boolean> {
    return this.withDatabase(async () => {
      try {
        const result = await this.db.transaction(async (tx) => {
          return await tx
            .delete(participantTable)
            .where(
              and(
                eq(participantTable.entityId, entityId),
                eq(participantTable.roomId, roomId),
              ),
            )
            .returning();
        });

        const removed = result.length > 0;
        return removed;
      } catch (error) {
        logger.error(
          {
            src: "plugin:sql",
            entityId,
            roomId,
            error: error instanceof Error ? error.message : String(error),
          },
          "Failed to remove participant from room",
        );
        return false;
      }
    });
  }

  /**
   * Asynchronously retrieves all participants for an entity from the database based on the provided parameters.
   * @param {UUID} entityId - The ID of the entity to retrieve participants for.
   * @returns {Promise<Participant[]>} A Promise that resolves to an array of participants.
   */
  async getParticipantsForEntity(entityId: UUID): Promise<Participant[]> {
    return this.withDatabase(async () => {
      const result = await this.db
        .select({
          id: participantTable.id,
          entityId: participantTable.entityId,
          roomId: participantTable.roomId,
        })
        .from(participantTable)
        .where(eq(participantTable.entityId, entityId));

      const entities = await this.getEntitiesByIds([entityId]);

      if (!entities || !entities.length) {
        return [];
```