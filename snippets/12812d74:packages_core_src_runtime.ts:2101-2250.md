# 12812d74:packages_core_src_runtime.ts:2101-2250

**Commit:** 12812d7441573a7a81c2c5d2ea28a46bd10f3d0c
**Author:** standujar
**Date:** Tue Dec 16 01:47:14 2025 +0100
**File:** packages/core/src/runtime.ts:2101-2250
**Novelty Score:** 30.22
**Concepts:** event-driven, plugin-system, testing

```
          typeof Blob !== 'undefined' &&
          params.audio instanceof Blob
        ) {
          sizeInfo = `${(params.audio as Blob).size} bytes`;
        }
      }
      this.logger.trace(
        { src: 'agent', agentId: this.agentId, model: modelKey, size: sizeInfo },
        'Model input (binary)'
      );
    }
    let modelParams: ModelParamsMap[T];
    if (
      params === null ||
      params === undefined ||
      typeof params !== 'object' ||
      Array.isArray(params) ||
      BufferUtils.isBuffer(params)
    ) {
      modelParams = params;
    } else {
      // Include model settings from character configuration if available
      const modelSettings = this.getModelSettings(modelKey);

      if (modelSettings) {
        // Apply model settings if configured
        modelParams = {
          ...modelSettings, // Apply model settings first (includes defaults and model-specific)
          ...params, // Then apply specific params (allowing overrides)
        };
      } else {
        // No model settings configured, use params as-is
        modelParams = params;
      }

      // Auto-populate user parameter from character name if not provided
      // The `user` parameter is used by LLM providers for tracking and analytics purposes.
      // We only auto-populate when user is undefined (not explicitly set to empty string or null)
      // to allow users to intentionally set an empty identifier if needed.
      if (isPlainObject(modelParams)) {
        if (modelParams.user === undefined && this.character?.name) {
          if (typeof modelParams === 'object' && modelParams !== null && !Array.isArray(modelParams)) {
            (modelParams as Record<string, unknown>).user = this.character.name;
          }
        }
      }
    }
    const startTime =
      typeof performance !== 'undefined' && typeof performance.now === 'function'
        ? performance.now()
        : Date.now();

    // Get streaming config
    const paramsChunk = isPlainObject(modelParams) ? (modelParams as any).onStreamChunk : undefined;
    const ctxChunk = getStreamingContext()?.onStreamChunk;
    const msgId = getStreamingContext()?.messageId;
    const explicitStream = isPlainObject(modelParams) ? (modelParams as any).stream : undefined;

    // stream: false = force no stream, otherwise stream if any callback exists
    const shouldStream = explicitStream === false ? false : !!(paramsChunk || ctxChunk || explicitStream);

    if (isPlainObject(modelParams)) {
      (modelParams as any).stream = shouldStream;
      delete (modelParams as any).onStreamChunk;
    }

    const response = await handler(this as IAgentRuntime, modelParams as Record<string, unknown>);

    // Stream: broadcast to callbacks if streaming
    if (shouldStream && (paramsChunk || ctxChunk) && response && typeof response === 'object' && 'textStream' in response) {
      let fullText = '';
      for await (const chunk of (response as TextStreamResult).textStream) {
        fullText += chunk;
        try { if (paramsChunk) await paramsChunk(chunk, msgId); } catch {}
        try { if (ctxChunk) await ctxChunk(chunk, msgId); } catch {}
      }

      // Log the completed stream
      const elapsedTime =
        (typeof performance !== 'undefined' && typeof performance.now === 'function'
          ? performance.now()
          : Date.now()) - startTime;
      this.logger.trace(
        { src: 'agent', agentId: this.agentId, model: modelKey, duration: Number(elapsedTime.toFixed(2)), streaming: true },
        'Model output (stream with callback complete)'
      );

      return fullText as R;
    }

    const elapsedTime =
      (typeof performance !== 'undefined' && typeof performance.now === 'function'
        ? performance.now()
        : Date.now()) - startTime;

    // Log timing / response (keep debug log if useful)
    this.logger.trace(
      {
        src: 'agent',
        agentId: this.agentId,
        model: modelKey,
        duration: Number(elapsedTime.toFixed(2)),
      },
      'Model output'
    );

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
```