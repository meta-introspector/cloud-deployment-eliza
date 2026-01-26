# a7046c18:packages_core_python_elizaos_types_database.py:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/elizaos/types/database.py:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
"""
Database types for elizaOS.

This module defines the IDatabaseAdapter interface and related types.
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from typing import Any, Literal

from pydantic import BaseModel, Field

from elizaos.types.primitives import UUID


class BaseLogBody(BaseModel):
    """Base log body type with common properties."""

    run_id: str | UUID | None = Field(default=None, alias="runId")
    status: str | None = None
    message_id: UUID | None = Field(default=None, alias="messageId")
    room_id: UUID | None = Field(default=None, alias="roomId")
    entity_id: UUID | None = Field(default=None, alias="entityId")
    metadata: dict[str, Any] | None = None

    model_config = {"populate_by_name": True, "extra": "allow"}


class ActionLogBody(BaseLogBody):
    """Log body for action logs."""

    action: str | None = None
    action_id: UUID | str | None = Field(default=None, alias="actionId")
    message: str | None = None
    state: Any | None = None
    responses: Any | None = None
    content: dict[str, Any] | None = None
    result: dict[str, Any] | None = None
    is_legacy_return: bool | None = Field(default=None, alias="isLegacyReturn")
    prompts: list[dict[str, Any]] | None = None
    prompt_count: int | None = Field(default=None, alias="promptCount")
    plan_step: str | None = Field(default=None, alias="planStep")
    plan_thought: str | None = Field(default=None, alias="planThought")


class EvaluatorLogBody(BaseLogBody):
    """Log body for evaluator logs."""

    evaluator: str | None = None
    message: str | None = None
    state: Any | None = None


class ModelLogBody(BaseLogBody):
    """Log body for model logs."""

    model_type: str | None = Field(default=None, alias="modelType")
    model_key: str | None = Field(default=None, alias="modelKey")
    params: dict[str, Any] | None = None
    prompt: str | None = None
    system_prompt: str | None = Field(default=None, alias="systemPrompt")
    timestamp: int | None = None
    execution_time: int | None = Field(default=None, alias="executionTime")
    provider: str | None = None
    action_context: dict[str, Any] | None = Field(default=None, alias="actionContext")
    response: Any | None = None


class EmbeddingLogBody(BaseLogBody):
    """Log body for embedding logs."""

    memory_id: str | None = Field(default=None, alias="memoryId")
    duration: int | None = None


# Union type for all log body types
LogBody = BaseLogBody | ActionLogBody | EvaluatorLogBody | ModelLogBody | EmbeddingLogBody


class Log(BaseModel):
    """Represents a log entry."""

    id: UUID | None = Field(default=None, description="Optional unique identifier")
    entity_id: UUID = Field(..., alias="entityId", description="Associated entity ID")
    room_id: UUID | None = Field(default=None, alias="roomId", description="Associated room ID")
    body: LogBody = Field(..., description="Log body")
    type: str = Field(..., description="Log type")
    created_at: int = Field(..., alias="createdAt", description="Log creation timestamp")

    model_config = {"populate_by_name": True}


# Run status type
RunStatus = Literal["started", "completed", "timeout", "error"]


class AgentRunCounts(BaseModel):
    """Counts for an agent run."""

    actions: int = 0
    model_calls: int = Field(default=0, alias="modelCalls")
    errors: int = 0
    evaluators: int = 0

    model_config = {"populate_by_name": True}


class AgentRunSummary(BaseModel):
    """Summary of an agent run."""

    run_id: str = Field(..., alias="runId")
    status: RunStatus
    started_at: int | None = Field(default=None, alias="startedAt")
    ended_at: int | None = Field(default=None, alias="endedAt")
    duration_ms: int | None = Field(default=None, alias="durationMs")
    message_id: UUID | None = Field(default=None, alias="messageId")
    room_id: UUID | None = Field(default=None, alias="roomId")
    entity_id: UUID | None = Field(default=None, alias="entityId")
    metadata: dict[str, Any] | None = None
    counts: AgentRunCounts | None = None

    model_config = {"populate_by_name": True}


class AgentRunSummaryResult(BaseModel):
    """Result of agent run summary query."""

    runs: list[AgentRunSummary]
    total: int
    has_more: bool = Field(..., alias="hasMore")

    model_config = {"populate_by_name": True}


class EmbeddingSearchResult(BaseModel):
    """Result interface for embedding similarity searches."""

    embedding: list[float]
    levenshtein_score: float = Field(..., alias="levenshteinScore")

    model_config = {"populate_by_name": True}


class MemoryRetrievalOptions(BaseModel):
    """Options for memory retrieval operations."""

    room_id: UUID = Field(..., alias="roomId")
    count: int | None = None
    unique: bool | None = None
```