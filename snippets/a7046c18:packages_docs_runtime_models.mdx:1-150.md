# a7046c18:packages_docs_runtime_models.mdx:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/runtime/models.mdx:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
---
title: "Model Management"
description: "One API for any AI model - OpenAI, Anthropic, Ollama, and more"
---

## Why a Model Layer?

Switching between OpenAI, Anthropic, or local models shouldn't require rewriting your agent. The model layer gives you:

- **One API** for all providers
- **Automatic fallback** when a provider fails
- **Streaming** with consistent callbacks
- **Type-safe** parameters per model type

```typescript
// Same code works with any provider
const response = await runtime.useModel(ModelType.TEXT_LARGE, {
  prompt: "Explain quantum computing",
  temperature: 0.7
});
```

<Tip>
**Provider is configured, not coded.** Set `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` - your code doesn't change.
</Tip>

## Model System

The model management system provides a unified interface for AI model access with automatic provider selection, priority-based routing, and type-safe parameters.

## Model Types

### Core Model Types

```typescript
enum ModelType {
  // Text generation models
  TEXT_SMALL = 'text:small',      // Fast, simple responses
  TEXT_MEDIUM = 'text:medium',    // Balanced performance
  TEXT_LARGE = 'text:large',      // Complex reasoning
  
  // Embedding models
  TEXT_EMBEDDING = 'text:embedding',
  
  // Image models
  IMAGE_GENERATION = 'image:generation',
  IMAGE_ANALYSIS = 'image:analysis',
  
  // Audio models
  SPEECH_TO_TEXT = 'speech:to:text',
  TEXT_TO_SPEECH = 'text:to:speech',
  
  // Specialized models
  CODE_GENERATION = 'code:generation',
  CLASSIFICATION = 'classification'
}
```

### Model Parameters

Type-safe parameters for each model type:

```typescript
// Text generation parameters
interface TextGenerationParams {
  prompt: string;
  messages?: Message[];
  temperature?: number;      // 0.0 - 2.0
  maxTokens?: number;
  topP?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stopSequences?: string[];
  systemPrompt?: string;
}

// Embedding parameters
interface EmbeddingParams {
  input: string | string[];
  model?: string;
  dimensions?: number;
}

// Image generation parameters
interface ImageGenerationParams {
  prompt: string;
  negativePrompt?: string;
  width?: number;
  height?: number;
  steps?: number;
  seed?: number;
  style?: string;
}

// Speech-to-text parameters
interface SpeechToTextParams {
  audio: Buffer | string;  // Audio data or URL
  language?: string;
  format?: 'json' | 'text' | 'srt';
  temperature?: number;
}
```

## Model Registration

### Registering Model Handlers

```typescript
// Register a model handler
runtime.registerModel(
  ModelType.TEXT_LARGE,
  async (runtime, params) => {
    // Model implementation
    const response = await callAPI(params);
    return response.text;
  },
  'openai',  // provider name
  100        // priority (higher = preferred)
);

// Register multiple models from a plugin
const modelPlugin: Plugin = {
  name: 'openai-models',
  
  models: [
    {
      type: ModelType.TEXT_LARGE,
      handler: handleTextGeneration,
      provider: 'openai',
      priority: 100
    },
    {
      type: ModelType.TEXT_EMBEDDING,
      handler: handleEmbedding,
      provider: 'openai',
      priority: 100
    }
  ]
};
```

### Model Handler Interface

```typescript
type ModelHandler<T = any, R = any> = (
  runtime: IAgentRuntime,
  params: T
) => Promise<R>;

interface ModelRegistration {
```