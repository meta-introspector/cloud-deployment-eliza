# a7046c18:packages_core_typescript_src_runtime.ts:2251-2400

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/runtime.ts:2251-2400
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    });
  }

  getModel(
    modelType: ModelTypeName | string,
  ):
    | ((
        runtime: IAgentRuntime,
        params: Record<string, unknown>,
      ) => Promise<unknown>)
    | undefined {
    const modelKey =
      typeof modelType === "string" ? modelType : ModelType[modelType];
    const models = this.models.get(modelKey);
    if (!models?.length) {
      return undefined;
    }

    // Return highest priority handler (first in array after sorting)
    this.logger.debug(
      {
        src: "agent",
        agentId: this.agentId,
        model: modelKey,
        provider: models[0].provider,
      },
      "Using model",
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
  private getModelSettings(
    modelType?: ModelTypeName,
  ): Record<string, number> | null {
    const modelSettings: Record<string, number> = {};

    // Helper to get a setting value with fallback chain
    const getSettingWithFallback = (
      param:
        | "MAX_TOKENS"
        | "TEMPERATURE"
        | "TOP_P"
        | "TOP_K"
        | "MIN_P"
        | "SEED"
        | "REPETITION_PENALTY"
        | "FREQUENCY_PENALTY"
        | "PRESENCE_PENALTY",
      legacyKey?: string,
    ): number | null => {
      // Try model-specific setting first
      if (modelType) {
        const modelSpecificKey = `${modelType}_${param}`;
        const modelValue = this.getSetting(modelSpecificKey);
        if (modelValue !== null && modelValue !== undefined) {
          const numValue = Number(modelValue);
          if (!Number.isNaN(numValue)) {
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
        if (!Number.isNaN(numValue)) {
          return numValue;
        }
        // If default value exists but is invalid, continue to legacy
      }

      // Fall back to legacy setting for backwards compatibility (if provided)
      if (legacyKey) {
        const legacyValue = this.getSetting(legacyKey);
        if (legacyValue !== null && legacyValue !== undefined) {
          const numValue = Number(legacyValue);
          if (!Number.isNaN(numValue)) {
            return numValue;
          }
        }
      }

      return null;
    };

    // Get settings with proper fallback chain
    const maxTokens = getSettingWithFallback(
      "MAX_TOKENS",
      MODEL_SETTINGS.MODEL_MAX_TOKEN,
    );
    const temperature = getSettingWithFallback(
      "TEMPERATURE",
      MODEL_SETTINGS.MODEL_TEMPERATURE,
    );
    const topP = getSettingWithFallback("TOP_P");
    const topK = getSettingWithFallback("TOP_K");
    const minP = getSettingWithFallback("MIN_P");
    const seed = getSettingWithFallback("SEED");
    const repetitionPenalty = getSettingWithFallback("REPETITION_PENALTY");
    const frequencyPenalty = getSettingWithFallback(
      "FREQUENCY_PENALTY",
      MODEL_SETTINGS.MODEL_FREQ_PENALTY,
    );
    const presencePenalty = getSettingWithFallback(
      "PRESENCE_PENALTY",
      MODEL_SETTINGS.MODEL_PRESENCE_PENALTY,
    );

    // Add settings if they exist
    if (maxTokens !== null) modelSettings.maxTokens = maxTokens;
    if (temperature !== null) modelSettings.temperature = temperature;
    if (topP !== null) modelSettings.topP = topP;
    if (topK !== null) modelSettings.topK = topK;
    if (minP !== null) modelSettings.minP = minP;
    if (seed !== null) modelSettings.seed = seed;
    if (repetitionPenalty !== null)
      modelSettings.repetitionPenalty = repetitionPenalty;
    if (frequencyPenalty !== null)
      modelSettings.frequencyPenalty = frequencyPenalty;
    if (presencePenalty !== null)
      modelSettings.presencePenalty = presencePenalty;

    // Return null if no settings were configured
    return Object.keys(modelSettings).length > 0 ? modelSettings : null;
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
```