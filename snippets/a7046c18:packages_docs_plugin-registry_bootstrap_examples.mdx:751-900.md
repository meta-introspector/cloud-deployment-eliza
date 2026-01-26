# a7046c18:packages_docs_plugin-registry_bootstrap_examples.mdx:751-900

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/bootstrap/examples.mdx:751-900
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
2. **Use providers for context** - Don't query database in actions
3. **Chain actions thoughtfully** - Order matters
4. **Handle errors gracefully** - Users should get helpful messages
5. **Test with different scenarios** - DMs, groups, mentions
6. **Monitor evaluator output** - Learn from your bot's analysis
7. **Configure templates** - Match your bot's personality

## Debugging Tips

```typescript
// Enable debug logging
process.env.DEBUG = 'elizaos:*';

// Log action execution
const debugAction = {
  ...originalAction,
  handler: async (...args) => {
    console.log(`Executing ${debugAction.name}`, args[1].content);
    const result = await originalAction.handler(...args);
    console.log(`${debugAction.name} completed`, result);
    return result;
  },
};

// Monitor provider data
runtime.on('state:composed', (state) => {
  console.log(
    'State providers:',
    state.providerData.map((p) => p.providerName)
  );
});

// Track message flow
runtime.on(EventType.MESSAGE_RECEIVED, (payload) => {
  console.log(`Message flow: ${payload.message.entityId} -> ${payload.runtime.agentId}`);
});
```

These examples demonstrate the flexibility and power of the plugin-bootstrap system. Start with simple examples and gradually add complexity as needed!

### Understanding the Callback Mechanism

Every action handler receives a callback function that sends messages back to the user. Here's how it works:

```typescript
const explainAction: Action = {
  name: 'EXPLAIN',
  description: 'Explains a concept in detail',

  handler: async (runtime, message, state, options, callback) => {
    // Extract topic from message
    const topic = extractTopic(message.content.text);

    // First message - acknowledge the request
    await callback({
      text: `Let me explain ${topic} for you...`,
      actions: ['ACKNOWLEDGE'],
    });

    // Fetch explanation (simulating delay)
    const explanation = await fetchExplanation(topic);

    // Second message - deliver the explanation
    await callback({
      text: explanation,
      actions: ['EXPLAIN'],
      thought: `Explained ${topic} to the user`,
    });

    // Third message - offer follow-up
    await callback({
      text: 'Would you like me to explain anything else about this topic?',
      actions: ['FOLLOW_UP'],
    });

    return true;
  },
};
```

## Template Customization Examples

### Example 1: Gaming Bot with Custom Templates

```typescript
import { AgentRuntime, Character } from '@elizaos/core';
import { bootstrapPlugin } from '@elizaos/plugin-bootstrap';

const gamingBotCharacter: Character = {
  name: 'GameMaster',
  description: 'A gaming companion and guide',

  templates: {
    // Custom shouldRespond for gaming context
    shouldRespondTemplate: `<task>Decide if {{agentName}} should respond to gaming-related messages.</task>

{{providers}}

<gaming-rules>
- ALWAYS respond to: game questions, strategy requests, team coordination
- RESPOND to: patch notes discussion, build advice, gameplay tips
- IGNORE: off-topic chat, real-world discussions (unless directly asked)
- STOP if: asked to stop giving advice or to be quiet
</gaming-rules>

<output>
<response>
  <reasoning>Gaming context assessment</reasoning>
  <action>RESPOND | IGNORE | STOP</action>
</response>
</output>`,

    // Gaming-focused message handler
    messageHandlerTemplate: `<task>Generate gaming advice as {{agentName}}.</task>

{{providers}}
Available actions: {{actionNames}}

<gaming-personality>
- Use gaming terminology naturally
- Reference game mechanics when relevant
- Be encouraging to new players
- Share pro tips for experienced players
- React enthusiastically to achievements
</gaming-personality>

<communication-style>
- Short, punchy responses for in-game chat
- Detailed explanations for strategy questions
- Use gaming emotes and expressions
- Reference popular gaming memes appropriately
</communication-style>

<output>
<response>
  <thought>Gaming situation analysis</thought>
  <actions>REPLY</actions>
  <providers>GAME_STATE,PLAYER_STATS</providers>
  <text>Your gaming response</text>
</response>
</output>`,

    // Gaming-specific reflection
    reflectionTemplate: `<task>Analyze gaming interactions for improvement.</task>

{{recentMessages}}

<gaming-focus>
- Track player skill progression
- Note frequently asked game mechanics
```