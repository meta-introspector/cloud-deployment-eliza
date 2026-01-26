# 5e8c73c1:packages_plugin-sql_src_base.ts:1951-2100

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-sql/src/base.ts:1951-2100
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
    // object directly PG sees `[object Object]` and fails the `::jsonb` cast.
    const contentToInsert =
      typeof memory.content === 'string' ? memory.content : JSON.stringify(memory.content ?? {});

    const metadataToInsert =
      typeof memory.metadata === 'string' ? memory.metadata : JSON.stringify(memory.metadata ?? {});

    // Use withEntityContext to set Entity RLS context if needed
    // This delegates to the concrete adapter implementation (PostgreSQL or PGLite)
    await this.withEntityContext(memory.entityId, async (tx) => {
      await tx.insert(memoryTable).values([
        {
          id: memoryId,
          type: tableName,
          content: sql`${contentToInsert}::jsonb`,
          metadata: sql`${metadataToInsert}::jsonb`,
          entityId: memory.entityId,
          roomId: memory.roomId,
          worldId: memory.worldId, // Include worldId
          agentId: memory.agentId || this.agentId,
          unique: memory.unique,
          createdAt: memory.createdAt ? new Date(memory.createdAt) : new Date(),
        },
      ]);

      if (memory.embedding && Array.isArray(memory.embedding)) {
        const embeddingValues: Record<string, unknown> = {
          id: v4(),
          memoryId: memoryId,
          createdAt: memory.createdAt ? new Date(memory.createdAt) : new Date(),
        };

        const cleanVector = memory.embedding.map((n) =>
          Number.isFinite(n) ? Number(n.toFixed(6)) : 0
        );

        embeddingValues[this.embeddingDimension] = cleanVector;

        await tx.insert(embeddingTable).values([embeddingValues]);
      }
    });

    return memoryId;
  }

  /**
   * Updates an existing memory in the database.
   * @param memory The memory object with updated content and optional embedding
   * @returns Promise resolving to boolean indicating success
   */
  async updateMemory(
    memory: Partial<Memory> & { id: UUID; metadata?: MemoryMetadata }
  ): Promise<boolean> {
    return this.withDatabase(async () => {
      try {
        await this.db.transaction(async (tx) => {
          // Update memory content if provided
          if (memory.content) {
            const contentToUpdate =
              typeof memory.content === 'string'
                ? memory.content
                : JSON.stringify(memory.content ?? {});

            const metadataToUpdate =
              typeof memory.metadata === 'string'
                ? memory.metadata
                : JSON.stringify(memory.metadata ?? {});

            await tx
              .update(memoryTable)
              .set({
                content: sql`${contentToUpdate}::jsonb`,
                ...(memory.metadata && { metadata: sql`${metadataToUpdate}::jsonb` }),
              })
              .where(eq(memoryTable.id, memory.id));
          } else if (memory.metadata) {
            // Update only metadata if content is not provided
            const metadataToUpdate =
              typeof memory.metadata === 'string'
                ? memory.metadata
                : JSON.stringify(memory.metadata ?? {});

            await tx
              .update(memoryTable)
              .set({
                metadata: sql`${metadataToUpdate}::jsonb`,
              })
              .where(eq(memoryTable.id, memory.id));
          }

          // Update embedding if provided
          if (memory.embedding && Array.isArray(memory.embedding)) {
            const cleanVector = memory.embedding.map((n) =>
              Number.isFinite(n) ? Number(n.toFixed(6)) : 0
            );

            // Check if embedding exists
            const existingEmbedding = await tx
              .select({ id: embeddingTable.id })
              .from(embeddingTable)
              .where(eq(embeddingTable.memoryId, memory.id))
              .limit(1);

            if (existingEmbedding.length > 0) {
              // Update existing embedding
              const updateValues: Record<string, unknown> = {};
              updateValues[this.embeddingDimension] = cleanVector;

              await tx
                .update(embeddingTable)
                .set(updateValues)
                .where(eq(embeddingTable.memoryId, memory.id));
            } else {
              // Create new embedding
              const embeddingValues: Record<string, unknown> = {
                id: v4(),
                memoryId: memory.id,
              };
              embeddingValues[this.embeddingDimension] = cleanVector;

              await tx.insert(embeddingTable).values([embeddingValues]);
            }
          }
        });

        return true;
      } catch (error) {
        logger.error(
          {
            src: 'plugin:sql',
            memoryId: memory.id,
            error: error instanceof Error ? error.message : String(error),
          },
          'Failed to update memory'
        );
        return false;
      }
    });
  }

  /**
   * Asynchronously deletes a memory from the database based on the provided parameters.
   * @param {UUID} memoryId - The ID of the memory to delete.
   * @returns {Promise<void>} A Promise that resolves when the memory is deleted.
   */
  async deleteMemory(memoryId: UUID): Promise<void> {
    return this.withDatabase(async () => {
      await this.db.transaction(async (tx) => {
        // See if there are any fragments that we need to delete
        await this.deleteMemoryFragments(tx, memoryId);
```