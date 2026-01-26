# a7046c18:packages_plugin-sql_rust_src_postgres_mod.rs:1-9

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/rust/src/postgres/mod.rs:1-9
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
//! PostgreSQL adapter for elizaOS
//!
//! This module provides the PostgreSQL database adapter implementation.

mod adapter;
mod manager;

pub use adapter::PostgresAdapter;
pub use manager::PostgresConnectionManager;
```