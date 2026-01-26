# a7046c18:packages_core_interop_ARCHITECTURE.md:151-299

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/interop/ARCHITECTURE.md:151-299
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
       │                      5. Serialize result
       │                                    │
       │  6. Return *char (JSON)            │
       │ ◄────────────────────────────────  │
       │                                    │
       │  7. Decode JSON                    │
       │  8. Free returned string           │
       ▼                                    │
```

### Action Invocation (TS → Python via IPC)

```
TypeScript Runtime        Bridge Server        Python Plugin
       │                       │                     │
       │  1. spawn subprocess  │                     │
       │ ─────────────────────►│                     │
       │                       │                     │
       │                       │  2. Load module     │
       │                       │ ───────────────────►│
       │                       │                     │
       │  3. {"type":"ready"}  │                     │
       │ ◄─────────────────────│                     │
       │                       │                     │
       │  4. action.invoke     │                     │
       │ ─────────────────────►│                     │
       │                       │  5. Call handler    │
       │                       │ ───────────────────►│
       │                       │                     │
       │                       │  6. ActionResult    │
       │                       │ ◄───────────────────│
       │  7. action.result     │                     │
       │ ◄─────────────────────│                     │
       ▼                       ▼                     ▼
```

## Plugin Manifest

Every cross-language plugin must provide a manifest (either embedded or as `plugin.json`):

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
      "description": "Does something"
    }
  ],
  "providers": [
    {
      "name": "MY_PROVIDER"
    }
  ]
}
```

## Loading Plugins

### TypeScript Runtime

```typescript
import { loadPlugin, loadWasmPlugin, loadPythonPlugin } from '@elizaos/core/interop';

// Auto-detect from manifest
const plugin1 = await loadPlugin({ manifestPath: './plugin.json' });

// Explicit WASM
const plugin2 = await loadWasmPlugin({ wasmPath: './plugin.wasm' });

// Explicit Python
const plugin3 = await loadPythonPlugin({ moduleName: 'my_plugin' });
```

### Python Runtime

```python
from elizaos.interop import load_rust_plugin
from elizaos_plugin_starter import plugin as python_plugin

# Load Rust plugin via FFI
rust_plugin = load_rust_plugin("./libmy_plugin.so")

# Native Python plugin
await runtime.register_plugin(python_plugin)
await runtime.register_plugin(rust_plugin)
```

### Rust Runtime

```rust
use elizaos_core::interop::WasmPluginLoader;

// Load WASM plugin (from TypeScript)
let plugin = WasmPluginLoader::load("./plugin.wasm").await?;
runtime.register_plugin(plugin);
```

## Building Cross-Language Plugins

### Rust Plugin (for TS + Python)

```bash
# For TypeScript (WASM)
cargo build --target wasm32-unknown-unknown --release --features wasm
wasm-bindgen target/wasm32-unknown-unknown/release/plugin.wasm --out-dir dist

# For Python (FFI)
cargo build --release --features ffi
```

### Python Plugin (for TS)

```bash
# Install the plugin
pip install my-plugin

# TypeScript will spawn it via IPC automatically
```

## Performance Considerations

| Method | Latency | Throughput | Memory |
|--------|---------|------------|--------|
| Native | ~1μs | Highest | Shared |
| WASM | ~10μs | High | Isolated |
| FFI | ~5μs | High | Shared |
| IPC | ~1ms | Medium | Separate |

## Security Considerations

1. **WASM**: Sandboxed execution, no direct system access
2. **FFI**: Full system access, requires trust
3. **IPC**: Process isolation, but can spawn with reduced privileges

## Future Work

1. **PyO3 integration**: Native Python ↔ Rust without FFI overhead
2. **Shared memory IPC**: Faster Python ↔ TypeScript communication
3. **Plugin marketplace**: Centralized discovery of cross-language plugins
4. **Hot reloading**: Reload plugins without runtime restart

```