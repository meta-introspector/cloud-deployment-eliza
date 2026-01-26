# a7046c18:packages_core_python_elizaos_types_events.py:151-236

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/elizaos/types/events.py:151-236
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```


class RunEventPayload(EventPayload):
    """Run event payload type."""

    run_id: UUID = Field(..., alias="runId", description="Run ID")
    message_id: UUID = Field(..., alias="messageId", description="Message ID")
    room_id: UUID = Field(..., alias="roomId", description="Room ID")
    entity_id: UUID = Field(..., alias="entityId", description="Entity ID")
    start_time: int = Field(..., alias="startTime", description="Start time")
    status: str = Field(..., description="Run status")
    end_time: int | None = Field(default=None, alias="endTime", description="End time")
    duration: int | None = Field(default=None, description="Duration in ms")
    error: str | None = Field(default=None, description="Error message")

    model_config = {"populate_by_name": True, "arbitrary_types_allowed": True}


class ActionEventPayload(EventPayload):
    """Action event payload type."""

    room_id: UUID = Field(..., alias="roomId", description="Room ID")
    world: UUID = Field(..., description="World ID")
    content: Content = Field(..., description="Content")
    message_id: UUID | None = Field(default=None, alias="messageId", description="Message ID")

    model_config = {"populate_by_name": True, "arbitrary_types_allowed": True}


class EvaluatorEventPayload(EventPayload):
    """Evaluator event payload type."""

    evaluator_id: UUID = Field(..., alias="evaluatorId", description="Evaluator ID")
    evaluator_name: str = Field(..., alias="evaluatorName", description="Evaluator name")
    start_time: int | None = Field(default=None, alias="startTime", description="Start time")
    completed: bool | None = Field(default=None, description="Whether completed")
    error: Exception | None = Field(default=None, description="Error if failed")

    model_config = {"populate_by_name": True, "arbitrary_types_allowed": True}


class ModelEventPayload(EventPayload):
    """Model event payload type."""

    provider: str = Field(..., description="Model provider")
    type: str = Field(..., description="Model type")
    prompt: str = Field(..., description="Prompt")
    tokens: dict[str, int] | None = Field(default=None, description="Token counts")

    model_config = {"populate_by_name": True, "arbitrary_types_allowed": True}


class EmbeddingGenerationPayload(EventPayload):
    """Payload for embedding generation events."""

    memory: Any = Field(..., description="Memory to embed")
    priority: str | None = Field(default=None, description="Priority level")
    retry_count: int | None = Field(default=None, alias="retryCount", description="Retry count")
    max_retries: int | None = Field(default=None, alias="maxRetries", description="Max retries")
    embedding: list[float] | None = Field(default=None, description="Embedding vector")
    error: Exception | str | Any | None = Field(default=None, description="Error")
    run_id: UUID | None = Field(default=None, alias="runId", description="Run ID")

    model_config = {"populate_by_name": True, "arbitrary_types_allowed": True}


class ControlMessage(BaseModel):
    """Control message for control events."""

    type: str = Field(..., description="Control message type")
    data: dict[str, Any] | None = Field(default=None, description="Message data")

    model_config = {"extra": "allow"}


class ControlMessagePayload(EventPayload):
    """Payload for control message events."""

    message: ControlMessage = Field(..., description="Control message")


# Event handler type
EventHandler = Callable[[EventPayload], Awaitable[None]]

# Event payload map type - maps event types to their payload types
EventPayloadMap = dict[EventType, type[EventPayload]]
```