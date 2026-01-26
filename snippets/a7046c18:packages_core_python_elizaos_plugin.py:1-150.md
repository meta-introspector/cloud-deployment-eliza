# a7046c18:packages_core_python_elizaos_plugin.py:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/elizaos/plugin.py:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
"""
Plugin utilities for elizaOS.

This module provides utilities for loading and registering plugins.
"""

from __future__ import annotations

import importlib
from typing import TYPE_CHECKING

from elizaos.logger import logger
from elizaos.types.plugin import Plugin

if TYPE_CHECKING:
    from elizaos.types.runtime import IAgentRuntime


class PluginLoadError(Exception):
    """Exception raised when plugin loading fails."""

    def __init__(self, message: str, plugin_name: str, cause: Exception | None = None) -> None:
        super().__init__(message)
        self.plugin_name = plugin_name
        self.cause = cause


class PluginRegistrationError(Exception):
    """Exception raised when plugin registration fails."""

    def __init__(self, message: str, plugin_name: str, cause: Exception | None = None) -> None:
        super().__init__(message)
        self.plugin_name = plugin_name
        self.cause = cause


def load_plugin(name: str) -> Plugin:
    """
    Load a plugin by name.

    The plugin should be a Python module that exports a `plugin` variable
    of type Plugin.

    Args:
        name: The plugin module name

    Returns:
        The loaded Plugin

    Raises:
        PluginLoadError: If the plugin cannot be loaded
    """
    try:
        # Try to import the module
        module = importlib.import_module(name)

        # Look for a plugin export
        if hasattr(module, "plugin"):
            plugin = module.plugin
            if isinstance(plugin, Plugin):
                logger.debug(f"Loaded plugin: {plugin.name}")
                return plugin
            # Try to construct if it's a dict
            if isinstance(plugin, dict):
                return Plugin(**plugin)

        # Try to find a default plugin export
        if hasattr(module, "default"):
            default = module.default
            if isinstance(default, Plugin):
                logger.debug(f"Loaded plugin from default export: {default.name}")
                return default
            if isinstance(default, dict):
                return Plugin(**default)

        raise PluginLoadError(
            f"Module {name} does not export a valid plugin",
            plugin_name=name,
        )

    except ImportError as e:
        raise PluginLoadError(
            f"Failed to import plugin module: {name}",
            plugin_name=name,
            cause=e,
        ) from e
    except Exception as e:
        raise PluginLoadError(
            f"Failed to load plugin {name}: {e}",
            plugin_name=name,
            cause=e,
        ) from e


async def register_plugin(runtime: IAgentRuntime, plugin: Plugin) -> None:
    """
    Register a plugin with the runtime.

    This function handles:
    1. Checking plugin dependencies
    2. Initializing the plugin
    3. Registering actions, providers, evaluators
    4. Starting services
    5. Registering event handlers

    Args:
        runtime: The agent runtime
        plugin: The plugin to register

    Raises:
        PluginRegistrationError: If registration fails
    """
    try:
        logger.info(f"Registering plugin: {plugin.name}")

        # Check dependencies
        if plugin.dependencies:
            for dep in plugin.dependencies:
                if dep not in [p.name for p in runtime.plugins]:
                    raise PluginRegistrationError(
                        f"Missing dependency: {dep}",
                        plugin_name=plugin.name,
                    )

        # Initialize the plugin if it has an init function
        if plugin.init:
            config = plugin.config or {}
            await plugin.init(config, runtime)

        # Register actions
        if plugin.actions:
            for action in plugin.actions:
                runtime.register_action(action)
                logger.debug(f"Registered action: {action.name}")

        # Register providers
        if plugin.providers:
            for provider in plugin.providers:
                runtime.register_provider(provider)
                logger.debug(f"Registered provider: {provider.name}")

        # Register evaluators
        if plugin.evaluators:
            for evaluator in plugin.evaluators:
                runtime.register_evaluator(evaluator)
                logger.debug(f"Registered evaluator: {evaluator.name}")

        # Register services
        if plugin.services:
            for service_class in plugin.services:
```