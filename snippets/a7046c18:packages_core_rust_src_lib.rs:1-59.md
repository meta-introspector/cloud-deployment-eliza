# a7046c18:packages_core_rust_src_lib.rs:1-59

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/src/lib.rs:1-59
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
//! elizaOS Core - Rust Implementation
//!
//! This crate provides the core runtime and types for elizaOS, a framework for building
//! AI agents. It is designed to be fully compatible with the TypeScript implementation,
//! supporting both native Rust and WASM targets.
//!
//! # Features
//!
//! - `native` (default): Enables native Rust runtime with tokio
//! - `wasm`: Enables WASM build with JavaScript interop
//!
//! # Example
//!
//! ```rust,no_run
//! use elizaos_core::{AgentRuntime, Character, parse_character};
//! use elizaos_core::runtime::RuntimeOptions;
//!
//! async fn example() -> anyhow::Result<()> {
//!     let character = parse_character(r#"{"name": "TestAgent", "bio": "A test agent"}"#)?;
//!     let runtime = AgentRuntime::new(RuntimeOptions {
//!         character: Some(character),
//!         ..Default::default()
//!     }).await?;
//!     runtime.initialize().await?;
//!     Ok(())
//! }
//! ```

#![warn(missing_docs)]
#![warn(rustdoc::missing_crate_level_docs)]

pub mod character;
pub mod plugin;
pub mod runtime;
pub mod types;

#[cfg(feature = "wasm")]
pub mod wasm;

// Re-export main types for convenience
pub use character::{
    build_character_plugins, merge_character_defaults, parse_character, validate_character,
};
pub use plugin::{load_plugin, resolve_plugin_dependencies, validate_plugin};
pub use runtime::AgentRuntime;
pub use types::*;

/// Initialize the library (sets up panic hooks for WASM, logging, etc.)
pub fn init() {
    #[cfg(feature = "wasm")]
    {
        console_error_panic_hook::set_once();
    }

    // Tracing is optional and only initialized if tracing-subscriber is available
}

/// Library version
pub const VERSION: &str = env!("CARGO_PKG_VERSION");
```