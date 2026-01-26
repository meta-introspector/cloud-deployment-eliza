# 12812d74:packages_core_src_types_model.ts:301-450

**Commit:** 12812d7441573a7a81c2c5d2ea28a46bd10f3d0c
**Author:** standujar
**Date:** Tue Dec 16 01:47:14 2025 +0100
**File:** packages/core/src/types/model.ts:301-450
**Novelty Score:** 30.22
**Concepts:** event-driven, plugin-system, testing

```
  /**
   * Promise that resolves to the complete text after streaming finishes.
   * Useful when you need the full response after streaming.
   */
  text: Promise<string>;

  /**
   * Promise that resolves to token usage information after streaming completes.
   * May be undefined if the provider doesn't report usage for streaming.
   */
  usage: Promise<TokenUsage | undefined>;

  /**
   * Promise that resolves to the finish reason after streaming completes.
   * Common values: 'stop', 'length', 'content-filter'
   */
  finishReason: Promise<string | undefined>;
}

/**
 * Options for the simplified generateText API.
 * Extends GenerateTextParams with additional configuration for character context.
 */
export interface GenerateTextOptions extends Omit<GenerateTextParams, 'prompt'> {
  /**
   * Whether to include character personality in the prompt.
   */
  includeCharacter?: boolean;
  /**
   * The model type to use for text generation.
   */
  modelType?: TextGenerationModelType;
}

/**
 * Structured response from text generation.
 */
export interface GenerateTextResult {
  /** The generated text response from the model */
  text: string;
}

/**
 * Parameters for text tokenization models
 */
export interface TokenizeTextParams {
  /** The text to tokenize */
  prompt: string;
  /** The model type to use for tokenization */
  modelType: ModelTypeName;
}

/**
 * Parameters for detokenizing text, i.e., converting a sequence of numerical tokens back into a string.
 * This is the reverse operation of tokenization.
 * This structure is used with `AgentRuntime.useModel` when the `modelType` is `ModelType.TEXT_TOKENIZER_DECODE`.
 */
export interface DetokenizeTextParams {
  /** An array of numerical tokens to be converted back into text. */
  tokens: number[];
  /** The model type used for detokenization, ensuring consistency with the original tokenization. */
  modelType: ModelTypeName;
}

/**
 * Parameters for text embedding models
 */
export interface TextEmbeddingParams {
  /** The text to create embeddings for */
  text: string;
}

/**
 * Parameters for image generation models
 */
export interface ImageGenerationParams {
  /** The prompt describing the image to generate */
  prompt: string;
  /** The dimensions of the image to generate */
  size?: string;
  /** Number of images to generate */
  count?: number;
}

/**
 * Parameters for image description models
 */
export interface ImageDescriptionParams {
  /** The URL or path of the image to describe */
  imageUrl: string;
  /** Optional prompt to guide the description */
  prompt?: string;
}

/**
 * Parameters for transcription models
 */
export interface TranscriptionParams {
  /** The URL or path of the audio file to transcribe */
  audioUrl: string;
  /** Optional prompt to guide transcription */
  prompt?: string;
}

/**
 * Parameters for text-to-speech models
 */
export interface TextToSpeechParams {
  /** The text to convert to speech */
  text: string;
  /** The voice to use */
  voice?: string;
  /** The speaking speed */
  speed?: number;
}

/**
 * Parameters for audio processing models
 */
export interface AudioProcessingParams {
  /** The URL or path of the audio file to process */
  audioUrl: string;
  /** The type of audio processing to perform */
  processingType: string;
}

/**
 * Parameters for video processing models
 */
export interface VideoProcessingParams {
  /** The URL or path of the video file to process */
  videoUrl: string;
  /** The type of video processing to perform */
  processingType: string;
}

/**
 * Optional JSON schema for validating generated objects
 */
export type JSONSchema = {
  type: string;
  properties?: Record<string, JSONSchema | { type: string }>;
  required?: string[];
  items?: JSONSchema;
  [key: string]: unknown;
};

/**
 * Parameters for object generation models
 * @template T - The expected return type, inferred from schema if provided
```