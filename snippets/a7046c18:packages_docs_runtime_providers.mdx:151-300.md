# a7046c18:packages_docs_runtime_providers.mdx:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/runtime/providers.mdx:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

```typescript
{
  values: {
    recentMessages: "User: Hello\nAlice: Hi there!",
    recentInteractions: "..."
  },
  data: {
    recentMessages: [...],
    actionResults: [...]
  },
  text: "# Conversation Messages\n..."
}
```

#### Facts Provider (`FACTS`)

Retrieves contextually relevant stored facts.

- **Dynamic**: Yes (must be explicitly included)
- **Behavior**: Uses embedding search to find relevant facts
- **Data Provided**:
  - Relevant facts based on context
  - Fact metadata and sources

#### Relationships Provider (`RELATIONSHIPS`)

Social graph and interaction history.

- **Dynamic**: Yes (must be explicitly included)
- **Data Provided**:
  - Known entities and their relationships
  - Interaction frequency
  - Relationship metadata

## State Composition

The `composeState` method aggregates data from multiple providers to create comprehensive state.

### Method Signature

```typescript
async composeState(
    message: Memory,
    includeList: string[] | null = null,
    onlyInclude = false,
    skipCache = false
): Promise<State>
```

### Parameters

- **message**: The current message/memory object being processed
- **includeList**: Array of provider names to include (optional)
- **onlyInclude**: If true, ONLY include providers from includeList
- **skipCache**: If true, bypass cache and fetch fresh data

### Composition Process

1. **Provider Selection**: Determines which providers to run based on filters
2. **Parallel Execution**: Runs all selected providers concurrently
3. **Result Aggregation**: Combines results from all providers
4. **Caching**: Stores the composed state for reuse

### Usage Patterns

```typescript
// Default state (all non-dynamic, non-private providers)
const state = await runtime.composeState(message);

// Include specific dynamic providers
const state = await runtime.composeState(message, ['FACTS', 'ENTITIES']);

// Only specific providers
const state = await runtime.composeState(message, ['CHARACTER'], true);

// Force fresh data (skip cache)
const state = await runtime.composeState(message, null, false, true);
```

## Provider Registration

### Registering a Provider

```typescript
runtime.registerProvider(provider);
```

Providers are registered during plugin initialization:

```typescript
const myPlugin: Plugin = {
  name: 'my-plugin',
  providers: [customProvider],
  
  init: async (config, runtime) => {
    // Providers auto-registered
  }
};
```

### Provider Position

Position determines execution order:

```typescript
const earlyProvider: Provider = {
  name: 'EARLY',
  position: -100,  // Runs very early
  get: async () => {...}
};

const lateProvider: Provider = {
  name: 'LATE',
  position: 200,   // Runs late
  get: async () => {...}
};
```

## Custom Providers

### Creating a Custom Provider

```typescript
const customDataProvider: Provider = {
  name: 'CUSTOM_DATA',
  description: 'Custom data from external source',
  dynamic: true,
  position: 150,
  
  get: async (runtime, message, state) => {
    try {
      // Fetch data from service or database
      const customData = await runtime.getService('customService')?.getData();
      
      if (!customData) {
        return { values: {}, data: {}, text: '' };
      }
      
      return {
        values: { customData: customData.summary },
        data: { customData },
        text: `Custom data: ${customData.summary}`,
      };
    } catch (error) {
      runtime.logger.error('Error in custom provider:', error);
      return { values: {}, data: {}, text: '' };
    }
  },
};
```