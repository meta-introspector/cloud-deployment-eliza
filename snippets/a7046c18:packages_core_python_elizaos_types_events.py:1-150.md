# a7046c18:packages_core_python_elizaos_types_events.py:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/elizaos/types/events.py:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
"""
Event types for elizaOS.

This module defines types for the event system.
"""

from __future__ import annotations

from collections.abc import Awaitable, Callable
from enum import Enum
from typing import TYPE_CHECKING, Any

from pydantic import BaseModel, Field

from elizaos.types.primitives import UUID, Content

if TYPE_CHECKING:
    pass


class EventType(str, Enum):
    """Standard event types across all platforms."""

    # World events
    WORLD_JOINED = "WORLD_JOINED"
    WORLD_CONNECTED = "WORLD_CONNECTED"
    WORLD_LEFT = "WORLD_LEFT"

    # Entity events
    ENTITY_JOINED = "ENTITY_JOINED"
    ENTITY_LEFT = "ENTITY_LEFT"
    ENTITY_UPDATED = "ENTITY_UPDATED"

    # Room events
    ROOM_JOINED = "ROOM_JOINED"
    ROOM_LEFT = "ROOM_LEFT"

    # Message events
    MESSAGE_RECEIVED = "MESSAGE_RECEIVED"
    MESSAGE_SENT = "MESSAGE_SENT"
    MESSAGE_DELETED = "MESSAGE_DELETED"

    # Channel events
    CHANNEL_CLEARED = "CHANNEL_CLEARED"

    # Voice events
    VOICE_MESSAGE_RECEIVED = "VOICE_MESSAGE_RECEIVED"
    VOICE_MESSAGE_SENT = "VOICE_MESSAGE_SENT"

    # Interaction events
    REACTION_RECEIVED = "REACTION_RECEIVED"
    POST_GENERATED = "POST_GENERATED"
    INTERACTION_RECEIVED = "INTERACTION_RECEIVED"

    # Run events
    RUN_STARTED = "RUN_STARTED"
    RUN_ENDED = "RUN_ENDED"
    RUN_TIMEOUT = "RUN_TIMEOUT"

    # Action events
    ACTION_STARTED = "ACTION_STARTED"
    ACTION_COMPLETED = "ACTION_COMPLETED"

    # Evaluator events
    EVALUATOR_STARTED = "EVALUATOR_STARTED"
    EVALUATOR_COMPLETED = "EVALUATOR_COMPLETED"

    # Model events
    MODEL_USED = "MODEL_USED"

    # Embedding events
    EMBEDDING_GENERATION_REQUESTED = "EMBEDDING_GENERATION_REQUESTED"
    EMBEDDING_GENERATION_COMPLETED = "EMBEDDING_GENERATION_COMPLETED"
    EMBEDDING_GENERATION_FAILED = "EMBEDDING_GENERATION_FAILED"

    # Control events
    CONTROL_MESSAGE = "CONTROL_MESSAGE"


class PlatformPrefix(str, Enum):
    """Platform-specific event type prefix."""

    DISCORD = "DISCORD"
    TELEGRAM = "TELEGRAM"
    TWITTER = "TWITTER"


class EventPayload(BaseModel):
    """Base payload interface for all events."""

    runtime: Any = Field(..., description="Agent runtime")
    source: str = Field(..., description="Event source")
    on_complete: Callable[[], None] | None = Field(
        default=None, alias="onComplete", description="Completion callback"
    )

    model_config = {"populate_by_name": True, "arbitrary_types_allowed": True}


class WorldPayload(EventPayload):
    """Payload for world-related events."""

    world: Any = Field(..., description="World object")
    rooms: list[Any] = Field(..., description="Rooms in the world")
    entities: list[Any] = Field(..., description="Entities in the world")


class EntityPayload(EventPayload):
    """Payload for entity-related events."""

    entity_id: UUID = Field(..., alias="entityId", description="Entity ID")
    world_id: UUID | None = Field(default=None, alias="worldId", description="World ID")
    room_id: UUID | None = Field(default=None, alias="roomId", description="Room ID")
    metadata: dict[str, Any] | None = Field(default=None, description="Entity metadata")

    model_config = {"populate_by_name": True, "arbitrary_types_allowed": True}


class MessagePayload(EventPayload):
    """Payload for message-related events."""

    message: Any = Field(..., description="Message memory")
    callback: Callable[[Content], Awaitable[list[Any]]] | None = Field(
        default=None, description="Message callback"
    )

    model_config = {"arbitrary_types_allowed": True}


class ChannelClearedPayload(EventPayload):
    """Payload for channel cleared events."""

    room_id: UUID = Field(..., alias="roomId", description="Room ID")
    channel_id: str = Field(..., alias="channelId", description="Channel ID")
    memory_count: int = Field(..., alias="memoryCount", description="Number of memories cleared")

    model_config = {"populate_by_name": True, "arbitrary_types_allowed": True}


class InvokePayload(EventPayload):
    """Payload for events invoked without a message."""

    world_id: UUID = Field(..., alias="worldId", description="World ID")
    user_id: str = Field(..., alias="userId", description="User ID")
    room_id: UUID = Field(..., alias="roomId", description="Room ID")
    callback: Callable[[Content], Awaitable[list[Any]]] | None = Field(
        default=None, description="Callback"
    )

    model_config = {"populate_by_name": True, "arbitrary_types_allowed": True}
```