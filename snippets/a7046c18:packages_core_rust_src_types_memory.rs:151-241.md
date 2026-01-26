# a7046c18:packages_core_rust_src_types_memory.rs:151-241

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/src/types/memory.rs:151-241
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    pub unique: Option<bool>,
    /// Embedding similarity score (set when retrieved via search)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub similarity: Option<f64>,
    /// Metadata for the memory
    #[serde(skip_serializing_if = "Option::is_none")]
    pub metadata: Option<MemoryMetadata>,
}

impl Memory {
    /// Create a new memory with the given content
    pub fn new(entity_id: UUID, room_id: UUID, content: Content) -> Self {
        Memory {
            id: Some(UUID::new_v4()),
            entity_id,
            agent_id: None,
            created_at: Some(chrono_timestamp()),
            content,
            embedding: None,
            room_id,
            world_id: None,
            unique: Some(true),
            similarity: None,
            metadata: None,
        }
    }

    /// Create a message memory
    pub fn message(entity_id: UUID, room_id: UUID, text: &str) -> Self {
        let content = Content {
            text: Some(text.to_string()),
            ..Default::default()
        };
        let mut memory = Memory::new(entity_id, room_id, content);
        memory.metadata = Some(MemoryMetadata::Message(MessageMetadata {
            base: BaseMetadata {
                memory_type: "message".to_string(),
                ..Default::default()
            },
        }));
        memory
    }
}

/// Get current timestamp in milliseconds
fn chrono_timestamp() -> i64 {
    std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_millis() as i64
}

/// Specialized memory type for messages with enhanced type checking
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MessageMemory {
    /// The underlying memory
    #[serde(flatten)]
    pub memory: Memory,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_memory_serialization() {
        let memory = Memory::message(UUID::new_v4(), UUID::new_v4(), "Hello, world!");

        let json = serde_json::to_string(&memory).unwrap();

        // Should use camelCase
        assert!(json.contains("\"entityId\""));
        assert!(json.contains("\"roomId\""));
        assert!(json.contains("\"createdAt\""));
    }

    #[test]
    fn test_memory_deserialization() {
        let json = r#"{
            "entityId": "550e8400-e29b-41d4-a716-446655440000",
            "roomId": "550e8400-e29b-41d4-a716-446655440001",
            "content": {
                "text": "Hello from TypeScript!"
            }
        }"#;

        let memory: Memory = serde_json::from_str(json).unwrap();
        assert_eq!(memory.content.text.unwrap(), "Hello from TypeScript!");
    }
}
```