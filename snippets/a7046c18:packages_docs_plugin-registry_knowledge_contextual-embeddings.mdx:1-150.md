# a7046c18:packages_docs_plugin-registry_knowledge_contextual-embeddings.mdx:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/knowledge/contextual-embeddings.mdx:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
---
title: Contextual Embeddings
description: Enhanced retrieval accuracy using Anthropic's contextual retrieval technique
---

Contextual embeddings are an advanced Knowledge plugin feature that improves retrieval accuracy by enriching text chunks with surrounding context before generating embeddings. This implementation is based on [Anthropic's contextual retrieval techniques](https://www.anthropic.com/news/contextual-retrieval).

## What are Contextual Embeddings?

Traditional RAG systems embed isolated text chunks, losing important context. Contextual embeddings solve this by using an LLM to add relevant context to each chunk before embedding.

### Traditional vs Contextual

<Tabs>
  <Tab title="Traditional Embedding">
    ```text
    Original chunk:
    "The deployment process requires authentication."
    
    Embedded as-is, missing context about:
    - Which deployment process?
    - What kind of authentication?
    - For which system?
    ```
  </Tab>
  <Tab title="Contextual Embedding">
    ```text
    Enriched chunk:
    "In the Kubernetes deployment section for the payment service, 
    the deployment process requires authentication using OAuth2 
    tokens obtained from the identity provider."
    
    Now embeddings understand this is about:
    - Kubernetes deployments
    - Payment service specifically
    - OAuth2 authentication
    ```
  </Tab>
</Tabs>

## How It Works

The Knowledge plugin uses a sophisticated prompt-based approach to enrich chunks:

1. **Document Analysis**: The full document is passed to an LLM along with each chunk
2. **Context Generation**: The LLM identifies relevant context from the document
3. **Chunk Enrichment**: The original chunk is preserved with added context
4. **Embedding**: The enriched chunk is embedded using your configured embedding model

<Note>
The implementation is based on Anthropic's Contextual Retrieval cookbook example, which showed up to 50% improvement in retrieval accuracy.
</Note>

## Configuration

### Enable Contextual Embeddings

```env title=".env"
# Enable contextual embeddings
CTX_KNOWLEDGE_ENABLED=true

# Configure your text generation provider
TEXT_PROVIDER=openrouter  # or openai, anthropic, google
TEXT_MODEL=anthropic/claude-3-haiku  # or any supported model

# Required API keys
OPENROUTER_API_KEY=your-key  # If using OpenRouter
# or
OPENAI_API_KEY=your-key      # If using OpenAI
# or
ANTHROPIC_API_KEY=your-key   # If using Anthropic
# or  
GOOGLE_API_KEY=your-key      # If using Google
```

<Warning>
**Important**: Embeddings always use the model configured in `useModel(TEXT_EMBEDDING)` from your agent setup. Do NOT try to mix different embedding models - all your documents must use the same embedding model for consistency.
</Warning>

### OpenRouter Standalone Setup

OpenRouter now supports embeddings natively with multiple models (`text-embedding-3-large`, `qwen3-embedding`, `gemini-embedding`, `mistral-embed`):

<Tabs>
  <Tab title="OpenRouter Only">
    ```typescript title="character.ts"
    export const character = {
      name: 'MyAgent',
      plugins: [
        '@elizaos/plugin-openrouter',   // Handles both text and embeddings
        '@elizaos/plugin-knowledge',    // Knowledge plugin
      ],
    };
    ```

    ```env title=".env"
    # Enable contextual embeddings
    CTX_KNOWLEDGE_ENABLED=true

    # OpenRouter handles both text generation and embeddings
    OPENROUTER_API_KEY=your-openrouter-key
    OPENROUTER_EMBEDDING_MODEL=openai/text-embedding-3-large  # Optional
    ```
  </Tab>
  <Tab title="OpenRouter + Local Fallback">
    ```typescript title="character.ts"
    export const character = {
      name: 'MyAgent',
      plugins: [
        '@elizaos/plugin-openrouter',  // Cloud text & embeddings
        '@elizaos/plugin-ollama',       // Offline fallback
        '@elizaos/plugin-knowledge',    // Knowledge plugin
      ],
    };
    ```

    ```env title=".env"
    # Enable contextual embeddings
    CTX_KNOWLEDGE_ENABLED=true

    # OpenRouter for cloud
    OPENROUTER_API_KEY=your-openrouter-key

    # Ollama as fallback for offline use
    OLLAMA_API_ENDPOINT=http://localhost:11434/api
    ```
  </Tab>
</Tabs>

### Alternative Providers

<Tabs>
  <Tab title="OpenAI Only">
    ```env
    CTX_KNOWLEDGE_ENABLED=true
    TEXT_PROVIDER=openai
    TEXT_MODEL=gpt-4o-mini
    OPENAI_API_KEY=your-key
    ```
  </Tab>
  <Tab title="Anthropic + OpenAI">
    ```env
    CTX_KNOWLEDGE_ENABLED=true
    TEXT_PROVIDER=anthropic
    TEXT_MODEL=claude-3-haiku-20240307
    ANTHROPIC_API_KEY=your-anthropic-key
    OPENAI_API_KEY=your-openai-key  # Still needed for embeddings
    ```
  </Tab>
  <Tab title="Google Only">
```