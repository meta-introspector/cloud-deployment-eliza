# 5e8c73c1:packages_core_src_runtime.ts:2551-2700

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/runtime.ts:2551-2700
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
  }
  async getAgent(agentId: UUID): Promise<Agent | null> {
    return await this.adapter.getAgent(agentId);
  }
  async getAgents(): Promise<Partial<Agent>[]> {
    return await this.adapter.getAgents();
  }
  async createAgent(agent: Partial<Agent>): Promise<boolean> {
    return await this.adapter.createAgent(agent);
  }
  async updateAgent(agentId: UUID, agent: Partial<Agent>): Promise<boolean> {
    return await this.adapter.updateAgent(agentId, agent);
  }
  async deleteAgent(agentId: UUID): Promise<boolean> {
    return await this.adapter.deleteAgent(agentId);
  }
  async ensureAgentExists(agent: Partial<Agent>): Promise<Agent> {
    if (!agent.id) {
      throw new Error('Agent id is required');
    }

    // Check if agent exists by ID
    const existingAgent = await this.adapter.getAgent(agent.id);

    if (existingAgent) {
      // Merge DB-persisted settings with character configuration
      // Priority: DB (persisted runtime settings) < character.json (file overrides)
      const mergedSettings = {
        ...existingAgent.settings, // Keep all DB-persisted settings
        ...agent.settings, // Override only keys present in character.json
      };

      // Deep merge secrets to preserve runtime-generated secrets
      const mergedSecrets =
        typeof existingAgent.settings?.secrets === 'object' ||
        typeof agent.settings?.secrets === 'object'
          ? {
              ...(typeof existingAgent.settings?.secrets === 'object'
                ? existingAgent.settings.secrets
                : {}),
              ...(typeof agent.settings?.secrets === 'object' ? agent.settings.secrets : {}),
            }
          : undefined;

      if (mergedSecrets) {
        mergedSettings.secrets = mergedSecrets;
      }

      const updatedAgent = {
        ...existingAgent, // Keep all DB-persisted data
        ...agent, // Override with character.json values
        settings: mergedSettings, // Use intelligently merged settings
        id: agent.id,
        updatedAt: Date.now(),
      };

      await this.adapter.updateAgent(agent.id, updatedAgent);
      const refreshedAgent = await this.adapter.getAgent(agent.id);

      if (!refreshedAgent) {
        throw new Error(`Failed to retrieve agent after update: ${agent.id}`);
      }

      this.logger.debug({ src: 'agent', agentId: agent.id }, 'Agent updated on restart');
      return refreshedAgent;
    }

    // Create new agent if it doesn't exist
    const newAgent: Agent = {
      ...agent,
      id: agent.id,
    } as Agent;

    const created = await this.adapter.createAgent(newAgent);
    if (!created) {
      throw new Error(`Failed to create agent: ${agent.id}`);
    }

    this.logger.debug({ src: 'agent', agentId: agent.id }, 'Agent created');
    return newAgent;
  }
  async getEntityById(entityId: UUID): Promise<Entity | null> {
    const entities = await this.adapter.getEntitiesByIds([entityId]);
    if (!entities?.length) return null;
    return entities[0];
  }

  async getEntitiesByIds(entityIds: UUID[]): Promise<Entity[] | null> {
    return await this.adapter.getEntitiesByIds(entityIds);
  }
  async getEntitiesForRoom(roomId: UUID, includeComponents?: boolean): Promise<Entity[]> {
    return await this.adapter.getEntitiesForRoom(roomId, includeComponents);
  }
  async createEntity(entity: Entity): Promise<boolean> {
    if (!entity.agentId) {
      entity.agentId = this.agentId;
    }
    return await this.createEntities([entity]);
  }

  async createEntities(entities: Entity[]): Promise<boolean> {
    entities.forEach((e) => {
      e.agentId = this.agentId;
    });
    return await this.adapter.createEntities(entities);
  }

  async updateEntity(entity: Entity): Promise<void> {
    await this.adapter.updateEntity(entity);
  }
  async getComponent(
    entityId: UUID,
    type: string,
    worldId?: UUID,
    sourceEntityId?: UUID
  ): Promise<Component | null> {
    return await this.adapter.getComponent(entityId, type, worldId, sourceEntityId);
  }
  async getComponents(entityId: UUID, worldId?: UUID, sourceEntityId?: UUID): Promise<Component[]> {
    return await this.adapter.getComponents(entityId, worldId, sourceEntityId);
  }
  async createComponent(component: Component): Promise<boolean> {
    return await this.adapter.createComponent(component);
  }
  async updateComponent(component: Component): Promise<void> {
    await this.adapter.updateComponent(component);
  }
  async deleteComponent(componentId: UUID): Promise<void> {
    await this.adapter.deleteComponent(componentId);
  }
  async addEmbeddingToMemory(memory: Memory): Promise<Memory> {
    if (memory.embedding) {
      return memory;
    }
    const memoryText = memory.content.text;
    if (!memoryText) {
      throw new Error('Cannot generate embedding: Memory content is empty');
    }
    try {
      memory.embedding = await this.useModel(ModelType.TEXT_EMBEDDING, {
        text: memoryText,
      });
    } catch (error: unknown) {
      this.logger.error(
        {
          src: 'agent',
          agentId: this.agentId,
          error: error instanceof Error ? error.message : String(error),
        },
        'Embedding generation failed'
```