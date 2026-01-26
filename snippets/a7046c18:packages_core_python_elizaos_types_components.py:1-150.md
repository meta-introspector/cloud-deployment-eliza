# a7046c18:packages_core_python_elizaos_types_components.py:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/elizaos/types/components.py:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
"""
Component types for elizaOS.

This module defines types for Actions, Providers, Evaluators, and related components.
"""

from __future__ import annotations

from collections.abc import Awaitable, Callable
from typing import TYPE_CHECKING, Any

from pydantic import BaseModel, Field

from elizaos.types.memory import Memory
from elizaos.types.primitives import Content

if TYPE_CHECKING:
    from elizaos.types.runtime import IAgentRuntime
    from elizaos.types.state import State


class ActionExample(BaseModel):
    """Example content with associated user for demonstration purposes."""

    name: str = Field(..., description="User associated with the example")
    content: Content = Field(..., description="Content of the example")

    model_config = {"populate_by_name": True}


class ActionResult(BaseModel):
    """Result returned by an action after execution."""

    text: str | None = Field(default=None, description="Optional text description of the result")
    values: dict[str, Any] | None = Field(
        default=None, description="Values to merge into the state"
    )
    data: dict[str, Any] | None = Field(
        default=None, description="Data payload containing action-specific results"
    )
    success: bool = Field(..., description="Whether the action succeeded")
    error: str | None = Field(default=None, description="Error message if the action failed")

    model_config = {"populate_by_name": True}


class ActionContext(BaseModel):
    """Context provided to actions during execution."""

    previous_results: list[ActionResult] = Field(
        ..., alias="previousResults", description="Results from previously executed actions"
    )

    model_config = {"populate_by_name": True}

    def get_previous_result(self, action_name: str) -> ActionResult | None:
        """Get a specific previous result by action name."""
        # TODO: Implementation would need action name tracking in previous_results
        _ = action_name  # Placeholder for future implementation
        return None


class ActionPlanStepInfo(BaseModel):
    """Information about an action step in a plan."""

    action: str = Field(..., description="Action name")
    status: str = Field(..., description="Step status: 'pending', 'completed', or 'failed'")
    result: ActionResult | None = Field(default=None, description="Step result")
    error: str | None = Field(default=None, description="Error if step failed")


class ActionPlanInfo(BaseModel):
    """Multi-step action plan information."""

    total_steps: int = Field(..., alias="totalSteps", description="Total number of steps")
    current_step: int = Field(
        ..., alias="currentStep", description="Current step being executed (1-based)"
    )
    steps: list[ActionPlanStepInfo] = Field(
        ..., description="Array of action steps with status tracking"
    )
    thought: str = Field(..., description="AI's reasoning for this execution plan")

    model_config = {"populate_by_name": True}


class HandlerOptions(BaseModel):
    """Options passed to action handlers during execution."""

    action_context: ActionContext | None = Field(
        default=None,
        alias="actionContext",
        description="Context with previous action results",
    )
    action_plan: ActionPlanInfo | None = Field(
        default=None,
        alias="actionPlan",
        description="Multi-step action plan information",
    )

    model_config = {"populate_by_name": True, "extra": "allow"}


# Type aliases for handler and validator functions
HandlerCallback = Callable[[Content], Awaitable[list[Memory]]]

Handler = Callable[
    [
        "IAgentRuntime",
        Memory,
        "State | None",
        HandlerOptions | None,
        HandlerCallback | None,
        list[Memory] | None,
    ],
    Awaitable[ActionResult | None],
]

Validator = Callable[
    ["IAgentRuntime", Memory, "State | None"],
    Awaitable[bool],
]


class Action(BaseModel):
    """Represents an action the agent can perform."""

    name: str = Field(..., description="Action name")
    description: str = Field(..., description="Detailed description")
    similes: list[str] | None = Field(default=None, description="Similar action descriptions")
    examples: list[list[ActionExample]] | None = Field(default=None, description="Example usages")
    handler: Handler = Field(..., description="Handler function")
    validate_fn: Validator = Field(..., alias="validate", description="Validation function")

    model_config = {"populate_by_name": True, "extra": "allow", "arbitrary_types_allowed": True}


class EvaluationExample(BaseModel):
    """Example for evaluating agent behavior."""

    prompt: str = Field(..., description="Evaluation context")
    messages: list[ActionExample] = Field(..., description="Example messages")
    outcome: str = Field(..., description="Expected outcome")

    model_config = {"populate_by_name": True}


class Evaluator(BaseModel):
    """Evaluator for assessing agent responses."""

```