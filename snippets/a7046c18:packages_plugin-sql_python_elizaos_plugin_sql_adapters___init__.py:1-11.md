# a7046c18:packages_plugin-sql_python_elizaos_plugin_sql_adapters___init__.py:1-11

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/python/elizaos_plugin_sql/adapters/__init__.py:1-11
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
"""Database adapters for elizaOS."""

from elizaos_plugin_sql.adapters.base import BaseSQLAdapter
from elizaos_plugin_sql.adapters.pglite import PGLiteAdapter
from elizaos_plugin_sql.adapters.postgres import PostgresAdapter

__all__ = [
    "BaseSQLAdapter",
    "PostgresAdapter",
    "PGLiteAdapter",
]
```