# a7046c18:packages_docs_plugin-registry_llm.mdx:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/llm.mdx:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
---
title: "Language Model Configuration"
description: "Understanding and configuring Language Model plugins in elizaOS"
---


elizaOS uses a plugin-based architecture for integrating different Language Model providers. This guide explains how to configure and use LLM plugins, including fallback mechanisms for embeddings and model registration.

## Key Concepts

### Model Types

elizaOS supports many types of AI operations. Here are the most common ones:

1. **TEXT_GENERATION** (`TEXT_SMALL`, `TEXT_LARGE`) - Having conversations and generating responses
2. **TEXT_EMBEDDING** - Converting text into numbers for memory and search
3. **OBJECT_GENERATION** (`OBJECT_SMALL`, `OBJECT_LARGE`) - Creating structured data like JSON

Think of it like different tools in a toolbox:
- **Text Generation** = Having a conversation
- **Embeddings** = Creating a "fingerprint" of text for finding similar things later
- **Object Generation** = Filling out forms with specific information

### Plugin Capabilities

Not all LLM plugins support all model types. Here's what each can do:

| Plugin | Text Chat | Embeddings | Structured Output | Runs Offline |
|--------|-----------|------------|-------------------|--------------|
| OpenAI | ✅ | ✅ | ✅ | ❌ |
| Anthropic | ✅ | ❌ | ✅ | ❌ |
| Google GenAI | ✅ | ✅ | ✅ | ❌ |
| Ollama | ✅ | ✅ | ✅ | ✅ |
| OpenRouter | ✅ | ✅ | ✅ | ❌ |

**Key Points:**
- 🌟 **OpenAI, Google GenAI & OpenRouter** = Do everything (jack of all trades)
- 💬 **Anthropic** = Amazing at chat, needs a fallback for embeddings
- 🏠 **Ollama** = Your local hero - does almost everything, no internet needed!

## Plugin Loading Order

The order in which plugins are loaded matters significantly. From the default character configuration:

```typescript
plugins: [
  // Core plugins first
  '@elizaos/plugin-sql',

  // Text-only plugins (no embedding support)
  ...(process.env.ANTHROPIC_API_KEY?.trim() ? ['@elizaos/plugin-anthropic'] : []),

  // Embedding-capable plugins
  ...(process.env.OPENROUTER_API_KEY?.trim() ? ['@elizaos/plugin-openrouter'] : []),
  ...(process.env.OPENAI_API_KEY?.trim() ? ['@elizaos/plugin-openai'] : []),
  ...(process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim() ? ['@elizaos/plugin-google-genai'] : []),

  // Ollama as fallback (only if no main LLM providers are configured)
  ...(process.env.OLLAMA_API_ENDPOINT?.trim() ? ['@elizaos/plugin-ollama'] : []),
]
```

### Understanding the Order

Think of it like choosing team players - you pick specialists first, then all-rounders:

1. **Anthropic goes first** - It's a specialist! Great at text generation but can't do embeddings. By loading it first, it gets priority for text tasks.

2. **OpenRouter, OpenAI & Google GenAI come next** - These are the all-rounders! They can do everything: text generation, embeddings, and structured output. They act as fallbacks for what Anthropic can't do (embeddings).

3. **Ollama comes last** - This is your local backup player! It supports almost everything (text, embeddings, objects) and runs on your computer. Perfect when cloud services aren't available.

### Why This Order Matters

When you ask elizaOS to do something, it looks for the best model in order:

- **Generate text?** → Anthropic gets first shot (if loaded)
- **Create embeddings?** → Anthropic can't, so OpenAI steps in
- **No cloud API keys?** → Ollama handles everything locally

This smart ordering means:
- You get the best specialized models for each task
- You always have fallbacks for missing capabilities  
- You can run fully offline with Ollama if needed

### Real Example: How It Works

Let's say you have Anthropic + OpenAI configured:

```
Task: "Generate a response"
1. Anthropic: "I got this!" ✅ (Priority 100 for text)
2. OpenAI: "I'm here if needed" (Priority 50)

Task: "Create embeddings for memory"
1. Anthropic: "Sorry, can't do that" ❌
2. OpenAI: "No problem, I'll handle it!" ✅

Task: "Generate structured JSON"
1. Anthropic: "I can do this!" ✅ (Priority 100 for objects)
2. OpenAI: "Standing by" (Priority 50)
```

## Model Registration

When plugins load, they "register" what they can do. It's like signing up for different jobs:

```typescript
// Each plugin says "I can do this!"
runtime.registerModel(
  ModelType.TEXT_LARGE,        // What type of work
  generateText,                // How to do it
  'anthropic',                 // Who's doing it
  100                         // Priority (higher = goes first)
);
```

### How elizaOS Picks the Right Model

When you ask elizaOS to do something, it:

1. **Checks what type of work it is** (text? embeddings? objects?)
2. **Looks at who signed up** for that job
3. **Picks based on priority** (higher number goes first)
4. **If tied, first registered wins**

**Example**: You ask for text generation
- Anthropic registered with priority 100 ✅ (wins!)
- OpenAI registered with priority 50
- Ollama registered with priority 10

But for embeddings:
- Anthropic didn't register ❌ (can't do it)
- OpenAI registered with priority 50 ✅ (wins!)
- Ollama registered with priority 10

## Embedding Fallback Strategy

Remember: Not all plugins can create embeddings! Here's how elizaOS handles this:

**The Problem**: 
- You're using Anthropic (great at chat, can't do embeddings)
- But elizaOS needs embeddings for memory and search

**The Solution**: 
elizaOS automatically finds another plugin that CAN do embeddings!

```typescript
// What happens behind the scenes:
// 1. "I need embeddings!"
```