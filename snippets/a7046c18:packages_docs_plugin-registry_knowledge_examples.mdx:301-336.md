# a7046c18:packages_docs_plugin-registry_knowledge_examples.mdx:301-336

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/knowledge/examples.mdx:301-336
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
   ```
   [INFO] Loaded 15 documents from docs folder on startup
   ```

2. Ask the agent about your documents:
   ```
   You: "What documents do you have about pricing?"
   Agent: "I have information about pricing from pricing-tiers.md and product-overview.pdf..."
   ```

3. Use the Knowledge tab to see all loaded documents

### Troubleshooting

**No documents loading?**
- Check `LOAD_DOCS_ON_STARTUP=true` is set
- Verify `docs` folder exists and has files
- Check file permissions

**Agent not finding information?**
- Ensure documents contain the information
- Try more specific questions
- Check the Knowledge tab to verify documents are loaded

## Summary

1. **For production**: Use the `docs` folder with auto-loading
2. **For dynamic content**: Use the web interface
3. **For tiny snippets only**: Use the knowledge array
4. **The agent automatically searches knowledge** - no special commands needed

<CardGroup cols={2}>
  <Card title="Quick Start" icon="play" href="/plugin-registry/knowledge/quick-start">
    Get started in 5 minutes
  </Card>
</CardGroup>
```