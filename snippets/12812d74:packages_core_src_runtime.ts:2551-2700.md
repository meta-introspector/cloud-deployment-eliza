# 12812d74:packages_core_src_runtime.ts:2551-2700

**Commit:** 12812d7441573a7a81c2c5d2ea28a46bd10f3d0c
**Author:** standujar
**Date:** Tue Dec 16 01:47:14 2025 +0100
**File:** packages/core/src/runtime.ts:2551-2700
**Novelty Score:** 30.22
**Concepts:** event-driven, plugin-system, testing

```

  async queueEmbeddingGeneration(
    memory: Memory,
    priority?: 'high' | 'normal' | 'low'
  ): Promise<void> {
    // Set default priority if not provided
    priority = priority || 'normal';

    // Skip if memory is null or undefined
    if (!memory) {
      return;
    }

    // Skip if memory already has embeddings
    if (memory.embedding) {
      return;
    }

    // Skip if no text content
    if (!memory.content?.text) {
      return;
    }

    // Emit event for async embedding generation
    await this.emitEvent(EventType.EMBEDDING_GENERATION_REQUESTED, {
      runtime: this,
      memory,
      priority,
      source: 'runtime',
      retryCount: 0,
      maxRetries: 3,
      runId: this.getCurrentRunId(),
    });
  }
  async getMemories(params: {
    entityId?: UUID;
    agentId?: UUID;
    roomId?: UUID;
    count?: number;
    unique?: boolean;
    tableName: string;
    start?: number;
    end?: number;
  }): Promise<Memory[]> {
    return await this.adapter.getMemories(params);
  }
  async getAllMemories(): Promise<Memory[]> {
    const tables = ['memories', 'messages', 'facts', 'documents'];
    const allMemories: Memory[] = [];

    for (const tableName of tables) {
      try {
        const memories = await this.adapter.getMemories({
          agentId: this.agentId,
          tableName,
          count: 10000, // Get a large number to fetch all
        });
        allMemories.push(...memories);
      } catch (error: unknown) {
        // Continue with other tables if one fails
        this.logger.debug(
          {
            src: 'agent',
            agentId: this.agentId,
            tableName,
            error: error instanceof Error ? error.message : String(error),
          },
          'Failed to get memories'
        );
      }
    }

    return allMemories;
  }
  async getMemoryById(id: UUID): Promise<Memory | null> {
    return await this.adapter.getMemoryById(id);
  }
  async getMemoriesByIds(ids: UUID[], tableName?: string): Promise<Memory[]> {
    return await this.adapter.getMemoriesByIds(ids, tableName);
  }
  async getMemoriesByRoomIds(params: {
    tableName: string;
    roomIds: UUID[];
    limit?: number;
  }): Promise<Memory[]> {
    return await this.adapter.getMemoriesByRoomIds(params);
  }

  async getCachedEmbeddings(params: {
    query_table_name: string;
    query_threshold: number;
    query_input: string;
    query_field_name: string;
    query_field_sub_name: string;
    query_match_count: number;
  }): Promise<{ embedding: number[]; levenshtein_score: number }[]> {
    return await this.adapter.getCachedEmbeddings(params);
  }
  async log(params: {
    body: { [key: string]: unknown };
    entityId: UUID;
    roomId: UUID;
    type: string;
  }): Promise<void> {
    await this.adapter.log(params);
  }
  async searchMemories(params: {
    embedding: number[];
    query?: string;
    match_threshold?: number;
    count?: number;
    roomId?: UUID;
    unique?: boolean;
    worldId?: UUID;
    entityId?: UUID;
    tableName: string;
  }): Promise<Memory[]> {
    const memories = await this.adapter.searchMemories(params);
    if (params.query) {
      const rerankedMemories = await this.rerankMemories(params.query, memories);
      return rerankedMemories;
    }
    return memories;
  }
  async rerankMemories(query: string, memories: Memory[]): Promise<Memory[]> {
    const docs = memories.map((memory) => ({
      title: memory.id,
      content: memory.content.text,
    }));
    const bm25 = new BM25(docs);
    const results = bm25.search(query, memories.length);
    return results.map((result) => memories[result.index]);
  }
  async createMemory(memory: Memory, tableName: string, unique?: boolean): Promise<UUID> {
    if (unique !== undefined) memory.unique = unique;
    return await this.adapter.createMemory(memory, tableName, unique);
  }
  async updateMemory(
    memory: Partial<Memory> & { id: UUID; metadata?: MemoryMetadata }
  ): Promise<boolean> {
    return await this.adapter.updateMemory(memory);
  }
  async deleteMemory(memoryId: UUID): Promise<void> {
    await this.adapter.deleteMemory(memoryId);
  }
  async deleteManyMemories(memoryIds: UUID[]): Promise<void> {
    await this.adapter.deleteManyMemories(memoryIds);
  }
  async clearAllAgentMemories(): Promise<void> {
    this.logger.info({ src: 'agent', agentId: this.agentId }, 'Clearing all memories');
```