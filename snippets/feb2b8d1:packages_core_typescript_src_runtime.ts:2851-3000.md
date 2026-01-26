# feb2b8d1:packages_core_typescript_src_runtime.ts:2851-3000

**Commit:** feb2b8d1a9d781db8ca36187a067193c397d0b85
**Author:** lalalune
**Date:** Thu Jan 8 23:09:32 2026 -0800
**File:** packages/core/typescript/src/runtime.ts:2851-3000
**Novelty Score:** 38.24
**Concepts:** plugin-system, testing

```
      this.logger.warn(
        { src: "agent", agentId: this.agentId, task: taskHandler.name },
        "Task worker already registered, overwriting",
      );
    }
    this.taskWorkers.set(taskHandler.name, taskHandler);
  }

  getTaskWorker(name: string): TaskWorker | undefined {
    return this.taskWorkers.get(name);
  }

  get db(): unknown {
    return this.adapter.db;
  }
  async init(): Promise<void> {
    await this.adapter.init();
  }
  async close(): Promise<void> {
    if (this.adapter) {
      await this.adapter.close();
    }
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
      throw new Error("Agent id is required");
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
      const existingSecrets = existingAgent.settings && existingAgent.settings.secrets;
      const agentSecrets = agent.settings && agent.settings.secrets;
      const mergedSecrets =
        typeof existingSecrets === "object" ||
        typeof agentSecrets === "object"
          ? {
              ...(typeof existingSecrets === "object"
                ? existingSecrets
                : {}),
              ...(typeof agentSecrets === "object"
                ? agentSecrets
                : {}),
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

      this.logger.debug(
        { src: "agent", agentId: agent.id },
        "Agent updated on restart",
      );
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

    this.logger.debug({ src: "agent", agentId: agent.id }, "Agent created");
    return newAgent;
  }
  async getEntityById(entityId: UUID): Promise<Entity | null> {
    const entities = await this.adapter.getEntitiesByIds([entityId]);
    if (!entities || !entities.length) return null;
    return entities[0];
  }

  async getEntitiesByIds(entityIds: UUID[]): Promise<Entity[] | null> {
    return await this.adapter.getEntitiesByIds(entityIds);
  }
  async getEntitiesForRoom(
    roomId: UUID,
    includeComponents?: boolean,
  ): Promise<Entity[]> {
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
    sourceEntityId?: UUID,
  ): Promise<Component | null> {
    return await this.adapter.getComponent(
      entityId,
```