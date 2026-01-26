# a7046c18:packages_plugin-sql_python_elizaos_plugin_sql_plugin.py:1-34

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/python/elizaos_plugin_sql/plugin.py:1-34
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
"""
elizaOS SQL Plugin definition.

This module defines the plugin for registering with elizaOS.
"""

from __future__ import annotations

from typing import TYPE_CHECKING

from elizaos.types import Plugin

if TYPE_CHECKING:
    from elizaos.types import IAgentRuntime


async def init_sql_plugin(
    config: dict[str, str | int | float | bool | None], runtime: IAgentRuntime
) -> None:
    """Initialize the SQL plugin."""
    # Plugin initialization logic here
    _ = config, runtime  # Parameters available for plugin initialization


sql_plugin = Plugin(
    name="@elizaos/plugin-sql",
    description="PostgreSQL and PGLite database adapters for elizaOS",
    init=init_sql_plugin,
    config={
        "database_url": None,
        "pool_size": 5,
        "max_overflow": 10,
    },
)
```