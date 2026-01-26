# a7046c18:packages_core_interop_python_rust_ffi.py:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/interop/python/rust_ffi.py:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
"""
Rust Plugin FFI Loader for elizaOS

This module provides utilities for loading Rust plugins into the Python runtime
via ctypes/cffi FFI bindings.
"""

from __future__ import annotations

import ctypes
import json
import os
import platform
from pathlib import Path
from typing import Any, Callable, Awaitable

from elizaos.types.plugin import Plugin
from elizaos.types.memory import Memory
from elizaos.types.state import State
from elizaos.types.components import (
    Action,
    ActionResult,
    Provider,
    ProviderResult,
    Evaluator,
    HandlerOptions,
)


def get_lib_extension() -> str:
    """Get the shared library extension for the current platform."""
    system = platform.system()
    if system == "Darwin":
        return ".dylib"
    elif system == "Windows":
        return ".dll"
    else:
        return ".so"


def get_lib_prefix() -> str:
    """Get the shared library prefix for the current platform."""
    system = platform.system()
    if system == "Windows":
        return ""
    else:
        return "lib"


class RustPluginFFI:
    """
    FFI wrapper for Rust plugins.
    
    The Rust plugin must export these functions:
    - elizaos_get_manifest() -> *const c_char
    - elizaos_init(config_json: *const c_char) -> c_int
    - elizaos_validate_action(name: *const c_char, memory: *const c_char, state: *const c_char) -> c_int
    - elizaos_invoke_action(name: *const c_char, memory: *const c_char, state: *const c_char, options: *const c_char) -> *const c_char
    - elizaos_get_provider(name: *const c_char, memory: *const c_char, state: *const c_char) -> *const c_char
    - elizaos_validate_evaluator(name: *const c_char, memory: *const c_char, state: *const c_char) -> c_int
    - elizaos_invoke_evaluator(name: *const c_char, memory: *const c_char, state: *const c_char) -> *const c_char
    - elizaos_free_string(ptr: *const c_char) -> void
    """

    def __init__(self, lib_path: str | Path) -> None:
        """
        Initialize the FFI wrapper.
        
        Args:
            lib_path: Path to the shared library (.so/.dylib/.dll)
        """
        self.lib_path = Path(lib_path)
        if not self.lib_path.exists():
            raise FileNotFoundError(f"Shared library not found: {lib_path}")

        # Load the library
        self.lib = ctypes.CDLL(str(self.lib_path))
        self._setup_bindings()
        self.manifest: dict[str, Any] | None = None

    def _setup_bindings(self) -> None:
        """Set up ctypes function bindings."""
        # elizaos_get_manifest() -> *const c_char
        self.lib.elizaos_get_manifest.argtypes = []
        self.lib.elizaos_get_manifest.restype = ctypes.c_char_p

        # elizaos_init(config_json: *const c_char) -> c_int
        self.lib.elizaos_init.argtypes = [ctypes.c_char_p]
        self.lib.elizaos_init.restype = ctypes.c_int

        # elizaos_validate_action(...)
        self.lib.elizaos_validate_action.argtypes = [
            ctypes.c_char_p,  # action name
            ctypes.c_char_p,  # memory json
            ctypes.c_char_p,  # state json
        ]
        self.lib.elizaos_validate_action.restype = ctypes.c_int

        # elizaos_invoke_action(...)
        self.lib.elizaos_invoke_action.argtypes = [
            ctypes.c_char_p,  # action name
            ctypes.c_char_p,  # memory json
            ctypes.c_char_p,  # state json
            ctypes.c_char_p,  # options json
        ]
        self.lib.elizaos_invoke_action.restype = ctypes.c_char_p

        # elizaos_get_provider(...)
        self.lib.elizaos_get_provider.argtypes = [
            ctypes.c_char_p,  # provider name
            ctypes.c_char_p,  # memory json
            ctypes.c_char_p,  # state json
        ]
        self.lib.elizaos_get_provider.restype = ctypes.c_char_p

        # elizaos_validate_evaluator(...)
        self.lib.elizaos_validate_evaluator.argtypes = [
            ctypes.c_char_p,  # evaluator name
            ctypes.c_char_p,  # memory json
            ctypes.c_char_p,  # state json
        ]
        self.lib.elizaos_validate_evaluator.restype = ctypes.c_int

        # elizaos_invoke_evaluator(...)
        self.lib.elizaos_invoke_evaluator.argtypes = [
            ctypes.c_char_p,  # evaluator name
            ctypes.c_char_p,  # memory json
            ctypes.c_char_p,  # state json
        ]
        self.lib.elizaos_invoke_evaluator.restype = ctypes.c_char_p

        # elizaos_free_string(ptr: *const c_char)
        self.lib.elizaos_free_string.argtypes = [ctypes.c_char_p]
        self.lib.elizaos_free_string.restype = None

    def _to_c_string(self, s: str | None) -> ctypes.c_char_p:
        """Convert Python string to C string."""
        if s is None:
            return ctypes.c_char_p(None)
        return ctypes.c_char_p(s.encode("utf-8"))

    def _from_c_string(self, ptr: ctypes.c_char_p) -> str | None:
        """Convert C string to Python string and free the C memory."""
        if not ptr:
            return None
        result = ptr.decode("utf-8")
        self.lib.elizaos_free_string(ptr)
        return result

    def get_manifest(self) -> dict[str, Any]:
```