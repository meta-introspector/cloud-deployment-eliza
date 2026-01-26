# 5e8c73c1:packages_test-utils_src_testDatabase.ts:751-900

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/test-utils/src/testDatabase.ts:751-900
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
        // Simple implementation - always return null (no special state)
        return null;
      },

      async setParticipantUserState(_roomId: any, _entityId: any, _state: any) {
        // No-op for mock
      },

      async getRelationship(params: any) {
        const relationships = Array.from(storage.relationships.values());
        return (
          relationships.find(
            (r: any) =>
              r.sourceEntityId === params.sourceEntityId &&
              r.targetEntityId === params.targetEntityId
          ) || null
        );
      },

      async updateRelationship(relationship: any) {
        if (!relationship.id || !storage.relationships.has(relationship.id)) {
          throw new Error('Relationship not found');
        }
        storage.relationships.set(relationship.id, relationship);
      },

      async getTask(id: any) {
        return storage.tasks.get(id) || null;
      },

      async getTasksByName(name: any) {
        return Array.from(storage.tasks.values()).filter((task: any) => task.name === name);
      },

      async updateTask(id: any, updates: any) {
        const task = storage.tasks.get(id);
        if (!task) {
          throw new Error('Task not found');
        }
        const updated = { ...task, ...updates, updatedAt: Date.now() };
        storage.tasks.set(id, updated);
      },

      async deleteLog(logId: any) {
        if (storage.logs) {
          storage.logs.delete(logId);
        }
      },

      async getMemoriesByWorldId(params: any) {
        const tableName = params.tableName || 'messages';
        const tableData = storage.memories.get(tableName);
        if (!tableData) {
          return [];
        }

        let memories = Array.from(tableData.values()).filter(
          (m: any) => m.worldId === params.worldId
        );

        if (params.count) {
          memories = memories.slice(0, params.count);
        }

        return memories;
      },

      async deleteManyMemories(memoryIds: any[]) {
        for (const [_tableName, tableData] of storage.memories) {
          for (const id of memoryIds) {
            tableData.delete(id);
          }
        }
      },

      async deleteAllMemories(roomId: any, _tableName: string) {
        const tableData = storage.memories.get(_tableName);
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

      async addParticipantsRoom(entityIds: any[], roomId: any) {
        for (const entityId of entityIds) {
          const participantId = `${entityId}-${roomId}`;
          storage.participants.set(participantId, { entityId, roomId });
        }
        return true;
      },

      async isRoomParticipant(roomId: UUID, entityId: UUID) {
        const participantId = `${entityId}-${roomId}`;
        return storage.participants.has(participantId);
      },
    };

    // Mock adapter implements IDatabaseAdapter interface
    return adapter as IDatabaseAdapter;
  }

  /**
   * Cleanup a specific test database
   */
  async cleanupDatabase(testId: string): Promise<void> {
    try {
      const adapter = this.testDatabases.get(testId);
      if (adapter) {
        await adapter.close();
        this.testDatabases.delete(testId);
        logger.debug(
          { src: 'test-utils:test-database', testId },
          `Cleaned up database for ${testId}`
        );
      }
    } catch (error) {
      logger.warn(
        {
          src: 'test-utils:test-database',
          testId,
          error: error instanceof Error ? error.message : String(error),
        },
        `Error cleaning up database ${testId}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Cleanup all test databases
   */
  async cleanup(): Promise<void> {
    logger.debug({ src: 'test-utils:test-database' }, 'Cleaning up all test databases');

    const cleanupPromises = Array.from(this.testDatabases.keys()).map((testId) =>
      this.cleanupDatabase(testId)
    );

    await Promise.all(cleanupPromises);

    // Clear tracking sets
```