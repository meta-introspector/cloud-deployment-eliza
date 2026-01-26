# a7046c18:packages_python-plugin-starter_elizaos_plugin_starter_plugin.py:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/python-plugin-starter/elizaos_plugin_starter/plugin.py:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
"""
elizaOS Python Plugin Starter Implementation

This module provides a template for creating elizaOS plugins in Python.
"""

from __future__ import annotations

from typing import TYPE_CHECKING, Any

from elizaos.types.plugin import Plugin
from elizaos.types.components import (
    Action,
    ActionResult,
    Provider,
    ProviderResult,
    HandlerOptions,
)
from elizaos.types.memory import Memory
from elizaos.types.state import State
from elizaos.types.service import Service
from elizaos.logger import create_logger

if TYPE_CHECKING:
    from elizaos.types.runtime import IAgentRuntime

logger = create_logger(namespace="python-plugin-starter")


# =============================================================================
# Actions
# =============================================================================


async def hello_python_validate(
    runtime: "IAgentRuntime",
    message: Memory,
    state: State | None,
) -> bool:
    """Validate the HELLO_PYTHON action."""
    # Always valid - you can add your validation logic here
    return True


async def hello_python_handler(
    runtime: "IAgentRuntime",
    message: Memory,
    state: State | None,
    options: HandlerOptions | None,
    callback: Any | None,
    responses: list[Memory] | None,
) -> ActionResult | None:
    """Handle the HELLO_PYTHON action."""
    try:
        # Get the user's message
        user_text = message.content.text if message.content else "friend"

        response_text = f"Hello from Python, {user_text}! 🐍"

        # Optionally call the callback to stream the response
        if callback:
            await callback(
                {
                    "text": response_text,
                    "actions": ["HELLO_PYTHON"],
                    "source": message.content.source if message.content else None,
                }
            )

        return ActionResult(
            success=True,
            text=response_text,
            data={
                "language": "python",
                "greeting": response_text,
            },
        )

    except Exception as e:
        logger.error(f"Error in HELLO_PYTHON action: {e}")
        return ActionResult(
            success=False,
            error=str(e),
        )


hello_python_action = Action(
    name="HELLO_PYTHON",
    description="Says hello from Python - demonstrates a basic Python action",
    similes=["GREET_PYTHON", "PYTHON_HELLO", "SAY_HI_PYTHON"],
    examples=[
        [
            {"name": "{{userName}}", "content": {"text": "hello", "actions": []}},
            {
                "name": "{{agentName}}",
                "content": {"text": "Hello from Python! 🐍", "actions": ["HELLO_PYTHON"]},
            },
        ]
    ],
    validate=hello_python_validate,
    handler=hello_python_handler,
)


# =============================================================================
# Providers
# =============================================================================


async def python_info_get(
    runtime: "IAgentRuntime",
    message: Memory,
    state: State,
) -> ProviderResult:
    """Get Python plugin information."""
    import sys
    import platform

    return ProviderResult(
        text="This is a Python plugin running via the elizaOS runtime!",
        values={
            "language": "python",
            "version": sys.version,
            "platform": platform.platform(),
        },
        data={
            "runtime_info": {
                "python_version": sys.version_info[:3],
                "implementation": platform.python_implementation(),
            }
        },
    )


python_info_provider = Provider(
    name="PYTHON_INFO",
    description="Provides information about the Python plugin and environment",
    dynamic=True,
    get=python_info_get,
)


# =============================================================================
# Services
# =============================================================================


class StarterService(Service):
    """
    Example service that demonstrates service lifecycle.
```