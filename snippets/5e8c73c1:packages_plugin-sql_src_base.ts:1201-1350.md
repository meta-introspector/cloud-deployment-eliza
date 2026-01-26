# 5e8c73c1:packages_plugin-sql_src_base.ts:1201-1350

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-sql/src/base.ts:1201-1350
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
        .from(memoryTable)
        .where(and(...conditions))
        .orderBy(desc(memoryTable.createdAt));

      const rows = params.limit ? await query.limit(params.limit) : await query;

      return rows.map((row) => ({
        id: row.id as UUID,
        createdAt: row.createdAt.getTime(),
        content: typeof row.content === 'string' ? JSON.parse(row.content) : row.content,
        entityId: row.entityId as UUID,
        agentId: row.agentId as UUID,
        roomId: row.roomId as UUID,
        unique: row.unique,
        metadata: row.metadata,
      })) as Memory[];
    });
  }

  /**
   * Asynchronously retrieves a memory by its unique identifier.
   * @param {UUID} id - The unique identifier of the memory to retrieve.
   * @returns {Promise<Memory | null>} A Promise that resolves to the memory if found, null otherwise.
   */
  async getMemoryById(id: UUID): Promise<Memory | null> {
    return this.withDatabase(async () => {
      const result = await this.db
        .select({
          memory: memoryTable,
          embedding: embeddingTable[this.embeddingDimension],
        })
        .from(memoryTable)
        .leftJoin(embeddingTable, eq(memoryTable.id, embeddingTable.memoryId))
        .where(eq(memoryTable.id, id))
        .limit(1);

      if (result.length === 0) return null;

      const row = result[0];
      return {
        id: row.memory.id as UUID,
        createdAt: row.memory.createdAt.getTime(),
        content:
          typeof row.memory.content === 'string'
            ? JSON.parse(row.memory.content)
            : row.memory.content,
        entityId: row.memory.entityId as UUID,
        agentId: row.memory.agentId as UUID,
        roomId: row.memory.roomId as UUID,
        unique: row.memory.unique,
        metadata: row.memory.metadata as MemoryMetadata,
        embedding: row.embedding ?? undefined,
      };
    });
  }

  /**
   * Asynchronously retrieves memories from the database based on the provided parameters.
   * @param {Object} params - The parameters for retrieving memories.
   * @param {UUID[]} params.memoryIds - The IDs of the memories to retrieve.
   * @param {string} [params.tableName] - The name of the table to retrieve memories from.
   * @returns {Promise<Memory[]>} A Promise that resolves to an array of memories.
   */
  async getMemoriesByIds(memoryIds: UUID[], tableName?: string): Promise<Memory[]> {
    return this.withDatabase(async () => {
      if (memoryIds.length === 0) return [];

      const conditions = [inArray(memoryTable.id, memoryIds)];

      if (tableName) {
        conditions.push(eq(memoryTable.type, tableName));
      }

      const rows = await this.db
        .select({
          memory: memoryTable,
          embedding: embeddingTable[this.embeddingDimension],
        })
        .from(memoryTable)
        .leftJoin(embeddingTable, eq(embeddingTable.memoryId, memoryTable.id))
        .where(and(...conditions))
        .orderBy(desc(memoryTable.createdAt));

      return rows.map((row) => ({
        id: row.memory.id as UUID,
        createdAt: row.memory.createdAt.getTime(),
        content:
          typeof row.memory.content === 'string'
            ? JSON.parse(row.memory.content)
            : row.memory.content,
        entityId: row.memory.entityId as UUID,
        agentId: row.memory.agentId as UUID,
        roomId: row.memory.roomId as UUID,
        unique: row.memory.unique,
        metadata: row.memory.metadata as MemoryMetadata,
        embedding: row.embedding ?? undefined,
      }));
    });
  }

  /**
   * Asynchronously retrieves cached embeddings from the database based on the provided parameters.
   * @param {Object} opts - The parameters for retrieving cached embeddings.
   * @param {string} opts.query_table_name - The name of the table to retrieve embeddings from.
   * @param {number} opts.query_threshold - The threshold for the levenshtein distance.
   * @param {string} opts.query_input - The input string to search for.
   * @param {string} opts.query_field_name - The name of the field to retrieve embeddings from.
   * @param {string} opts.query_field_sub_name - The name of the sub-field to retrieve embeddings from.
   * @param {number} opts.query_match_count - The maximum number of matches to retrieve.
   * @returns {Promise<{ embedding: number[]; levenshtein_score: number }[]>} A Promise that resolves to an array of cached embeddings.
   */
  async getCachedEmbeddings(opts: {
    query_table_name: string;
    query_threshold: number;
    query_input: string;
    query_field_name: string;
    query_field_sub_name: string;
    query_match_count: number;
  }): Promise<{ embedding: number[]; levenshtein_score: number }[]> {
    return this.withDatabase(async () => {
      try {
        // Drizzle database has execute method for raw SQL
        interface DrizzleDatabaseWithExecute {
          execute: (query: ReturnType<typeof sql>) => Promise<{ rows: Record<string, unknown>[] }>;
        }
        const results = await (this.db as DrizzleDatabaseWithExecute).execute(sql`
                    WITH content_text AS (
                        SELECT
                            m.id,
                            COALESCE(
                                m.content->>${opts.query_field_sub_name},
                                ''
                            ) as content_text
                        FROM memories m
                        WHERE m.type = ${opts.query_table_name}
                            AND m.content->>${opts.query_field_sub_name} IS NOT NULL
                    ),
                    embedded_text AS (
                        SELECT
                            ct.content_text,
                            COALESCE(
                                e.dim_384,
                                e.dim_512,
                                e.dim_768,
                                e.dim_1024,
                                e.dim_1536,
                                e.dim_3072
                            ) as embedding
                        FROM content_text ct
                        LEFT JOIN embeddings e ON e.memory_id = ct.id
```