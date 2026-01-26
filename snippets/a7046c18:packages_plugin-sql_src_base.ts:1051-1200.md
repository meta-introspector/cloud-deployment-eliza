# a7046c18:packages_plugin-sql_src_base.ts:1051-1200

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/base.ts:1051-1200
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
          type: componentTable.type,
          data: componentTable.data,
          worldId: componentTable.worldId,
          agentId: componentTable.agentId,
          roomId: componentTable.roomId,
          sourceEntityId: componentTable.sourceEntityId,
          createdAt: componentTable.createdAt,
        })
        .from(componentTable)
        .where(and(...conditions));

      if (result.length === 0) return [];

      const components = result.map((component) => ({
        ...component,
        id: component.id as UUID,
        entityId: component.entityId as UUID,
        agentId: component.agentId as UUID,
        roomId: component.roomId as UUID,
        worldId: (component.worldId ?? "") as UUID,
        sourceEntityId: (component.sourceEntityId ?? "") as UUID,
        data: component.data as Record<string, unknown>,
        createdAt: component.createdAt.getTime(),
      }));

      return components;
    });
  }

  /**
   * Asynchronously creates a new component in the database.
   * @param {Component} component - The component object to be created.
   * @returns {Promise<boolean>} A Promise that resolves to a boolean indicating the success of the operation.
   */
  async createComponent(component: Component): Promise<boolean> {
    return this.withDatabase(async () => {
      await this.db.insert(componentTable).values({
        ...component,
        createdAt: new Date(),
      });
      return true;
    });
  }

  /**
   * Asynchronously updates an existing component in the database.
   * @param {Component} component - The component object to be updated.
   * @returns {Promise<void>} A Promise that resolves when the component is updated.
   */
  async updateComponent(component: Component): Promise<void> {
    return this.withDatabase(async () => {
      try {
        await this.db
          .update(componentTable)
          .set({
            ...component,
            updatedAt: new Date(),
          })
          .where(eq(componentTable.id, component.id));
      } catch (e) {
        console.error("updateComponent error", e);
      }
    });
  }

  /**
   * Asynchronously deletes a component from the database.
   * @param {UUID} componentId - The unique identifier of the component to delete.
   * @returns {Promise<void>} A Promise that resolves when the component is deleted.
   */
  async deleteComponent(componentId: UUID): Promise<void> {
    return this.withDatabase(async () => {
      await this.db
        .delete(componentTable)
        .where(eq(componentTable.id, componentId));
    });
  }

  /**
   * Asynchronously retrieves memories from the database based on the provided parameters.
   * @param {Object} params - The parameters for retrieving memories.
   * @param {UUID} params.roomId - The ID of the room to retrieve memories for.
   * @param {number} [params.count] - The maximum number of memories to retrieve.
   * @param {number} [params.offset] - The offset for pagination.
   * @param {boolean} [params.unique] - Whether to retrieve unique memories only.
   * @param {string} [params.tableName] - The name of the table to retrieve memories from.
   * @param {number} [params.start] - The start date to retrieve memories from.
   * @param {number} [params.end] - The end date to retrieve memories from.
   * @returns {Promise<Memory[]>} A Promise that resolves to an array of memories.
   */
  async getMemories(params: {
    entityId?: UUID;
    agentId?: UUID;
    count?: number;
    offset?: number;
    unique?: boolean;
    tableName: string;
    start?: number;
    end?: number;
    roomId?: UUID;
    worldId?: UUID;
  }): Promise<Memory[]> {
    const {
      entityId,
      agentId,
      roomId,
      worldId,
      tableName,
      unique,
      start,
      end,
      offset,
    } = params;

    if (!tableName) throw new Error("tableName is required");
    if (offset !== undefined && offset < 0) {
      throw new Error("offset must be a non-negative number");
    }

    return this.withEntityContext(entityId ?? null, async (tx) => {
      const conditions = [eq(memoryTable.type, tableName)];

      if (start) {
        conditions.push(gte(memoryTable.createdAt, new Date(start)));
      }

      // Note: entityId WHERE filter removed - RLS handles access control
      // This allows seeing ALL messages in accessible rooms (user + agent responses)

      if (roomId) {
        conditions.push(eq(memoryTable.roomId, roomId));
      }

      // Add worldId condition
      if (worldId) {
        conditions.push(eq(memoryTable.worldId, worldId));
      }

      if (end) {
        conditions.push(lte(memoryTable.createdAt, new Date(end)));
      }

      if (unique) {
        conditions.push(eq(memoryTable.unique, true));
      }

      if (agentId) {
        conditions.push(eq(memoryTable.agentId, agentId));
      }

```