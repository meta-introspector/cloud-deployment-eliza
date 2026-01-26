# 5e8c73c1:packages_plugin-sql_src_base.ts:151-300

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-sql/src/base.ts:151-300
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
  }

  /**
   * Get the underlying database instance for testing purposes
   */
  public getDatabase(): unknown {
    return this.db;
  }

  protected agentId: UUID;

  /**
   * Constructor for creating a new instance of Agent with the specified agentId.
   *
   * @param {UUID} agentId - The unique identifier for the agent.
   */
  constructor(agentId: UUID) {
    super();
    this.agentId = agentId;
  }

  /**
   * Normalizes entity names to ensure they are always a proper array of strings.
   * Handles strings, Sets, Maps, iterables, and non-iterable values.
   * All array elements are converted to strings to prevent database errors.
   * @param {any} names - The names value to normalize
   * @returns {string[]} A proper array of string names
   * @private
   */
  private normalizeEntityNames(names: unknown): string[] {
    // Handle null/undefined
    if (names == null) {
      return [];
    }

    // Handle string - wrap in array
    if (typeof names === 'string') {
      return [names];
    }

    // Handle arrays - ensure all elements are strings
    if (Array.isArray(names)) {
      return names.map(String);
    }

    // Handle Sets - convert to array and ensure all elements are strings
    if (names instanceof Set) {
      return Array.from(names).map(String);
    }

    // Handle other iterables (including Maps) - convert to array and ensure all elements are strings
    // Maps yield [key, value] tuples, so we need to convert those to strings too
    if (typeof names === 'object' && typeof names[Symbol.iterator] === 'function') {
      return Array.from(names as Iterable<unknown>).map(String);
    }

    // Handle non-iterable primitives (numbers, booleans, objects)
    return [String(names)];
  }

  /**
   * Executes the given operation with retry logic.
   * @template T
   * @param {() => Promise<T>} operation - The operation to be executed.
   * @returns {Promise<T>} A promise that resolves with the result of the operation.
   */
  protected async withRetry<T>(operation: () => Promise<T>): Promise<T> {
    let lastError: Error = new Error('Unknown error');

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;

        if (attempt < this.maxRetries) {
          const backoffDelay = Math.min(this.baseDelay * 2 ** (attempt - 1), this.maxDelay);

          const jitter = Math.random() * this.jitterMax;
          const delay = backoffDelay + jitter;

          logger.warn(
            {
              src: 'plugin:sql',
              attempt,
              maxRetries: this.maxRetries,
              error: error instanceof Error ? error.message : String(error),
            },
            'Database operation failed, retrying'
          );

          await new Promise((resolve) => setTimeout(resolve, delay));
        } else {
          logger.error(
            {
              src: 'plugin:sql',
              totalAttempts: attempt,
              error: error instanceof Error ? error.message : String(error),
            },
            'Max retry attempts reached'
          );
          throw error instanceof Error ? error : new Error(String(error));
        }
      }
    }

    throw lastError;
  }

  /**
   * Asynchronously ensures that the given embedding dimension is valid for the agent.
   *
   * @param {number} dimension - The dimension to ensure for the embedding.
   * @returns {Promise<void>} - Resolves once the embedding dimension is ensured.
   */
  async ensureEmbeddingDimension(dimension: number) {
    return this.withDatabase(async () => {
      const existingMemory = await this.db
        .select()
        .from(memoryTable)
        .innerJoin(embeddingTable, eq(embeddingTable.memoryId, memoryTable.id))
        .where(eq(memoryTable.agentId, this.agentId))
        .limit(1);

      if (existingMemory.length > 0) {
        // The join result includes both memoryTable and embeddingTable columns
        // Access embedding columns directly from the joined result
        interface JoinedMemoryResult {
          memories: typeof memoryTable.$inferSelect;
          embeddings: typeof embeddingTable.$inferSelect;
        }
        const joinedResult = existingMemory[0] as JoinedMemoryResult;
        Object.entries(DIMENSION_MAP).find(([_, colName]) => {
          const embeddingCol = colName as keyof typeof embeddingTable.$inferSelect;
          return joinedResult.embeddings[embeddingCol] !== null;
        });
        // We don't actually need to use usedDimension for now, but it's good to know it's there.
      }

      this.embeddingDimension = DIMENSION_MAP[dimension];
    });
  }

  /**
   * Asynchronously retrieves an agent by their ID from the database.
   * @param {UUID} agentId - The ID of the agent to retrieve.
   * @returns {Promise<Agent | null>} A promise that resolves to the retrieved agent or null if not found.
   */
  async getAgent(agentId: UUID): Promise<Agent | null> {
    return this.withDatabase(async () => {
```