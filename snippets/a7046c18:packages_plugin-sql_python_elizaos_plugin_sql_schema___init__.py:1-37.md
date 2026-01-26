# a7046c18:packages_plugin-sql_python_elizaos_plugin_sql_schema___init__.py:1-37

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/python/elizaos_plugin_sql/schema/__init__.py:1-37
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
"""
Database schema definitions using SQLAlchemy.

This module defines the database tables for elizaOS using SQLAlchemy ORM.
"""

from elizaos_plugin_sql.schema.tables import (
    AgentTable,
    Base,
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

__all__ = [
    "Base",
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
]
```