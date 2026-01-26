# a7046c18:packages_plugin-sql_src_base.ts:2101-2250

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/base.ts:2101-2250
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      ]);

      if (memory.embedding && Array.isArray(memory.embedding)) {
        const embeddingValues: Record<string, unknown> = {
          id: v4(),
          memoryId: memoryId,
          createdAt: memory.createdAt ? new Date(memory.createdAt) : new Date(),
        };

        const cleanVector = memory.embedding.map((n) =>
          Number.isFinite(n) ? Number(n.toFixed(6)) : 0,
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
    memory: Partial<Memory> & { id: UUID; metadata?: MemoryMetadata },
  ): Promise<boolean> {
    return this.withDatabase(async () => {
      try {
        await this.db.transaction(async (tx) => {
          // Update memory content if provided
          if (memory.content) {
            const contentToUpdate =
              typeof memory.content === "string"
                ? memory.content
                : JSON.stringify(memory.content ?? {});

            const metadataToUpdate =
              typeof memory.metadata === "string"
                ? memory.metadata
                : JSON.stringify(memory.metadata ?? {});

            await tx
              .update(memoryTable)
              .set({
                content: sql`${contentToUpdate}::jsonb`,
                ...(memory.metadata && {
                  metadata: sql`${metadataToUpdate}::jsonb`,
                }),
              })
              .where(eq(memoryTable.id, memory.id));
          } else if (memory.metadata) {
            // Update only metadata if content is not provided
            const metadataToUpdate =
              typeof memory.metadata === "string"
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
              Number.isFinite(n) ? Number(n.toFixed(6)) : 0,
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
            src: "plugin:sql",
            memoryId: memory.id,
            error: error instanceof Error ? error.message : String(error),
          },
          "Failed to update memory",
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

        // Then delete the embedding for the main memory
        await tx
          .delete(embeddingTable)
          .where(eq(embeddingTable.memoryId, memoryId));

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
```