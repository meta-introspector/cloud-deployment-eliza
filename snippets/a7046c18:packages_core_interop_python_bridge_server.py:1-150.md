# a7046c18:packages_core_interop_python_bridge_server.py:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/interop/python/bridge_server.py:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
#!/usr/bin/env python3
"""
elizaOS Python Plugin Bridge Server

This server is spawned by the TypeScript runtime to load and execute
Python plugins via JSON-RPC over stdin/stdout.
"""

from __future__ import annotations

import argparse
import asyncio
import importlib
import json
import sys
import traceback
from typing import Any

# Import elizaos types
try:
    from elizaos.types.plugin import Plugin
    from elizaos.types.memory import Memory
    from elizaos.types.state import State
    from elizaos.types.components import ActionResult, ProviderResult, HandlerOptions
except ImportError:
    # Fallback for standalone testing
    Plugin = dict  # type: ignore
    Memory = dict  # type: ignore
    State = dict  # type: ignore
    ActionResult = dict  # type: ignore
    ProviderResult = dict  # type: ignore
    HandlerOptions = dict  # type: ignore


class PluginBridgeServer:
    """JSON-RPC bridge server for Python plugins."""

    def __init__(self, module_name: str) -> None:
        self.module_name = module_name
        self.plugin: Plugin | None = None
        self.actions: dict[str, Any] = {}
        self.providers: dict[str, Any] = {}
        self.evaluators: dict[str, Any] = {}
        self.initialized = False

    async def load_plugin(self) -> None:
        """Load the Python plugin module."""
        try:
            module = importlib.import_module(self.module_name)

            # Look for plugin export
            if hasattr(module, "plugin"):
                self.plugin = module.plugin
            elif hasattr(module, "default"):
                self.plugin = module.default
            else:
                raise RuntimeError(f"Module {self.module_name} has no plugin export")

            # Index components for fast lookup
            if hasattr(self.plugin, "actions") and self.plugin.actions:
                for action in self.plugin.actions:
                    self.actions[action.name] = action

            if hasattr(self.plugin, "providers") and self.plugin.providers:
                for provider in self.plugin.providers:
                    self.providers[provider.name] = provider

            if hasattr(self.plugin, "evaluators") and self.plugin.evaluators:
                for evaluator in self.plugin.evaluators:
                    self.evaluators[evaluator.name] = evaluator

        except Exception as e:
            raise RuntimeError(f"Failed to load plugin: {e}") from e

    def get_manifest(self) -> dict[str, Any]:
        """Get the plugin manifest as a dictionary."""
        if not self.plugin:
            raise RuntimeError("Plugin not loaded")

        manifest: dict[str, Any] = {
            "name": self.plugin.name,
            "description": self.plugin.description,
            "version": getattr(self.plugin, "version", "1.0.0"),
            "language": "python",
        }

        if hasattr(self.plugin, "config") and self.plugin.config:
            manifest["config"] = self.plugin.config

        if hasattr(self.plugin, "dependencies") and self.plugin.dependencies:
            manifest["dependencies"] = self.plugin.dependencies

        if hasattr(self.plugin, "actions") and self.plugin.actions:
            manifest["actions"] = [
                {
                    "name": a.name,
                    "description": a.description,
                    "similes": getattr(a, "similes", None),
                }
                for a in self.plugin.actions
            ]

        if hasattr(self.plugin, "providers") and self.plugin.providers:
            manifest["providers"] = [
                {
                    "name": p.name,
                    "description": getattr(p, "description", None),
                    "dynamic": getattr(p, "dynamic", None),
                    "position": getattr(p, "position", None),
                    "private": getattr(p, "private", None),
                }
                for p in self.plugin.providers
            ]

        if hasattr(self.plugin, "evaluators") and self.plugin.evaluators:
            manifest["evaluators"] = [
                {
                    "name": e.name,
                    "description": e.description,
                    "alwaysRun": getattr(e, "always_run", None),
                    "similes": getattr(e, "similes", None),
                }
                for e in self.plugin.evaluators
            ]

        return manifest

    async def handle_request(self, request: dict[str, Any]) -> dict[str, Any]:
        """Handle an incoming JSON-RPC request."""
        req_type = request.get("type", "")
        req_id = request.get("id", "")

        try:
            if req_type == "plugin.init":
                config = request.get("config", {})
                if self.plugin and hasattr(self.plugin, "init") and self.plugin.init:
                    await self.plugin.init(config, None)  # type: ignore
                self.initialized = True
                return {"type": "plugin.init.result", "id": req_id, "success": True}

            elif req_type == "action.validate":
                action_name = request.get("action", "")
                action = self.actions.get(action_name)
                if not action:
                    return {"type": "validate.result", "id": req_id, "valid": False}

                memory = self._parse_memory(request.get("memory"))
                state = self._parse_state(request.get("state"))

                # Call validate function
```