# a7046c18:packages_plugin-sql_src_base.ts:3301-3450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/base.ts:3301-3450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        };
      });
    });
  }

  /**
   * Asynchronously updates an existing task in the database.
   * @param id The UUID of the task to update
   * @param task Partial Task object containing the fields to update
   * @returns Promise resolving when the update is complete
   */
  async updateTask(id: UUID, task: Partial<Task>): Promise<void> {
    await this.withRetry(async () => {
      await this.withDatabase(async () => {
        const updateValues: Partial<Task> = {};

        // Add fields to update if they exist in the partial task object
        if (task.name !== undefined) updateValues.name = task.name;
        if (task.description !== undefined)
          updateValues.description = task.description;
        if (task.roomId !== undefined) updateValues.roomId = task.roomId;
        if (task.worldId !== undefined) updateValues.worldId = task.worldId;
        if (task.tags !== undefined) updateValues.tags = task.tags;

        // Always update the updatedAt timestamp as a Date
        // Note: Task interface uses number for updatedAt, but database schema uses Date
        interface TaskUpdateValues
          extends Partial<typeof taskTable.$inferInsert> {
          updatedAt?: Date;
        }
        const dbUpdateValues: TaskUpdateValues = {
          ...updateValues,
          updatedAt: new Date(),
        };

        // Handle metadata updates - just set it directly without merging
        if (task.metadata !== undefined) {
          dbUpdateValues.metadata = task.metadata;
        }

        await this.db
          .update(taskTable)
          // createdAt is hella borked, number / Date
          .set(dbUpdateValues)
          .where(
            and(eq(taskTable.id, id), eq(taskTable.agentId, this.agentId)),
          );
      });
    });
  }

  /**
   * Asynchronously deletes a task from the database.
   * @param id The UUID of the task to delete
   * @returns Promise resolving when the deletion is complete
   */
  async deleteTask(id: UUID): Promise<void> {
    return this.withDatabase(async () => {
      await this.db.delete(taskTable).where(eq(taskTable.id, id));
    });
  }

  async getMemoriesByWorldId(params: {
    worldId: UUID;
    count?: number;
    tableName?: string;
  }): Promise<Memory[]> {
    return this.withDatabase(async () => {
      // First, get all rooms for the given worldId
      const rooms = await this.db
        .select({ id: roomTable.id })
        .from(roomTable)
        .where(
          and(
            eq(roomTable.worldId, params.worldId),
            eq(roomTable.agentId, this.agentId),
          ),
        );

      if (rooms.length === 0) {
        return [];
      }

      const roomIds = rooms.map((room) => room.id as UUID);

      const memories = await this.getMemoriesByRoomIds({
        roomIds,
        tableName: params.tableName || "messages",
        limit: params.count,
      });

      return memories;
    });
  }

  async deleteRoomsByWorldId(worldId: UUID): Promise<void> {
    return this.withDatabase(async () => {
      const rooms = await this.db
        .select({ id: roomTable.id })
        .from(roomTable)
        .where(
          and(
            eq(roomTable.worldId, worldId),
            eq(roomTable.agentId, this.agentId),
          ),
        );

      if (rooms.length === 0) {
        return;
      }

      const roomIds = rooms.map((room) => room.id as UUID);

      if (roomIds.length > 0) {
        await this.db.delete(logTable).where(inArray(logTable.roomId, roomIds));
        await this.db
          .delete(participantTable)
          .where(inArray(participantTable.roomId, roomIds));

        const memoriesInRooms = await this.db
          .select({ id: memoryTable.id })
          .from(memoryTable)
          .where(inArray(memoryTable.roomId, roomIds));
        const memoryIdsInRooms = memoriesInRooms.map((m) => m.id as UUID);

        if (memoryIdsInRooms.length > 0) {
          await this.db
            .delete(embeddingTable)
            .where(inArray(embeddingTable.memoryId, memoryIdsInRooms));
          await this.db
            .delete(memoryTable)
            .where(inArray(memoryTable.id, memoryIdsInRooms));
        }

        await this.db.delete(roomTable).where(inArray(roomTable.id, roomIds));

        logger.debug(
          {
            src: "plugin:sql",
            worldId,
            roomsDeleted: roomIds.length,
            memoriesDeleted: memoryIdsInRooms.length,
          },
          "World cleanup completed",
        );
      }
    });
  }

  // Message Server Database Operations
```