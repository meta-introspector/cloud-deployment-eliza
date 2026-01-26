# a7046c18:packages_docs_plugin-registry_knowledge_contextual-embeddings.mdx:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/knowledge/contextual-embeddings.mdx:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    ```env
    CTX_KNOWLEDGE_ENABLED=true
    TEXT_PROVIDER=google
    TEXT_MODEL=gemini-1.5-flash
    GOOGLE_API_KEY=your-google-key
    # Google embeddings will be used automatically
    ```
  </Tab>
  <Tab title="OpenRouter + Google">
    ```env
    CTX_KNOWLEDGE_ENABLED=true
    TEXT_PROVIDER=openrouter
    TEXT_MODEL=anthropic/claude-3-haiku
    OPENROUTER_API_KEY=your-openrouter-key
    GOOGLE_API_KEY=your-google-key  # For embeddings
    # Requires @elizaos/plugin-google for embeddings
    ```
  </Tab>
</Tabs>

## Technical Details

### Chunk Processing

The plugin uses fixed chunk sizes optimized for contextual enrichment:

- **Chunk Size**: 500 tokens (approximately 1,750 characters)
- **Chunk Overlap**: 100 tokens
- **Context Target**: 60-200 tokens of added context

These values are based on research showing that smaller chunks with rich context perform better than larger chunks without context.

### Content-Aware Templates

The plugin automatically detects content types and uses specialized prompts:

```typescript
// Different templates for different content types
- General text documents
- PDF documents (with special handling for corrupted text)
- Mathematical content (preserves equations and notation)
- Code files (includes imports, function signatures)
- Technical documentation (preserves terminology)
```

### OpenRouter Caching

When using OpenRouter with Claude or Gemini models, the plugin automatically leverages caching:

1. **First document chunk**: Caches the full document
2. **Subsequent chunks**: Reuses cached document (90% cost reduction)
3. **Cache duration**: 5 minutes (automatic)

This means processing a 100-page document costs almost the same as processing a single page!

## Example: How Context Improves Retrieval

### Without Contextual Embeddings

```text
Query: "How do I configure the timeout?"

Retrieved chunk:
"Set the timeout value to 30 seconds."

Problem: Which timeout? Database? API? Cache?
```

### With Contextual Embeddings

```text
Query: "How do I configure the timeout?"

Retrieved chunk:
"In the Redis configuration section, when setting up the caching layer,
set the timeout value to 30 seconds for optimal performance with 
session data."

Result: Clear understanding this is about Redis cache timeout.
```

## Performance Considerations

### Processing Time

- **Initial processing**: 1-3 seconds per chunk (includes LLM call)
- **With caching**: 0.1-0.3 seconds per chunk
- **Batch processing**: Up to 30 chunks concurrently

### Cost Estimation

| Document Size | Pages | Chunks | Without Caching | With OpenRouter Cache |
|--------------|-------|--------|-----------------|----------------------|
| Small | 10 | ~20 | $0.02 | $0.002 |
| Medium | 50 | ~100 | $0.10 | $0.01 |
| Large | 200 | ~400 | $0.40 | $0.04 |

<Note>
Costs are estimates based on Claude 3 Haiku pricing. Actual costs depend on your chosen model.
</Note>

## Monitoring

The plugin provides detailed logging:

```bash
# Enable debug logging to see enrichment details
LOG_LEVEL=debug elizaos start
```

This will show:
- Context enrichment progress
- Cache hit/miss rates
- Processing times per document
- Token usage

## Common Issues and Solutions

### Context Not Being Added

**Check if contextual embeddings are enabled:**
```bash
# Look for this in your logs:
"CTX enrichment ENABLED"
# or
"CTX enrichment DISABLED"
```

**Verify your configuration:**
- `CTX_KNOWLEDGE_ENABLED=true` (not "TRUE" or "True")
- `TEXT_PROVIDER` and `TEXT_MODEL` are both set
- Required API key for your provider is set

### Slow Processing

**Solutions:**
1. Use OpenRouter with Claude/Gemini for automatic caching
2. Process smaller batches of documents
3. Use faster models (Claude 3 Haiku, Gemini 1.5 Flash)

### High Costs

**Solutions:**
1. Enable OpenRouter caching (90% cost reduction)
2. Use smaller models for context generation
3. Process documents in batches during off-peak hours

## Best Practices

<Steps>
```