# feb2b8d1:packages_core_typescript_src_runtime.ts:2551-2700

**Commit:** feb2b8d1a9d781db8ca36187a067193c397d0b85
**Author:** lalalune
**Date:** Thu Jan 8 23:09:32 2026 -0800
**File:** packages/core/typescript/src/runtime.ts:2551-2700
**Novelty Score:** 38.24
**Concepts:** plugin-system, testing

```
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
        if (modelParams.user === undefined && this.character.name) {
          if (
            typeof modelParams === "object" &&
            modelParams !== null &&
            !Array.isArray(modelParams)
          ) {
            (modelParams as Record<string, unknown>).user = this.character.name;
          }
        }
      }
    }
    const startTime =
      typeof performance !== "undefined" &&
      typeof performance.now === "function"
        ? performance.now()
        : Date.now();

    // Get streaming config
    // Define interface for params that may have streaming properties
    interface StreamingParams {
      stream?: boolean;
      onStreamChunk?: (
        chunk: string,
        messageId?: string,
      ) => void | Promise<void>;
    }
    const streamingCtx = getStreamingContext();
    const paramsAsStreaming = isPlainObject(modelParams)
      ? (modelParams as StreamingParams)
      : undefined;
    const paramsChunk = paramsAsStreaming && paramsAsStreaming.onStreamChunk;
    const ctxChunk = streamingCtx && streamingCtx.onStreamChunk;
    const msgId = streamingCtx && streamingCtx.messageId;
    const abortSignal = streamingCtx && streamingCtx.abortSignal;
    const explicitStream = paramsAsStreaming && paramsAsStreaming.stream;

    // stream: false = force no stream, otherwise stream if any callback exists
    const shouldStream =
      explicitStream === false
        ? false
        : !!(paramsChunk || ctxChunk || explicitStream);

    if (isPlainObject(modelParams) && paramsAsStreaming) {
      paramsAsStreaming.stream = shouldStream;
      delete paramsAsStreaming.onStreamChunk;
    }

    const response = await handler(
      this as IAgentRuntime,
      modelParams as Record<string, unknown>,
    );

    // Stream: broadcast to callbacks if streaming
    if (
      shouldStream &&
      (paramsChunk || ctxChunk) &&
      response &&
      typeof response === "object" &&
      "textStream" in response
    ) {
      let fullText = "";
      for await (const chunk of (response as TextStreamResult).textStream) {
        if (abortSignal && abortSignal.aborted) break;
        fullText += chunk;
        try {
          if (paramsChunk) await paramsChunk(chunk, msgId);
        } catch {}
        try {
          if (ctxChunk) await ctxChunk(chunk, msgId);
        } catch {}
      }

      // Signal stream end to allow context to reset state between useModel calls
      const streamingCtxEnd = getStreamingContext();
      const ctxEnd = streamingCtxEnd && streamingCtxEnd.onStreamEnd;
      if (ctxEnd) ctxEnd();

      // Log the completed stream
      const elapsedTime =
        (typeof performance !== "undefined" &&
        typeof performance.now === "function"
          ? performance.now()
          : Date.now()) - startTime;
      this.logger.trace(
        {
          src: "agent",
          agentId: this.agentId,
          model: modelKey,
          duration: Number(elapsedTime.toFixed(2)),
          streaming: true,
        },
        "Model output (stream with callback complete)",
      );

      this.logModelCall(
        modelType,
        modelKey,
        params,
        promptContent,
        elapsedTime,
        provider,
        fullText,
      );
      return fullText as R;
    }

    const elapsedTime =
      (typeof performance !== "undefined" &&
      typeof performance.now === "function"
        ? performance.now()
        : Date.now()) - startTime;

    // Log timing / response (keep debug log if useful)
    this.logger.trace(
      {
        src: "agent",
        agentId: this.agentId,
        model: modelKey,
        duration: Number(elapsedTime.toFixed(2)),
      },
      "Model output",
    );

    this.logModelCall(
      modelType,
      modelKey,
      params,
      promptContent,
      elapsedTime,
      provider,
      response,
    );
    return response as R;
  }

  /**
   * Simplified text generation with optional character context.
   */
```