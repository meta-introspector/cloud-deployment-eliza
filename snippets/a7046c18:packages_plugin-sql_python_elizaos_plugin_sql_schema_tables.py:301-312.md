# a7046c18:packages_plugin-sql_python_elizaos_plugin_sql_schema_tables.py:301-312

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/python/elizaos_plugin_sql/schema/tables.py:301-312
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    entity_id = Column(UUID(as_uuid=True), nullable=False)
    room_id = Column(UUID(as_uuid=True), nullable=True)
    type = Column(String(100), nullable=False)
    body = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    __table_args__ = (
        Index("idx_logs_entity_id", "entity_id"),
        Index("idx_logs_room_id", "room_id"),
        Index("idx_logs_type", "type"),
        Index("idx_logs_created_at", "created_at"),
    )
```