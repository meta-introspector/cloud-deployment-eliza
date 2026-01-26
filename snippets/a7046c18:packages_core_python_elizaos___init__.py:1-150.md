# a7046c18:packages_core_python_elizaos___init__.py:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/elizaos/__init__.py:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
"""
elizaOS Core - The Python runtime and types for elizaOS AI agents.

This package provides the core functionality for building AI agents with elizaOS,
including the AgentRuntime, plugin system, and all core types.
"""

from elizaos.character import parse_character, validate_character_config
from elizaos.logger import Logger, create_logger
from elizaos.plugin import load_plugin, register_plugin
from elizaos.runtime import AgentRuntime
from elizaos.types import (
    UUID,
    Action,
    ActionContext,
    ActionExample,
    ActionResult,
    Agent,
    AgentStatus,
    BaseMetadata,
    ChannelType,
    Character,
    Component,
    Content,
    ContentType,
    CustomMetadata,
    DescriptionMetadata,
    DocumentMetadata,
    Entity,
    EvaluationExample,
    Evaluator,
    EventPayload,
    EventType,
    FragmentMetadata,
    HandlerCallback,
    HandlerOptions,
    Log,
    Media,
    Memory,
    MemoryMetadata,
    MemoryScope,
    MemoryType,
    MentionContext,
    MessageExample,
    MessageMemory,
    MessageMetadata,
    Metadata,
    ModelType,
    Participant,
    Plugin,
    Provider,
    ProviderResult,
    Relationship,
    Role,
    Room,
    Route,
    RouteRequest,
    RouteResponse,
    Service,
    ServiceType,
    ServiceTypeName,
    State,
    StateData,
    Task,
    TaskWorker,
    World,
    as_uuid,
)
from elizaos.types.database import IDatabaseAdapter  # noqa: E402

# Rebuild models with forward references
from elizaos.types.runtime import IAgentRuntime  # noqa: E402

_rebuild_ns = {
    "IAgentRuntime": IAgentRuntime,
    "IDatabaseAdapter": IDatabaseAdapter,
    "Service": Service,
    "Action": Action,
    "Evaluator": Evaluator,
    "Provider": Provider,
    "Task": Task,
    "Memory": Memory,
    "State": State,
    "Character": Character,
    "Plugin": Plugin,
    "Route": Route,
    "HandlerOptions": HandlerOptions,
    "ActionResult": ActionResult,
}
Plugin.model_rebuild(_types_namespace=_rebuild_ns)
Action.model_rebuild(_types_namespace=_rebuild_ns)
Evaluator.model_rebuild(_types_namespace=_rebuild_ns)
Provider.model_rebuild(_types_namespace=_rebuild_ns)
TaskWorker.model_rebuild(_types_namespace=_rebuild_ns)

__version__ = "1.0.0"

__all__ = [
    # Runtime
    "AgentRuntime",
    # Types - Primitives
    "UUID",
    "as_uuid",
    "Content",
    "ContentType",
    "Media",
    "Metadata",
    "MentionContext",
    # Types - Memory
    "Memory",
    "MessageMemory",
    "MemoryType",
    "MemoryScope",
    "MemoryMetadata",
    "BaseMetadata",
    "DocumentMetadata",
    "FragmentMetadata",
    "MessageMetadata",
    "DescriptionMetadata",
    "CustomMetadata",
    # Types - Agent
    "Character",
    "Agent",
    "AgentStatus",
    "MessageExample",
    # Types - Environment
    "Entity",
    "Component",
    "World",
    "Room",
    "ChannelType",
    "Role",
    "Participant",
    "Relationship",
    # Types - Components
    "Action",
    "ActionExample",
    "ActionResult",
    "ActionContext",
    "Evaluator",
    "EvaluationExample",
    "Provider",
    "ProviderResult",
    "HandlerCallback",
    "HandlerOptions",
    # Types - Plugin
    "Plugin",
    "Route",
    "RouteRequest",
    "RouteResponse",
```