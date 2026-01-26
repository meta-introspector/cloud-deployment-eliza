# a7046c18:packages_python-plugin-starter_README.md:151-207

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/python-plugin-starter/README.md:151-207
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    services=[MyService],
)
```

## Testing

```bash
# Run tests
pytest

# Run with coverage
pytest --cov=elizaos_plugin_starter

# Type checking
mypy elizaos_plugin_starter
```

## API Reference

### ActionResult

```python
# Success
ActionResult(success=True, text="Done!")

# Success with data
ActionResult(
    success=True,
    text="Result",
    data={"key": "value"},
    values={"template_var": "value"},
)

# Failure
ActionResult(success=False, error="Something went wrong")
```

### ProviderResult

```python
ProviderResult(
    text="Human-readable context for LLM",
    values={"variable": "for template substitution"},
    data={"structured": {"data": "for programmatic access"}},
)
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `EXAMPLE_PLUGIN_VARIABLE` | Example configuration variable | No |

## License

MIT

```