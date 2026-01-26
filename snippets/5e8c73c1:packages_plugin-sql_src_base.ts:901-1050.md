# 5e8c73c1:packages_plugin-sql_src_base.ts:901-1050

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-sql/src/base.ts:901-1050
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```

      const result = await this.db.execute(searchQuery);

      return result.rows.map((row: Record<string, unknown>) => ({
        id: row.id as UUID,
        agentId: row.agentId as UUID,
        names: row.names || [],
        metadata: row.metadata || {},
      }));
    });
  }

  async getComponent(
    entityId: UUID,
    type: string,
    worldId?: UUID,
    sourceEntityId?: UUID
  ): Promise<Component | null> {
    return this.withDatabase(async () => {
      const conditions = [eq(componentTable.entityId, entityId), eq(componentTable.type, type)];

      if (worldId) {
        conditions.push(eq(componentTable.worldId, worldId));
      }

      if (sourceEntityId) {
        conditions.push(eq(componentTable.sourceEntityId, sourceEntityId));
      }

      const result = await this.db
        .select()
        .from(componentTable)
        .where(and(...conditions));

      if (result.length === 0) return null;

      const component = result[0];

      return {
        ...component,
        id: component.id as UUID,
        entityId: component.entityId as UUID,
        agentId: component.agentId as UUID,
        roomId: component.roomId as UUID,
        worldId: (component.worldId ?? '') as UUID,
        sourceEntityId: (component.sourceEntityId ?? '') as UUID,
        data: component.data as Record<string, unknown>,
        createdAt: component.createdAt.getTime(),
      };
    });
  }

  /**
   * Asynchronously retrieves all components for a given entity, optionally filtered by world and source entity.
   * @param {UUID} entityId - The unique identifier of the entity to retrieve components for
   * @param {UUID} [worldId] - Optional world ID to filter components by
   * @param {UUID} [sourceEntityId] - Optional source entity ID to filter components by
   * @returns {Promise<Component[]>} A Promise that resolves to an array of components
   */
  async getComponents(entityId: UUID, worldId?: UUID, sourceEntityId?: UUID): Promise<Component[]> {
    return this.withDatabase(async () => {
      const conditions = [eq(componentTable.entityId, entityId)];

      if (worldId) {
        conditions.push(eq(componentTable.worldId, worldId));
      }

      if (sourceEntityId) {
        conditions.push(eq(componentTable.sourceEntityId, sourceEntityId));
      }

      const result = await this.db
        .select({
          id: componentTable.id,
          entityId: componentTable.entityId,
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
        worldId: (component.worldId ?? '') as UUID,
        sourceEntityId: (component.sourceEntityId ?? '') as UUID,
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
        console.error('updateComponent error', e);
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
      await this.db.delete(componentTable).where(eq(componentTable.id, componentId));
    });
  }
```