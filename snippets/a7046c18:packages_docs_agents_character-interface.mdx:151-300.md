# a7046c18:packages_docs_agents_character-interface.mdx:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/agents/character-interface.mdx:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

```typescript
messageExamples: [
  // Each sub-array is a complete conversation
  [
    {
      name: "{{user}}",
      content: { text: "Can you help me debug this React error?" }
    },
    {
      name: "TechHelper",
      content: { 
        text: "I'd be happy to help! Can you share the error message and the relevant code?"
      }
    },
    {
      name: "{{user}}",
      content: { text: "It says 'Cannot read property of undefined'" }
    },
    {
      name: "TechHelper",
      content: { 
        text: "This error typically occurs when trying to access a property on a null or undefined object. Let's trace through your code to find where this might be happening. Can you show me the component where this error occurs?"
      }
    }
  ],
  // Another conversation example
  [
    {
      name: "{{user}}",
      content: { text: "What's the difference between let and const?" }
    },
    {
      name: "TechHelper",
      content: { 
        text: "`const` declares a variable that cannot be reassigned, while `let` allows reassignment. For example:\n```js\nconst x = 1;\nx = 2; // Error!\n\nlet y = 1;\ny = 2; // Works fine\n```\nNote that `const` objects can still have their properties modified."
      }
    }
  ]
]
```

### Style Configuration

Define writing styles for different contexts:

```typescript
style: {
  // General style rules applied everywhere
  all: [
    "Be concise and clear",
    "Use technical terms accurately",
    "Provide examples when helpful"
  ],
  
  // Chat-specific style
  chat: [
    "Be conversational and friendly",
    "Ask clarifying questions",
    "Break down complex topics"
  ],
  
  // Social media post style
  post: [
    "Keep it under 280 characters when possible",
    "Use relevant hashtags",
    "Be engaging and informative"
  ]
}
```

## Knowledge Configuration

Configure the agent's knowledge base:

```typescript
knowledge: [
  // Simple string facts
  "I specialize in TypeScript and React",
  "I can help with debugging and code reviews",
  
  // File reference
  {
    path: "./knowledge/react-best-practices.md",
    shared: true  // Available to all agents
  },
  
  // Directory of knowledge files
  {
    directory: "./knowledge/tutorials",
    shared: false  // Only for this agent
  }
]
```

## Plugin Management

### Basic Plugin Configuration

```typescript
plugins: [
  "@elizaos/plugin-bootstrap",  // Core functionality
  "@elizaos/plugin-discord",     // Discord integration
  "@elizaos/plugin-openai",      // OpenAI models
  "./custom-plugins/my-plugin"   // Local plugin
]
```

### Environment-Based Plugin Loading

Load plugins conditionally based on environment variables:

```typescript
plugins: [
  // Always loaded
  "@elizaos/plugin-bootstrap",
  "@elizaos/plugin-sql",
  
  // Conditionally loaded based on API keys
  ...(process.env.OPENAI_API_KEY ? ["@elizaos/plugin-openai"] : []),
  ...(process.env.ANTHROPIC_API_KEY ? ["@elizaos/plugin-anthropic"] : []),
  
  // Platform plugins
  ...(process.env.DISCORD_API_TOKEN ? ["@elizaos/plugin-discord"] : []),
  ...(process.env.TELEGRAM_BOT_TOKEN ? ["@elizaos/plugin-telegram"] : []),
  
  // Feature flags
  ...(process.env.ENABLE_VOICE ? ["@elizaos/plugin-voice"] : []),
]
```

## Settings and Secrets

### Settings Object

General configuration values:

```typescript
settings: {
  // Model configuration
  model: "gpt-4",
  temperature: 0.7,
  maxTokens: 2000,
  
  // Behavior settings
  responseTimeout: 30000,
  maxMemorySize: 1000,
  
  // Custom settings for plugins
  voiceEnabled: true,
```