# a7046c18:packages_core_python_elizaos_types_runtime.py:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/elizaos/types/runtime.py:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
"""
Runtime types for elizaOS.

This module defines the IAgentRuntime interface and related types.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from collections.abc import Awaitable, Callable
from typing import TYPE_CHECKING, Any

from pydantic import BaseModel, Field

from elizaos.types.database import IDatabaseAdapter
from elizaos.types.primitives import UUID, Content

if TYPE_CHECKING:
    from elizaos.types.agent import Character
    from elizaos.types.components import (
        Action,
        ActionResult,
        Evaluator,
        HandlerCallback,
        Provider,
    )
    from elizaos.types.environment import Entity, Room, World
    from elizaos.types.memory import Memory
    from elizaos.types.model import (
        GenerateTextOptions,
        GenerateTextResult,
    )
    from elizaos.types.plugin import Plugin, Route
    from elizaos.types.service import Service
    from elizaos.types.state import State
    from elizaos.types.task import TaskWorker


# Runtime settings type
RuntimeSettings = dict[str, str | bool | int | float | None]


# Send handler function type
SendHandlerFunction = Callable[[Any, Content], Awaitable[None]]


class TargetInfo(BaseModel):
    """Target information for sending messages."""

    room_id: UUID | None = Field(default=None, alias="roomId")
    entity_id: UUID | None = Field(default=None, alias="entityId")
    world_id: UUID | None = Field(default=None, alias="worldId")
    source: str | None = None

    model_config = {"populate_by_name": True, "extra": "allow"}


class IAgentRuntime(IDatabaseAdapter, ABC):
    """
    Represents the core runtime environment for an agent.
    Defines methods for database interaction, plugin management, event handling,
    state composition, model usage, and task management.
    """

    # Properties that must be implemented
    @property
    @abstractmethod
    def agent_id(self) -> UUID:
        """Get the agent's UUID."""
        ...

    @property
    @abstractmethod
    def character(self) -> Character:
        """Get the agent's character configuration."""
        ...

    @property
    @abstractmethod
    def providers(self) -> list[Provider]:
        """Get registered providers."""
        ...

    @property
    @abstractmethod
    def actions(self) -> list[Action]:
        """Get registered actions."""
        ...

    @property
    @abstractmethod
    def evaluators(self) -> list[Evaluator]:
        """Get registered evaluators."""
        ...

    @property
    @abstractmethod
    def plugins(self) -> list[Plugin]:
        """Get registered plugins."""
        ...

    @property
    @abstractmethod
    def services(self) -> dict[str, list[Service]]:
        """Get registered services."""
        ...

    @property
    @abstractmethod
    def routes(self) -> list[Route]:
        """Get registered routes."""
        ...

    # Plugin management
    @abstractmethod
    async def register_plugin(self, plugin: Plugin) -> None:
        """Register a plugin with the runtime."""
        ...

    @abstractmethod
    async def initialize(self, config: dict[str, str | int | bool | None] | None = None) -> None:
        """Initialize the runtime."""
        ...

    # Service management
    @abstractmethod
    def get_service(self, service: str) -> Service | None:
        """Get a service by type."""
        ...

    @abstractmethod
    def get_services_by_type(self, service: str) -> list[Service]:
        """Get all services of a type."""
        ...

    @abstractmethod
    def get_all_services(self) -> dict[str, list[Service]]:
        """Get all registered services."""
        ...

    @abstractmethod
    async def register_service(self, service: type[Service]) -> None:
        """Register a service class."""
        ...

    @abstractmethod
    async def get_service_load_promise(self, service_type: str) -> Service:
        """Get a promise that resolves when the service is loaded."""
        ...

```