# a7046c18:packages_docs_plugin-registry_knowledge_contextual-embeddings.mdx:301-326

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/knowledge/contextual-embeddings.mdx:301-326
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  <Step title="Use OpenRouter for Cost Efficiency">
    OpenRouter's caching makes contextual embeddings 90% cheaper when processing multiple chunks from the same document.
  </Step>
  <Step title="Keep Default Settings">
    The chunk sizes and overlap are optimized based on research. Only change if you have specific requirements.
  </Step>
  <Step title="Monitor Your Logs">
    Enable debug logging when first setting up to ensure context is being added properly.
  </Step>
  <Step title="Use Appropriate Models">
    - Claude 3 Haiku: Best balance of quality and cost
    - Gemini 1.5 Flash: Fastest processing
    - GPT-4o-mini: Good quality, moderate cost
  </Step>
</Steps>

## Summary

Contextual embeddings significantly improve retrieval accuracy by:

- Adding document context to each chunk before embedding
- Using intelligent templates based on content type
- Preserving the original text while enriching with context
- Leveraging caching for cost-efficient processing

The implementation is based on Anthropic's proven approach and integrates seamlessly with elizaOS's existing infrastructure. Simply set `CTX_KNOWLEDGE_ENABLED=true` and configure your text generation provider to get started!
```