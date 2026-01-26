# 5e8c73c1:packages_plugin-sql_src_base.ts:3001-3150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-sql/src/base.ts:3001-3150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
      return this.withDatabase(async () => {
        const result = await this.db
          .select()
          .from(taskTable)
          .where(
            and(
              eq(taskTable.agentId, this.agentId),
              ...(params.roomId ? [eq(taskTable.roomId, params.roomId)] : []),
              ...(params.tags && params.tags.length > 0
                ? [
                    sql`${taskTable.tags} @> ARRAY[${sql.join(
                      params.tags.map((t) => sql`${t}`),
                      sql`, `
                    )}]::text[]`,
                  ]
                : [])
            )
          );

        return result.map((row) => ({
          id: row.id as UUID,
          name: row.name,
          description: row.description ?? '',
          roomId: row.roomId as UUID,
          worldId: row.worldId as UUID,
          tags: row.tags || [],
          metadata: row.metadata as TaskMetadata,
        }));
      });
    });
  }

  /**
   * Asynchronously retrieves a specific task by its name.
   * @param name The name of the task to retrieve
   * @returns Promise resolving to the Task object if found, null otherwise
   */
  async getTasksByName(name: string): Promise<Task[]> {
    return this.withRetry(async () => {
      return this.withDatabase(async () => {
        const result = await this.db
          .select()
          .from(taskTable)
          .where(and(eq(taskTable.name, name), eq(taskTable.agentId, this.agentId)));

        return result.map((row) => ({
          id: row.id as UUID,
          name: row.name,
          description: row.description ?? '',
          roomId: row.roomId as UUID,
          worldId: row.worldId as UUID,
          tags: row.tags || [],
          metadata: (row.metadata || {}) as TaskMetadata,
        }));
      });
    });
  }

  /**
   * Asynchronously retrieves a specific task by its ID.
   * @param id The UUID of the task to retrieve
   * @returns Promise resolving to the Task object if found, null otherwise
   */
  async getTask(id: UUID): Promise<Task | null> {
    return this.withRetry(async () => {
      return this.withDatabase(async () => {
        const result = await this.db
          .select()
          .from(taskTable)
          .where(and(eq(taskTable.id, id), eq(taskTable.agentId, this.agentId)))
          .limit(1);

        if (result.length === 0) {
          return null;
        }

        const row = result[0];
        return {
          id: row.id as UUID,
          name: row.name,
          description: row.description ?? '',
          roomId: row.roomId as UUID,
          worldId: row.worldId as UUID,
          tags: row.tags || [],
          metadata: (row.metadata || {}) as TaskMetadata,
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
        if (task.description !== undefined) updateValues.description = task.description;
        if (task.roomId !== undefined) updateValues.roomId = task.roomId;
        if (task.worldId !== undefined) updateValues.worldId = task.worldId;
        if (task.tags !== undefined) updateValues.tags = task.tags;

        // Always update the updatedAt timestamp as a Date
        // Note: Task interface uses number for updatedAt, but database schema uses Date
        interface TaskUpdateValues extends Partial<typeof taskTable.$inferInsert> {
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
          .where(and(eq(taskTable.id, id), eq(taskTable.agentId, this.agentId)));
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
```