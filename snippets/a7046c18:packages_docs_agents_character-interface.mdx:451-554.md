# a7046c18:packages_docs_agents_character-interface.mdx:451-554

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/agents/character-interface.mdx:451-554
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
Use the built-in validation to ensure your character is properly configured:

```typescript
import { validateCharacter } from '@elizaos/core';

const validation = validateCharacter(character);
if (!validation.valid) {
  console.error('Character validation failed:', validation.errors);
}
```

### Testing Character Configurations

```typescript
import { describe, it, expect } from 'vitest';
import { character } from './character';

describe('Character Configuration', () => {
  it('should have required fields', () => {
    expect(character.name).toBeDefined();
    expect(character.bio).toBeDefined();
  });
  
  it('should have valid message examples', () => {
    expect(character.messageExamples).toBeInstanceOf(Array);
    character.messageExamples?.forEach(conversation => {
      expect(conversation).toBeInstanceOf(Array);
      conversation.forEach(message => {
        expect(message).toHaveProperty('name');
        expect(message).toHaveProperty('content');
      });
    });
  });
  
  it('should have environment-appropriate plugins', () => {
    if (process.env.OPENAI_API_KEY) {
      expect(character.plugins).toContain('@elizaos/plugin-openai');
    }
  });
});
```

## Best Practices

1. **Keep personality traits consistent**: Ensure bio, adjectives, and style align
2. **Provide diverse message examples**: Cover various interaction patterns
3. **Use TypeScript for type safety**: Leverage type checking for configuration
4. **Load plugins conditionally**: Check for API keys before loading
5. **Order plugins by dependency**: Load core plugins before dependent ones
6. **Use environment variables for secrets**: Never hardcode sensitive data
7. **Validate before deployment**: Always validate character configuration
8. **Test conversation flows**: Ensure message examples produce desired behavior
9. **Document custom settings**: Clearly explain any custom configuration
10. **Version your characters**: Track changes to character configurations

## Migration Guide

### From JSON to TypeScript

Converting a JSON character to TypeScript:

```typescript
// Before: character.json
{
  "name": "MyAgent",
  "bio": "An AI assistant"
}

// After: character.ts
import { Character } from '@elizaos/core';

export const character: Character = {
  name: "MyAgent",
  bio: "An AI assistant"
};
```

## See Also

<CardGroup cols={2}>
  <Card title="Personality & Behavior" icon="user" href="/agents/personality-and-behavior">
    Learn to craft unique agent personalities
  </Card>

  <Card title="Memory & State" icon="brain" href="/agents/memory-and-state">
    Understand how agents remember and learn
  </Card>

  <Card title="Runtime & Lifecycle" icon="play" href="/agents/runtime-and-lifecycle">
    See how characters become live agents
  </Card>

  <Card title="Plugin Development" icon="puzzle" href="/plugins/development">
    Extend your agent with custom plugins
  </Card>

  <Card title="Core Runtime" icon="microchip" href="/runtime/core">
    How the runtime orchestrates your agent
  </Card>

  <Card title="Deploy to Cloud" icon="cloud" href="/guides/deploy-to-cloud">
    Ship your agent to production in minutes
  </Card>
</CardGroup>
```