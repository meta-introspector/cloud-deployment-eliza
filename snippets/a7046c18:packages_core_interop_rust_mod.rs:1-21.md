# a7046c18:packages_core_interop_rust_mod.rs:1-21

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/interop/rust/mod.rs:1-21
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
//! elizaOS Cross-Language Interop - Rust
//!
//! This module provides utilities for:
//! - Exporting Rust plugins via FFI for Python
//! - Exporting Rust plugins via WASM for TypeScript
//! - Loading plugins from other languages (future)

pub mod ffi_exports;

#[cfg(feature = "wasm")]
pub mod wasm_plugin;

// Re-export commonly used items
pub use ffi_exports::{register_plugin, PluginExport};

#[cfg(feature = "wasm")]
pub use wasm_plugin::{
    register_wasm_plugin, ActionManifest, ActionResult, EvaluatorManifest, PluginManifest,
    ProviderManifest, ProviderResult, WasmPlugin,
};

```