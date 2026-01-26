# a7046c18:packages_docs_plugin-registry_bootstrap_message-flow.mdx:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/bootstrap/message-flow.mdx:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  // Plus any configured in environment
  return bypassTypes.includes(room.type) || bypassSources.includes(source);
}
```

#### LLM Evaluation

```typescript
if (!shouldBypassShouldRespond) {
  const state = await runtime.composeState(message, [
    'ANXIETY',
    'SHOULD_RESPOND',
    'ENTITIES',
    'CHARACTER',
    'RECENT_MESSAGES',
    'ACTIONS',
  ]);

  const prompt = composePromptFromState({
    state,
    template: shouldRespondTemplate,
  });

  const response = await runtime.useModel(ModelType.TEXT_SMALL, { prompt });
  const parsed = parseKeyValueXml(response);

  shouldRespond = parsed?.action && !['IGNORE', 'NONE'].includes(parsed.action.toUpperCase());
}
```

### 9. Response Generation

#### State Composition with Providers

```typescript
state = await runtime.composeState(message, ['ACTIONS']);

// Each provider adds context:
// - RECENT_MESSAGES: Conversation history
// - CHARACTER: Personality traits
// - ENTITIES: User information
// - TIME: Temporal context
// - RELATIONSHIPS: Social connections
// - WORLD: Environment details
// - etc.
```

#### LLM Response

```typescript
const prompt = composePromptFromState({
  state,
  template: messageHandlerTemplate,
});

let response = await runtime.useModel(ModelType.TEXT_LARGE, { prompt });

// Expected XML format:
/*
<thought>Agent's internal reasoning</thought>
<actions>REPLY,FOLLOW_ROOM</actions>
<providers>TECHNICAL_DOCS,FAQ</providers>
<text>The actual response text</text>
<simple>false</simple>
*/
```

### 10. Response Validation

```typescript
// Retry logic for missing fields
while (retries < 3 && (!responseContent?.thought || !responseContent?.actions)) {
  // Regenerate response
  retries++;
}

// Check if still the latest response
if (latestResponseIds.get(runtime.agentId).get(message.roomId) !== responseId) {
  return; // Newer message is being processed
}
```

### 11. Action Processing

#### Simple Response

```typescript
// Simple = REPLY action only, no providers
if (responseContent.simple && responseContent.text) {
  await callback(responseContent);
}
```

#### Complex Response

```typescript
// Multiple actions or providers
await runtime.processActions(message, responseMessages, state, callback);
```

### 12. Evaluator Execution

#### Reflection Evaluator

```typescript
// Runs after response generation
await runtime.evaluate(message, state, shouldRespond, callback, responseMessages);

// Reflection evaluator:
// 1. Analyzes conversation quality
// 2. Extracts new facts
// 3. Updates relationships
// 4. Self-reflects on performance
```

## Key Decision Points

### 1. Should Respond Decision Tree

```text
Is DM? → YES → Respond
Is Voice DM? → YES → Respond
Is API Call? → YES → Respond
Is Muted + Name Mentioned? → YES → Respond
Is Muted? → NO → Ignore
Run shouldRespond LLM →
  - Action = REPLY/etc → Respond
  - Action = IGNORE/NONE → Ignore
```

### 2. Response Type Decision

```text
Actions = [REPLY] only AND Providers = [] → Simple Response
Otherwise → Complex Response with Action Processing
```

### 3. Evaluator Trigger Conditions

```text
Message Count > ConversationLength / 4 → Run Reflection
New Interaction → Update Relationships
Facts Mentioned → Extract and Store
```

## Performance Optimizations

### 1. Response ID Tracking

- Prevents duplicate responses when multiple messages arrive quickly
```