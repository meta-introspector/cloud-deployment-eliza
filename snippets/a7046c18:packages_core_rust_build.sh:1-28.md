# a7046c18:packages_core_rust_build.sh:1-28

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/build.sh:1-28
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
#!/bin/bash
set -e

echo "Building elizaOS Core Rust..."

# Build native library
echo "Building native library..."
cargo build --release

# Build WASM for web
echo "Building WASM for web..."
wasm-pack build --target web --out-dir pkg/web --features wasm

# Build WASM for Node.js
echo "Building WASM for Node.js..."
wasm-pack build --target nodejs --out-dir pkg/node --features wasm

# Run tests
echo "Running tests..."
cargo test

echo "Build complete!"
echo ""
echo "Outputs:"
echo "  - Native: target/release/libelizaos_core.so (or .dylib on macOS, .dll on Windows)"
echo "  - WASM Web: pkg/web/"
echo "  - WASM Node.js: pkg/node/"

```