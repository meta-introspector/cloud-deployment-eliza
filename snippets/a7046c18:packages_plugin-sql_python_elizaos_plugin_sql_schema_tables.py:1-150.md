# a7046c18:packages_plugin-sql_python_elizaos_plugin_sql_schema_tables.py:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/python/elizaos_plugin_sql/schema/tables.py:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
"""
SQLAlchemy table definitions for elizaOS.

These tables mirror the TypeScript Drizzle schema for compatibility.
"""

from __future__ import annotations

from datetime import datetime

from sqlalchemy import (
    JSON,
    Boolean,
    Column,
    DateTime,
    Float,
    ForeignKey,
    Index,
    Integer,
    String,
    Text,
    UniqueConstraint,
)
from sqlalchemy.dialects.postgresql import ARRAY, UUID
from sqlalchemy.orm import DeclarativeBase, relationship


class Base(DeclarativeBase):
    """Base class for all SQLAlchemy models."""

    pass


class AgentTable(Base):
    """Agents table - stores agent configurations."""

    __tablename__ = "agents"

    id = Column(UUID(as_uuid=True), primary_key=True)
    name = Column(String(255), nullable=False)
    username = Column(String(255), nullable=True)
    bio = Column(Text, nullable=True)
    system = Column(Text, nullable=True)
    settings = Column(JSON, nullable=True)
    secrets = Column(JSON, nullable=True)
    enabled = Column(Boolean, default=True)
    status = Column(String(50), default="active")
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    entities = relationship("EntityTable", back_populates="agent")
    rooms = relationship("RoomTable", back_populates="agent")
    worlds = relationship("WorldTable", back_populates="agent")

    __table_args__ = (Index("idx_agents_name", "name"),)


class EntityTable(Base):
    """Entities table - stores users and other entities."""

    __tablename__ = "entities"

    id = Column(UUID(as_uuid=True), primary_key=True)
    agent_id = Column(
        UUID(as_uuid=True), ForeignKey("agents.id", ondelete="CASCADE"), nullable=False
    )
    names: Column[list[str]] = Column(ARRAY(String), nullable=False)
    entity_metadata = Column("metadata", JSON, default={})
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    agent = relationship("AgentTable", back_populates="entities")
    components = relationship("ComponentTable", back_populates="entity")
    participations = relationship("ParticipantTable", back_populates="entity")

    __table_args__ = (Index("idx_entities_agent_id", "agent_id"),)


class ComponentTable(Base):
    """Components table - stores entity components."""

    __tablename__ = "components"

    id = Column(UUID(as_uuid=True), primary_key=True)
    entity_id = Column(
        UUID(as_uuid=True), ForeignKey("entities.id", ondelete="CASCADE"), nullable=False
    )
    agent_id = Column(UUID(as_uuid=True), nullable=False)
    room_id = Column(UUID(as_uuid=True), nullable=False)
    world_id = Column(UUID(as_uuid=True), nullable=False)
    source_entity_id = Column(UUID(as_uuid=True), nullable=False)
    type = Column(String(255), nullable=False)
    data = Column(JSON, default={})
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    entity = relationship("EntityTable", back_populates="components")

    __table_args__ = (
        Index("idx_components_entity_id", "entity_id"),
        Index("idx_components_type", "type"),
    )


class WorldTable(Base):
    """Worlds table - stores world/server containers."""

    __tablename__ = "worlds"

    id = Column(UUID(as_uuid=True), primary_key=True)
    name = Column(String(255), nullable=True)
    agent_id = Column(
        UUID(as_uuid=True), ForeignKey("agents.id", ondelete="CASCADE"), nullable=False
    )
    message_server_id = Column(UUID(as_uuid=True), nullable=True)
    world_metadata = Column("metadata", JSON, default={})
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    agent = relationship("AgentTable", back_populates="worlds")
    rooms = relationship("RoomTable", back_populates="world")

    __table_args__ = (Index("idx_worlds_agent_id", "agent_id"),)


class RoomTable(Base):
    """Rooms table - stores conversation rooms."""

    __tablename__ = "rooms"

    id = Column(UUID(as_uuid=True), primary_key=True)
    name = Column(String(255), nullable=True)
    agent_id = Column(
        UUID(as_uuid=True), ForeignKey("agents.id", ondelete="CASCADE"), nullable=True
    )
    source = Column(String(100), nullable=False)
    type = Column(String(50), nullable=False)
    channel_id = Column(String(255), nullable=True)
    message_server_id = Column(UUID(as_uuid=True), nullable=True)
    world_id = Column(
        UUID(as_uuid=True), ForeignKey("worlds.id", ondelete="SET NULL"), nullable=True
    )
    room_metadata = Column("metadata", JSON, default={})
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
```