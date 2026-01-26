# a7046c18:packages_core_python_elizaos_runtime.py:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/elizaos/runtime.py:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
"""
AgentRuntime implementation for elizaOS.

This module provides the main runtime for elizaOS agents.
"""

from __future__ import annotations

import asyncio
import uuid
from collections.abc import Awaitable, Callable
from typing import Any

from elizaos.logger import create_logger
from elizaos.types.agent import Character
from elizaos.types.components import (
    Action,
    ActionResult,
    Evaluator,
    HandlerCallback,
    HandlerOptions,
    Provider,
)
from elizaos.types.database import AgentRunSummaryResult, IDatabaseAdapter, Log
from elizaos.types.environment import Entity, Room, World
from elizaos.types.events import EventType
from elizaos.types.memory import Memory
from elizaos.types.model import GenerateTextOptions, GenerateTextResult, ModelType
from elizaos.types.plugin import Plugin, Route
from elizaos.types.primitives import UUID, Content, as_uuid
from elizaos.types.runtime import IAgentRuntime, RuntimeSettings, SendHandlerFunction, TargetInfo
from elizaos.types.service import Service
from elizaos.types.state import State, StateData
from elizaos.types.task import TaskWorker


class ModelHandler:
    """Represents a registered model handler."""

    def __init__(
        self,
        handler: Callable[[IAgentRuntime, dict[str, Any]], Awaitable[Any]],
        provider: str,
        priority: int = 0,
    ) -> None:
        self.handler = handler
        self.provider = provider
        self.priority = priority


class AgentRuntime(IAgentRuntime):
    """
    Main runtime for elizaOS agents.

    This class implements the IAgentRuntime interface and provides
    the core functionality for running AI agents.
    """

    def __init__(
        self,
        character: Character,
        agent_id: UUID | None = None,
        adapter: IDatabaseAdapter | None = None,
        plugins: list[Plugin] | None = None,
        settings: RuntimeSettings | None = None,
        conversation_length: int = 32,
    ) -> None:
        """
        Initialize the AgentRuntime.

        Args:
            character: The agent's character configuration
            agent_id: Optional agent ID (generated if not provided)
            adapter: Optional database adapter
            plugins: Optional list of plugins to register
            settings: Optional runtime settings
            conversation_length: Number of messages to keep in context
        """
        # Generate agent ID from character name or random UUID
        self._agent_id = agent_id or as_uuid(str(uuid.uuid5(uuid.NAMESPACE_DNS, character.name)))
        self._character = character
        self._adapter = adapter
        self._conversation_length = conversation_length
        self._settings: RuntimeSettings = settings or {}

        # Initialize collections
        self._providers: list[Provider] = []
        self._actions: list[Action] = []
        self._evaluators: list[Evaluator] = []
        self._plugins: list[Plugin] = []
        self._services: dict[str, list[Service]] = {}
        self._routes: list[Route] = []
        self._events: dict[str, list[Callable[[Any], Awaitable[None]]]] = {}
        self._models: dict[str, list[ModelHandler]] = {}
        self._task_workers: dict[str, TaskWorker] = {}
        self._send_handlers: dict[str, SendHandlerFunction] = {}
        self._state_cache: dict[str, State] = {}

        # Run tracking
        self._current_run_id: UUID | None = None
        self._current_room_id: UUID | None = None

        # Action results cache
        self._action_results: dict[str, list[ActionResult]] = {}

        # Logger
        self.logger = create_logger(namespace=character.name)

        # Store initial plugins for later registration
        self._initial_plugins = plugins or []

        # Initialization promise tracking
        self._init_complete = False
        self._init_event = asyncio.Event()

    # Properties
    @property
    def agent_id(self) -> UUID:
        return self._agent_id

    @property
    def character(self) -> Character:
        return self._character

    @property
    def providers(self) -> list[Provider]:
        return self._providers

    @property
    def actions(self) -> list[Action]:
        return self._actions

    @property
    def evaluators(self) -> list[Evaluator]:
        return self._evaluators

    @property
    def plugins(self) -> list[Plugin]:
        return self._plugins

    @property
    def services(self) -> dict[str, list[Service]]:
        return self._services

    @property
    def routes(self) -> list[Route]:
        return self._routes

    @property
    def db(self) -> Any:
```