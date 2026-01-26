# a7046c18:packages_docs_plugin-registry_llm_google-genai.mdx:1-108

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/llm/google-genai.mdx:1-108
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
---
title: "Google GenAI Plugin"
description: "Google Gemini models integration for elizaOS"
---

## Features

- **Gemini models** - Access to Gemini Pro and Gemini Pro Vision
- **Multimodal support** - Process text and images
- **Embedding models** - Native embedding support
- **Safety settings** - Configurable content filtering

## Installation

```bash
elizaos plugins add @elizaos/plugin-google-genai
```

## Configuration

### Environment Variables

```bash
# Required
GOOGLE_GENERATIVE_AI_API_KEY=...

# Optional model configuration
# You can use any available Google Gemini model
GOOGLE_SMALL_MODEL=gemini-2.0-flash-001           # Default: gemini-2.0-flash-001
GOOGLE_LARGE_MODEL=gemini-2.5-pro-preview-03-25   # Default: gemini-2.5-pro-preview-03-25
GOOGLE_IMAGE_MODEL=gemini-1.5-flash               # For vision tasks
GOOGLE_EMBEDDING_MODEL=text-embedding-004         # Default: text-embedding-004

# Examples of other available models:
# GOOGLE_SMALL_MODEL=gemini-1.5-flash
# GOOGLE_LARGE_MODEL=gemini-1.5-pro
# GOOGLE_LARGE_MODEL=gemini-pro
# GOOGLE_EMBEDDING_MODEL=embedding-001
```

### Character Configuration

```json
{
  "name": "MyAgent",
  "plugins": ["@elizaos/plugin-google-genai"]
}
```

## Supported Operations

| Operation | Models | Notes |
|-----------|--------|-------|
| TEXT_GENERATION | gemini-pro, gemini-pro-vision | Multimodal capable |
| EMBEDDING | embedding-001 | 768-dimensional |
| OBJECT_GENERATION | All Gemini models | Structured output |

## Model Configuration

The plugin uses three model categories:

- **SMALL_MODEL**: Fast, efficient for simple tasks
- **LARGE_MODEL**: Best quality, complex reasoning
- **IMAGE_MODEL**: Multimodal capabilities (text + vision)
- **EMBEDDING_MODEL**: Vector embeddings

You can configure any available Gemini model:
- Gemini 2.0 Flash (latest)
- Gemini 2.5 Pro Preview
- Gemini 1.5 Pro/Flash
- Gemini Pro (legacy)
- Any new models Google releases

## Safety Configuration

Control content filtering:

```typescript
// In character settings
{
  "settings": {
    "google_safety": {
      "harassment": "BLOCK_NONE",
      "hate_speech": "BLOCK_MEDIUM_AND_ABOVE",
      "sexually_explicit": "BLOCK_MEDIUM_AND_ABOVE",
      "dangerous_content": "BLOCK_MEDIUM_AND_ABOVE"
    }
  }
}
```

## Usage Tips

1. **Multimodal** - Leverage image understanding capabilities
2. **Long Context** - Gemini 1.5 Pro supports up to 1M tokens
3. **Rate Limits** - Free tier has generous limits

## Cost Structure

- Free tier: 60 queries per minute
- Paid tier: Higher limits and priority access
- Embedding calls are separate from generation

## External Resources

- [Plugin Source](https://github.com/elizaos/eliza/tree/main/packages/plugin-google-genai)
- [Google AI Studio](https://makersuite.google.com)
- [API Documentation](https://ai.google.dev/docs)
```