# a7046c18:packages_plugin-sql_src_base.ts:3001-3150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/base.ts:3001-3150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

        if (result && result.length > 0 && result[0]) {
          return result[0].value as T | undefined;
        }

        return undefined;
      } catch (error) {
        logger.error(
          {
            src: "plugin:sql",
            agentId: this.agentId,
            error: error instanceof Error ? error.message : String(error),
            key,
          },
          "Error fetching cache",
        );
        return undefined;
      }
    });
  }

  /**
   * Asynchronously sets a cache value in the database based on the provided key and value.
   * @param {string} key - The key to set the cache value for.
   * @param {T} value - The value to set in the cache.
   * @returns {Promise<boolean>} A Promise that resolves to a boolean indicating whether the cache value was set successfully.
   */
  async setCache<T>(key: string, value: T): Promise<boolean> {
    return this.withDatabase(async () => {
      try {
        await this.db
          .insert(cacheTable)
          .values({
            key: key,
            agentId: this.agentId,
            value: value,
          })
          .onConflictDoUpdate({
            target: [cacheTable.key, cacheTable.agentId],
            set: {
              value: value,
            },
          });

        return true;
      } catch (error) {
        logger.error(
          {
            src: "plugin:sql",
            agentId: this.agentId,
            error: error instanceof Error ? error.message : String(error),
            key,
          },
          "Error setting cache",
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
            .where(
              and(
                eq(cacheTable.agentId, this.agentId),
                eq(cacheTable.key, key),
              ),
            );
        });
        return true;
      } catch (error) {
        logger.error(
          {
            src: "plugin:sql",
            agentId: this.agentId,
            error: error instanceof Error ? error.message : String(error),
            key,
          },
          "Error deleting cache",
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
        name: world.name || "",
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
      const result = await this.db
        .select()
        .from(worldTable)
        .where(eq(worldTable.id, id));
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
      await this.db
        .update(worldTable)
        .set(world)
```