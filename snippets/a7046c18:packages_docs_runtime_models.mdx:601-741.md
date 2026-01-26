# a7046c18:packages_docs_runtime_models.mdx:601-741

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/runtime/models.mdx:601-741
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        cost: 0
      });
    }
    
    const metrics = this.metrics.get(key);
    metrics.count++;
    metrics.totalDuration += duration;
    metrics.avgDuration = metrics.totalDuration / metrics.count;
    
    // Estimate tokens (simplified)
    if (type === ModelType.TEXT_LARGE) {
      const tokens = this.estimateTokens(params.prompt) + 
                     this.estimateTokens(result);
      metrics.totalTokens += tokens;
      metrics.cost += this.calculateCost(provider, type, tokens);
    }
    
    // Emit metrics event
    await this.runtime.emit(EventType.MODEL_USED, {
      runtime: this.runtime,
      modelType: type,
      provider,
      params,
      result,
      duration,
      metrics
    });
  }
}
```

## Error Handling

### Retry Logic

```typescript
async function modelCallWithRetry(
  runtime: IAgentRuntime,
  type: ModelType,
  params: any,
  maxRetries = 3
) {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await runtime.useModel(type, params);
    } catch (error) {
      lastError = error;
      
      // Check if retryable
      if (isRateLimitError(error)) {
        // Wait with exponential backoff
        const delay = Math.pow(2, i) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      // Non-retryable error
      throw error;
    }
  }
  
  throw lastError;
}
```

### Graceful Degradation

```typescript
// Fallback to simpler models on failure
async function modelCallWithFallback(
  runtime: IAgentRuntime,
  params: TextGenerationParams
) {
  const modelHierarchy = [
    ModelType.TEXT_LARGE,
    ModelType.TEXT_MEDIUM,
    ModelType.TEXT_SMALL
  ];
  
  for (const modelType of modelHierarchy) {
    try {
      return await runtime.useModel(modelType, params);
    } catch (error) {
      runtime.logger.warn(`Model ${modelType} failed, trying fallback`);
      
      if (modelType === ModelType.TEXT_SMALL) {
        // Last option failed
        throw error;
      }
    }
  }
}
```

## Best Practices

### Model Selection

- **Right-Size Models**: Use appropriate model size for task complexity
- **Cost Awareness**: Consider cost when selecting providers
- **Latency Requirements**: Use local models for low-latency needs
- **Fallback Strategy**: Implement fallbacks for reliability
- **Caching**: Cache responses for repeated queries

### Performance

- **Batch Processing**: Batch multiple requests when possible
- **Streaming**: Use streaming for long responses
- **Timeout Handling**: Set appropriate timeouts
- **Connection Pooling**: Reuse HTTP connections
- **Rate Limiting**: Respect provider rate limits

### Monitoring

- **Track Usage**: Monitor token usage and costs
- **Error Rates**: Track provider error rates
- **Latency Metrics**: Monitor response times
- **Quality Metrics**: Track response quality
- **Cost Analysis**: Analyze cost per request

## See Also

<CardGroup cols={2}>
  <Card title="Services" icon="server" href="/runtime/services">
    Build services that provide models
  </Card>
  
  <Card title="Messaging" icon="message" href="/runtime/messaging">
    Stream model responses in real-time
  </Card>
  
  <Card title="Sessions API" icon="comments" href="/runtime/sessions-api">
    Use models in conversations
  </Card>
  
  <Card title="Providers" icon="database" href="/runtime/providers">
    Supply context to models
  </Card>
</CardGroup>
```