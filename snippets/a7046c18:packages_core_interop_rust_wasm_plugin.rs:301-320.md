# a7046c18:packages_core_interop_rust_wasm_plugin.rs:301-320

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/interop/rust/wasm_plugin.rs:301-320
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    unsafe {
        let _ = Vec::from_raw_parts(ptr, 0, size);
    }
}

/// Macro to export a WASM plugin
///
/// This macro should be called in your plugin's lib.rs to make it loadable
/// from the TypeScript runtime via WASM.
#[macro_export]
macro_rules! elizaos_wasm_plugin {
    ($plugin:expr) => {
        #[wasm_bindgen(start)]
        pub fn wasm_plugin_init() {
            console_error_panic_hook::set_once();
            $crate::interop::wasm_plugin::register_wasm_plugin($plugin);
        }
    };
}

```