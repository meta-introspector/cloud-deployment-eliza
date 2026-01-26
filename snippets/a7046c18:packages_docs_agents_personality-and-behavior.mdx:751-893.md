# a7046c18:packages_docs_agents_personality-and-behavior.mdx:751-893

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/agents/personality-and-behavior.mdx:751-893
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      teacher: "Let me explain this step-by-step...",
      expert: "From an architectural perspective...",
      friend: "Hey! Let's figure this out together...",
      coach: "You've got this! Here's how to approach it..."
    };
    return personas[mode];
  }
}

// Usage in message examples
messageExamples: [[
  { name: "{{user}}", content: { text: "Switch to teacher mode" }},
  { name: "Agent", content: { 
    text: "Switching to teacher mode! 📚 I'll break down concepts into clear, manageable lessons with examples and practice exercises. What would you like to learn about?" 
  }}
]]
```

### Personality Evolution

Design personalities that can adapt over time:

```typescript
// Track interaction patterns
knowledge: [
  "User prefers concise explanations",
  "User is familiar with React and TypeScript",
  "User learns best through examples"
]

// Adaptive responses based on history
messageExamples: [[
  { name: "{{user}}", content: { text: "Explain hooks" }},
  { name: "Agent", content: { 
    text: "Since you're already comfortable with React, I'll skip the basics: Hooks are functions that let you 'hook into' React features from functional components. The key insight is they maintain state between renders using a consistent call order. Want to dive into the Rules of Hooks or see advanced patterns?" 
  }}
]]
```

### Contextual Personality Shifts

Adjust personality based on context:

```typescript
style: {
  all: [
    "Match the user's energy level",
    "Adapt formality to the situation",
    "Mirror technical depth appropriately"
  ],
  // Professional context
  chat: [
    "In work channels: maintain professional tone",
    "In casual channels: be more relaxed",
    "In help channels: focus on problem-solving"
  ],
  // Time-based adjustments
  post: [
    "Morning: energetic and motivational",
    "Afternoon: focused and productive",
    "Evening: relaxed and reflective"
  ]
}
```

## Testing Personality Consistency

### Personality Validation Checklist

- [ ] Bio aligns with adjectives
- [ ] Message examples demonstrate stated traits
- [ ] Style rules don't contradict personality
- [ ] Topics match claimed expertise
- [ ] Post examples fit the character voice
- [ ] Knowledge supports the backstory
- [ ] No conflicting behavioral patterns

### Example Test Scenarios

```typescript
describe('Personality Consistency', () => {
  it('should maintain consistent tone across contexts', () => {
    const responses = generateResponses(character, ['chat', 'post']);
    responses.forEach(response => {
      expect(response).toMatchPersonalityTraits(character.adjectives);
    });
  });
  
  it('should demonstrate claimed expertise', () => {
    const technicalResponse = generateResponse(character, "Explain async/await");
    expect(technicalResponse).toShowExpertise(character.topics);
  });
  
  it('should handle edge cases consistently', () => {
    const edgeCases = [
      "I don't understand",
      "You're wrong",
      "Can you help with [unrelated topic]?"
    ];
    edgeCases.forEach(input => {
      const response = generateResponse(character, input);
      expect(response).toMaintainPersonality(character);
    });
  });
});
```

## Best Practices

1. **Start with a clear purpose**: Define what your agent should achieve before crafting personality
2. **Use real conversation examples**: Base message examples on actual user interactions
3. **Test with diverse users**: Different people will interact differently with your agent
4. **Avoid stereotypes**: Create unique personalities rather than relying on clichés
5. **Document personality decisions**: Explain why certain traits were chosen
6. **Regular personality audits**: Review and refine based on user interactions
7. **Cultural sensitivity**: Consider how personality translates across cultures
8. **Consistency over time**: Maintain personality even as you add features
9. **Balance personality with function**: Never sacrifice utility for character
10. **Allow for growth**: Design personalities that can evolve with user needs

<Tip>
  **Guides**: [Customize an Agent](/guides/customize-an-agent) | [Multiple Agents](/guides/add-multiple-agents)
</Tip>

## See Also

<CardGroup cols={2}>
  <Card title="Character Interface" icon="code" href="/agents/character-interface">
    Learn the technical implementation
  </Card>
  
  <Card title="Memory & State" icon="brain" href="/agents/memory-and-state">
    Understand how personalities persist
  </Card>
  
  <Card title="Runtime & Lifecycle" icon="play" href="/agents/runtime-and-lifecycle">
    See how personalities come to life
  </Card>
  
  <Card title="Plugin Development" icon="puzzle" href="/plugins/development">
    Extend your agent with custom plugins
  </Card>
</CardGroup>
```