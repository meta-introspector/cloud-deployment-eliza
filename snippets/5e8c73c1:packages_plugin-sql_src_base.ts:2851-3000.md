# 5e8c73c1:packages_plugin-sql_src_base.ts:2851-3000

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-sql/src/base.ts:2851-3000
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
            agentId: this.agentId,
            error: error instanceof Error ? error.message : String(error),
            key,
          },
          'Error setting cache'
        );
        return false;
      }
    });
  }

  /**
   * Asynchronously deletes a cache value from the database based on the provided key.
   * @param {string} key - The key to delete the cache value for.
   * @returns {Promise<boolean>} A Promise that resolves to a boolean indicating whether the cache value was deleted successfully.
   */
  async deleteCache(key: string): Promise<boolean> {
    return this.withDatabase(async () => {
      try {
        await this.db.transaction(async (tx) => {
          await tx
            .delete(cacheTable)
            .where(and(eq(cacheTable.agentId, this.agentId), eq(cacheTable.key, key)));
        });
        return true;
      } catch (error) {
        logger.error(
          {
            src: 'plugin:sql',
            agentId: this.agentId,
            error: error instanceof Error ? error.message : String(error),
            key,
          },
          'Error deleting cache'
        );
        return false;
      }
    });
  }

  /**
   * Asynchronously creates a new world in the database based on the provided parameters.
   * @param {World} world - The world object to create.
   * @returns {Promise<UUID>} A Promise that resolves to the ID of the created world.
   */
  async createWorld(world: World): Promise<UUID> {
    return this.withDatabase(async () => {
      const newWorldId = world.id || v4();
      await this.db.insert(worldTable).values({
        ...world,
        id: newWorldId,
        name: world.name || '',
      });
      return newWorldId;
    });
  }

  /**
   * Asynchronously retrieves a world from the database based on the provided parameters.
   * @param {UUID} id - The ID of the world to retrieve.
   * @returns {Promise<World | null>} A Promise that resolves to the world if found, null otherwise.
   */
  async getWorld(id: UUID): Promise<World | null> {
    return this.withDatabase(async () => {
      const result = await this.db.select().from(worldTable).where(eq(worldTable.id, id));
      return result.length > 0 ? (result[0] as World) : null;
    });
  }

  /**
   * Asynchronously retrieves all worlds from the database based on the provided parameters.
   * @returns {Promise<World[]>} A Promise that resolves to an array of worlds.
   */
  async getAllWorlds(): Promise<World[]> {
    return this.withDatabase(async () => {
      const result = await this.db
        .select()
        .from(worldTable)
        .where(eq(worldTable.agentId, this.agentId));
      return result as World[];
    });
  }

  /**
   * Asynchronously updates an existing world in the database based on the provided parameters.
   * @param {World} world - The world object to update.
   * @returns {Promise<void>} A Promise that resolves when the world is updated.
   */
  async updateWorld(world: World): Promise<void> {
    return this.withDatabase(async () => {
      await this.db.update(worldTable).set(world).where(eq(worldTable.id, world.id));
    });
  }

  /**
   * Asynchronously removes a world from the database based on the provided parameters.
   * @param {UUID} id - The ID of the world to remove.
   * @returns {Promise<void>} A Promise that resolves when the world is removed.
   */
  async removeWorld(id: UUID): Promise<void> {
    return this.withDatabase(async () => {
      await this.db.delete(worldTable).where(eq(worldTable.id, id));
    });
  }

  /**
   * Asynchronously creates a new task in the database based on the provided parameters.
   * @param {Task} task - The task object to create.
   * @returns {Promise<UUID>} A Promise that resolves to the ID of the created task.
   */
  async createTask(task: Task): Promise<UUID> {
    if (!task.worldId) {
      throw new Error('worldId is required');
    }
    return this.withRetry(async () => {
      return this.withDatabase(async () => {
        const now = new Date();
        const metadata = task.metadata || {};

        const values = {
          id: task.id as UUID,
          name: task.name,
          description: task.description,
          roomId: task.roomId as UUID,
          worldId: task.worldId as UUID,
          tags: task.tags,
          metadata: metadata,
          createdAt: now,
          updatedAt: now,
          agentId: this.agentId as UUID,
        };

        const result = await this.db.insert(taskTable).values(values).returning();

        return result[0].id as UUID;
      });
    });
  }

  /**
   * Asynchronously retrieves tasks based on specified parameters.
   * @param params Object containing optional roomId, tags, and entityId to filter tasks
   * @returns Promise resolving to an array of Task objects
   */
  async getTasks(params: {
    roomId?: UUID;
    tags?: string[];
    entityId?: UUID; // Added entityId parameter
  }): Promise<Task[]> {
    return this.withRetry(async () => {
```