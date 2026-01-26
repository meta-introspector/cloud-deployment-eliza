# feb2b8d1:packages_core_typescript_src_runtime.ts:2401-2550

**Commit:** feb2b8d1a9d781db8ca36187a067193c397d0b85
**Author:** lalalune
**Date:** Thu Jan 8 23:09:32 2026 -0800
**File:** packages/core/typescript/src/runtime.ts:2401-2550
**Novelty Score:** 38.24
**Concepts:** plugin-system, testing

```
  }

  /**
   * Helper to log model calls to the database (used by both streaming and non-streaming paths)
   */
  private logModelCall(
    modelType: string,
    modelKey: string,
    params: unknown,
    promptContent: string | null,
    elapsedTime: number,
    provider: string | undefined,
    response: unknown,
  ): void {
    // Log prompts to action context (except embeddings)
    if (modelKey !== ModelType.TEXT_EMBEDDING && promptContent) {
      if (this.currentActionContext) {
        this.currentActionContext.prompts.push({
          modelType: modelKey,
          prompt: promptContent,
          timestamp: Date.now(),
        });
      }
    }

    // Log to database
    this.adapter.log({
      entityId: this.agentId,
      roomId: this.currentRoomId ?? this.agentId,
      body: {
        modelType,
        modelKey,
        params: {
          ...(typeof params === "object" && !Array.isArray(params) && params
            ? params
            : {}),
          prompt: promptContent,
        },
        prompt: promptContent,
        systemPrompt: this.character.system || null,
        runId: this.getCurrentRunId(),
        timestamp: Date.now(),
        executionTime: elapsedTime,
        provider:
          provider || (this.models.get(modelKey) && this.models.get(modelKey)![0] && this.models.get(modelKey)![0].provider) || "unknown",
        actionContext: this.currentActionContext
          ? {
              actionName: this.currentActionContext.actionName,
              actionId: this.currentActionContext.actionId,
            }
          : undefined,
        response:
          Array.isArray(response) &&
          response.every((x) => typeof x === "number")
            ? "[array]"
            : response,
      },
      type: `useModel:${modelKey}`,
    });
  }

  async useModel<T extends keyof ModelParamsMap, R = ModelResultMap[T]>(
    modelType: T,
    params: ModelParamsMap[T],
    provider?: string,
  ): Promise<R> {
    const modelKey =
      typeof modelType === "string" ? modelType : ModelType[modelType];
    const paramsObj = params as Record<string, unknown> | null | undefined;
    const promptContent =
      (paramsObj &&
      "prompt" in paramsObj &&
      typeof paramsObj.prompt === "string"
        ? paramsObj.prompt
        : null) ||
      (paramsObj && "input" in paramsObj && typeof paramsObj.input === "string"
        ? paramsObj.input
        : null) ||
      (paramsObj && "messages" in paramsObj && Array.isArray(paramsObj.messages)
        ? JSON.stringify(paramsObj.messages)
        : null);
    const model = this.getModel(modelKey);
    const modelsForKey = this.models.get(modelKey);
    const modelWithProvider =
      provider && modelsForKey &&
      modelsForKey.find((m) => m.provider === provider);
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
        { src: "agent", agentId: this.agentId, model: modelKey, params },
        "Model input",
      );
    } else {
      // For binary models, just log the type and size info
      let sizeInfo = "unknown size";
      if (Buffer.isBuffer(params)) {
        sizeInfo = `${params.length} bytes`;
      } else if (typeof Blob !== "undefined" && params instanceof Blob) {
        sizeInfo = `${params.size} bytes`;
      } else if (typeof params === "object" && params !== null) {
        if ("audio" in params && Buffer.isBuffer(params.audio)) {
          sizeInfo = `${(params.audio as Buffer).length} bytes`;
        } else if (
          "audio" in params &&
          typeof Blob !== "undefined" &&
          params.audio instanceof Blob
        ) {
          sizeInfo = `${(params.audio as Blob).size} bytes`;
        }
      }
      this.logger.trace(
        {
          src: "agent",
          agentId: this.agentId,
          model: modelKey,
          size: sizeInfo,
        },
        "Model input (binary)",
      );
    }
    let modelParams: ModelParamsMap[T];
    if (
      params === null ||
      params === undefined ||
      typeof params !== "object" ||
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
```