# a7046c18:packages_core_rust_tests_serialization_tests.rs:151-233

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/tests/serialization_tests.rs:151-233
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

    let json = serde_json::to_string(&world).unwrap();

    assert!(json.contains("\"name\":\"Test World\""));
    assert!(json.contains("\"agentId\""));
}

/// Test that State serializes correctly
#[test]
fn test_state_serialization() {
    let mut state = State::with_text("Current context");
    state.set_value("key", serde_json::json!("value"));
    state.set_value("number", serde_json::json!(42));
    state.set_value("flag", serde_json::json!(true));

    let json = serde_json::to_string(&state).unwrap();

    assert!(json.contains("\"text\":\"Current context\""));
    assert!(json.contains("\"key\":\"value\""));
    assert!(json.contains("\"number\":42"));
    assert!(json.contains("\"flag\":true"));
}

/// Test that Content with nested fields serializes correctly
#[test]
fn test_content_serialization() {
    let content = Content {
        text: Some("Hello, world!".to_string()),
        thought: Some("Thinking about the response...".to_string()),
        actions: Some(vec!["REPLY".to_string(), "WAIT".to_string()]),
        source: Some("discord".to_string()),
        in_reply_to: Some(UUID::new("550e8400-e29b-41d4-a716-446655440000").unwrap()),
        ..Default::default()
    };

    let json = serde_json::to_string(&content).unwrap();

    assert!(json.contains("\"text\":\"Hello, world!\""));
    assert!(json.contains("\"thought\""));
    assert!(json.contains("\"actions\""));
    assert!(json.contains("\"inReplyTo\""));
}

/// Test UUID roundtrip
#[test]
fn test_uuid_roundtrip() {
    let original = "550e8400-e29b-41d4-a716-446655440000";
    let uuid = UUID::new(original).unwrap();

    let json = serde_json::to_string(&uuid).unwrap();
    let deserialized: UUID = serde_json::from_str(&json).unwrap();

    assert_eq!(uuid, deserialized);
    assert_eq!(deserialized.as_str(), original);
}

/// Test that optional fields are omitted when None
#[test]
fn test_optional_fields_omitted() {
    let memory = Memory {
        id: None,
        entity_id: UUID::new("550e8400-e29b-41d4-a716-446655440001").unwrap(),
        agent_id: None,
        created_at: None,
        content: Content::default(),
        embedding: None,
        room_id: UUID::new("550e8400-e29b-41d4-a716-446655440003").unwrap(),
        world_id: None,
        unique: None,
        similarity: None,
        metadata: None,
    };

    let json = serde_json::to_string(&memory).unwrap();

    // These optional fields should not appear
    assert!(!json.contains("\"id\""));
    assert!(!json.contains("\"agentId\""));
    assert!(!json.contains("\"createdAt\""));
    assert!(!json.contains("\"embedding\""));
    assert!(!json.contains("\"worldId\""));
    assert!(!json.contains("\"similarity\""));
}
```