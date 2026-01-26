# a69475c0:packages_core_src_runtime.ts:1951-2100

**Commit:** a69475c084e9a6fb6fc85f19ea6742546b8e0476
**Author:** standujar
**Date:** Wed Dec 17 15:16:36 2025 +0100
**File:** packages/core/src/runtime.ts:1951-2100
**Novelty Score:** 29.11
**Concepts:** event-driven, testing

```

  registerModel(
    modelType: ModelTypeName | string,
    handler: (runtime: IAgentRuntime, params: Record<string, unknown>) => Promise<unknown>,
    provider: string,
    priority?: number
  ): void {
    const modelKey = typeof modelType === 'string' ? modelType : ModelType[modelType];
    if (!this.models.has(modelKey)) {
      this.models.set(modelKey, []);
    }

    const registrationOrder = Date.now();
    this.models.get(modelKey)?.push({
      handler,
      provider,
      priority: priority || 0,
      registrationOrder,
    });
    this.models.get(modelKey)?.sort((a, b) => {
      if ((b.priority || 0) !== (a.priority || 0)) {
        return (b.priority || 0) - (a.priority || 0);
      }
      return (a.registrationOrder || 0) - (b.registrationOrder || 0);
    });
  }

  getModel(
    modelType: ModelTypeName | string
  ): ((runtime: IAgentRuntime, params: Record<string, unknown>) => Promise<unknown>) | undefined {
    const modelKey = typeof modelType === 'string' ? modelType : ModelType[modelType];
    const models = this.models.get(modelKey);
    if (!models?.length) {
      return undefined;
    }

    // Return highest priority handler (first in array after sorting)
    this.logger.debug(
      { src: 'agent', agentId: this.agentId, model: modelKey, provider: models[0].provider },
      'Using model'
    );
    return models[0].handler;
  }

  /**
   * Retrieves model configuration settings from character settings with support for
   * model-specific overrides and default fallbacks.
   *
   * Precedence order (highest to lowest):
   * 1. Model-specific settings (e.g., TEXT_SMALL_TEMPERATURE)
   * 2. Default settings (e.g., DEFAULT_TEMPERATURE)
   * 3. Legacy settings for backwards compatibility (e.g., MODEL_TEMPERATURE)
   *
   * @param modelType The specific model type to get settings for
   * @returns Object containing model parameters if they exist, or null if no settings are configured
   */
  private getModelSettings(modelType?: ModelTypeName): Record<string, number> | null {
    const modelSettings: Record<string, number> = {};

    // Helper to get a setting value with fallback chain
    const getSettingWithFallback = (
      param:
        | 'MAX_TOKENS'
        | 'TEMPERATURE'
        | 'TOP_P'
        | 'TOP_K'
        | 'MIN_P'
        | 'SEED'
        | 'REPETITION_PENALTY'
        | 'FREQUENCY_PENALTY'
        | 'PRESENCE_PENALTY',
      legacyKey?: string
    ): number | null => {
      // Try model-specific setting first
      if (modelType) {
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
```