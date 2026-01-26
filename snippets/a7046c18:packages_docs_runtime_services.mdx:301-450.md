# a7046c18:packages_docs_runtime_services.mdx:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/runtime/services.mdx:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    const results = await this.searchClient.search(query);
    
    // Cache results
    this.cache.set(query, {
      results,
      timestamp: Date.now()
    });
    
    return results;
  }
  
  private clearOldCache() {
    const oneHourAgo = Date.now() - 3600000;
    for (const [key, value] of this.cache.entries()) {
      if (value.timestamp < oneHourAgo) {
        this.cache.delete(key);
      }
    }
  }
  
  async stop() {
    this.cache.clear();
    await this.searchClient?.close();
  }
}
```

### Model Provider Service

Services that provide AI model access:

```typescript
class OpenAIService extends Service {
  static serviceType = 'openai' as const;
  capabilityDescription = 'OpenAI model provider';
  
  private client: OpenAI;
  
  static async start(runtime: IAgentRuntime): Promise<Service> {
    const service = new OpenAIService(runtime);
    await service.initialize();
    return service;
  }
  
  private async initialize() {
    const apiKey = this.runtime.getSetting('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }
    
    this.client = new OpenAI({ apiKey });
    
    // Register model handlers
    this.runtime.registerModel(
      ModelType.TEXT_LARGE,
      this.handleTextGeneration.bind(this),
      'openai',
      100 // priority
    );
    
    this.runtime.registerModel(
      ModelType.TEXT_EMBEDDING,
      this.handleEmbedding.bind(this),
      'openai',
      100
    );
  }
  
  private async handleTextGeneration(params: GenerateTextParams) {
    const response = await this.client.chat.completions.create({
      model: params.model || 'gpt-4',
      messages: params.messages,
      temperature: params.temperature,
      max_tokens: params.maxTokens
    });
    
    return response.choices[0].message;
  }
  
  private async handleEmbedding(params: EmbedParams) {
    const response = await this.client.embeddings.create({
      model: 'text-embedding-3-small',
      input: params.input
    });
    
    return response.data[0].embedding;
  }
  
  async stop() {
    // Cleanup if needed
  }
}
```

## Service Registration

### Plugin Registration

Services are registered during plugin initialization:

```typescript
export const discordPlugin: Plugin = {
  name: 'discord',
  services: [DiscordService],
  
  init: async (config, runtime) => {
    // Services auto-registered and started
  }
};
```

### Manual Registration

Services can also be registered manually:

```typescript
await runtime.registerService(CustomService);
```

## Service Management

### Getting Services

Access services through the runtime:

```typescript
// Get service by type
const discord = runtime.getService('discord');

// Type-safe service access
const searchService = runtime.getService<SearchService>('search');
const results = await searchService.search('elizaOS');
```

### Service Communication

Services can interact with each other:

```typescript
class NotificationService extends Service {
  static serviceType = 'notification' as const;
  capabilityDescription = 'Cross-platform notifications';
  
  async notify(message: string) {
    // Get Discord service
    const discord = this.runtime.getService('discord');
    if (discord) {
      await discord.sendMessage(channelId, message);
    }
    
```