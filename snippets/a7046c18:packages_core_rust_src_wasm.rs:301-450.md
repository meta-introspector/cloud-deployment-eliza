# a7046c18:packages_core_rust_src_wasm.rs:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/src/wasm.rs:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
/// WASM-compatible Room wrapper
#[cfg(feature = "wasm")]
#[wasm_bindgen]
pub struct WasmRoom {
    inner: Room,
}

#[cfg(feature = "wasm")]
#[wasm_bindgen]
impl WasmRoom {
    /// Create a new room from JSON
    #[wasm_bindgen(js_name = "fromJson")]
    pub fn from_json(json: &str) -> Result<WasmRoom, JsValue> {
        serde_json::from_str::<Room>(json)
            .map(|inner| WasmRoom { inner })
            .map_err(|e| JsValue::from_str(&format!("Failed to parse Room: {}", e)))
    }

    /// Convert to JSON
    #[wasm_bindgen(js_name = "toJson")]
    pub fn to_json(&self) -> Result<String, JsValue> {
        serde_json::to_string(&self.inner)
            .map_err(|e| JsValue::from_str(&format!("Failed to serialize Room: {}", e)))
    }

    /// Get the room ID
    #[wasm_bindgen(getter)]
    pub fn id(&self) -> String {
        self.inner.id.to_string()
    }
}

/// WASM-compatible Entity wrapper
#[cfg(feature = "wasm")]
#[wasm_bindgen]
pub struct WasmEntity {
    inner: Entity,
}

#[cfg(feature = "wasm")]
#[wasm_bindgen]
impl WasmEntity {
    /// Create a new entity from JSON
    #[wasm_bindgen(js_name = "fromJson")]
    pub fn from_json(json: &str) -> Result<WasmEntity, JsValue> {
        serde_json::from_str::<Entity>(json)
            .map(|inner| WasmEntity { inner })
            .map_err(|e| JsValue::from_str(&format!("Failed to parse Entity: {}", e)))
    }

    /// Convert to JSON
    #[wasm_bindgen(js_name = "toJson")]
    pub fn to_json(&self) -> Result<String, JsValue> {
        serde_json::to_string(&self.inner)
            .map_err(|e| JsValue::from_str(&format!("Failed to serialize Entity: {}", e)))
    }

    /// Get the entity ID
    #[wasm_bindgen(getter)]
    pub fn id(&self) -> Option<String> {
        self.inner.id.as_ref().map(|id| id.to_string())
    }
}

// ========================================
// Utility functions
// ========================================

/// Parse a character JSON string and validate it
#[cfg(feature = "wasm")]
#[wasm_bindgen(js_name = "parseCharacter")]
pub fn parse_character(json: &str) -> Result<WasmCharacter, JsValue> {
    WasmCharacter::from_json(json)
}

/// Parse a memory JSON string
#[cfg(feature = "wasm")]
#[wasm_bindgen(js_name = "parseMemory")]
pub fn parse_memory(json: &str) -> Result<WasmMemory, JsValue> {
    WasmMemory::from_json(json)
}

/// Validate a UUID string
#[cfg(feature = "wasm")]
#[wasm_bindgen(js_name = "validateUUID")]
pub fn validate_uuid(uuid_str: &str) -> bool {
    uuid::Uuid::parse_str(uuid_str).is_ok()
}

/// Generate a new UUID
#[cfg(feature = "wasm")]
#[wasm_bindgen(js_name = "generateUUID")]
pub fn generate_uuid() -> String {
    uuid::Uuid::new_v4().to_string()
}

/// Convert a string to a deterministic UUID (similar to stringToUuid in TS)
#[cfg(feature = "wasm")]
#[wasm_bindgen(js_name = "stringToUuid")]
pub fn string_to_uuid(input: &str) -> String {
    // Use UUID v5 with a fixed namespace for deterministic generation
    use uuid::Uuid;
    let namespace = Uuid::parse_str("6ba7b810-9dad-11d1-80b4-00c04fd430c8").unwrap();
    Uuid::new_v5(&namespace, input.as_bytes()).to_string()
}

/// Get the version of the elizaOS core
#[cfg(feature = "wasm")]
#[wasm_bindgen(js_name = "getVersion")]
pub fn get_version() -> String {
    env!("CARGO_PKG_VERSION").to_string()
}

// ========================================
// Interop test helpers
// ========================================

/// Test serialization round-trip for Memory
#[cfg(feature = "wasm")]
#[wasm_bindgen(js_name = "testMemoryRoundTrip")]
pub fn test_memory_round_trip(json: &str) -> Result<bool, JsValue> {
    let memory = WasmMemory::from_json(json)?;
    let serialized = memory.to_json()?;
    let reparsed = WasmMemory::from_json(&serialized)?;
    let reserialized = reparsed.to_json()?;

    // Compare the final serialization
    Ok(serialized == reserialized)
}

/// Test serialization round-trip for Character
#[cfg(feature = "wasm")]
#[wasm_bindgen(js_name = "testCharacterRoundTrip")]
pub fn test_character_round_trip(json: &str) -> Result<bool, JsValue> {
    let character = WasmCharacter::from_json(json)?;
    let serialized = character.to_json()?;
    let reparsed = WasmCharacter::from_json(&serialized)?;
    let reserialized = reparsed.to_json()?;

    Ok(serialized == reserialized)
}

/// Test serialization round-trip for Agent
#[cfg(feature = "wasm")]
#[wasm_bindgen(js_name = "testAgentRoundTrip")]
pub fn test_agent_round_trip(json: &str) -> Result<bool, JsValue> {
    let agent = WasmAgent::from_json(json)?;
    let serialized = agent.to_json()?;
    let reparsed = WasmAgent::from_json(&serialized)?;
    let reserialized = reparsed.to_json()?;
```