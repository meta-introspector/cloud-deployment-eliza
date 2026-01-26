# 5e8c73c1:packages_core_src_runtime.ts:2401-2550

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/runtime.ts:2401-2550
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
   * Simplified text generation with optional character context.
   */
  async generateText(input: string, options?: GenerateTextOptions): Promise<GenerateTextResult> {
    if (!input?.trim()) {
      throw new Error('Input cannot be empty');
    }

    // Set defaults
    const includeCharacter = options?.includeCharacter ?? true;
    const modelType = options?.modelType ?? ModelType.TEXT_LARGE;

    let prompt = input;

    // Add character context if requested
    if (includeCharacter && this.character) {
      const c = this.character;
      const parts: string[] = [];

      // Add bio
      const bioText = Array.isArray(c.bio) ? c.bio.join(' ') : c.bio;
      if (bioText) {
        parts.push(`# About ${c.name}\n${bioText}`);
      }

      // Add system prompt
      if (c.system) {
        parts.push(c.system);
      }

      // Add style directives (all + chat)
      const styles = [...(c.style?.all || []), ...(c.style?.chat || [])];
      if (styles.length > 0) {
        parts.push(`Style:\n${styles.map((s) => `- ${s}`).join('\n')}`);
      }

      // Combine character context with input
      if (parts.length > 0) {
        prompt = `${parts.join('\n\n')}\n\n${input}`;
      }
    }

    const params: GenerateTextParams = {
      prompt,
      maxTokens: options?.maxTokens,
      minTokens: options?.minTokens,
      temperature: options?.temperature,
      topP: options?.topP,
      topK: options?.topK,
      minP: options?.minP,
      seed: options?.seed,
      repetitionPenalty: options?.repetitionPenalty,
      frequencyPenalty: options?.frequencyPenalty,
      presencePenalty: options?.presencePenalty,
      stopSequences: options?.stopSequences,
      // User identifier for provider tracking/analytics - auto-populates from character name if not provided
      // Explicitly set empty string or null will be preserved (not overridden)
      user: options?.user !== undefined ? options.user : this.character?.name,
      responseFormat: options?.responseFormat,
    };

    const response = await this.useModel(modelType, params);

    return {
      text: response as string,
    };
  }

  registerEvent<T extends keyof EventPayloadMap>(event: T, handler: EventHandler<T>): void;
  registerEvent(event: string, handler: (params: EventPayload) => Promise<void>): void;
  registerEvent(
    event: string,
    handler: ((params: EventPayload) => Promise<void>) | ((params: unknown) => Promise<void>)
  ): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event]!.push(handler as (params: unknown) => Promise<void>);
  }

  getEvent(event: string): ((params: unknown) => Promise<void>)[] | undefined {
    return this.events[event] as ((params: unknown) => Promise<void>)[] | undefined;
  }

  async emitEvent(event: string | string[], params: unknown) {
    const events = Array.isArray(event) ? event : [event];
    for (const eventName of events) {
      const eventHandlers = this.events[eventName];
      if (!eventHandlers) {
        continue;
      }
      let paramsWithRuntime: EventPayload = { runtime: this as IAgentRuntime, source: 'runtime' };
      if (typeof params === 'object' && params && params !== null) {
        const paramsObj = params as Record<string, unknown>;
        paramsWithRuntime = {
          ...paramsObj,
          runtime: this as IAgentRuntime,
          source: (paramsObj.source as string) || 'runtime',
        } as EventPayload;
      }
      await Promise.all(
        eventHandlers.map((handler) => handler(paramsWithRuntime as unknown as EventPayload))
      );
    }
  }

  async ensureEmbeddingDimension() {
    if (!this.adapter) {
      throw new Error('Database adapter not initialized before ensureEmbeddingDimension');
    }
    const model = this.getModel(ModelType.TEXT_EMBEDDING);
    if (!model) {
      throw new Error('No TEXT_EMBEDDING model registered');
    }

    const embedding = await this.useModel(ModelType.TEXT_EMBEDDING, { text: '' });
    if (!embedding || !embedding.length) {
      throw new Error('Invalid embedding received');
    }

    await this.adapter.ensureEmbeddingDimension(embedding.length);
    this.logger.debug(
      { src: 'agent', agentId: this.agentId, dimension: embedding.length },
      'Embedding dimension set'
    );
  }

  registerTaskWorker(taskHandler: TaskWorker): void {
    if (this.taskWorkers.has(taskHandler.name)) {
      this.logger.warn(
        { src: 'agent', agentId: this.agentId, task: taskHandler.name },
        'Task worker already registered, overwriting'
      );
    }
    this.taskWorkers.set(taskHandler.name, taskHandler);
  }

  getTaskWorker(name: string): TaskWorker | undefined {
    return this.taskWorkers.get(name);
  }

  get db(): unknown {
    return this.adapter.db;
  }
  async init(): Promise<void> {
    await this.adapter.init();
  }
  async close(): Promise<void> {
    if (this.adapter) {
      await this.adapter.close();
    }
```