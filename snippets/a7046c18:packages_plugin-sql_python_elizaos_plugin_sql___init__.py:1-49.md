# a7046c18:packages_plugin-sql_python_elizaos_plugin_sql___init__.py:1-49

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/python/elizaos_plugin_sql/__init__.py:1-49
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
"""
elizaOS SQL Plugin - PostgreSQL and PGLite database adapters for elizaOS.

This package provides database adapters for elizaOS agents using
PostgreSQL (production) and PGLite (development).
"""

from elizaos_plugin_sql.adapters.base import BaseSQLAdapter
from elizaos_plugin_sql.adapters.pglite import PGLiteAdapter
from elizaos_plugin_sql.adapters.postgres import PostgresAdapter
from elizaos_plugin_sql.plugin import sql_plugin
from elizaos_plugin_sql.schema import (
    AgentTable,
    CacheTable,
    ComponentTable,
    EmbeddingTable,
    EntityTable,
    LogTable,
    MemoryTable,
    ParticipantTable,
    RelationshipTable,
    RoomTable,
    TaskTable,
    WorldTable,
)

__version__ = "1.0.0"

__all__ = [
    # Adapters
    "PostgresAdapter",
    "PGLiteAdapter",
    "BaseSQLAdapter",
    # Schema tables
    "AgentTable",
    "CacheTable",
    "ComponentTable",
    "EmbeddingTable",
    "EntityTable",
    "LogTable",
    "MemoryTable",
    "ParticipantTable",
    "RelationshipTable",
    "RoomTable",
    "TaskTable",
    "WorldTable",
    # Plugin
    "sql_plugin",
]
```