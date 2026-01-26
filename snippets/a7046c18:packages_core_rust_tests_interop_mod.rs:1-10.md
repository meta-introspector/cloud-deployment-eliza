# a7046c18:packages_core_rust_tests_interop_mod.rs:1-10

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/tests/interop/mod.rs:1-10
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
//! Interoperability tests for elizaOS Core
//!
//! These tests verify that Rust types serialize/deserialize identically to TypeScript.
//! They use JSON fixtures that are generated from the TypeScript implementation
//! to ensure perfect compatibility.

mod serialization_equivalence;
mod type_mapping;
mod uuid_compatibility;

```