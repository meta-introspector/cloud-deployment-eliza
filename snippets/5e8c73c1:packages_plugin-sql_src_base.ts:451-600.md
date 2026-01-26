# 5e8c73c1:packages_plugin-sql_src_base.ts:451-600

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-sql/src/base.ts:451-600
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```

  /**
   * Merges updated agent settings with existing settings in the database,
   * with special handling for nested objects like secrets.
   * @param tx - The database transaction
   * @param agentId - The ID of the agent
   * @param updatedSettings - The settings object with updates
   * @returns The merged settings object
   * @private
   */
  private async mergeAgentSettings<T extends Record<string, unknown>>(
    tx: DrizzleDatabase,
    agentId: UUID,
    updatedSettings: T
  ): Promise<T> {
    // First get the current agent data
    const currentAgent = await tx
      .select({ settings: agentTable.settings })
      .from(agentTable)
      .where(eq(agentTable.id, agentId))
      .limit(1);

    const currentSettings =
      currentAgent.length > 0 && currentAgent[0].settings ? currentAgent[0].settings : {};

    const deepMerge = (
      target: Record<string, unknown> | unknown,
      source: Record<string, unknown>
    ): Record<string, unknown> | undefined => {
      // If source is explicitly null, it means the intention is to set this entire branch to null (or delete if top-level handled by caller).
      // For recursive calls, if a sub-object in source is null, it effectively means "remove this sub-object from target".
      // However, our primary deletion signal is a *property value* being null within an object.
      if (source === null) {
        // If the entire source for a given key is null, we treat it as "delete this key from target"
        // by returning undefined, which the caller can use to delete the key.
        return undefined;
      }

      // If source is an array or a primitive, it replaces the target value.
      if (Array.isArray(source) || typeof source !== 'object') {
        return source;
      }

      // Initialize output. If target is not an object, start with an empty one to merge source into.
      const output =
        typeof target === 'object' && target !== null && !Array.isArray(target)
          ? { ...target }
          : {};

      for (const key of Object.keys(source)) {
        // Iterate over source keys
        const sourceValue = source[key];

        if (sourceValue === null) {
          // If a value in source is null, delete the corresponding key from output.
          delete output[key];
        } else if (typeof sourceValue === 'object' && !Array.isArray(sourceValue)) {
          // If value is an object, recurse.
          const nestedMergeResult = deepMerge(output[key], sourceValue as Record<string, unknown>);
          if (nestedMergeResult === undefined) {
            // If recursive merge resulted in undefined (meaning the nested object should be deleted)
            delete output[key];
          } else {
            output[key] = nestedMergeResult;
          }
        } else {
          // Primitive or array value from source, assign it.
          output[key] = sourceValue;
        }
      }

      // After processing all keys from source, check if output became empty.
      // An object is empty if all its keys were deleted or resulted in undefined.
      // This is a more direct check than iterating 'output' after building it.
      if (Object.keys(output).length === 0) {
        // If the source itself was not an explicitly empty object,
        // and the merge resulted in an empty object, signal deletion.
        if (!(typeof source === 'object' && source !== null && Object.keys(source).length === 0)) {
          return undefined; // Signal to delete this (parent) key if it became empty.
        }
      }

      return output;
    }; // End of deepMerge

    const finalSettings = deepMerge(currentSettings, updatedSettings);
    // If the entire settings object becomes undefined (e.g. all keys removed),
    // return an empty object instead of undefined/null to keep the settings field present.
    return (finalSettings ?? {}) as T;
  }

  /**
   * Asynchronously deletes an agent with the specified UUID and all related entries.
   *
   * @param {UUID} agentId - The UUID of the agent to be deleted.
   * @returns {Promise<boolean>} - A boolean indicating if the deletion was successful.
   */
  async deleteAgent(agentId: UUID): Promise<boolean> {
    return this.withDatabase(async () => {
      try {
        // Simply delete the agent - all related data will be cascade deleted
        const result = await this.db
          .delete(agentTable)
          .where(eq(agentTable.id, agentId))
          .returning();

        if (result.length === 0) {
          logger.warn({ src: 'plugin:sql', agentId }, 'Agent not found for deletion');
          return false;
        }

        return true;
      } catch (error) {
        logger.error(
          {
            src: 'plugin:sql',
            agentId,
            error: error instanceof Error ? error.message : String(error),
          },
          'Failed to delete agent'
        );
        throw error;
      }
    });
  }

  /**
   * Count all agents in the database
   * Used primarily for maintenance and cleanup operations
   */
  /**
   * Asynchronously counts the number of agents in the database.
   * @returns {Promise<number>} A Promise that resolves to the number of agents in the database.
   */
  async countAgents(): Promise<number> {
    return this.withDatabase(async () => {
      try {
        const result = await this.db.select({ count: count() }).from(agentTable);

        return result[0]?.count || 0;
      } catch (error) {
        logger.error(
          { src: 'plugin:sql', error: error instanceof Error ? error.message : String(error) },
          'Failed to count agents'
        );
        return 0;
      }
    });
  }

```