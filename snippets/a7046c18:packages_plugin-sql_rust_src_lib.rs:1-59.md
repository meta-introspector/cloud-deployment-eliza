# a7046c18:packages_plugin-sql_rust_src_lib.rs:1-59

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/rust/src/lib.rs:1-59
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
//! elizaOS Plugin SQL - Rust Implementation
//!
//! This crate provides database adapters for elizaOS, supporting both PGLite (for WASM/browser)
//! and PostgreSQL (for native server deployments).
//!
//! # Features
//!
//! - `native` (default): Enables PostgreSQL adapter with sqlx
//! - `wasm`: Enables PGLite adapter with JavaScript interop
//!
//! # Example
//!
//! ```rust,ignore
//! use elizaos_plugin_sql::{PostgresAdapter, DatabaseAdapter};
//! use elizaos_core::UUID;
//!
//! async fn example() -> anyhow::Result<()> {
//!     let agent_id = UUID::new_v4();
//!     let adapter = PostgresAdapter::new("postgres://localhost/eliza", &agent_id).await?;
//!     adapter.init().await?;
//!     
//!     let agent = adapter.get_agent(&agent_id).await?;
//!     Ok(())
//! }
//! ```

#![warn(missing_docs)]

pub mod base;
pub mod schema;

#[cfg(feature = "native")]
pub mod postgres;

#[cfg(feature = "wasm")]
pub mod pglite;

#[cfg(feature = "wasm")]
pub mod wasm;

// Re-export core types
pub use elizaos_core::types::*;

// Re-export adapters
pub use base::DatabaseAdapter;

#[cfg(feature = "native")]
pub use postgres::PostgresAdapter;

#[cfg(feature = "wasm")]
pub use pglite::PgLiteAdapter;

/// Plugin definition for elizaOS
pub fn plugin() -> elizaos_core::Plugin {
    elizaos_core::Plugin::new(
        "sql",
        "SQL database plugin with PostgreSQL and PGLite support",
    )
}
```