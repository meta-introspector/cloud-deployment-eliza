# a7046c18:packages_plugin-sql_rust_src_wasm.rs:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/rust/src/wasm.rs:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
//! WASM bindings for elizaOS plugin-sql
//!
//! This module provides JavaScript/TypeScript and Python bindings for the elizaOS
//! SQL plugin through WebAssembly.

#[cfg(feature = "wasm")]
use wasm_bindgen::prelude::*;

#[cfg(feature = "wasm")]
use crate::schema::{
    AgentRow, CacheRow, EntityRow, LogRow, MemoryRow, ParticipantRow, RelationshipRow, RoomRow,
    TaskRow, WorldRow,
};

/// Initialize the WASM module with panic hook for better error messages
#[cfg(feature = "wasm")]
#[wasm_bindgen(start)]
pub fn init_wasm() {
    console_error_panic_hook::set_once();
}

/// WASM-compatible MemoryRow wrapper
#[cfg(feature = "wasm")]
#[wasm_bindgen]
pub struct WasmMemoryRow {
    inner: MemoryRow,
}

#[cfg(feature = "wasm")]
#[wasm_bindgen]
impl WasmMemoryRow {
    /// Create a new memory row from JSON
    #[wasm_bindgen(js_name = "fromJson")]
    pub fn from_json(json: &str) -> Result<WasmMemoryRow, JsValue> {
        serde_json::from_str::<MemoryRow>(json)
            .map(|inner| WasmMemoryRow { inner })
            .map_err(|e| JsValue::from_str(&format!("Failed to parse MemoryRow: {}", e)))
    }

    /// Convert to JSON
    #[wasm_bindgen(js_name = "toJson")]
    pub fn to_json(&self) -> Result<String, JsValue> {
        serde_json::to_string(&self.inner)
            .map_err(|e| JsValue::from_str(&format!("Failed to serialize MemoryRow: {}", e)))
    }

    /// Get the memory ID
    #[wasm_bindgen(getter)]
    pub fn id(&self) -> String {
        self.inner.id.clone()
    }

    /// Get the entity ID
    #[wasm_bindgen(getter, js_name = "entityId")]
    pub fn entity_id(&self) -> String {
        self.inner.entity_id.clone()
    }

    /// Get the room ID
    #[wasm_bindgen(getter, js_name = "roomId")]
    pub fn room_id(&self) -> String {
        self.inner.room_id.clone()
    }

    /// Get the agent ID
    #[wasm_bindgen(getter, js_name = "agentId")]
    pub fn agent_id(&self) -> String {
        self.inner.agent_id.clone()
    }
}

/// WASM-compatible AgentRow wrapper
#[cfg(feature = "wasm")]
#[wasm_bindgen]
pub struct WasmAgentRow {
    inner: AgentRow,
}

#[cfg(feature = "wasm")]
#[wasm_bindgen]
impl WasmAgentRow {
    /// Create a new agent row from JSON
    #[wasm_bindgen(js_name = "fromJson")]
    pub fn from_json(json: &str) -> Result<WasmAgentRow, JsValue> {
        serde_json::from_str::<AgentRow>(json)
            .map(|inner| WasmAgentRow { inner })
            .map_err(|e| JsValue::from_str(&format!("Failed to parse AgentRow: {}", e)))
    }

    /// Convert to JSON
    #[wasm_bindgen(js_name = "toJson")]
    pub fn to_json(&self) -> Result<String, JsValue> {
        serde_json::to_string(&self.inner)
            .map_err(|e| JsValue::from_str(&format!("Failed to serialize AgentRow: {}", e)))
    }

    /// Get the agent ID
    #[wasm_bindgen(getter)]
    pub fn id(&self) -> String {
        self.inner.id.clone()
    }

    /// Get the agent name
    #[wasm_bindgen(getter)]
    pub fn name(&self) -> String {
        self.inner.name.clone()
    }
}

/// WASM-compatible EntityRow wrapper
#[cfg(feature = "wasm")]
#[wasm_bindgen]
pub struct WasmEntityRow {
    inner: EntityRow,
}

#[cfg(feature = "wasm")]
#[wasm_bindgen]
impl WasmEntityRow {
    /// Create a new entity row from JSON
    #[wasm_bindgen(js_name = "fromJson")]
    pub fn from_json(json: &str) -> Result<WasmEntityRow, JsValue> {
        serde_json::from_str::<EntityRow>(json)
            .map(|inner| WasmEntityRow { inner })
            .map_err(|e| JsValue::from_str(&format!("Failed to parse EntityRow: {}", e)))
    }

    /// Convert to JSON
    #[wasm_bindgen(js_name = "toJson")]
    pub fn to_json(&self) -> Result<String, JsValue> {
        serde_json::to_string(&self.inner)
            .map_err(|e| JsValue::from_str(&format!("Failed to serialize EntityRow: {}", e)))
    }

    /// Get the entity ID
    #[wasm_bindgen(getter)]
    pub fn id(&self) -> String {
        self.inner.id.clone()
    }
}

/// WASM-compatible RoomRow wrapper
#[cfg(feature = "wasm")]
#[wasm_bindgen]
pub struct WasmRoomRow {
    inner: RoomRow,
}

#[cfg(feature = "wasm")]
#[wasm_bindgen]
```