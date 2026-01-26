# a69475c0:packages_core_src_runtime.ts:2101-2250

**Commit:** a69475c084e9a6fb6fc85f19ea6742546b8e0476
**Author:** standujar
**Date:** Wed Dec 17 15:16:36 2025 +0100
**File:** packages/core/src/runtime.ts:2101-2250
**Novelty Score:** 29.11
**Concepts:** event-driven, testing

```
    const promptContent =
      (paramsObj && 'prompt' in paramsObj && typeof paramsObj.prompt === 'string' ? paramsObj.prompt : null) ||
      (paramsObj && 'input' in paramsObj && typeof paramsObj.input === 'string' ? paramsObj.input : null) ||
      (paramsObj && 'messages' in paramsObj && Array.isArray(paramsObj.messages) ? JSON.stringify(paramsObj.messages) : null);
    const model = this.getModel(modelKey);
    const modelWithProvider = provider && this.models.get(modelKey)?.find((m) => m.provider === provider);
    const handler = modelWithProvider ? modelWithProvider.handler : model;
    if (!handler) {
      const errorMsg = `No handler found for delegate type: ${modelKey}`;
      throw new Error(errorMsg);
    }

    // Log input parameters (keep debug log if useful)
    // Skip verbose logging for binary data models (TRANSCRIPTION, IMAGE, AUDIO, VIDEO)
    const binaryModels: string[] = [
      ModelType.TRANSCRIPTION,
      ModelType.IMAGE,
      ModelType.AUDIO,
      ModelType.VIDEO,
    ];
    if (!binaryModels.includes(modelKey)) {
      this.logger.trace(
        { src: 'agent', agentId: this.agentId, model: modelKey, params },
        'Model input'
      );
    } else {
      // For binary models, just log the type and size info
      let sizeInfo = 'unknown size';
      if (Buffer.isBuffer(params)) {
        sizeInfo = `${params.length} bytes`;
      } else if (typeof Blob !== 'undefined' && params instanceof Blob) {
        sizeInfo = `${params.size} bytes`;
      } else if (typeof params === 'object' && params !== null) {
        if ('audio' in params && Buffer.isBuffer(params.audio)) {
          sizeInfo = `${(params.audio as Buffer).length} bytes`;
        } else if (
          'audio' in params &&
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
    const streamingCtx = getStreamingContext();
    const paramsChunk = isPlainObject(modelParams) ? (modelParams as any).onStreamChunk : undefined;
    const ctxChunk = streamingCtx?.onStreamChunk;
    const msgId = streamingCtx?.messageId;
    const abortSignal = streamingCtx?.abortSignal;
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
        if (abortSignal?.aborted) break;
        fullText += chunk;
        try { if (paramsChunk) await paramsChunk(chunk, msgId); } catch {}
        try { if (ctxChunk) await ctxChunk(chunk, msgId); } catch {}
      }

      // Signal stream end to allow context to reset state between useModel calls
      const ctxEnd = getStreamingContext()?.onStreamEnd;
      if (ctxEnd) ctxEnd();

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

```