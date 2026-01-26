# 5e8c73c1:packages_core_src_runtime.ts:2101-2250

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/runtime.ts:2101-2250
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
        const modelSpecificKey = `${modelType}_${param}`;
        const modelValue = this.getSetting(modelSpecificKey);
        if (modelValue !== null && modelValue !== undefined) {
          const numValue = Number(modelValue);
          if (!isNaN(numValue)) {
            return numValue;
          }
          // If model-specific value exists but is invalid, continue to fallbacks
        }
      }

      // Fall back to default setting
      const defaultKey = `DEFAULT_${param}`;
      const defaultValue = this.getSetting(defaultKey);
      if (defaultValue !== null && defaultValue !== undefined) {
        const numValue = Number(defaultValue);
        if (!isNaN(numValue)) {
          return numValue;
        }
        // If default value exists but is invalid, continue to legacy
      }

      // Fall back to legacy setting for backwards compatibility (if provided)
      if (legacyKey) {
        const legacyValue = this.getSetting(legacyKey);
        if (legacyValue !== null && legacyValue !== undefined) {
          const numValue = Number(legacyValue);
          if (!isNaN(numValue)) {
            return numValue;
          }
        }
      }

      return null;
    };

    // Get settings with proper fallback chain
    const maxTokens = getSettingWithFallback('MAX_TOKENS', MODEL_SETTINGS.MODEL_MAX_TOKEN);
    const temperature = getSettingWithFallback('TEMPERATURE', MODEL_SETTINGS.MODEL_TEMPERATURE);
    const topP = getSettingWithFallback('TOP_P');
    const topK = getSettingWithFallback('TOP_K');
    const minP = getSettingWithFallback('MIN_P');
    const seed = getSettingWithFallback('SEED');
    const repetitionPenalty = getSettingWithFallback('REPETITION_PENALTY');
    const frequencyPenalty = getSettingWithFallback(
      'FREQUENCY_PENALTY',
      MODEL_SETTINGS.MODEL_FREQ_PENALTY
    );
    const presencePenalty = getSettingWithFallback(
      'PRESENCE_PENALTY',
      MODEL_SETTINGS.MODEL_PRESENCE_PENALTY
    );

    // Add settings if they exist
    if (maxTokens !== null) modelSettings.maxTokens = maxTokens;
    if (temperature !== null) modelSettings.temperature = temperature;
    if (topP !== null) modelSettings.topP = topP;
    if (topK !== null) modelSettings.topK = topK;
    if (minP !== null) modelSettings.minP = minP;
    if (seed !== null) modelSettings.seed = seed;
    if (repetitionPenalty !== null) modelSettings.repetitionPenalty = repetitionPenalty;
    if (frequencyPenalty !== null) modelSettings.frequencyPenalty = frequencyPenalty;
    if (presencePenalty !== null) modelSettings.presencePenalty = presencePenalty;

    // Return null if no settings were configured
    return Object.keys(modelSettings).length > 0 ? modelSettings : null;
  }

  async useModel<T extends keyof ModelParamsMap, R = ModelResultMap[T]>(
    modelType: T,
    params: ModelParamsMap[T],
    provider?: string
  ): Promise<R> {
    const modelKey = typeof modelType === 'string' ? modelType : ModelType[modelType];
    const paramsObj = params as Record<string, unknown> | null | undefined;
    const promptContent =
      (paramsObj && 'prompt' in paramsObj && typeof paramsObj.prompt === 'string'
        ? paramsObj.prompt
        : null) ||
      (paramsObj && 'input' in paramsObj && typeof paramsObj.input === 'string'
        ? paramsObj.input
        : null) ||
      (paramsObj && 'messages' in paramsObj && Array.isArray(paramsObj.messages)
        ? JSON.stringify(paramsObj.messages)
        : null);
    const model = this.getModel(modelKey);
    const modelWithProvider =
      provider && this.models.get(modelKey)?.find((m) => m.provider === provider);
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
```