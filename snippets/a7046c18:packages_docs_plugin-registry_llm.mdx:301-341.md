# a7046c18:packages_docs_plugin-registry_llm.mdx:301-341

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/llm.mdx:301-341
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
}
```

### "Missing API Key"

Ensure your environment variables are set:

```bash
# Check current environment
echo $OPENAI_API_KEY

# Or use the CLI
elizaos env edit-local
```

### Models Not Loading

Check plugin initialization in logs:

```
Success: Plugin @elizaos/plugin-openai initialized successfully
```

## Migration from v0.x

In elizaOS v0.x, models were configured directly in character files:

```json
// ❌ OLD (v0.x) - No longer works
{
  "modelProvider": "openai",
  "model": "gpt-4"
}

// ✅ NEW (v1.x) - Use plugins
{
  "plugins": ["@elizaos/plugin-openai"]
}
```

The `modelProvider` field is now ignored. All model configuration happens through plugins.
```