# a7046c18:packages_docs_plugin-registry_llm.mdx:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/llm.mdx:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
// 2. "Can Anthropic do it?" → No ❌
// 3. "Can OpenAI do it?" → Yes ✅
// 4. "OpenAI, you're up!"
```

### Common Patterns

#### Anthropic + OpenAI Fallback
```json
{
  "plugins": [
    "@elizaos/plugin-anthropic",  // Primary for text
    "@elizaos/plugin-openai"       // Fallback for embeddings
  ]
}
```

#### OpenRouter Standalone
```json
{
  "plugins": [
    "@elizaos/plugin-openrouter"  // Handles text and embeddings
  ]
}
```

#### OpenRouter + Local Fallback
```json
{
  "plugins": [
    "@elizaos/plugin-openrouter",  // Cloud text & embeddings
    "@elizaos/plugin-ollama"        // Offline fallback
  ]
}
```

## Configuration

### Environment Variables

Each plugin requires specific environment variables:

```bash
# .env file

# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_SMALL_MODEL=gpt-4o-mini          # Optional: any available model
OPENAI_LARGE_MODEL=gpt-4o               # Optional: any available model

# Anthropic  
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_SMALL_MODEL=claude-3-haiku-20240307    # Optional: any Claude model
ANTHROPIC_LARGE_MODEL=claude-3-5-sonnet-latest   # Optional: any Claude model

# Google GenAI
GOOGLE_GENERATIVE_AI_API_KEY=...
GOOGLE_SMALL_MODEL=gemini-2.0-flash-001  # Optional: any Gemini model
GOOGLE_LARGE_MODEL=gemini-2.5-pro-preview-03-25  # Optional: any Gemini model

# Ollama
OLLAMA_API_ENDPOINT=http://localhost:11434/api
OLLAMA_SMALL_MODEL=llama3.2              # Optional: any local model
OLLAMA_LARGE_MODEL=llama3.1:70b          # Optional: any local model
OLLAMA_EMBEDDING_MODEL=nomic-embed-text  # Optional: any embedding model

# OpenRouter
OPENROUTER_API_KEY=sk-or-...
OPENROUTER_SMALL_MODEL=google/gemini-2.0-flash-001  # Optional: any available model
OPENROUTER_LARGE_MODEL=anthropic/claude-3-opus      # Optional: any available model

**Important**: The model names shown are examples. You can use any model available from each provider.

### Character-Specific Secrets

You can also configure API keys per character:

```json
{
  "name": "MyAgent",
  "settings": {
    "secrets": {
      "OPENAI_API_KEY": "sk-...",
      "ANTHROPIC_API_KEY": "sk-ant-..."
    }
  }
}
```

## Available Plugins

### Cloud Providers

- [OpenAI Plugin](/plugin-registry/llm/openai) - Full-featured with all model types
- [Anthropic Plugin](/plugin-registry/llm/anthropic) - Claude models for text generation
- [Google GenAI Plugin](/plugin-registry/llm/google-genai) - Gemini models
- [OpenRouter Plugin](/plugin-registry/llm/openrouter) - Access to multiple providers

### Local/Self-Hosted

- [Ollama Plugin](/plugin-registry/llm/ollama) - Run models locally with Ollama

## Best Practices

### 1. Always Configure Embeddings

Even if your primary model doesn't support embeddings, always include a fallback:

```json
{
  "plugins": [
    "@elizaos/plugin-anthropic",
    "@elizaos/plugin-openai"  // For embeddings
  ]
}
```

### 2. Order Matters

Place your preferred providers first, but ensure embedding capability somewhere in the chain.

### 3. Test Your Configuration

Verify all model types work:

```typescript
// The runtime will log which provider is used for each operation
[AgentRuntime][MyAgent] Using model TEXT_GENERATION from provider anthropic
[AgentRuntime][MyAgent] Using model EMBEDDING from provider openai
```

### 4. Monitor Costs

Different providers have different pricing. Consider:
- Using local models (Ollama) for development
- Mixing providers (e.g., OpenRouter for text, local for embeddings)
- Setting up usage alerts with your providers

## Troubleshooting

### "No model found for type EMBEDDING"

Your configured plugins don't support embeddings. Add an embedding-capable plugin:

```json
{
  "plugins": [
    "@elizaos/plugin-anthropic",
    "@elizaos/plugin-openai"  // Add this
  ]
```