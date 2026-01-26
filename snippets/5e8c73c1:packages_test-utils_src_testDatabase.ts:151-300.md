# 5e8c73c1:packages_test-utils_src_testDatabase.ts:151-300

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/test-utils/src/testDatabase.ts:151-300
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
      },

      async init() {
        logger.debug(
          { src: 'test-utils:test-database', testId },
          `Initialized mock database for ${testId}`
        );
      },

      async runMigrations() {
        // No-op for mock
      },

      async isReady() {
        return true;
      },

      async close() {
        storage.agents.clear();
        storage.entities.clear();
        storage.memories.clear();
        storage.relationships.clear();
        storage.rooms.clear();
        storage.participants.clear();
        storage.cache.clear();
        storage.worlds.clear();
        storage.tasks.clear();
      },

      async getConnection() {
        return null;
      },

      async ensureEmbeddingDimension() {
        // No-op for mock
      },

      async getAgent(agentId: any) {
        return storage.agents.get(agentId) || null;
      },

      async getAgents() {
        return Array.from(storage.agents.values());
      },

      async createAgent(agent: any) {
        const id = agent.id || uuidv4();
        const fullAgent = { ...agent, id };
        storage.agents.set(id, fullAgent);
        return true;
      },

      async updateAgent(agentId: any, agent: any) {
        if (storage.agents.has(agentId)) {
          storage.agents.set(agentId, { ...agent, id: agentId });
          return true;
        }
        return false;
      },

      async deleteAgent(agentId: any) {
        return storage.agents.delete(agentId);
      },

      // Entity operations
      async createEntity(entity: any) {
        const id = entity.id || uuidv4();
        const fullEntity = { ...entity, id };
        storage.entities.set(id, fullEntity);
        return fullEntity;
      },

      async createEntities(entities: any[]) {
        for (const entity of entities) {
          const id = entity.id || uuidv4();
          const fullEntity = { ...entity, id };
          storage.entities.set(id, fullEntity);
        }
        return true;
      },

      async getEntityById(id: any) {
        return storage.entities.get(id) || null;
      },

      async updateEntity(entity: any) {
        if (!entity.id || !storage.entities.has(entity.id)) {
          throw new Error('Entity not found');
        }
        storage.entities.set(entity.id, entity);
      },

      async getEntitiesForRoom(roomId: any) {
        const participants = Array.from(storage.participants.values()).filter(
          (p: any) => p.roomId === roomId
        );

        const entities = [];
        for (const participant of participants) {
          const entity = storage.entities.get(participant.entityId);
          if (entity) {
            entities.push(entity);
          }
        }
        return entities;
      },

      // Memory operations
      async createMemory(memory: any, tableName = 'messages', _unique = false) {
        const id = memory.id || uuidv4();
        const fullMemory = {
          ...memory,
          id,
          createdAt: memory.createdAt || Date.now(),
        };

        if (!storage.memories.has(tableName)) {
          storage.memories.set(tableName, new Map());
        }

        storage.memories.get(tableName).set(id, fullMemory);
        return id as `${string}-${string}-${string}-${string}-${string}`;
      },

      async getMemories(params: any) {
        const tableName = params.tableName || 'messages';
        const tableData = storage.memories.get(tableName);

        if (!tableData) {
          return [];
        }

        let memories = Array.from(tableData.values()) as Memory[];

        // Apply filters
        if (params.roomId) {
          memories = memories.filter((m) => m.roomId === params.roomId);
        }

        if (params.entityId) {
          memories = memories.filter((m: any) => m.entityId === params.entityId);
        }

        // Sort by creation time (newest first)
        memories.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

        // Apply limit
        if (params.count) {
          memories = memories.slice(0, params.count);
        }
```