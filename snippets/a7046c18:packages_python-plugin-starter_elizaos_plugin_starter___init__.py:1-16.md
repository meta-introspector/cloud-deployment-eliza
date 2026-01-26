# a7046c18:packages_python-plugin-starter_elizaos_plugin_starter___init__.py:1-16

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/python-plugin-starter/elizaos_plugin_starter/__init__.py:1-16
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
"""
elizaOS Python Plugin Starter

A template for creating elizaOS plugins in Python that can be loaded by:
- Python runtime (native)
- TypeScript runtime (via IPC bridge)

Example:
    >>> from elizaos_plugin_starter import plugin
    >>> await runtime.register_plugin(plugin)
"""

from elizaos_plugin_starter.plugin import plugin, StarterService

__all__ = ["plugin", "StarterService"]
__version__ = "1.0.0"
```