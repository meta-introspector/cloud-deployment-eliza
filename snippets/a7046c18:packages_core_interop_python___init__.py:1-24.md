# a7046c18:packages_core_interop_python___init__.py:1-24

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/interop/python/__init__.py:1-24
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
"""
elizaOS Cross-Language Interop - Python

This module provides utilities for loading plugins written in other languages
(Rust, TypeScript) into the Python runtime.
"""

from elizaos.interop.rust_ffi import (
    RustPluginFFI,
    load_rust_plugin,
    find_rust_plugin,
    get_lib_extension,
    get_lib_prefix,
)

__all__ = [
    # Rust FFI
    "RustPluginFFI",
    "load_rust_plugin",
    "find_rust_plugin",
    "get_lib_extension",
    "get_lib_prefix",
]

```