# a7046c18:packages_docs_runtime_models.mdx:451-600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/runtime/models.mdx:451-600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    // Medium complexity - use medium model
    return runtime.useModel(ModelType.TEXT_MEDIUM, {
      prompt: task,
      temperature: 0.5
    });
  } else {
    // Complex task - use large model
    return runtime.useModel(ModelType.TEXT_LARGE, {
      prompt: task,
      temperature: 0.7,
      maxTokens: 2000
    });
  }
}
```

### Cost Optimization

```typescript
// Track and optimize model usage costs
class CostOptimizedModelRouter {
  private costs = {
    'openai': { [ModelType.TEXT_LARGE]: 0.03, [ModelType.TEXT_EMBEDDING]: 0.0001 },
    'anthropic': { [ModelType.TEXT_LARGE]: 0.025 },
    'ollama': { [ModelType.TEXT_LARGE]: 0, [ModelType.TEXT_EMBEDDING]: 0 }
  };
  
  async useModel(type: ModelType, params: any, maxCost?: number) {
    const providers = this.getProvidersByCost(type, maxCost);
    
    for (const provider of providers) {
      try {
        const result = await provider.handler(this.runtime, params);
        
        // Track usage
        this.trackUsage(provider.name, type, params);
        
        return result;
      } catch (error) {
        continue;
      }
    }
  }
  
  private getProvidersByCost(type: ModelType, maxCost?: number) {
    return this.providers
      .filter(p => {
        const cost = this.costs[p.name]?.[type] || Infinity;
        return !maxCost || cost <= maxCost;
      })
      .sort((a, b) => {
        const costA = this.costs[a.name]?.[type] || Infinity;
        const costB = this.costs[b.name]?.[type] || Infinity;
        return costA - costB;
      });
  }
}
```

## Model Caching

### Response Caching

```typescript
class ModelCache {
  private cache = new Map<string, { result: any; timestamp: number }>();
  private ttl = 60 * 60 * 1000; // 1 hour
  
  getCacheKey(type: ModelType, params: any): string {
    return `${type}:${JSON.stringify(params)}`;
  }
  
  get(type: ModelType, params: any): any | null {
    const key = this.getCacheKey(type, params);
    const cached = this.cache.get(key);
    
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.result;
  }
  
  set(type: ModelType, params: any, result: any) {
    const key = this.getCacheKey(type, params);
    this.cache.set(key, {
      result,
      timestamp: Date.now()
    });
  }
}

// Use with runtime
const cache = new ModelCache();

async function cachedModelCall(runtime: IAgentRuntime, type: ModelType, params: any) {
  // Check cache
  const cached = cache.get(type, params);
  if (cached) return cached;
  
  // Make call
  const result = await runtime.useModel(type, params);
  
  // Cache result
  cache.set(type, params, result);
  
  return result;
}
```

## Model Monitoring

### Usage Tracking

```typescript
interface ModelUsageMetrics {
  provider: string;
  modelType: ModelType;
  count: number;
  totalTokens: number;
  totalDuration: number;
  avgDuration: number;
  errors: number;
  cost: number;
}

class ModelMonitor {
  private metrics = new Map<string, ModelUsageMetrics>();
  
  async trackUsage(
    provider: string,
    type: ModelType,
    params: any,
    result: any,
    duration: number
  ) {
    const key = `${provider}:${type}`;
    
    if (!this.metrics.has(key)) {
      this.metrics.set(key, {
        provider,
        modelType: type,
        count: 0,
        totalTokens: 0,
        totalDuration: 0,
        avgDuration: 0,
        errors: 0,
```