# a7046c18:packages_core_python_elizaos_types_agent.py:1-125

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/elizaos/types/agent.py:1-125
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
"""
Agent types for elizaOS.

This module defines types for agent and character configuration.
"""

from __future__ import annotations

from collections.abc import Callable
from enum import Enum

from pydantic import BaseModel, Field, field_validator

from elizaos.types.primitives import UUID, Content


class MessageExample(BaseModel):
    """Example message for demonstration."""

    name: str = Field(..., description="Associated user")
    content: Content = Field(..., description="Message content")

    model_config = {"populate_by_name": True}


# Template type can be a string or a callable that takes state and returns a string
TemplateType = str | Callable[[dict[str, object]], str]


class DirectoryItem(BaseModel):
    """Directory-based knowledge source."""

    directory: str = Field(..., description="Path to directory containing knowledge files")
    shared: bool | None = Field(
        default=None, description="Whether this knowledge is shared across characters"
    )


class PathItem(BaseModel):
    """File path-based knowledge source."""

    path: str = Field(..., description="Path to a knowledge file")
    shared: bool | None = Field(
        default=None, description="Whether this knowledge is shared across characters"
    )


# Knowledge item can be a string path, PathItem, or DirectoryItem
KnowledgeItem = str | PathItem | DirectoryItem


class StyleConfig(BaseModel):
    """Writing style configuration."""

    all: list[str] | None = Field(
        default=None, description="Style guidelines applied to all types of responses"
    )
    chat: list[str] | None = Field(
        default=None, description="Style guidelines specific to chat responses"
    )
    post: list[str] | None = Field(
        default=None, description="Style guidelines specific to social media posts"
    )


class Character(BaseModel):
    """
    Configuration for an agent's character, defining its personality,
    knowledge, and capabilities.
    """

    id: UUID | None = Field(default=None, description="Optional unique identifier")
    name: str = Field(..., min_length=1, description="Character name")
    username: str | None = Field(default=None, description="Optional username")
    system: str | None = Field(default=None, description="Optional system prompt")
    templates: dict[str, str] | None = Field(default=None, description="Optional prompt templates")
    bio: str | list[str] = Field(..., description="Character biography")
    message_examples: list[list[MessageExample]] | None = Field(
        default=None, alias="messageExamples", description="Example messages"
    )
    post_examples: list[str] | None = Field(
        default=None, alias="postExamples", description="Example posts"
    )
    topics: list[str] | None = Field(default=None, description="Known topics")
    adjectives: list[str] | None = Field(default=None, description="Character traits")
    knowledge: list[KnowledgeItem] | None = Field(
        default=None, description="Optional knowledge base"
    )
    plugins: list[str] | None = Field(default=None, description="Available plugins")
    settings: dict[str, str | bool | int | float | dict[str, object]] | None = Field(
        default=None, description="Optional configuration"
    )
    secrets: dict[str, str | bool | int] | None = Field(
        default=None, description="Optional secrets"
    )
    style: StyleConfig | None = Field(default=None, description="Writing style guides")

    model_config = {"populate_by_name": True, "extra": "forbid"}

    @field_validator("bio", mode="before")
    @classmethod
    def normalize_bio(cls, v: str | list[str]) -> str | list[str]:
        """Accept both string and list for bio."""
        return v


class AgentStatus(str, Enum):
    """Agent operational status."""

    ACTIVE = "active"
    INACTIVE = "inactive"


class Agent(Character):
    """
    Represents an operational agent, extending the Character definition
    with runtime status and timestamps.
    """

    enabled: bool | None = Field(default=None, description="Whether the agent is currently active")
    status: AgentStatus | None = Field(default=None, description="Current operational status")
    created_at: int = Field(..., alias="createdAt", description="Creation timestamp")
    updated_at: int = Field(..., alias="updatedAt", description="Last update timestamp")

    model_config = {"populate_by_name": True, "extra": "allow"}
```