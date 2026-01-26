# a7046c18:packages_docs_runtime_models.mdx:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/runtime/models.mdx:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  
  register(runtime: IAgentRuntime) {
    runtime.registerModel(
      ModelType.TEXT_LARGE,
      this.handleTextGeneration.bind(this),
      'openai',
      100
    );
    
    runtime.registerModel(
      ModelType.TEXT_EMBEDDING,
      this.handleEmbedding.bind(this),
      'openai',
      100
    );
  }
}
```

### Anthropic Provider

```typescript
class AnthropicModelProvider {
  private client: Anthropic;
  
  constructor(runtime: IAgentRuntime) {
    const apiKey = runtime.getSetting('ANTHROPIC_API_KEY');
    this.client = new Anthropic({ apiKey });
  }
  
  async handleTextGeneration(params: TextGenerationParams) {
    const response = await this.client.messages.create({
      model: params.model || 'claude-3-opus-20240229',
      messages: params.messages || [
        { role: 'user', content: params.prompt }
      ],
      max_tokens: params.maxTokens || 1000,
      temperature: params.temperature,
      system: params.systemPrompt
    });
    
    return response.content[0].text;
  }
  
  register(runtime: IAgentRuntime) {
    runtime.registerModel(
      ModelType.TEXT_LARGE,
      this.handleTextGeneration.bind(this),
      'anthropic',
      95 // Slightly lower priority than OpenAI
    );
  }
}
```

### Local Model Provider (Ollama)

```typescript
class OllamaModelProvider {
  private baseUrl: string;
  
  constructor(runtime: IAgentRuntime) {
    this.baseUrl = runtime.getSetting('OLLAMA_BASE_URL') || 'http://localhost:11434';
  }
  
  async handleTextGeneration(params: TextGenerationParams) {
    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: params.model || 'llama2',
        prompt: params.prompt,
        temperature: params.temperature,
        options: {
          num_predict: params.maxTokens,
          top_p: params.topP,
          stop: params.stopSequences
        }
      })
    });
    
    const data = await response.json();
    return data.response;
  }
  
  async handleEmbedding(params: EmbeddingParams) {
    const response = await fetch(`${this.baseUrl}/api/embeddings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: params.model || 'all-minilm',
        prompt: params.input
      })
    });
    
    const data = await response.json();
    return data.embedding;
  }
  
  register(runtime: IAgentRuntime) {
    // Lower priority for local models
    runtime.registerModel(
      ModelType.TEXT_LARGE,
      this.handleTextGeneration.bind(this),
      'ollama',
      50
    );
    
    runtime.registerModel(
      ModelType.TEXT_EMBEDDING,
      this.handleEmbedding.bind(this),
      'ollama',
      50
    );
  }
}
```

## Model Selection Strategy

### Automatic Selection

```typescript
// Runtime automatically selects best available provider
const response = await runtime.useModel(
  ModelType.TEXT_LARGE,
  { prompt: "Hello" }
);

// Selection order:
// 1. Check if preferred provider specified
// 2. Sort available providers by priority
// 3. Try each provider until success
// 4. Cache successful provider for session
```

### Context-Based Selection

```typescript
// Select model based on context
async function selectModelForTask(runtime: IAgentRuntime, task: string) {
  const complexity = analyzeComplexity(task);
  
  if (complexity < 0.3) {
    // Simple task - use small model
    return runtime.useModel(ModelType.TEXT_SMALL, {
      prompt: task,
      temperature: 0.3
    });
  } else if (complexity < 0.7) {
```