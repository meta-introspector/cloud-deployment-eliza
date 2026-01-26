# 5e8c73c1:packages_plugin-sql_src_base.ts:2101-2250

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-sql/src/base.ts:2101-2250
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```

        // Then delete the embedding for the main memory
        await tx.delete(embeddingTable).where(eq(embeddingTable.memoryId, memoryId));

        // Finally delete the memory itself
        await tx.delete(memoryTable).where(eq(memoryTable.id, memoryId));
      });
    });
  }

  /**
   * Asynchronously deletes multiple memories from the database in a single batch operation.
   * @param {UUID[]} memoryIds - An array of UUIDs of the memories to delete.
   * @returns {Promise<void>} A Promise that resolves when all memories are deleted.
   */
  async deleteManyMemories(memoryIds: UUID[]): Promise<void> {
    if (memoryIds.length === 0) {
      return;
    }

    return this.withDatabase(async () => {
      await this.db.transaction(async (tx) => {
        // Process in smaller batches to avoid query size limits
        const BATCH_SIZE = 100;
        for (let i = 0; i < memoryIds.length; i += BATCH_SIZE) {
          const batch = memoryIds.slice(i, i + BATCH_SIZE);

          // Delete any fragments for document memories in this batch
          await Promise.all(
            batch.map(async (memoryId) => {
              await this.deleteMemoryFragments(tx, memoryId);
            })
          );

          // Delete embeddings for the batch
          await tx.delete(embeddingTable).where(inArray(embeddingTable.memoryId, batch));

          // Delete the memories themselves
          await tx.delete(memoryTable).where(inArray(memoryTable.id, batch));
        }
      });
    });
  }

  /**
   * Deletes all memory fragments that reference a specific document memory
   * @param tx The database transaction
   * @param documentId The UUID of the document memory whose fragments should be deleted
   * @private
   */
  private async deleteMemoryFragments(tx: DrizzleDatabase, documentId: UUID): Promise<void> {
    const fragmentsToDelete = await this.getMemoryFragments(tx, documentId);

    if (fragmentsToDelete.length > 0) {
      const fragmentIds = fragmentsToDelete.map((f) => f.id) as UUID[];

      // Delete embeddings for fragments
      await tx.delete(embeddingTable).where(inArray(embeddingTable.memoryId, fragmentIds));

      // Delete the fragments
      await tx.delete(memoryTable).where(inArray(memoryTable.id, fragmentIds));
    }
  }

  /**
   * Retrieves all memory fragments that reference a specific document memory
   * @param tx The database transaction
   * @param documentId The UUID of the document memory whose fragments should be retrieved
   * @returns An array of memory fragments
   * @private
   */
  private async getMemoryFragments(tx: DrizzleDatabase, documentId: UUID): Promise<{ id: UUID }[]> {
    const fragments = await tx
      .select({ id: memoryTable.id })
      .from(memoryTable)
      .where(
        and(
          eq(memoryTable.agentId, this.agentId),
          sql`${memoryTable.metadata}->>'documentId' = ${documentId}`
        )
      );

    return fragments.map((f) => ({ id: f.id as UUID }));
  }

  /**
   * Asynchronously deletes all memories from the database based on the provided parameters.
   * @param {UUID} roomId - The ID of the room to delete memories from.
   * @param {string} tableName - The name of the table to delete memories from.
   * @returns {Promise<void>} A Promise that resolves when the memories are deleted.
   */
  async deleteAllMemories(roomId: UUID, tableName: string): Promise<void> {
    return this.withDatabase(async () => {
      await this.db.transaction(async (tx) => {
        // 1) fetch all memory IDs for this room + table
        const rows = await tx
          .select({ id: memoryTable.id })
          .from(memoryTable)
          .where(and(eq(memoryTable.roomId, roomId), eq(memoryTable.type, tableName)));

        const ids = rows.map((r) => r.id);
        logger.debug(
          { src: 'plugin:sql', roomId, tableName, memoryCount: ids.length },
          'Deleting all memories'
        );

        if (ids.length === 0) {
          return;
        }

        // 2) delete any fragments for "document" memories & their embeddings
        await Promise.all(
          ids.map(async (memoryId) => {
            await this.deleteMemoryFragments(tx, memoryId);
            await tx.delete(embeddingTable).where(eq(embeddingTable.memoryId, memoryId));
          })
        );

        // 3) delete the memories themselves
        await tx
          .delete(memoryTable)
          .where(and(eq(memoryTable.roomId, roomId), eq(memoryTable.type, tableName)));
      });
    });
  }

  /**
   * Asynchronously counts the number of memories in the database based on the provided parameters.
   * @param {UUID} roomId - The ID of the room to count memories in.
   * @param {boolean} [unique] - Whether to count unique memories only.
   * @param {string} [tableName] - The name of the table to count memories in.
   * @returns {Promise<number>} A Promise that resolves to the number of memories.
   */
  async countMemories(roomId: UUID, unique = true, tableName = ''): Promise<number> {
    if (!tableName) throw new Error('tableName is required');

    return this.withDatabase(async () => {
      const conditions = [eq(memoryTable.roomId, roomId), eq(memoryTable.type, tableName)];

      if (unique) {
        conditions.push(eq(memoryTable.unique, true));
      }

      const result = await this.db
        .select({ count: sql<number>`count(*)` })
        .from(memoryTable)
        .where(and(...conditions));

      return Number(result[0]?.count ?? 0);
    });
```