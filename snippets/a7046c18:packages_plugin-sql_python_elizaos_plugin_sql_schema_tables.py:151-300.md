# a7046c18:packages_plugin-sql_python_elizaos_plugin_sql_schema_tables.py:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/python/elizaos_plugin_sql/schema/tables.py:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    agent = relationship("AgentTable", back_populates="rooms")
    world = relationship("WorldTable", back_populates="rooms")
    participants = relationship("ParticipantTable", back_populates="room")
    memories = relationship("MemoryTable", back_populates="room")

    __table_args__ = (
        Index("idx_rooms_agent_id", "agent_id"),
        Index("idx_rooms_world_id", "world_id"),
        Index("idx_rooms_source", "source"),
    )


class ParticipantTable(Base):
    """Participants table - stores room participants."""

    __tablename__ = "participants"

    id = Column(UUID(as_uuid=True), primary_key=True)
    entity_id = Column(
        UUID(as_uuid=True), ForeignKey("entities.id", ondelete="CASCADE"), nullable=False
    )
    room_id = Column(UUID(as_uuid=True), ForeignKey("rooms.id", ondelete="CASCADE"), nullable=False)
    user_state = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    entity = relationship("EntityTable", back_populates="participations")
    room = relationship("RoomTable", back_populates="participants")

    __table_args__ = (
        UniqueConstraint("entity_id", "room_id", name="uq_participant_entity_room"),
        Index("idx_participants_entity_id", "entity_id"),
        Index("idx_participants_room_id", "room_id"),
    )


class MemoryTable(Base):
    """Memories table - stores memories/messages."""

    __tablename__ = "memories"

    id = Column(UUID(as_uuid=True), primary_key=True)
    entity_id = Column(UUID(as_uuid=True), nullable=False)
    agent_id = Column(UUID(as_uuid=True), nullable=True)
    room_id = Column(UUID(as_uuid=True), ForeignKey("rooms.id", ondelete="CASCADE"), nullable=False)
    world_id = Column(UUID(as_uuid=True), nullable=True)
    content = Column(JSON, nullable=False)
    unique = Column(Boolean, default=False)
    memory_metadata = Column("metadata", JSON, default={})
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    room = relationship("RoomTable", back_populates="memories")
    embedding = relationship("EmbeddingTable", back_populates="memory", uselist=False)

    __table_args__ = (
        Index("idx_memories_room_id", "room_id"),
        Index("idx_memories_entity_id", "entity_id"),
        Index("idx_memories_agent_id", "agent_id"),
        Index("idx_memories_created_at", "created_at"),
    )


class EmbeddingTable(Base):
    """Embeddings table - stores vector embeddings for memories."""

    __tablename__ = "embeddings"

    id = Column(UUID(as_uuid=True), primary_key=True)
    memory_id = Column(
        UUID(as_uuid=True),
        ForeignKey("memories.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
    )
    # Vector stored as ARRAY of floats for compatibility
    # For production, use pgvector extension
    embedding_vector: Column[list[float]] = Column("embedding", ARRAY(Float), nullable=False)
    dimension = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    memory = relationship("MemoryTable", back_populates="embedding")

    __table_args__ = (Index("idx_embeddings_memory_id", "memory_id"),)


class RelationshipTable(Base):
    """Relationships table - stores entity relationships."""

    __tablename__ = "relationships"

    id = Column(UUID(as_uuid=True), primary_key=True)
    source_entity_id = Column(UUID(as_uuid=True), nullable=False)
    target_entity_id = Column(UUID(as_uuid=True), nullable=False)
    agent_id = Column(UUID(as_uuid=True), nullable=False)
    tags: Column[list[str]] = Column(ARRAY(String), default=[])
    relationship_metadata = Column("metadata", JSON, default={})
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    __table_args__ = (
        Index("idx_relationships_source", "source_entity_id"),
        Index("idx_relationships_target", "target_entity_id"),
        Index("idx_relationships_agent", "agent_id"),
    )


class TaskTable(Base):
    """Tasks table - stores task queue."""

    __tablename__ = "tasks"

    id = Column(UUID(as_uuid=True), primary_key=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    room_id = Column(UUID(as_uuid=True), nullable=True)
    entity_id = Column(UUID(as_uuid=True), nullable=True)
    world_id = Column(UUID(as_uuid=True), nullable=True)
    status = Column(String(50), default="pending", nullable=False)
    task_tags: Column[list[str]] = Column("tags", ARRAY(String), default=[])
    task_metadata = Column("metadata", JSON, default={})
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    __table_args__ = (
        Index("idx_tasks_name", "name"),
        Index("idx_tasks_status", "status"),
        Index("idx_tasks_room_id", "room_id"),
    )


class CacheTable(Base):
    """Cache table - stores key-value cache entries."""

    __tablename__ = "cache"

    key = Column(String(512), primary_key=True)
    value = Column(JSON, nullable=False)
    expires_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    __table_args__ = (Index("idx_cache_expires_at", "expires_at"),)


class LogTable(Base):
    """Logs table - stores activity logs."""

    __tablename__ = "logs"

    id = Column(UUID(as_uuid=True), primary_key=True)
```