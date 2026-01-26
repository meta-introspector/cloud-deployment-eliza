# a69475c0:packages_core_src_runtime.ts:2551-2700

**Commit:** a69475c084e9a6fb6fc85f19ea6742546b8e0476
**Author:** standujar
**Date:** Wed Dec 17 15:16:36 2025 +0100
**File:** packages/core/src/runtime.ts:2551-2700
**Novelty Score:** 29.11
**Concepts:** event-driven, testing

```
    entityId: UUID,
    type: string,
    worldId?: UUID,
    sourceEntityId?: UUID
  ): Promise<Component | null> {
    return await this.adapter.getComponent(entityId, type, worldId, sourceEntityId);
  }
  async getComponents(entityId: UUID, worldId?: UUID, sourceEntityId?: UUID): Promise<Component[]> {
    return await this.adapter.getComponents(entityId, worldId, sourceEntityId);
  }
  async createComponent(component: Component): Promise<boolean> {
    return await this.adapter.createComponent(component);
  }
  async updateComponent(component: Component): Promise<void> {
    await this.adapter.updateComponent(component);
  }
  async deleteComponent(componentId: UUID): Promise<void> {
    await this.adapter.deleteComponent(componentId);
  }
  async addEmbeddingToMemory(memory: Memory): Promise<Memory> {
    if (memory.embedding) {
      return memory;
    }
    const memoryText = memory.content.text;
    if (!memoryText) {
      throw new Error('Cannot generate embedding: Memory content is empty');
    }
    try {
      memory.embedding = await this.useModel(ModelType.TEXT_EMBEDDING, {
        text: memoryText,
      });
    } catch (error: unknown) {
      this.logger.error(
        {
          src: 'agent',
          agentId: this.agentId,
          error: error instanceof Error ? error.message : String(error),
        },
        'Embedding generation failed'
      );
      memory.embedding = await this.useModel(ModelType.TEXT_EMBEDDING, { text: '' });
    }
    return memory;
  }

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
```