# a7046c18:packages_plugin-sql_src_base.ts:1951-2100

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/base.ts:1951-2100
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
   * @param {number} [params.count] - The maximum number of memories to retrieve.
   * @param {UUID} [params.roomId] - Optional room ID to filter by.
   * @param {UUID} [params.worldId] - Optional world ID to filter by.
   * @param {UUID} [params.entityId] - Optional entity ID to filter by.
   * @param {boolean} [params.unique] - Whether to retrieve unique memories only.
   * @param {string} [params.tableName] - The name of the table to search for memories in.
   * @returns {Promise<Memory[]>} A Promise that resolves to an array of memories.
   */
  async searchMemoriesByEmbedding(
    embedding: number[],
    params: {
      match_threshold?: number;
      count?: number;
      roomId?: UUID;
      worldId?: UUID;
      entityId?: UUID;
      unique?: boolean;
      tableName: string;
    },
  ): Promise<Memory[]> {
    return this.withDatabase(async () => {
      const cleanVector = embedding.map((n) =>
        Number.isFinite(n) ? Number(n.toFixed(6)) : 0,
      );

      const similarity = sql<number>`1 - (${cosineDistance(
        embeddingTable[this.embeddingDimension],
        cleanVector,
      )})`;

      const conditions = [eq(memoryTable.type, params.tableName)];

      if (params.unique) {
        conditions.push(eq(memoryTable.unique, true));
      }

      conditions.push(eq(memoryTable.agentId, this.agentId));

      // Add filters based on direct params
      if (params.roomId) {
        conditions.push(eq(memoryTable.roomId, params.roomId));
      }
      if (params.worldId) {
        conditions.push(eq(memoryTable.worldId, params.worldId));
      }
      if (params.entityId) {
        conditions.push(eq(memoryTable.entityId, params.entityId));
      }

      if (params.match_threshold) {
        conditions.push(gte(similarity, params.match_threshold));
      }

      const results = await this.db
        .select({
          memory: memoryTable,
          similarity,
          embedding: embeddingTable[this.embeddingDimension],
        })
        .from(embeddingTable)
        .innerJoin(memoryTable, eq(memoryTable.id, embeddingTable.memoryId))
        .where(and(...conditions))
        .orderBy(desc(similarity))
        .limit(params.count ?? 10);

      return results.map((row) => ({
        id: row.memory.id as UUID,
        type: row.memory.type,
        createdAt: row.memory.createdAt.getTime(),
        content:
          typeof row.memory.content === "string"
            ? JSON.parse(row.memory.content)
            : row.memory.content,
        entityId: row.memory.entityId as UUID,
        agentId: row.memory.agentId as UUID,
        roomId: row.memory.roomId as UUID,
        worldId: row.memory.worldId as UUID | undefined, // Include worldId
        unique: row.memory.unique,
        metadata: row.memory.metadata as MemoryMetadata,
        embedding: row.embedding ?? undefined,
        similarity: row.similarity,
      }));
    });
  }

  /**
   * Asynchronously creates a new memory in the database.
   * @param {Memory & { metadata?: MemoryMetadata }} memory - The memory object to create.
   * @param {string} tableName - The name of the table to create the memory in.
   * @returns {Promise<UUID>} A Promise that resolves to the ID of the created memory.
   */
  async createMemory(
    memory: Memory & { metadata?: MemoryMetadata },
    tableName: string,
  ): Promise<UUID> {
    const memoryId = memory.id ?? (v4() as UUID);

    const existing = await this.getMemoryById(memoryId);
    if (existing) {
      return memoryId;
    }

    // only do costly check if we need to
    if (memory.unique === undefined) {
      memory.unique = true; // set default
      if (memory.embedding && Array.isArray(memory.embedding)) {
        const similarMemories = await this.searchMemoriesByEmbedding(
          memory.embedding,
          {
            tableName,
            // Use the scope fields from the memory object for similarity check
            roomId: memory.roomId,
            worldId: memory.worldId,
            entityId: memory.entityId,
            match_threshold: 0.95,
            count: 1,
          },
        );
        memory.unique = similarMemories.length === 0;
      }
    }

    // Ensure we always pass a JSON string to the SQL placeholder – if we pass an
    // object directly PG sees `[object Object]` and fails the `::jsonb` cast.
    const contentToInsert =
      typeof memory.content === "string"
        ? memory.content
        : JSON.stringify(memory.content ?? {});

    const metadataToInsert =
      typeof memory.metadata === "string"
        ? memory.metadata
        : JSON.stringify(memory.metadata ?? {});

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
```