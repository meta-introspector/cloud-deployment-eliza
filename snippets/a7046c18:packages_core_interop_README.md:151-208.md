# a7046c18:packages_core_interop_README.md:151-208

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/interop/README.md:151-208
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

### Action Response
```json
{
  "type": "action.result",
  "id": "uuid",
  "result": {
    "success": true,
    "text": "Action completed",
    "data": { ... }
  }
}
```

### Provider Request
```json
{
  "type": "provider.get",
  "id": "uuid",
  "provider": "MY_PROVIDER",
  "memory": { ... },
  "state": { ... }
}
```

### Provider Response
```json
{
  "type": "provider.result",
  "id": "uuid",
  "result": {
    "text": "Provider data",
    "values": { ... },
    "data": { ... }
  }
}
```

## File Structure

```
packages/core/interop/
├── README.md                 # This file
├── plugin.schema.json        # JSON Schema for plugin definitions
├── typescript/               # TypeScript interop implementations
│   ├── wasm-loader.ts       # Load WASM plugins
│   ├── python-bridge.ts     # IPC bridge to Python
│   └── types.ts             # Interop types
├── rust/                     # Rust interop implementations
│   ├── wasm_bindings.rs     # WASM export macros
│   ├── pyo3_bindings.rs     # Python bindings
│   └── ipc_server.rs        # IPC server for external calls
└── python/                   # Python interop implementations
    ├── wasm_loader.py       # Load WASM plugins (via wasmtime)
    ├── rust_ffi.py          # FFI loader for Rust shared libs
    └── ts_bridge.py         # IPC bridge to TypeScript
```

```