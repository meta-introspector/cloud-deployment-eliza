# a7046c18:packages_core_rust_tests_interop_serialization_equivalence.rs:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/tests/interop/serialization_equivalence.rs:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
//! Serialization equivalence tests
//!
//! These tests verify that Rust serialization produces identical JSON
//! to the TypeScript implementation.

use elizaos_core::types::{
    character::{Agent, AgentStatus, Bio, Character},
    environment::{ChannelType, Component, Entity, Relationship, Role, Room, World},
    memory::{Memory, MemoryMetadata, MemoryType},
    primitives::Content,
    state::{Goal, State, Task, TaskStatus},
};
use serde_json::{json, Value};

/// Test fixtures that match TypeScript output exactly
mod fixtures {
    use super::*;

    pub fn basic_memory_json() -> Value {
        json!({
            "id": "550e8400-e29b-41d4-a716-446655440000",
            "entityId": "550e8400-e29b-41d4-a716-446655440001",
            "roomId": "550e8400-e29b-41d4-a716-446655440002",
            "content": {
                "text": "Hello, world!",
                "source": "test"
            },
            "createdAt": 1704067200000_i64
        })
    }

    pub fn full_character_json() -> Value {
        json!({
            "name": "TestAgent",
            "system": "You are a helpful assistant.",
            "bio": ["An AI assistant", "Helps users with tasks"],
            "topics": ["general", "coding", "writing"],
            "messageExamples": [
                [
                    {"name": "user", "content": {"text": "Hello"}},
                    {"name": "TestAgent", "content": {"text": "Hi there!"}}
                ]
            ],
            "postExamples": ["Check out this cool thing!"],
            "settings": {
                "model": "gpt-4",
                "temperature": 0.7
            }
        })
    }

    pub fn agent_json() -> Value {
        json!({
            "id": "550e8400-e29b-41d4-a716-446655440000",
            "name": "TestAgent",
            "bio": "A test agent for verification",
            "status": "active",
            "enabled": true
        })
    }

    pub fn room_json() -> Value {
        json!({
            "id": "550e8400-e29b-41d4-a716-446655440000",
            "name": "Test Room",
            "source": "test",
            "type": "GROUP",
            "channelId": "channel-123",
            "serverId": "server-456",
            "worldId": "550e8400-e29b-41d4-a716-446655440001"
        })
    }

    pub fn entity_json() -> Value {
        json!({
            "id": "550e8400-e29b-41d4-a716-446655440000",
            "names": ["User", "TestUser"],
            "agentId": "550e8400-e29b-41d4-a716-446655440001",
            "metadata": {
                "email": "test@example.com"
            }
        })
    }
}

#[test]
fn test_memory_serialization_matches_typescript() {
    let memory = Memory {
        id: Some("550e8400-e29b-41d4-a716-446655440000".to_string()),
        entity_id: "550e8400-e29b-41d4-a716-446655440001".to_string(),
        room_id: "550e8400-e29b-41d4-a716-446655440002".to_string(),
        content: Content {
            text: Some("Hello, world!".to_string()),
            source: Some("test".to_string()),
            ..Default::default()
        },
        created_at: Some(1704067200000),
        ..Default::default()
    };

    let serialized = serde_json::to_value(&memory).unwrap();
    let expected = fixtures::basic_memory_json();

    // Check key fields match
    assert_eq!(serialized["id"], expected["id"]);
    assert_eq!(serialized["entityId"], expected["entityId"]);
    assert_eq!(serialized["roomId"], expected["roomId"]);
    assert_eq!(serialized["content"]["text"], expected["content"]["text"]);
    assert_eq!(
        serialized["content"]["source"],
        expected["content"]["source"]
    );
    assert_eq!(serialized["createdAt"], expected["createdAt"]);
}

#[test]
fn test_memory_deserialization_from_typescript() {
    let typescript_json = fixtures::basic_memory_json();
    let memory: Memory = serde_json::from_value(typescript_json).unwrap();

    assert_eq!(
        memory.id,
        Some("550e8400-e29b-41d4-a716-446655440000".to_string())
    );
    assert_eq!(
        memory.entity_id,
        "550e8400-e29b-41d4-a716-446655440001".to_string()
    );
    assert_eq!(
        memory.room_id,
        "550e8400-e29b-41d4-a716-446655440002".to_string()
    );
    assert_eq!(memory.content.text, Some("Hello, world!".to_string()));
    assert_eq!(memory.content.source, Some("test".to_string()));
    assert_eq!(memory.created_at, Some(1704067200000));
}

#[test]
fn test_memory_round_trip() {
    let original = fixtures::basic_memory_json();
    let memory: Memory = serde_json::from_value(original.clone()).unwrap();
    let serialized = serde_json::to_value(&memory).unwrap();
    let reparsed: Memory = serde_json::from_value(serialized.clone()).unwrap();
    let reserialized = serde_json::to_value(&reparsed).unwrap();

    // Check that round-trip produces identical results
    assert_eq!(serialized, reserialized);
}

#[test]
```