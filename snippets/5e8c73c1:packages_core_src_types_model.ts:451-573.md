# 5e8c73c1:packages_core_src_types_model.ts:451-573

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/types/model.ts:451-573
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
 */
export interface ObjectGenerationParams {
  /** The prompt describing the object to generate */
  prompt: string;
  /** Optional JSON schema for validation */
  schema?: JSONSchema;
  /** Type of object to generate */
  output?: 'object' | 'array' | 'enum';
  /** For enum type, the allowed values */
  enumValues?: string[];
  /** Model type to use */
  modelType?: ModelTypeName;
  /** Model temperature (0.0 to 1.0) */
  temperature?: number;
  /** Sequences that should stop generation */
  stopSequences?: string[];
}

/**
 * Map of model types to their parameter types
 */
export interface ModelParamsMap {
  [ModelType.TEXT_SMALL]: GenerateTextParams;
  [ModelType.TEXT_LARGE]: GenerateTextParams;
  [ModelType.TEXT_EMBEDDING]: TextEmbeddingParams | string | null;
  [ModelType.TEXT_TOKENIZER_ENCODE]: TokenizeTextParams;
  [ModelType.TEXT_TOKENIZER_DECODE]: DetokenizeTextParams;
  [ModelType.TEXT_REASONING_SMALL]: GenerateTextParams;
  [ModelType.TEXT_REASONING_LARGE]: GenerateTextParams;
  [ModelType.IMAGE]: ImageGenerationParams;
  [ModelType.IMAGE_DESCRIPTION]: ImageDescriptionParams | string;
  [ModelType.TRANSCRIPTION]: TranscriptionParams | Buffer | string;
  [ModelType.TEXT_TO_SPEECH]: TextToSpeechParams | string;
  [ModelType.AUDIO]: AudioProcessingParams;
  [ModelType.VIDEO]: VideoProcessingParams;
  [ModelType.OBJECT_SMALL]: ObjectGenerationParams;
  [ModelType.OBJECT_LARGE]: ObjectGenerationParams;
  [ModelType.TEXT_COMPLETION]: GenerateTextParams;
  // Custom model types should be registered via runtime.registerModel() in plugin init()
}

/**
 * Map of model types to their DEFAULT return value types.
 *
 * Note: For text generation models (TEXT_SMALL, TEXT_LARGE, TEXT_REASONING_*),
 * the actual return type depends on the parameters and is handled by overloads:
 * - `{ prompt }`: Returns `string` (this default)
 * - `{ prompt, stream: true }`: Returns `TextStreamResult` (via overload)
 *
 * The overloads in IAgentRuntime.useModel() provide the correct type inference.
 */
export interface ModelResultMap {
  [ModelType.TEXT_SMALL]: string;
  [ModelType.TEXT_LARGE]: string;
  [ModelType.TEXT_EMBEDDING]: number[];
  [ModelType.TEXT_TOKENIZER_ENCODE]: number[];
  [ModelType.TEXT_TOKENIZER_DECODE]: string;
  [ModelType.TEXT_REASONING_SMALL]: string;
  [ModelType.TEXT_REASONING_LARGE]: string;
  [ModelType.IMAGE]: { url: string }[];
  [ModelType.IMAGE_DESCRIPTION]: { title: string; description: string };
  [ModelType.TRANSCRIPTION]: string;
  [ModelType.TEXT_TO_SPEECH]: Buffer | ArrayBuffer | Uint8Array;
  [ModelType.AUDIO]: Buffer | ArrayBuffer | Uint8Array | Record<string, unknown>;
  [ModelType.VIDEO]: Buffer | ArrayBuffer | Uint8Array | Record<string, unknown>;
  [ModelType.OBJECT_SMALL]: Record<string, unknown>;
  [ModelType.OBJECT_LARGE]: Record<string, unknown>;
  [ModelType.TEXT_COMPLETION]: string;
  // Custom model types should be registered via runtime.registerModel() in plugin init()
}

/**
 * Models that support streaming - their handlers can return either string or TextStreamResult
 */
export type StreamableModelType =
  | typeof ModelType.TEXT_SMALL
  | typeof ModelType.TEXT_LARGE
  | typeof ModelType.TEXT_REASONING_SMALL
  | typeof ModelType.TEXT_REASONING_LARGE
  | typeof ModelType.TEXT_COMPLETION;

/**
 * Result type for plugin model handlers - includes TextStreamResult for streamable models
 */
export type PluginModelResult<K extends keyof ModelResultMap> = K extends StreamableModelType
  ? ModelResultMap[K] | TextStreamResult
  : ModelResultMap[K];

/**
 * Type guard to check if a model type supports streaming.
 */
export function isStreamableModelType(modelType: ModelTypeName): boolean {
  return [
    ModelType.TEXT_SMALL,
    ModelType.TEXT_LARGE,
    ModelType.TEXT_REASONING_SMALL,
    ModelType.TEXT_REASONING_LARGE,
    ModelType.TEXT_COMPLETION,
  ].includes(modelType as any);
}

/**
 * Defines the structure for a model handler registration within the `AgentRuntime`.
 * Each model (e.g., for text generation, embedding) is associated with a handler function,
 * the name of the provider (plugin or system) that registered it, and an optional priority.
 * The `priority` (higher is more preferred) helps in selecting which handler to use if multiple
 * handlers are registered for the same model type. The `registrationOrder` (not in type, but used in runtime)
 * serves as a tie-breaker. See `AgentRuntime.registerModel` and `AgentRuntime.getModel`.
 */
export interface ModelHandler<TParams = Record<string, unknown>, TResult = unknown> {
  /** The function that executes the model, taking runtime and parameters, and returning a Promise. */
  handler: (runtime: IAgentRuntime, params: TParams) => Promise<TResult>;
  /** The name of the provider (e.g., plugin name) that registered this model handler. */
  provider: string;
  /**
   * Optional priority for this model handler. Higher numbers indicate higher priority.
   * This is used by `AgentRuntime.getModel` to select the most appropriate handler
   * when multiple are available for a given model type. Defaults to 0 if not specified.
   */
  priority?: number; // Optional priority for selection order

  registrationOrder?: number;
}
```