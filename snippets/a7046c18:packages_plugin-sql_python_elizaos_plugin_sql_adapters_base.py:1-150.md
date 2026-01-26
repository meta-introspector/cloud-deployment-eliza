# a7046c18:packages_plugin-sql_python_elizaos_plugin_sql_adapters_base.py:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/python/elizaos_plugin_sql/adapters/base.py:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
"""
Base SQL adapter implementation.

This module provides the abstract base class for SQL database adapters.
"""

from __future__ import annotations

import uuid
from abc import abstractmethod
from datetime import datetime
from typing import Any

from elizaos.types import (
    UUID,
    IDatabaseAdapter,
    Log,
    as_uuid,
)
from sqlalchemy import and_, delete, func, or_, select, update
from sqlalchemy.ext.asyncio import (
    AsyncEngine,
    AsyncSession,
    async_sessionmaker,
)

from elizaos_plugin_sql.schema import (
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


class BaseSQLAdapter(IDatabaseAdapter):
    """
    Base class for SQL database adapters.

    Provides common implementation for database operations using SQLAlchemy.
    Subclasses must implement database-specific connection handling.
    """

    def __init__(self, agent_id: UUID) -> None:
        """Initialize the adapter."""
        self._agent_id = agent_id
        self._engine: AsyncEngine | None = None
        self._session_factory: async_sessionmaker[AsyncSession] | None = None
        self._embedding_dimension: int = 384

    @property
    def db(self) -> AsyncEngine:
        """Get the database engine."""
        if not self._engine:
            raise RuntimeError("Database not initialized")
        return self._engine

    @abstractmethod
    async def _create_engine(self) -> AsyncEngine:
        """Create the SQLAlchemy async engine. Must be implemented by subclasses."""
        ...

    async def initialize(self, config: dict[str, str | int | bool | None] | None = None) -> None:
        """Initialize the database connection."""
        _ = config  # Config handled elsewhere
        self._engine = await self._create_engine()
        self._session_factory = async_sessionmaker(
            self._engine, class_=AsyncSession, expire_on_commit=False
        )
        await self.init()

    async def init(self) -> None:
        """Initialize database tables."""
        if not self._engine:
            raise RuntimeError("Database engine not created")

        async with self._engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

    async def is_ready(self) -> bool:
        """Check if the database connection is ready."""
        if not self._engine:
            return False
        try:
            async with self._engine.connect() as conn:
                await conn.execute(select(1))
            return True
        except Exception:
            return False

    async def close(self) -> None:
        """Close the database connection."""
        if self._engine:
            await self._engine.dispose()
            self._engine = None

    async def get_connection(self) -> AsyncSession:
        """Get a database session."""
        if not self._session_factory:
            raise RuntimeError("Database not initialized")
        return self._session_factory()

    def _get_session(self) -> AsyncSession:
        """Get a new session from the factory."""
        if not self._session_factory:
            raise RuntimeError("Database not initialized")
        return self._session_factory()

    # Agent methods
    async def get_agent(self, agent_id: UUID) -> dict[str, Any] | None:
        """Get agent by ID."""
        async with self._get_session() as session:
            result = await session.execute(select(AgentTable).where(AgentTable.id == agent_id))
            agent = result.scalar_one_or_none()
            if agent:
                return self._agent_to_dict(agent)
            return None

    async def get_agents(self) -> list[dict[str, Any]]:
        """Get all agents."""
        async with self._get_session() as session:
            result = await session.execute(select(AgentTable))
            agents = result.scalars().all()
            return [self._agent_to_dict(a) for a in agents]

    async def create_agent(self, agent: dict[str, Any]) -> bool:
        """Create a new agent."""
        async with self._get_session() as session:
            try:
                db_agent = AgentTable(
                    id=agent.get("id") or uuid.uuid4(),
                    name=agent["name"],
                    username=agent.get("username"),
                    bio=agent.get("bio"),
                    system=agent.get("system"),
                    settings=agent.get("settings"),
                    secrets=agent.get("secrets"),
                    enabled=agent.get("enabled", True),
                    status=agent.get("status", "active"),
                )
                session.add(db_agent)
                await session.commit()
```