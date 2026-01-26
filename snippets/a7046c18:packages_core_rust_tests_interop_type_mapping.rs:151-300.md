# a7046c18:packages_core_rust_tests_interop_type_mapping.rs:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/tests/interop/type_mapping.rs:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    assert_eq!(json["description"], "A test plugin");
    assert!(json["actions"].is_array());
    assert!(json["dependencies"].is_array());
}

/// Test State structure
#[test]
fn test_state_structure() {
    let state = State {
        agent_id: Some("agent-123".to_string()),
        agent_name: Some("TestAgent".to_string()),
        room_id: Some("room-456".to_string()),
        recent_messages: Some(vec![]),
        goals: Some(vec![]),
        ..Default::default()
    };

    let json = serde_json::to_value(&state).unwrap();

    assert_eq!(json["agentId"], "agent-123");
    assert_eq!(json["agentName"], "TestAgent");
    assert_eq!(json["roomId"], "room-456");
}

/// Test Goal structure
#[test]
fn test_goal_structure() {
    let goal = Goal {
        id: Some("goal-123".to_string()),
        name: Some("Test Goal".to_string()),
        status: Some(TaskStatus::Pending),
        objectives: Some(vec![]),
        ..Default::default()
    };

    let json = serde_json::to_value(&goal).unwrap();

    assert!(json.get("id").is_some());
    assert!(json.get("name").is_some());
    assert!(json.get("status").is_some());
}

/// Test Task structure
#[test]
fn test_task_structure() {
    let task = Task {
        id: Some(UUID::new("550e8400-e29b-41d4-a716-446655440000").unwrap()),
        name: "Test Task".to_string(),
        description: Some("A test task".to_string()),
        status: Some(TaskStatus::Pending),
        room_id: Some(UUID::new("550e8400-e29b-41d4-a716-446655440001").unwrap()),
        ..Default::default()
    };

    let json = serde_json::to_value(&task).unwrap();

    assert_eq!(json["id"], "550e8400-e29b-41d4-a716-446655440000");
    assert_eq!(json["name"], "Test Task");
    assert_eq!(json["status"], "pending");
}

/// Test World structure
#[test]
fn test_world_structure() {
    let world = World {
        id: "world-123".to_string(),
        name: Some("Test World".to_string()),
        owner_id: Some("owner-456".to_string()),
        ..Default::default()
    };

    let json = serde_json::to_value(&world).unwrap();

    assert_eq!(json["id"], "world-123");
    assert_eq!(json["name"], "Test World");
    assert_eq!(json["ownerId"], "owner-456");
}

/// Test Component structure
#[test]
fn test_component_structure() {
    let component = Component {
        id: "comp-123".to_string(),
        entity_id: "entity-456".to_string(),
        agent_id: "agent-789".to_string(),
        room_id: "room-abc".to_string(),
        world_id: Some("world-def".to_string()),
        source_entity_id: Some("source-ghi".to_string()),
        component_type: "test".to_string(),
        data: serde_json::json!({"key": "value"}),
        ..Default::default()
    };

    let json = serde_json::to_value(&component).unwrap();

    assert_eq!(json["id"], "comp-123");
    assert_eq!(json["type"], "test");
    assert!(json["data"].is_object());
}

/// Test Relationship structure
#[test]
fn test_relationship_structure() {
    let relationship = Relationship {
        id: "rel-123".to_string(),
        source_entity_id: "source-456".to_string(),
        target_entity_id: "target-789".to_string(),
        agent_id: "agent-abc".to_string(),
        tags: Some(vec!["friend".to_string()]),
        ..Default::default()
    };

    let json = serde_json::to_value(&relationship).unwrap();

    assert_eq!(json["id"], "rel-123");
    assert_eq!(json["sourceEntityId"], "source-456");
    assert_eq!(json["targetEntityId"], "target-789");
    assert!(json["tags"].is_array());
}

/// Test ModelType enum
#[test]
fn test_model_type_enum() {
    let types = vec![
        (ModelType::TextSmall, "TEXT_SMALL"),
        (ModelType::TextLarge, "TEXT_LARGE"),
        (ModelType::TextEmbedding, "TEXT_EMBEDDING"),
        (ModelType::ImageDescription, "IMAGE_DESCRIPTION"),
        (ModelType::ImageGeneration, "IMAGE_GENERATION"),
        (ModelType::AudioTranscription, "AUDIO_TRANSCRIPTION"),
        (ModelType::TextToSpeech, "TEXT_TO_SPEECH"),
    ];

    for (model_type, expected) in types {
        let json = serde_json::to_value(&model_type).unwrap();
        assert_eq!(json, expected);
    }
}

/// Test EventType enum
#[test]
fn test_event_type_enum() {
    let types = vec![
        (EventType::WorldJoined, "WORLD_JOINED"),
        (EventType::WorldLeft, "WORLD_LEFT"),
        (EventType::WorldConnected, "WORLD_CONNECTED"),
        (EventType::MessageReceived, "MESSAGE_RECEIVED"),
        (EventType::MessageSent, "MESSAGE_SENT"),
        (EventType::ActionStarted, "ACTION_STARTED"),
        (EventType::ActionCompleted, "ACTION_COMPLETED"),
```