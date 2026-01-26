# a7046c18:packages_core_rust_build-wasm.sh:1-30

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/build-wasm.sh:1-30
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
#!/bin/bash
# Build elizaOS Core for WASM

set -e

echo "Building elizaOS Core for WASM..."

# Install wasm-pack if not present
if ! command -v wasm-pack &> /dev/null; then
    echo "Installing wasm-pack..."
    cargo install wasm-pack
fi

# Build for web target (bundler-compatible)
echo "Building for web target..."
wasm-pack build --target web --features wasm --no-default-features --out-dir pkg-web

# Build for Node.js target
echo "Building for Node.js target..."
wasm-pack build --target nodejs --features wasm --no-default-features --out-dir pkg-node

# Build for bundler target (webpack, etc.)
echo "Building for bundler target..."
wasm-pack build --target bundler --features wasm --no-default-features --out-dir pkg

echo "WASM build complete!"
echo "  - pkg/        : For bundlers (webpack, parcel, etc.)"
echo "  - pkg-web/    : For web browsers (ES modules)"
echo "  - pkg-node/   : For Node.js"

```