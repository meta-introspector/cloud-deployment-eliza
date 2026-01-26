# a7046c18:packages_core_python_elizaos_types_plugin.py:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/elizaos/types/plugin.py:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
"""
Plugin types for elizaOS.

This module defines types for plugins and routes.
"""

from __future__ import annotations

from collections.abc import Awaitable, Callable
from typing import TYPE_CHECKING, Any, Literal

from pydantic import BaseModel, Field

if TYPE_CHECKING:
    from elizaos.types.agent import Character
    from elizaos.types.components import Action, Evaluator, Provider
    from elizaos.types.database import IDatabaseAdapter
    from elizaos.types.runtime import IAgentRuntime
    from elizaos.types.service import Service


class RouteRequest(BaseModel):
    """Minimal request interface for route handlers."""

    body: Any | None = Field(default=None, description="Request body")
    params: dict[str, str] | None = Field(default=None, description="Route parameters")
    query: dict[str, Any] | None = Field(default=None, description="Query parameters")
    headers: dict[str, str | list[str] | None] | None = Field(
        default=None, description="Request headers"
    )
    method: str | None = Field(default=None, description="HTTP method")
    path: str | None = Field(default=None, description="Request path")
    url: str | None = Field(default=None, description="Full URL")

    model_config = {"extra": "allow"}


class RouteResponse:
    """Minimal response interface for route handlers."""

    def __init__(self) -> None:
        self._status_code: int = 200
        self._headers: dict[str, str | list[str]] = {}
        self._body: Any = None
        self.headers_sent: bool = False

    def status(self, code: int) -> RouteResponse:
        """Set the response status code."""
        self._status_code = code
        return self

    def json(self, data: Any) -> RouteResponse:
        """Send JSON response."""
        self._body = data
        return self

    def send(self, data: Any) -> RouteResponse:
        """Send response data."""
        self._body = data
        return self

    def end(self) -> RouteResponse:
        """End the response."""
        self.headers_sent = True
        return self

    def set_header(self, name: str, value: str | list[str]) -> RouteResponse:
        """Set a response header."""
        self._headers[name] = value
        return self


# Route handler type
RouteHandler = Callable[
    [RouteRequest, RouteResponse, "IAgentRuntime"],
    Awaitable[None],
]


class Route(BaseModel):
    """Route definition for plugin HTTP routes."""

    type: Literal["GET", "POST", "PUT", "PATCH", "DELETE", "STATIC"] = Field(
        ..., description="HTTP method"
    )
    path: str = Field(..., description="Route path")
    file_path: str | None = Field(default=None, alias="filePath", description="Static file path")
    public: bool | None = Field(default=None, description="Whether route is public")
    name: str | None = Field(default=None, description="Route name for tab display")
    handler: RouteHandler | None = Field(default=None, description="Route handler")
    is_multipart: bool | None = Field(
        default=None,
        alias="isMultipart",
        description="Whether route expects multipart/form-data",
    )

    model_config = {"populate_by_name": True, "arbitrary_types_allowed": True}


# Plugin events type - maps event names to lists of event handlers
PluginEvents = dict[str, list[Callable[[Any], Awaitable[None]]]]


class TestCase(BaseModel):
    """Test case definition for plugin tests."""

    name: str = Field(..., description="Test case name")
    fn: Callable[[IAgentRuntime], Awaitable[None]] = Field(..., description="Test function")

    model_config = {"arbitrary_types_allowed": True}


class TestSuite(BaseModel):
    """Test suite definition for plugin tests."""

    name: str = Field(..., description="Test suite name")
    tests: list[TestCase] = Field(..., description="Test cases")

    model_config = {"arbitrary_types_allowed": True}


class ComponentTypeDefinition(BaseModel):
    """Component type definition for plugins."""

    name: str = Field(..., description="Component type name")
    schema_def: dict[str, Any] = Field(..., alias="schema", description="Component schema")
    validator: Callable[[Any], bool] | None = Field(
        default=None, description="Optional validator function"
    )

    model_config = {"arbitrary_types_allowed": True, "populate_by_name": True}


class Plugin(BaseModel):
    """Plugin for extending agent functionality."""

    name: str = Field(..., description="Unique name for the plugin")
    description: str = Field(..., description="Human-readable description")

    # Initialize plugin with runtime services
    init: (
        Callable[[dict[str, str | int | float | bool | None], IAgentRuntime], Awaitable[None]]
        | None
    ) = Field(default=None, description="Plugin initialization function")

    # Configuration
    config: dict[str, str | int | float | bool | None] | None = Field(
        default=None, description="Plugin configuration"
    )

```