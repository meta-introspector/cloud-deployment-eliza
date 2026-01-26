# 5e8c73c1:packages_plugin-sql_src_base.ts:2401-2550

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-sql/src/base.ts:2401-2550
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
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
            src: 'plugin:sql',
            entityId,
            roomId,
            agentId: this.agentId,
            error: error instanceof Error ? error.message : String(error),
          },
          'Failed to add participant to room'
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
        await this.db.insert(participantTable).values(values).onConflictDoNothing().execute();
        return true;
      } catch (error) {
        logger.error(
          {
            src: 'plugin:sql',
            roomId,
            agentId: this.agentId,
            error: error instanceof Error ? error.message : String(error),
          },
          'Failed to add participants to room'
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
              and(eq(participantTable.entityId, entityId), eq(participantTable.roomId, roomId))
            )
            .returning();
        });

        const removed = result.length > 0;
        return removed;
      } catch (error) {
        logger.error(
          {
            src: 'plugin:sql',
            entityId,
            roomId,
            error: error instanceof Error ? error.message : String(error),
          },
          'Failed to remove participant from room'
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
```