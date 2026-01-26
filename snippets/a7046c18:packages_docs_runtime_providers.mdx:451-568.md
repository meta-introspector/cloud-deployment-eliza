# a7046c18:packages_docs_runtime_providers.mdx:451-568

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/runtime/providers.mdx:451-568
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  get: async (runtime, message) => {
    const state = await runtime.composeState(message, ['B']);
    // Uses B's data
  }
};

const providerB: Provider = {
  get: async (runtime, message) => {
    const state = await runtime.composeState(message, ['A']);
    // Uses A's data - CIRCULAR!
  }
};

// GOOD: Use position and state parameter
const providerA: Provider = {
  position: 100,
  get: async (runtime, message) => {
    // Generate data independently
    return { data: { aData: 'value' } };
  }
};

const providerB: Provider = {
  position: 200,
  get: async (runtime, message, state) => {
    // Access A's data from state
    const aData = state?.data?.providers?.A?.data;
    return { data: { bData: processData(aData) } };
  }
};
```

### Memory Leaks

Prevent memory leaks with proper cache management:

```typescript
class BoundedCache extends Map {
  private maxSize: number;
  
  constructor(maxSize: number = 1000) {
    super();
    this.maxSize = maxSize;
  }
  
  set(key: string, value: any) {
    if (this.size >= this.maxSize) {
      const firstKey = this.keys().next().value;
      this.delete(firstKey);
    }
    return super.set(key, value);
  }
}
```

### Debugging State Composition

```typescript
// Debug helper to trace provider execution
async function debugComposeState(runtime: IAgentRuntime, message: Memory, includeList?: string[]) {
  console.log('=== State Composition Debug ===');
  console.log('Message ID:', message.id);
  console.log('Include List:', includeList || 'default');

  // Monkey patch provider execution
  const originalProviders = runtime.providers;
  runtime.providers = runtime.providers.map((provider) => ({
    ...provider,
    get: async (...args) => {
      const start = Date.now();
      console.log(`[${provider.name}] Starting...`);

      try {
        const result = await provider.get(...args);
        const duration = Date.now() - start;
        console.log(`[${provider.name}] Completed in ${duration}ms`);
        console.log(`[${provider.name}] Data size:`, JSON.stringify(result).length);
        return result;
      } catch (error) {
        console.error(`[${provider.name}] Error:`, error);
        throw error;
      }
    },
  }));

  const state = await runtime.composeState(message, includeList);

  // Restore original providers
  runtime.providers = originalProviders;

  console.log('=== Final State Summary ===');
  console.log('Total providers run:', Object.keys(state.data.providers || {}).length);
  console.log('State text length:', state.text.length);
  console.log('===============================');

  return state;
}
```

## See Also

<CardGroup cols={2}>
  <Card title="Models" icon="robot" href="/runtime/models">
    Learn how models use provider context
  </Card>
  
  <Card title="Services" icon="server" href="/runtime/services">
    Build services that use providers
  </Card>
  
  <Card title="Messaging" icon="message" href="/runtime/messaging">
    Real-time provider updates
  </Card>
  
  <Card title="Sessions API" icon="comments" href="/runtime/sessions-api">
    See providers in conversational context
  </Card>
</CardGroup>
```