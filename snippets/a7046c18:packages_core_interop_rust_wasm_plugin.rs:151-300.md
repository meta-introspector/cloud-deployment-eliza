# a7046c18:packages_core_interop_rust_wasm_plugin.rs:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/interop/rust/wasm_plugin.rs:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    fn manifest(&self) -> PluginManifest;

    /// Initialize the plugin with configuration
    fn init(&mut self, config_json: &str) -> Result<(), String>;

    /// Validate an action
    fn validate_action(&self, name: &str, memory_json: &str, state_json: &str) -> bool;

    /// Invoke an action
    fn invoke_action(
        &self,
        name: &str,
        memory_json: &str,
        state_json: &str,
        options_json: &str,
    ) -> ActionResult;

    /// Get provider data
    fn get_provider(&self, name: &str, memory_json: &str, state_json: &str) -> ProviderResult;

    /// Validate an evaluator
    fn validate_evaluator(&self, name: &str, memory_json: &str, state_json: &str) -> bool;

    /// Invoke an evaluator
    fn invoke_evaluator(
        &self,
        name: &str,
        memory_json: &str,
        state_json: &str,
    ) -> Option<ActionResult>;
}

/// Global plugin instance for WASM
static WASM_PLUGIN: Mutex<Option<Box<dyn WasmPlugin>>> = Mutex::new(None);

/// Register a plugin for WASM export
pub fn register_wasm_plugin<P: WasmPlugin + 'static>(plugin: P) {
    let mut instance = WASM_PLUGIN.lock().unwrap();
    *instance = Some(Box::new(plugin));
}

// ============================================================================
// WASM Export Functions
// ============================================================================

/// Get the plugin manifest as JSON
#[wasm_bindgen]
pub fn get_manifest() -> String {
    let instance = WASM_PLUGIN.lock().unwrap();
    match &*instance {
        Some(plugin) => serde_json::to_string(&plugin.manifest()).unwrap_or_else(|e| {
            format!(r#"{{"error": "{}"}}"#, e)
        }),
        None => r#"{"error": "No plugin registered"}"#.to_string(),
    }
}

/// Initialize the plugin
#[wasm_bindgen]
pub fn init(config_json: &str) {
    let mut instance = WASM_PLUGIN.lock().unwrap();
    if let Some(plugin) = instance.as_mut() {
        let _ = plugin.init(config_json);
    }
}

/// Validate an action
#[wasm_bindgen]
pub fn validate_action(name: &str, memory_json: &str, state_json: &str) -> bool {
    let instance = WASM_PLUGIN.lock().unwrap();
    match &*instance {
        Some(plugin) => plugin.validate_action(name, memory_json, state_json),
        None => false,
    }
}

/// Invoke an action
#[wasm_bindgen]
pub fn invoke_action(
    name: &str,
    memory_json: &str,
    state_json: &str,
    options_json: &str,
) -> String {
    let instance = WASM_PLUGIN.lock().unwrap();
    match &*instance {
        Some(plugin) => {
            let result = plugin.invoke_action(name, memory_json, state_json, options_json);
            serde_json::to_string(&result).unwrap_or_else(|e| {
                format!(r#"{{"success": false, "error": "{}"}}"#, e)
            })
        }
        None => r#"{"success": false, "error": "No plugin registered"}"#.to_string(),
    }
}

/// Get provider data
#[wasm_bindgen]
pub fn get_provider(name: &str, memory_json: &str, state_json: &str) -> String {
    let instance = WASM_PLUGIN.lock().unwrap();
    match &*instance {
        Some(plugin) => {
            let result = plugin.get_provider(name, memory_json, state_json);
            serde_json::to_string(&result).unwrap_or_else(|_| {
                r#"{"text": null, "values": null, "data": null}"#.to_string()
            })
        }
        None => r#"{"text": null, "values": null, "data": null}"#.to_string(),
    }
}

/// Validate an evaluator
#[wasm_bindgen]
pub fn validate_evaluator(name: &str, memory_json: &str, state_json: &str) -> bool {
    let instance = WASM_PLUGIN.lock().unwrap();
    match &*instance {
        Some(plugin) => plugin.validate_evaluator(name, memory_json, state_json),
        None => false,
    }
}

/// Invoke an evaluator
#[wasm_bindgen]
pub fn invoke_evaluator(name: &str, memory_json: &str, state_json: &str) -> String {
    let instance = WASM_PLUGIN.lock().unwrap();
    match &*instance {
        Some(plugin) => match plugin.invoke_evaluator(name, memory_json, state_json) {
            Some(result) => serde_json::to_string(&result).unwrap_or_else(|_| "null".to_string()),
            None => "null".to_string(),
        },
        None => "null".to_string(),
    }
}

// ============================================================================
// Memory Allocation for String Passing
// ============================================================================

/// Allocate memory for string passing
#[wasm_bindgen]
pub fn alloc(size: usize) -> *mut u8 {
    let mut buf = Vec::with_capacity(size);
    let ptr = buf.as_mut_ptr();
    std::mem::forget(buf);
    ptr
}

/// Deallocate memory
#[wasm_bindgen]
pub fn dealloc(ptr: *mut u8, size: usize) {
```