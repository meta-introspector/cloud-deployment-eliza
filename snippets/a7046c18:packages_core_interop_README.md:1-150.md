# a7046c18:packages_core_interop_README.md:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/interop/README.md:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
# elizaOS Cross-Language Plugin Interoperability

This module provides seamless interoperability between elizaOS runtimes written in different languages (Rust, TypeScript, Python).

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Plugin Interface Definition                   │
│                    (plugin.schema.json - IDL)                   │
└─────────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
   │    Rust     │     │ TypeScript  │     │   Python    │
   │   Runtime   │     │   Runtime   │     │   Runtime   │
   └──────┬──────┘     └──────┬──────┘     └──────┬──────┘
          │                   │                   │
          ▼                   ▼                   ▼
   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
   │ WASM Export │     │ WASM Loader │     │  IPC/FFI    │
   │ + PyO3 FFI  │     │ + IPC Client│     │   Bridge    │
   └─────────────┘     └─────────────┘     └─────────────┘
```

## Interop Methods

### 1. **WASM (WebAssembly)** - Rust ↔ TypeScript
- Rust plugins compile to WASM via `wasm-bindgen`
- TypeScript runtime loads WASM modules dynamically
- High performance, sandboxed execution

### 2. **PyO3/FFI** - Rust ↔ Python  
- Rust plugins expose Python bindings via PyO3
- Python can call Rust code directly via FFI
- Native performance, type-safe

### 3. **IPC (Inter-Process Communication)** - Any ↔ Any
- JSON-RPC over Unix sockets or TCP
- Works for all language combinations
- Flexible but has serialization overhead

### 4. **subprocess** - TypeScript/Python host ↔ Rust/Python plugin
- Spawn plugin as subprocess
- Communicate via stdin/stdout JSON
- Simplest to implement, good isolation

## Usage

### Loading a Rust Plugin in TypeScript

```typescript
import { loadWasmPlugin } from '@elizaos/core/interop';

const plugin = await loadWasmPlugin('./my-rust-plugin.wasm');
runtime.registerPlugin(plugin);
```

### Loading a TypeScript Plugin in Rust

```rust
use elizaos_core::interop::WasmPluginLoader;

let plugin = WasmPluginLoader::load("./my-ts-plugin.wasm").await?;
runtime.register_plugin(plugin);
```

### Loading a Python Plugin in TypeScript

```typescript
import { loadPythonPlugin } from '@elizaos/core/interop';

const plugin = await loadPythonPlugin('my_python_plugin');
runtime.registerPlugin(plugin);
```

### Loading a Rust Plugin in Python

```python
from elizaos.interop import load_rust_plugin

plugin = load_rust_plugin("./my_rust_plugin.so")
await runtime.register_plugin(plugin)
```

## Plugin Manifest

Every cross-language plugin must include a `plugin.json` manifest:

```json
{
  "name": "my-plugin",
  "description": "A cross-language plugin",
  "version": "1.0.0",
  "language": "rust",
  "interop": {
    "protocol": "wasm",
    "wasmPath": "./dist/my_plugin.wasm"
  },
  "actions": [
    {
      "name": "MY_ACTION",
      "description": "Does something cool"
    }
  ]
}
```

## Building Cross-Language Plugins

### Rust → WASM (for TypeScript)

```bash
cd packages/my-rust-plugin
cargo build --target wasm32-unknown-unknown --release
wasm-bindgen target/wasm32-unknown-unknown/release/my_plugin.wasm --out-dir dist
```

### Rust → Python Extension

```bash
cd packages/my-rust-plugin
maturin build --release
pip install target/wheels/my_plugin-*.whl
```

### TypeScript → WASM (experimental)

```bash
# Using AssemblyScript or similar
cd packages/my-ts-plugin
asc src/index.ts -o dist/plugin.wasm
```

## Protocol Messages

All interop communication uses JSON-serialized messages:

### Action Invocation
```json
{
  "type": "action.invoke",
  "id": "uuid",
  "action": "MY_ACTION",
  "memory": { ... },
  "state": { ... },
  "options": { ... }
}
```
```