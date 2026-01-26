# a7046c18:packages_docs_plugin-registry_bootstrap_complete-documentation.mdx:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/bootstrap/complete-documentation.mdx:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

16. **ACTION_STATE** (`actionState.ts`)

    - Current action execution state
    - Previous action results
    - Action chain context

17. **FACTS** (`facts.ts`)

    - Stored knowledge and learned facts
    - Contextual information
    - Agent memory facts

### Evaluators

Evaluators perform post-interaction cognitive processing:

#### REFLECTION Evaluator (`reflection.ts`)

The reflection evaluator:

1. **Analyzes conversation quality**
2. **Extracts new facts**
3. **Identifies relationships**
4. **Updates knowledge base**

```typescript
{
  "thought": "Self-reflective analysis of interaction",
  "facts": [
    {
      "claim": "Factual statement learned",
      "type": "fact|opinion|status",
      "in_bio": false,
      "already_known": false
    }
  ],
  "relationships": [
    {
      "sourceEntityId": "initiator_id",
      "targetEntityId": "target_id",
      "tags": ["interaction_type", "context"]
    }
  ]
}
```

### Services

#### TaskService (`task.ts`)

Manages scheduled and background tasks:

```typescript
class TaskService extends Service {
  // Executes tasks based on:
  // - Schedule (repeating tasks)
  // - Queue (one-time tasks)
  // - Validation rules
  // - Worker availability
}
```

Task features:

- **Repeating tasks**: Execute at intervals
- **One-time tasks**: Execute once and delete
- **Immediate tasks**: Execute on creation
- **Validated tasks**: Conditional execution

## Detailed Component Documentation

### Message Handler Deep Dive

#### 1. Attachment Processing

```typescript
export async function processAttachments(
  attachments: Media[],
  runtime: IAgentRuntime
): Promise<Media[]> {
  // For images: Generate descriptions using vision models
  // For documents: Extract text content
  // For other media: Process as configured
}
```

#### 2. Should Bypass Logic

```typescript
export function shouldBypassShouldRespond(
  runtime: IAgentRuntime,
  room?: Room,
  source?: string
): boolean {
  // DMs always bypass shouldRespond check
  // Voice DMs bypass
  // API calls bypass
  // Configurable via SHOULD_RESPOND_BYPASS_TYPES
}
```

#### 3. Response ID Management

```typescript
// Prevents duplicate responses when multiple messages arrive quickly
const latestResponseIds = new Map<string, Map<string, string>>();
// Only process if this is still the latest response for the room
```

### Action Handler Pattern

All actions follow this structure:

```typescript
export const actionName = {
  name: 'ACTION_NAME',
  similes: ['ALTERNATIVE_NAME', 'SYNONYM'],
  description: 'What this action does',
  validate: async (runtime: IAgentRuntime) => boolean,
  handler: async (
    runtime: IAgentRuntime,
    message: Memory,
    state: State,
    options: any,
    callback: HandlerCallback,
    responses?: Memory[]
  ) => boolean,
  examples: ActionExample[][]
}
```

### Provider Pattern

Providers follow this structure:

```typescript
export const providerName: Provider = {
  name: 'PROVIDER_NAME',
  description: 'What context this provides',
  position: 100, // Order priority
  get: async (runtime: IAgentRuntime, message: Memory) => {
    return {
      data: {}, // Raw data
      values: {}, // Processed values
      text: '', // Formatted text for prompt
    };
  },
};
```
```