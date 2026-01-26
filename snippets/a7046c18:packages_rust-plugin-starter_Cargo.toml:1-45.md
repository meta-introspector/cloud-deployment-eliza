# a7046c18:packages_rust-plugin-starter_Cargo.toml:1-45

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/rust-plugin-starter/Cargo.toml:1-45
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
[package]
name = "elizaos-plugin-starter"
version = "1.0.0"
edition = "2021"
authors = ["elizaOS Team"]
description = "Starter template for elizaOS Rust plugins with cross-language support"
license = "MIT"
repository = "https://github.com/elizaos/eliza"
keywords = ["elizaos", "plugin", "wasm", "ffi"]

[lib]
crate-type = ["cdylib", "rlib"]

[features]
default = ["ffi"]
ffi = []
wasm = ["wasm-bindgen", "console_error_panic_hook", "getrandom/js"]

[dependencies]
# Core dependencies
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
async-trait = "0.1"
thiserror = "2.0"
anyhow = "1.0"

# Logging
tracing = "0.1"

# WASM-only dependencies
wasm-bindgen = { version = "0.2", optional = true }
console_error_panic_hook = { version = "0.1", optional = true }
getrandom = { version = "0.2", optional = true }

[dev-dependencies]
tokio = { version = "1.0", features = ["rt-multi-thread", "macros"] }

[profile.release]
lto = true
opt-level = "z"

# For WASM builds
[profile.release.package."*"]
opt-level = "z"

```