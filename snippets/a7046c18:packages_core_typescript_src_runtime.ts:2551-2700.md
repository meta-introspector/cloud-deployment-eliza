# a7046c18:packages_core_typescript_src_runtime.ts:2551-2700

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/runtime.ts:2551-2700
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
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
    const paramsChunk = paramsAsStreaming?.onStreamChunk;
    const ctxChunk = streamingCtx?.onStreamChunk;
    const msgId = streamingCtx?.messageId;
    const abortSignal = streamingCtx?.abortSignal;
    const explicitStream = paramsAsStreaming?.stream;

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
        if (abortSignal?.aborted) break;
        fullText += chunk;
        try {
          if (paramsChunk) await paramsChunk(chunk, msgId);
        } catch {}
        try {
          if (ctxChunk) await ctxChunk(chunk, msgId);
        } catch {}
      }

      // Signal stream end to allow context to reset state between useModel calls
      const ctxEnd = getStreamingContext()?.onStreamEnd;
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
  async generateText(
    input: string,
    options?: GenerateTextOptions,
  ): Promise<GenerateTextResult> {
    if (!input?.trim()) {
      throw new Error("Input cannot be empty");
    }

    // Set defaults
    const includeCharacter = options?.includeCharacter ?? true;
    const modelType = options?.modelType ?? ModelType.TEXT_LARGE;

    let prompt = input;
```