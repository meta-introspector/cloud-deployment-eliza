# a7046c18:packages_docs_plugin-registry_bootstrap_complete-documentation.mdx:451-600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/bootstrap/complete-documentation.mdx:451-600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

## Configuration

### Environment Variables

```bash
# Control which room types bypass shouldRespond check
SHOULD_RESPOND_BYPASS_TYPES=["dm", "voice_dm", "api"]

# Control which sources bypass shouldRespond check
SHOULD_RESPOND_BYPASS_SOURCES=["client_chat", "api"]

# Conversation context length
CONVERSATION_LENGTH=20

# Response timeout (ms)
RESPONSE_TIMEOUT=3600000  # 1 hour
```

### Character Templates

Configure custom templates:

```typescript
character: {
  templates: {
    messageHandlerTemplate: string,
    shouldRespondTemplate: string,
    reflectionTemplate: string,
    postCreationTemplate: string
  }
}
```

## Template Customization

### Understanding Templates

Templates are the core prompts that control how your agent thinks and responds. The plugin-bootstrap provides default templates, but you can customize them through your character configuration to create unique agent behaviors.

### Available Templates

1. **shouldRespondTemplate** - Controls when the agent decides to respond
2. **messageHandlerTemplate** - Governs how the agent generates responses and selects actions
3. **reflectionTemplate** - Manages post-interaction analysis
4. **postCreationTemplate** - Handles social media post generation

### How Templates Work

Templates use a mustache-style syntax with placeholders:

- `{{agentName}}` - The agent's name
- `{{providers}}` - Injected provider context
- `{{actionNames}}` - Available actions
- `{{recentMessages}}` - Conversation history

### Customizing Templates

You can override any template in your character configuration:

```typescript
import { Character } from '@elizaos/core';

export const myCharacter: Character = {
  name: 'TechBot',
  // ... other config ...

  templates: {
    // Custom shouldRespond logic
    shouldRespondTemplate: `<task>Decide if {{agentName}} should help with technical questions.</task>

{{providers}}

<rules>
- Always respond to technical questions
- Always respond to direct mentions
- Ignore casual chat unless it's tech-related
- If someone asks for help, ALWAYS respond
</rules>

<output>
<response>
  <reasoning>Your technical assessment</reasoning>
  <action>RESPOND | IGNORE | STOP</action>
</response>
</output>`,

    // Custom message handler with specific behavior
    messageHandlerTemplate: `<task>Generate a helpful technical response as {{agentName}}.</task>

{{providers}}

Available actions: {{actionNames}}

<personality>
- Be precise and technical but friendly
- Provide code examples when relevant
- Ask clarifying questions for vague requests
- Suggest best practices
</personality>

<output>
<response>
  <thought>Technical analysis of the request</thought>
  <actions>ACTION1,ACTION2</actions>
  <providers>PROVIDER1,PROVIDER2</providers>
  <text>Your helpful technical response</text>
</response>
</output>`,

    // Custom reflection template
    reflectionTemplate: `<task>Analyze the technical conversation for learning opportunities.</task>

{{recentMessages}}

<focus>
- Extract technical facts and solutions
- Note programming patterns discussed
- Track user expertise levels
- Identify knowledge gaps
</focus>

<output>
{
  "thought": "Technical insight gained",
  "facts": [
    {
      "claim": "Technical fact learned",
      "type": "technical|solution|pattern",
      "topic": "programming|devops|architecture"
    }
  ],
  "userExpertise": {
    "level": "beginner|intermediate|expert",
    "topics": ["topic1", "topic2"]
  }
}
</output>`,
  },
};
```

### Template Processing Flow

1. **Template Selection**: The system selects the appropriate template based on the current operation
2. **Variable Injection**: Placeholders are replaced with actual values
3. **Provider Integration**: Provider data is formatted and injected
4. **LLM Processing**: The completed prompt is sent to the language model
5. **Response Parsing**: The XML/JSON response is parsed and validated

```