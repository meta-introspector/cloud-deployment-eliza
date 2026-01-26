# a7046c18:packages_docs_plugin-registry_bootstrap_examples.mdx:1051-1200

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/bootstrap/examples.mdx:1051-1200
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
```

### Example 3: Educational Bot with Adaptive Templates

```typescript
const educatorCharacter: Character = {
  name: 'EduBot',
  description: 'Adaptive educational assistant',

  templates: {
    // Education-focused templates with learning level adaptation
    messageHandlerTemplate: `<task>Provide educational guidance as {{agentName}}.</task>

{{providers}}

<student-context>
Current Level: {{studentLevel}}
Subject: {{subject}}
Learning Style: {{learningStyle}}
</student-context>

<teaching-approach>
For BEGINNERS:
- Use simple language and analogies
- Break down complex concepts
- Provide many examples
- Check understanding frequently

For INTERMEDIATE:
- Build on existing knowledge
- Introduce technical terminology
- Encourage critical thinking
- Suggest practice problems

For ADVANCED:
- Discuss edge cases and exceptions
- Explore theoretical foundations
- Connect to real-world applications
- Recommend further reading
</teaching-approach>

<output>
<response>
  <thought>Pedagogical approach for this student</thought>
  <actions>REPLY,GENERATE_QUIZ</actions>
  <providers>STUDENT_PROGRESS,CURRICULUM,LEARNING_HISTORY</providers>
  <text>Your educational response</text>
</response>
</output>`,
  },
};
```

## Advanced Callback Patterns

### Progressive Disclosure Pattern

```typescript
const teachAction: Action = {
  name: 'TEACH_CONCEPT',

  handler: async (runtime, message, state, options, callback) => {
    const concept = extractConcept(message.content.text);
    const userLevel = await getUserLevel(runtime, message.entityId);

    if (userLevel === 'beginner') {
      // Start with simple explanation
      await callback({
        text: `Let's start with the basics of ${concept}...`,
        actions: ['TEACH_INTRO'],
      });

      // Add an analogy
      await callback({
        text: `Think of it like ${getAnalogy(concept)}`,
        actions: ['TEACH_ANALOGY'],
      });

      // Check understanding
      await callback({
        text: 'Does this make sense so far? Would you like me to explain differently?',
        actions: ['CHECK_UNDERSTANDING'],
      });
    } else {
      // Advanced explanation
      await callback({
        text: `${concept} involves several key principles...`,
        actions: ['TEACH_ADVANCED'],
        attachments: [
          {
            url: `/diagrams/${concept}.png`,
            contentType: 'image/png',
          },
        ],
      });
    }

    return true;
  },
};
```

### Error Recovery Pattern

```typescript
const processAction: Action = {
  name: 'PROCESS_REQUEST',

  handler: async (runtime, message, state, options, callback) => {
    try {
      // Acknowledge request
      await callback({
        text: 'Processing your request...',
        actions: ['ACKNOWLEDGE'],
      });

      // Attempt processing
      const result = await processUserRequest(message);

      // Success response
      await callback({
        text: `Successfully completed! ${result.summary}`,
        actions: ['SUCCESS'],
        metadata: { processId: result.id },
      });
    } catch (error) {
      // Error response with helpful information
      await callback({
        text: 'I encountered an issue processing your request.',
        actions: ['ERROR'],
      });

      // Provide specific error details
      if (error.code === 'RATE_LIMIT') {
        await callback({
          text: "You've exceeded the rate limit. Please try again in a few minutes.",
          actions: ['RATE_LIMIT_ERROR'],
        });
      } else if (error.code === 'INVALID_INPUT') {
        await callback({
          text: `The input seems invalid. Please check: ${error.details}`,
          actions: ['VALIDATION_ERROR'],
        });
      } else {
        // Generic error with support option
        await callback({
          text: 'An unexpected error occurred. Would you like me to create a support ticket?',
          actions: ['OFFER_SUPPORT'],
          metadata: { errorId: generateErrorId() },
        });
```