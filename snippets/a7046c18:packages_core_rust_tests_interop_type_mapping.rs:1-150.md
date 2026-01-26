# a7046c18:packages_core_rust_tests_interop_type_mapping.rs:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/tests/interop/type_mapping.rs:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
//! Type mapping tests
//!
//! Verifies that Rust types map correctly to TypeScript types

use elizaos_core::types::{
    character::{Agent, AgentStatus, Bio, Character},
    components::{Action, Evaluator, Provider},
    environment::{ChannelType, Component, Entity, Relationship, Room, World},
    events::EventType,
    memory::{Memory, MemoryMetadata, MemoryType},
    model::ModelType,
    plugin::Plugin,
    primitives::Content,
    state::{Goal, State, Task, TaskStatus},
};
use serde_json::Value;

/// Test that optional fields are properly handled
#[test]
fn test_optional_fields_serialize_correctly() {
    // Memory with only required fields
    let minimal_memory = Memory {
        entity_id: "entity-123".to_string(),
        room_id: "room-456".to_string(),
        content: Content::default(),
        ..Default::default()
    };

    let json = serde_json::to_value(&minimal_memory).unwrap();

    // Required fields should be present
    assert!(json.get("entityId").is_some());
    assert!(json.get("roomId").is_some());
    assert!(json.get("content").is_some());

    // Optional fields should be absent or null
    assert!(json.get("id").is_none() || json.get("id").unwrap().is_null());
}

/// Test that arrays are properly handled
#[test]
fn test_array_fields() {
    let character = Character {
        name: "Test".to_string(),
        topics: Some(vec!["topic1".to_string(), "topic2".to_string()]),
        bio: Some(Bio::Multiple(vec!["bio1".to_string(), "bio2".to_string()])),
        ..Default::default()
    };

    let json = serde_json::to_value(&character).unwrap();

    assert!(json["topics"].is_array());
    assert_eq!(json["topics"].as_array().unwrap().len(), 2);
}

/// Test that nested objects are properly serialized
#[test]
fn test_nested_object_serialization() {
    let memory = Memory {
        entity_id: "entity-123".to_string(),
        room_id: "room-456".to_string(),
        content: Content {
            text: Some("Hello".to_string()),
            source: Some("test".to_string()),
            metadata: Some(serde_json::json!({"key": "value"})),
            ..Default::default()
        },
        ..Default::default()
    };

    let json = serde_json::to_value(&memory).unwrap();

    assert!(json["content"].is_object());
    assert_eq!(json["content"]["text"], "Hello");
    assert_eq!(json["content"]["source"], "test");
    assert!(json["content"]["metadata"].is_object());
}

/// Test enum serialization strategies
#[test]
fn test_enum_serialization() {
    // String enums (lowercase)
    let agent_status = AgentStatus::Active;
    assert_eq!(serde_json::to_value(&agent_status).unwrap(), "active");

    // String enums (snake_case)
    let task_status = TaskStatus::InProgress;
    assert_eq!(serde_json::to_value(&task_status).unwrap(), "in_progress");

    // String enums (UPPER)
    let channel_type = ChannelType::Group;
    assert_eq!(serde_json::to_value(&channel_type).unwrap(), "GROUP");
}

/// Test that Bio can be either string or array
#[test]
fn test_bio_union_type() {
    // Single string bio
    let single_bio = Bio::Single("A simple bio".to_string());
    let json = serde_json::to_value(&single_bio).unwrap();
    assert!(json.is_string());
    assert_eq!(json.as_str().unwrap(), "A simple bio");

    // Array bio
    let multi_bio = Bio::Multiple(vec!["Line 1".to_string(), "Line 2".to_string()]);
    let json = serde_json::to_value(&multi_bio).unwrap();
    assert!(json.is_array());
    assert_eq!(json.as_array().unwrap().len(), 2);
}

/// Test that Content handles all field types correctly
#[test]
fn test_content_all_fields() {
    let content = Content {
        text: Some("Hello".to_string()),
        source: Some("test".to_string()),
        url: Some("https://example.com".to_string()),
        actions: Some(vec!["action1".to_string(), "action2".to_string()]),
        metadata: Some(serde_json::json!({"nested": {"key": "value"}})),
        attachments: Some(vec![serde_json::json!({"type": "image", "url": "..."})]),
        ..Default::default()
    };

    let json = serde_json::to_value(&content).unwrap();

    assert_eq!(json["text"], "Hello");
    assert_eq!(json["source"], "test");
    assert_eq!(json["url"], "https://example.com");
    assert!(json["actions"].is_array());
    assert!(json["metadata"].is_object());
    assert!(json["attachments"].is_array());
}

/// Test Plugin structure
#[test]
fn test_plugin_structure() {
    let plugin = Plugin {
        name: "test-plugin".to_string(),
        description: Some("A test plugin".to_string()),
        actions: Some(vec![]),
        evaluators: Some(vec![]),
        providers: Some(vec![]),
        services: Some(vec![]),
        dependencies: Some(vec!["dep1".to_string()]),
        ..Default::default()
    };

    let json = serde_json::to_value(&plugin).unwrap();

    assert_eq!(json["name"], "test-plugin");
```