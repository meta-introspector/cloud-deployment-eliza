# a7046c18:packages_core_typescript_src_types_model.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/types/model.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

  // TEXT_COMPLETION specific settings
  TEXT_COMPLETION_MAX_TOKENS: "TEXT_COMPLETION_MAX_TOKENS",
  TEXT_COMPLETION_TEMPERATURE: "TEXT_COMPLETION_TEMPERATURE",
  TEXT_COMPLETION_TOP_P: "TEXT_COMPLETION_TOP_P",
  TEXT_COMPLETION_TOP_K: "TEXT_COMPLETION_TOP_K",
  TEXT_COMPLETION_MIN_P: "TEXT_COMPLETION_MIN_P",
  TEXT_COMPLETION_SEED: "TEXT_COMPLETION_SEED",
  TEXT_COMPLETION_REPETITION_PENALTY: "TEXT_COMPLETION_REPETITION_PENALTY",
  TEXT_COMPLETION_FREQUENCY_PENALTY: "TEXT_COMPLETION_FREQUENCY_PENALTY",
  TEXT_COMPLETION_PRESENCE_PENALTY: "TEXT_COMPLETION_PRESENCE_PENALTY",
  // Legacy keys for backwards compatibility (will be treated as defaults)
  MODEL_MAX_TOKEN: "MODEL_MAX_TOKEN",
  MODEL_TEMPERATURE: "MODEL_TEMPERATURE",
  MODEL_FREQ_PENALTY: "MODEL_FREQ_PENALTY",
  MODEL_PRESENCE_PENALTY: "MODEL_PRESENCE_PENALTY",
} as const;

/**
 * Parameters for generating text using a language model.
 * This structure is typically passed to `AgentRuntime.useModel` when the `modelType` is one of
 * `ModelType.TEXT_SMALL`, `ModelType.TEXT_LARGE`, `ModelType.TEXT_REASONING_SMALL`,
 * `ModelType.TEXT_REASONING_LARGE`, or `ModelType.TEXT_COMPLETION`.
 * It includes essential information like the prompt and various generation controls.
 *
 * **Note for Plugin Implementers**: Different LLM providers have varying support for these parameters.
 * Some providers may not support both `temperature` and `topP` simultaneously, or may have other restrictions.
 * Plugin implementations should filter out unsupported parameters before calling their provider's API.
 * Check your provider's documentation to determine which parameters are supported.
 */
export type GenerateTextParams = {
  /** The input string or prompt that the language model will use to generate text. */
  prompt: string;
  /** Optional. The maximum number of tokens to generate in the response. */
  maxTokens?: number;
  /** Optional. The minimum number of tokens to generate in the response. */
  minTokens?: number;
  /** Optional. Controls randomness (0.0-1.0). Lower values are more deterministic, higher are more creative. */
  temperature?: number;
  /** Optional. Nucleus sampling parameter (0.0-1.0). Controls diversity via nucleus sampling.
   * Note: Some providers may not support both `temperature` and `topP` simultaneously.
   * Plugin implementations should filter based on provider capabilities. */
  topP?: number;
  /** Optional. Limits the number of highest-probability tokens considered at each step.
   * Common in Ollama, vLLM, and other local model providers. Alternative/complement to topP. */
  topK?: number;
  /** Optional. Minimum probability threshold (0.0-1.0). Discards tokens with probability below this threshold.
   * Common in node-llama-cpp. Can improve output quality when using higher temperatures by filtering low-probability tokens. */
  minP?: number;
  /** Optional. Random seed for reproducible outputs. Useful for testing and debugging. */
  seed?: number;
  /** Optional. Repetition penalty (1.0 = no penalty, >1.0 reduces repetition).
   * Common in Ollama, vLLM, and some Hugging Face models. */
  repetitionPenalty?: number;
  /** Optional. Penalizes new tokens based on their existing frequency in the text so far. */
  frequencyPenalty?: number;
  /** Optional. Penalizes new tokens based on whether they appear in the text so far. */
  presencePenalty?: number;
  /** Optional. A list of sequences at which the model will stop generating further tokens. */
  stopSequences?: string[];
  /** Optional. User identifier for tracking and analytics purposes.
   *
   * This parameter is used by LLM providers (e.g., OpenAI) to track and monitor API usage per user.
   * It helps providers identify abuse patterns, implement rate limiting, and provide usage analytics.
   *
   * Behavior:
   * - If not provided (undefined), will automatically default to the agent's character name
   * - If explicitly set to empty string (""), it will be preserved (not overridden)
   * - If explicitly set to null, it will be preserved (not overridden)
   *
   * Examples:
   * - `user: "alice"` - Tracks requests from user "alice"
   * - `user: ""` - Explicitly sends empty user identifier
   * - `user: undefined` - Auto-populates with character name (e.g., "MyAgent")
   *
   * Note: Plugin implementations should pass this parameter to their provider's API when supported.
   */
  user?: string | null;
  /** Optional. Response format specification. Forces the model to return a specific format (e.g., JSON).
   * Common formats: 'json_object' (OpenAI), 'text'. Plugin implementations should map this to provider-specific formats. */
  responseFormat?: { type: "json_object" | "text" } | string;
  /**
   * Enable or disable streaming mode.
   * - `true`: Force streaming (requires onStreamChunk or context)
   * - `false`: Force non-streaming even if callback exists
   * - `undefined`: Auto (streams if onStreamChunk or context exists)
   */
  stream?: boolean;
  /**
   * Optional. Callback function for receiving streaming chunks.
   * When provided, streaming is automatically enabled and chunks are sent to this callback.
   *
   * @example
   * ```typescript
   * const text = await runtime.useModel(ModelType.TEXT_LARGE, {
   *   prompt: "Hello",
   *   onStreamChunk: (chunk) => process.stdout.write(chunk)
   * });
   * ```
   */
  onStreamChunk?: (chunk: string, messageId?: string) => void | Promise<void>;
};

/**
 * Token usage information from a model response.
 * Provides metrics about token consumption for billing and monitoring.
 */
export interface TokenUsage {
  /** Number of tokens in the input prompt */
  promptTokens: number;
  /** Number of tokens in the generated response */
  completionTokens: number;
  /** Total tokens used (promptTokens + completionTokens) */
  totalTokens: number;
}

/**
 * Represents a single chunk in a text stream.
 * Each chunk contains a piece of the generated text.
 */
export interface TextStreamChunk {
  /** The text content of this chunk */
  text: string;
  /** Whether this is the final chunk in the stream */
  done: boolean;
}

/**
 * Result of a streaming text generation request.
 * Provides an async iterable for consuming text chunks as they arrive.
 *
 * @example
 * ```typescript
 * const result = await runtime.useModel(ModelType.TEXT_LARGE, {
 *   prompt: "Hello",
 *   stream: true
 * }) as TextStreamResult;
 *
 * let fullText = '';
 * for await (const chunk of result.textStream) {
 *   fullText += chunk;
 *   console.log('Received:', chunk);
 * }
 *
 * // After stream completes
 * const usage = await result.usage;
 * console.log('Total tokens:', usage.totalTokens);
 * ```
 */
export interface TextStreamResult {
```