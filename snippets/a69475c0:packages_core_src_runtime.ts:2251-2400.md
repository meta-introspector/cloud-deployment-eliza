# a69475c0:packages_core_src_runtime.ts:2251-2400

**Commit:** a69475c084e9a6fb6fc85f19ea6742546b8e0476
**Author:** standujar
**Date:** Wed Dec 17 15:16:36 2025 +0100
**File:** packages/core/src/runtime.ts:2251-2400
**Novelty Score:** 29.11
**Concepts:** event-driven, testing

```
    // Log all prompts except TEXT_EMBEDDING to track agent behavior
    if (modelKey !== ModelType.TEXT_EMBEDDING && promptContent) {
      // If we're in an action context, collect the prompt
      if (this.currentActionContext) {
        this.currentActionContext.prompts.push({
          modelType: modelKey,
          prompt: promptContent,
          timestamp: Date.now(),
        });
      }
    }

    // Keep the existing model logging for backward compatibility
    this.adapter.log({
      entityId: this.agentId,
      roomId: this.currentRoomId ?? this.agentId,
      body: {
        modelType,
        modelKey,
        params: {
          ...(typeof params === 'object' && !Array.isArray(params) && params ? params : {}),
          prompt: promptContent,
        },
        prompt: promptContent,
        systemPrompt: this.character?.system || null,
        runId: this.getCurrentRunId(),
        timestamp: Date.now(),
        executionTime: elapsedTime,
        provider: provider || this.models.get(modelKey)?.[0]?.provider || 'unknown',
        actionContext: this.currentActionContext
          ? {
            actionName: this.currentActionContext.actionName,
            actionId: this.currentActionContext.actionId,
          }
          : undefined,
        response:
          Array.isArray(response) && response.every((x) => typeof x === 'number')
            ? '[array]'
            : response,
      },
      type: `useModel:${modelKey}`,
    });

    return response as R;
  }

  /**
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
  registerEvent(event: string, handler: ((params: EventPayload) => Promise<void>) | ((params: unknown) => Promise<void>)): void {
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
      await Promise.all(eventHandlers.map((handler) => handler(paramsWithRuntime as unknown as EventPayload)));
    }
  }

  async ensureEmbeddingDimension() {
    if (!this.adapter) {
      throw new Error('Database adapter not initialized before ensureEmbeddingDimension');
```