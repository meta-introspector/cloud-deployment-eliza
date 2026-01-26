# a7046c18:packages_docs_plugin-registry_bootstrap_complete-documentation.mdx:601-750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/bootstrap/complete-documentation.mdx:601-750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
### Advanced Template Techniques

#### Conditional Logic

```typescript
messageHandlerTemplate: `{{providers}}

<conditions>
{{#if isNewUser}}
Provide extra guidance and explanations
{{/if}}

{{#if hasAttachments}}
Analyze the attached media carefully
{{/if}}
</conditions>

<response>
  <thought>Context-aware thinking</thought>
  <actions>REPLY</actions>
  <text>Adaptive response</text>
</response>`;
```

#### Custom Provider Integration

```typescript
messageHandlerTemplate: `<context>
{{providers.CUSTOM_CONTEXT}}
{{providers.USER_HISTORY}}
</context>

Generate response considering the custom context above...`;
```

## Understanding the Callback Mechanism

### What is the Callback?

The callback is a function passed to every action handler that **sends the response back to the user**. When you call the callback, you're telling the system "here's what to send back".

### Callback Flow

```typescript
// In an action handler
async handler(runtime, message, state, options, callback) {
  // 1. Process the request
  const result = await doSomething();

  // 2. Call callback to send response
  await callback({
    text: "Here's your response",      // The message to send
    actions: ['ACTION_NAME'],          // Actions taken
    thought: 'Internal reasoning',     // Agent's thought process
    attachments: [],                   // Optional media
    metadata: {}                       // Optional metadata
  });

  // 3. Return success
  return true;
}
```

### Important Callback Concepts

1. **Calling callback = Sending a message**: When you invoke `callback()`, the message is sent to the user
2. **Multiple callbacks = Multiple messages**: You can call callback multiple times to send multiple messages
3. **No callback = No response**: If you don't call callback, no message is sent
4. **Async operation**: Always await the callback for proper error handling

### Callback Examples

#### Simple Response

```typescript
await callback({
  text: 'Hello! How can I help?',
  actions: ['REPLY'],
});
```

#### Response with Attachments

```typescript
await callback({
  text: "Here's the image you requested",
  actions: ['GENERATE_IMAGE'],
  attachments: [
    {
      url: 'https://example.com/image.png',
      contentType: 'image/png',
    },
  ],
});
```

#### Multi-Message Response

```typescript
// First message
await callback({
  text: 'Let me check that for you...',
  actions: ['ACKNOWLEDGE'],
});

// Do some processing
const result = await fetchData();

// Second message with results
await callback({
  text: `Here's what I found: ${result}`,
  actions: ['REPLY'],
});
```

#### Conditional Response

```typescript
if (error) {
  await callback({
    text: 'Sorry, I encountered an error',
    actions: ['ERROR'],
    metadata: { error: error.message },
  });
} else {
  await callback({
    text: 'Successfully completed!',
    actions: ['SUCCESS'],
  });
}
```

### Callback Best Practices

1. **Always call callback**: Even for errors, call callback to inform the user
2. **Be descriptive**: Include clear text explaining what happened
3. **Use appropriate actions**: Tag responses with the correct action names
4. **Include thought**: Help with debugging by including agent reasoning
5. **Handle errors gracefully**: Provide user-friendly error messages

## Integration Guide

### 1. Basic Integration

```typescript
import { Project, ProjectAgent, Character } from '@elizaos/core';

// Define your character with bootstrap plugin
const character: Character = {
  name: 'MyAgent',
```