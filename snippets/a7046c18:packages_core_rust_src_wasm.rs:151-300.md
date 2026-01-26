# a7046c18:packages_core_rust_src_wasm.rs:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/src/wasm.rs:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    }

    /// Get the system prompt
    #[wasm_bindgen(getter)]
    pub fn system(&self) -> Option<String> {
        self.inner.system.clone()
    }

    /// Get topics as JSON array
    #[wasm_bindgen(getter)]
    pub fn topics(&self) -> Result<String, JsValue> {
        serde_json::to_string(&self.inner.topics)
            .map_err(|e| JsValue::from_str(&format!("Failed to serialize topics: {}", e)))
    }

    /// Get the bio
    #[wasm_bindgen(getter)]
    pub fn bio(&self) -> Result<String, JsValue> {
        serde_json::to_string(&self.inner.bio)
            .map_err(|e| JsValue::from_str(&format!("Failed to serialize bio: {}", e)))
    }
}

/// WASM-compatible Agent wrapper
#[cfg(feature = "wasm")]
#[wasm_bindgen]
pub struct WasmAgent {
    inner: Agent,
}

#[cfg(feature = "wasm")]
#[wasm_bindgen]
impl WasmAgent {
    /// Create a new agent from JSON
    #[wasm_bindgen(js_name = "fromJson")]
    pub fn from_json(json: &str) -> Result<WasmAgent, JsValue> {
        serde_json::from_str::<Agent>(json)
            .map(|inner| WasmAgent { inner })
            .map_err(|e| JsValue::from_str(&format!("Failed to parse Agent: {}", e)))
    }

    /// Convert to JSON
    #[wasm_bindgen(js_name = "toJson")]
    pub fn to_json(&self) -> Result<String, JsValue> {
        serde_json::to_string(&self.inner)
            .map_err(|e| JsValue::from_str(&format!("Failed to serialize Agent: {}", e)))
    }

    /// Get the agent ID
    #[wasm_bindgen(getter)]
    pub fn id(&self) -> Option<String> {
        self.inner.character.id.as_ref().map(|id| id.to_string())
    }

    /// Get the agent name
    #[wasm_bindgen(getter)]
    pub fn name(&self) -> String {
        self.inner.character.name.clone()
    }
}

/// WASM-compatible Plugin wrapper
#[cfg(feature = "wasm")]
#[wasm_bindgen]
pub struct WasmPlugin {
    inner: Plugin,
}

#[cfg(feature = "wasm")]
#[wasm_bindgen]
impl WasmPlugin {
    /// Create a new plugin from JSON (only definition is serialized)
    #[wasm_bindgen(js_name = "fromJson")]
    pub fn from_json(json: &str) -> Result<WasmPlugin, JsValue> {
        use crate::types::{Plugin, PluginDefinition};
        let definition: PluginDefinition = serde_json::from_str(json)
            .map_err(|e| JsValue::from_str(&format!("Failed to parse PluginDefinition: {}", e)))?;
        Ok(WasmPlugin {
            inner: Plugin {
                definition,
                action_handlers: vec![],
                provider_handlers: vec![],
                evaluator_handlers: vec![],
                tests: vec![],
                init: None,
            },
        })
    }

    /// Convert to JSON (only definition is serialized)
    #[wasm_bindgen(js_name = "toJson")]
    pub fn to_json(&self) -> Result<String, JsValue> {
        serde_json::to_string(&self.inner.definition)
            .map_err(|e| JsValue::from_str(&format!("Failed to serialize PluginDefinition: {}", e)))
    }

    /// Get the plugin name
    #[wasm_bindgen(getter)]
    pub fn name(&self) -> String {
        self.inner.name().to_string()
    }

    /// Get the plugin description
    #[wasm_bindgen(getter)]
    pub fn description(&self) -> Option<String> {
        Some(self.inner.description().to_string())
    }
}

/// WASM-compatible State wrapper
#[cfg(feature = "wasm")]
#[wasm_bindgen]
pub struct WasmState {
    inner: State,
}

#[cfg(feature = "wasm")]
#[wasm_bindgen]
impl WasmState {
    /// Create a new state from JSON
    #[wasm_bindgen(js_name = "fromJson")]
    pub fn from_json(json: &str) -> Result<WasmState, JsValue> {
        serde_json::from_str::<State>(json)
            .map(|inner| WasmState { inner })
            .map_err(|e| JsValue::from_str(&format!("Failed to parse State: {}", e)))
    }

    /// Convert to JSON
    #[wasm_bindgen(js_name = "toJson")]
    pub fn to_json(&self) -> Result<String, JsValue> {
        serde_json::to_string(&self.inner)
            .map_err(|e| JsValue::from_str(&format!("Failed to serialize State: {}", e)))
    }

    /// Create empty state
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            inner: State::default(),
        }
    }
}

#[cfg(feature = "wasm")]
impl Default for WasmState {
    fn default() -> Self {
        Self::new()
    }
}

```