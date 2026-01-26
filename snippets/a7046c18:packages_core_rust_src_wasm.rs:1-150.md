# a7046c18:packages_core_rust_src_wasm.rs:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/src/wasm.rs:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
//! WASM bindings for elizaOS core
//!
//! This module provides JavaScript/TypeScript and Python bindings for the elizaOS
//! core types and functionality through WebAssembly.

#[cfg(feature = "wasm")]
use wasm_bindgen::prelude::*;

#[cfg(feature = "wasm")]
use crate::types::{Agent, Character, Entity, Memory, Plugin, Room, State, UUID};

/// Initialize the WASM module with panic hook for better error messages
#[cfg(feature = "wasm")]
#[wasm_bindgen(start)]
pub fn init_wasm() {
    console_error_panic_hook::set_once();
}

/// WASM-compatible UUID type wrapper
#[cfg(feature = "wasm")]
#[wasm_bindgen]
pub struct WasmUUID {
    inner: UUID,
}

#[cfg(feature = "wasm")]
#[wasm_bindgen]
impl WasmUUID {
    /// Create a new random UUID
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {
            inner: UUID::new_v4(),
        }
    }

    /// Create a UUID from a string
    #[wasm_bindgen(js_name = "fromString")]
    pub fn from_string(s: &str) -> Result<WasmUUID, JsValue> {
        UUID::new(s)
            .map(|inner| WasmUUID { inner })
            .map_err(|e| JsValue::from_str(&format!("Invalid UUID: {}", e)))
    }

    /// Convert to string
    #[wasm_bindgen(js_name = "toString")]
    pub fn to_string_js(&self) -> String {
        self.inner.to_string()
    }
}

#[cfg(feature = "wasm")]
impl Default for WasmUUID {
    fn default() -> Self {
        Self::new()
    }
}

/// WASM-compatible Memory wrapper
#[cfg(feature = "wasm")]
#[wasm_bindgen]
pub struct WasmMemory {
    inner: Memory,
}

#[cfg(feature = "wasm")]
#[wasm_bindgen]
impl WasmMemory {
    /// Create a new memory from JSON
    #[wasm_bindgen(js_name = "fromJson")]
    pub fn from_json(json: &str) -> Result<WasmMemory, JsValue> {
        serde_json::from_str::<Memory>(json)
            .map(|inner| WasmMemory { inner })
            .map_err(|e| JsValue::from_str(&format!("Failed to parse Memory: {}", e)))
    }

    /// Convert to JSON
    #[wasm_bindgen(js_name = "toJson")]
    pub fn to_json(&self) -> Result<String, JsValue> {
        serde_json::to_string(&self.inner)
            .map_err(|e| JsValue::from_str(&format!("Failed to serialize Memory: {}", e)))
    }

    /// Get the memory ID
    #[wasm_bindgen(getter)]
    pub fn id(&self) -> Option<String> {
        self.inner.id.as_ref().map(|id| id.to_string())
    }

    /// Get the entity ID
    #[wasm_bindgen(getter, js_name = "entityId")]
    pub fn entity_id(&self) -> String {
        self.inner.entity_id.to_string()
    }

    /// Get the room ID
    #[wasm_bindgen(getter, js_name = "roomId")]
    pub fn room_id(&self) -> String {
        self.inner.room_id.to_string()
    }

    /// Get the content as JSON
    #[wasm_bindgen(getter)]
    pub fn content(&self) -> Result<String, JsValue> {
        serde_json::to_string(&self.inner.content)
            .map_err(|e| JsValue::from_str(&format!("Failed to serialize content: {}", e)))
    }

    /// Check if memory is unique
    #[wasm_bindgen(getter)]
    pub fn unique(&self) -> bool {
        self.inner.unique.unwrap_or(false)
    }

    /// Get created_at timestamp
    #[wasm_bindgen(getter, js_name = "createdAt")]
    pub fn created_at(&self) -> Option<f64> {
        self.inner.created_at.map(|t| t as f64)
    }
}

/// WASM-compatible Character wrapper
#[cfg(feature = "wasm")]
#[wasm_bindgen]
pub struct WasmCharacter {
    inner: Character,
}

#[cfg(feature = "wasm")]
#[wasm_bindgen]
impl WasmCharacter {
    /// Create a new character from JSON
    #[wasm_bindgen(js_name = "fromJson")]
    pub fn from_json(json: &str) -> Result<WasmCharacter, JsValue> {
        serde_json::from_str::<Character>(json)
            .map(|inner| WasmCharacter { inner })
            .map_err(|e| JsValue::from_str(&format!("Failed to parse Character: {}", e)))
    }

    /// Convert to JSON
    #[wasm_bindgen(js_name = "toJson")]
    pub fn to_json(&self) -> Result<String, JsValue> {
        serde_json::to_string(&self.inner)
            .map_err(|e| JsValue::from_str(&format!("Failed to serialize Character: {}", e)))
    }

    /// Get the character name
    #[wasm_bindgen(getter)]
    pub fn name(&self) -> String {
        self.inner.name.clone()
```