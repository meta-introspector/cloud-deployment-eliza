# a7046c18:packages_plugin-sql_rust_src_wasm.rs:151-207

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/rust/src/wasm.rs:151-207
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
impl WasmRoomRow {
    /// Create a new room row from JSON
    #[wasm_bindgen(js_name = "fromJson")]
    pub fn from_json(json: &str) -> Result<WasmRoomRow, JsValue> {
        serde_json::from_str::<RoomRow>(json)
            .map(|inner| WasmRoomRow { inner })
            .map_err(|e| JsValue::from_str(&format!("Failed to parse RoomRow: {}", e)))
    }

    /// Convert to JSON
    #[wasm_bindgen(js_name = "toJson")]
    pub fn to_json(&self) -> Result<String, JsValue> {
        serde_json::to_string(&self.inner)
            .map_err(|e| JsValue::from_str(&format!("Failed to serialize RoomRow: {}", e)))
    }

    /// Get the room ID
    #[wasm_bindgen(getter)]
    pub fn id(&self) -> String {
        self.inner.id.clone()
    }
}

// ========================================
// Interop test helpers
// ========================================

/// Test serialization round-trip for MemoryRow
#[cfg(feature = "wasm")]
#[wasm_bindgen(js_name = "testMemoryRowRoundTrip")]
pub fn test_memory_row_round_trip(json: &str) -> Result<bool, JsValue> {
    let row = WasmMemoryRow::from_json(json)?;
    let serialized = row.to_json()?;
    let reparsed = WasmMemoryRow::from_json(&serialized)?;
    let reserialized = reparsed.to_json()?;

    Ok(serialized == reserialized)
}

/// Test serialization round-trip for AgentRow
#[cfg(feature = "wasm")]
#[wasm_bindgen(js_name = "testAgentRowRoundTrip")]
pub fn test_agent_row_round_trip(json: &str) -> Result<bool, JsValue> {
    let row = WasmAgentRow::from_json(json)?;
    let serialized = row.to_json()?;
    let reparsed = WasmAgentRow::from_json(&serialized)?;
    let reserialized = reparsed.to_json()?;

    Ok(serialized == reserialized)
}

/// Get the version of the plugin
#[cfg(feature = "wasm")]
#[wasm_bindgen(js_name = "getVersion")]
pub fn get_version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}
```