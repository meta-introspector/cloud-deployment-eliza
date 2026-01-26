# 5e8c73c1:packages_test-utils_src_testDatabase.ts:301-450

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/test-utils/src/testDatabase.ts:301-450
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```

        return memories;
      },

      async searchMemories(params: any) {
        // Simple text search for testing
        const tableName = params.tableName || 'messages';
        const tableData = storage.memories.get(tableName);

        if (!tableData) {
          return [];
        }

        let memories = Array.from(tableData.values()) as Memory[];

        if (params.roomId) {
          memories = memories.filter((m) => m.roomId === params.roomId);
        }

        // Simple text matching instead of vector search
        if (params.query) {
          memories = memories.filter((m) =>
            typeof m.content === 'object' &&
            m.content !== null &&
            'text' in m.content &&
            typeof m.content.text === 'string'
              ? m.content.text.toLowerCase().includes(params.query.toLowerCase())
              : false
          );
        }

        return memories.slice(0, params.count || 10);
      },

      async getMemoryById(id: any) {
        for (const [_tableName, tableData] of storage.memories) {
          const memory = tableData.get(id);
          if (memory) {
            return memory;
          }
        }
        return null;
      },

      async getMemoriesByIds(ids: any, tableName = 'messages') {
        const tableData = storage.memories.get(tableName);
        if (!tableData) {
          return [];
        }

        const memories = [];
        for (const id of ids) {
          const memory = tableData.get(id);
          if (memory) {
            memories.push(memory);
          }
        }
        return memories;
      },

      async getMemoriesByRoomIds(params: any): Promise<any[]> {
        const tableData = storage.memories.get(params.tableName);
        if (!tableData) {
          return [];
        }

        let memories = Array.from(tableData.values()).filter((m: any) =>
          params.roomIds.includes(m.roomId)
        );

        if (params.limit) {
          memories = memories.slice(0, params.limit);
        }

        return memories;
      },

      async getCachedEmbeddings() {
        return []; // Not implemented for basic mock
      },

      async log(params: any) {
        // Simple log storage
        if (!storage.logs) {
          storage.logs = new Map();
        }
        const logId = uuidv4();
        storage.logs.set(logId, {
          id: logId,
          ...params,
          createdAt: new Date(),
        });
      },

      async getLogs() {
        if (!storage.logs) {
          return [];
        }
        return Array.from(storage.logs.values());
      },

      async deleteMemory(memoryId: any, tableName = 'messages') {
        const tableData = storage.memories.get(tableName);
        if (tableData) {
          return tableData.delete(memoryId);
        }
        return false;
      },

      // Room operations
      async createRoom(room: any) {
        const id = room.id || uuidv4();
        const fullRoom = { ...room, id };
        storage.rooms.set(id, fullRoom);
      },

      async getRoom(roomId: any) {
        return storage.rooms.get(roomId) || null;
      },

      async getRooms(worldId: any) {
        return Array.from(storage.rooms.values()).filter(
          (room) => !worldId || room.worldId === worldId
        );
      },

      // Participant operations
      async addParticipant(entityId: any, roomId: any) {
        const participantId = `${entityId}-${roomId}`;
        storage.participants.set(participantId, { entityId, roomId });
        return true;
      },

      async removeParticipant(entityId: any, roomId: any) {
        const participantId = `${entityId}-${roomId}`;
        return storage.participants.delete(participantId);
      },

      async getParticipantsForRoom(roomId: any) {
        return Array.from(storage.participants.values())
          .filter((p: any) => p.roomId === roomId)
          .map((p: any) => p.entityId);
      },

      // Cache operations
      async setCache(key: any, value: any) {
        storage.cache.set(key, {
          value,
          createdAt: Date.now(),
        });
```