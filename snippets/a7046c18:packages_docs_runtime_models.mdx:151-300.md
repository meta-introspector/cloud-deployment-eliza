# a7046c18:packages_docs_runtime_models.mdx:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/runtime/models.mdx:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  type: ModelTypeName;
  handler: ModelHandler;
  provider: string;
  priority: number;
}
```

## Using Models

### Type-Safe Model Usage

```typescript
// Text generation
const response = await runtime.useModel(
  ModelType.TEXT_LARGE,
  {
    prompt: "Explain quantum computing",
    temperature: 0.7,
    maxTokens: 500
  }
);

// Get embeddings
const embedding = await runtime.useModel(
  ModelType.TEXT_EMBEDDING,
  { input: "Text to embed" }
);

// Generate image
const image = await runtime.useModel(
  ModelType.IMAGE_GENERATION,
  {
    prompt: "A sunset over mountains",
    width: 1024,
    height: 1024,
    steps: 50
  }
);

// Speech to text
const transcript = await runtime.useModel(
  ModelType.SPEECH_TO_TEXT,
  {
    audio: audioBuffer,
    language: 'en',
    format: 'json'
  }
);
```

### Specifying Provider

```typescript
// Use specific provider
const response = await runtime.useModel(
  ModelType.TEXT_LARGE,
  { prompt: "Hello" },
  'anthropic'  // Force specific provider
);

// Get available providers
const providers = runtime.getModelProviders(ModelType.TEXT_LARGE);
console.log('Available providers:', providers);
// ['openai', 'anthropic', 'ollama']
```

## Provider Priority

### Priority System

The runtime selects providers based on priority:

```typescript
// Higher priority providers are preferred
runtime.registerModel(ModelType.TEXT_LARGE, handlerA, 'provider-a', 100);
runtime.registerModel(ModelType.TEXT_LARGE, handlerB, 'provider-b', 90);
runtime.registerModel(ModelType.TEXT_LARGE, handlerC, 'provider-c', 80);

// Will use provider-a (priority 100)
await runtime.useModel(ModelType.TEXT_LARGE, params);
```

### Fallback Mechanism

```typescript
// Automatic fallback on failure
class ModelRouter {
  async useModel(type: ModelType, params: any, preferredProvider?: string) {
    const providers = this.getProvidersByPriority(type, preferredProvider);
    
    for (const provider of providers) {
      try {
        return await provider.handler(this.runtime, params);
      } catch (error) {
        this.logger.warn(`Provider ${provider.name} failed:`, error);
        
        // Try next provider
        if (provider !== providers[providers.length - 1]) {
          continue;
        }
        
        // All providers failed
        throw new Error(`No providers available for ${type}`);
      }
    }
  }
}
```

## Model Providers

### OpenAI Provider

```typescript
class OpenAIModelProvider {
  private client: OpenAI;
  
  constructor(runtime: IAgentRuntime) {
    const apiKey = runtime.getSetting('OPENAI_API_KEY');
    this.client = new OpenAI({ apiKey });
  }
  
  async handleTextGeneration(params: TextGenerationParams) {
    const response = await this.client.chat.completions.create({
      model: params.model || 'gpt-4',
      messages: params.messages || [
        { role: 'user', content: params.prompt }
      ],
      temperature: params.temperature,
      max_tokens: params.maxTokens,
      top_p: params.topP,
      frequency_penalty: params.frequencyPenalty,
      presence_penalty: params.presencePenalty,
      stop: params.stopSequences
    });
    
    return response.choices[0].message.content;
  }
  
  async handleEmbedding(params: EmbeddingParams) {
    const response = await this.client.embeddings.create({
      model: 'text-embedding-3-small',
      input: params.input,
      dimensions: params.dimensions
    });
    
    return Array.isArray(params.input)
      ? response.data.map(d => d.embedding)
      : response.data[0].embedding;
  }
```