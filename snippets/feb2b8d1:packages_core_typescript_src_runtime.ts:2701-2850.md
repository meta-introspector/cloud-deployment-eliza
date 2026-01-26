# feb2b8d1:packages_core_typescript_src_runtime.ts:2701-2850

**Commit:** feb2b8d1a9d781db8ca36187a067193c397d0b85
**Author:** lalalune
**Date:** Thu Jan 8 23:09:32 2026 -0800
**File:** packages/core/typescript/src/runtime.ts:2701-2850
**Novelty Score:** 38.24
**Concepts:** plugin-system, testing

```
  async generateText(
    input: string,
    options?: GenerateTextOptions,
  ): Promise<GenerateTextResult> {
    if (!input || !input.trim()) {
      throw new Error("Input cannot be empty");
    }

    // Set defaults
    const includeCharacter = (options && options.includeCharacter) ?? true;
    const modelType = (options && options.modelType) ?? ModelType.TEXT_LARGE;

    let prompt = input;

    // Add character context if requested
    if (includeCharacter && this.character) {
      const c = this.character;
      const parts: string[] = [];

      // Add bio
      const bioText = Array.isArray(c.bio) ? c.bio.join(" ") : c.bio;
      if (bioText) {
        parts.push(`# About ${c.name}\n${bioText}`);
      }

      // Add system prompt
      if (c.system) {
        parts.push(c.system);
      }

      // Add style directives (all + chat)
      const styles = [
        ...((c.style && c.style.all) || []),
        ...((c.style && c.style.chat) || []),
      ];
      if (styles.length > 0) {
        parts.push(`Style:\n${styles.map((s) => `- ${s}`).join("\n")}`);
      }

      // Combine character context with input
      if (parts.length > 0) {
        prompt = `${parts.join("\n\n")}\n\n${input}`;
      }
    }

    const params: GenerateTextParams = {
      prompt,
      maxTokens: options && options.maxTokens,
      minTokens: options && options.minTokens,
      temperature: options && options.temperature,
      topP: options && options.topP,
      topK: options && options.topK,
      minP: options && options.minP,
      seed: options && options.seed,
      repetitionPenalty: options && options.repetitionPenalty,
      frequencyPenalty: options && options.frequencyPenalty,
      presencePenalty: options && options.presencePenalty,
      stopSequences: options && options.stopSequences,
      // User identifier for provider tracking/analytics - auto-populates from character name if not provided
      // Explicitly set empty string or null will be preserved (not overridden)
      user: (options && options.user !== undefined) ? options.user : this.character.name,
      responseFormat: options && options.responseFormat,
    };

    const response = await this.useModel(modelType, params);

    return {
      text: response as string,
    };
  }

  registerEvent<T extends keyof EventPayloadMap>(
    event: T,
    handler: EventHandler<T>,
  ): void;
  registerEvent<P extends EventPayload = EventPayload>(
    event: string,
    handler: (params: P) => Promise<void>,
  ): void;
  registerEvent(
    event: string,
    handler: (params: EventPayload) => Promise<void>,
  ): void {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    const eventHandlers = this.events[event];
    if (eventHandlers) {
      eventHandlers.push(handler as (params: unknown) => Promise<void>);
    }
  }

  getEvent(event: string): ((params: unknown) => Promise<void>)[] | undefined {
    return this.events[event] as
      | ((params: unknown) => Promise<void>)[]
      | undefined;
  }

  async emitEvent(event: string | string[], params: unknown) {
    const events = Array.isArray(event) ? event : [event];
    for (const eventName of events) {
      const eventHandlers = this.events[eventName];
      if (!eventHandlers) {
        continue;
      }
      let paramsWithRuntime: EventPayload = {
        runtime: this as IAgentRuntime,
        source: "runtime",
      };
      if (typeof params === "object" && params && params !== null) {
        const paramsObj = params as Record<string, unknown>;
        paramsWithRuntime = {
          ...paramsObj,
          runtime: this as IAgentRuntime,
          source: (paramsObj.source as string) || "runtime",
        } as EventPayload;
      }
      await Promise.all(
        eventHandlers.map((handler) => handler(paramsWithRuntime)),
      );
    }
  }

  async ensureEmbeddingDimension() {
    if (!this.adapter) {
      throw new Error(
        "Database adapter not initialized before ensureEmbeddingDimension",
      );
    }
    const model = this.getModel(ModelType.TEXT_EMBEDDING);
    if (!model) {
      throw new Error("No TEXT_EMBEDDING model registered");
    }

    const embedding = await this.useModel(ModelType.TEXT_EMBEDDING, {
      text: "",
    });
    if (!embedding || !embedding.length) {
      throw new Error("Invalid embedding received");
    }

    await this.adapter.ensureEmbeddingDimension(embedding.length);
    this.logger.debug(
      { src: "agent", agentId: this.agentId, dimension: embedding.length },
      "Embedding dimension set",
    );
  }

  registerTaskWorker(taskHandler: TaskWorker): void {
    if (this.taskWorkers.has(taskHandler.name)) {
```