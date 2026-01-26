# a7046c18:packages_ts-plugin-starter_bunfig.toml:1-10

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/ts-plugin-starter/bunfig.toml:1-10
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
[test]
timeout = 60000
coverage = true

[test.env]
NODE_ENV = "test"

coverage-exclude = [
  "**/dist/**",
]
```