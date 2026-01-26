# 5e8c73c1:packages_test-utils_src_testDatabase.ts:451-600

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/test-utils/src/testDatabase.ts:451-600
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
        return true;
      },

      async getCache(key: any) {
        const cached = storage.cache.get(key);
        return cached ? cached.value : null;
      },

      async deleteCache(key: any) {
        return storage.cache.delete(key);
      },

      // World operations
      async createWorld(world: any) {
        const id = world.id || uuidv4();
        const fullWorld = { ...world, id };
        storage.worlds.set(id, fullWorld);
        return id as `${string}-${string}-${string}-${string}-${string}`;
      },

      async getWorld(worldId: any) {
        return storage.worlds.get(worldId) || null;
      },

      async getAllWorlds() {
        return Array.from(storage.worlds.values());
      },

      // Task operations
      async createTask(task: any) {
        const id = task.id || uuidv4();
        const fullTask = {
          ...task,
          id,
          updatedAt: task.updatedAt || Date.now(),
        };
        storage.tasks.set(id, fullTask);
        return id as `${string}-${string}-${string}-${string}-${string}`;
      },

      async getTasks(params: any) {
        let tasks = Array.from(storage.tasks.values());

        if (params.roomId) {
          tasks = tasks.filter((task) => task.roomId === params.roomId);
        }

        if (params.tags) {
          tasks = tasks.filter((task: any) =>
            params.tags.some((tag: any) => task.tags.includes(tag))
          );
        }

        return tasks;
      },

      async deleteTask(taskId: any) {
        storage.tasks.delete(taskId);
      },

      // Relationship operations
      async createRelationship(relationship: any) {
        const id = uuidv4();
        const fullRelationship = { ...relationship, id };
        storage.relationships.set(id, fullRelationship);
        return true;
      },

      async getRelationships(params: any) {
        let relationships = Array.from(storage.relationships.values());

        if (params.entityId) {
          relationships = relationships.filter(
            (rel) =>
              rel.sourceEntityId === params.entityId || rel.targetEntityId === params.entityId
          );
        }

        return relationships;
      },

      async getEntitiesByIds(ids: any) {
        const entities = [];
        for (const id of ids) {
          const entity = storage.entities.get(id);
          if (entity) {
            entities.push(entity);
          }
        }
        return entities;
      },

      async updateMemory(memory: any) {
        const tableName = 'messages'; // Default table
        const tableData = storage.memories.get(tableName);
        if (tableData && tableData.has(memory.id)) {
          const existing = tableData.get(memory.id);
          const updated = { ...existing, ...memory };
          tableData.set(memory.id, updated);
          return updated;
        }
        return null;
      },

      async countMemories(roomId: UUID, unique?: boolean, tableName = 'messages') {
        const tableData = storage.memories.get(tableName);
        if (!tableData) {
          return 0;
        }

        if (!roomId) {
          return tableData.size;
        }

        let memories = Array.from(tableData.values()).filter((m: any) => m.roomId === roomId);
        if (unique) {
          memories = memories.filter((m: any) => m.unique === true);
        }
        return memories.length;
      },

      async getMemoriesByEntityIds(entityIds: any, tableName = 'messages') {
        const tableData = storage.memories.get(tableName);
        if (!tableData) {
          return [];
        }

        return Array.from(tableData.values()).filter((m: any) => entityIds.includes(m.entityId));
      },

      async removeAllMemories(roomId: any, tableName = 'messages') {
        const tableData = storage.memories.get(tableName);
        if (!tableData) {
          return;
        }

        const toDelete = [];
        for (const [id, memory] of tableData) {
          if (memory.roomId === roomId) {
            toDelete.push(id);
          }
        }

        for (const id of toDelete) {
          tableData.delete(id);
        }
      },

      async updateRoom(room: any) {
        if (!room.id || !storage.rooms.has(room.id)) {
```