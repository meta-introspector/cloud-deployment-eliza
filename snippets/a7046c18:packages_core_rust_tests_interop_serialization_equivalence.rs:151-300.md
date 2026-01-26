# a7046c18:packages_core_rust_tests_interop_serialization_equivalence.rs:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/tests/interop/serialization_equivalence.rs:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
fn test_character_serialization_matches_typescript() {
    let character = Character {
        name: "TestAgent".to_string(),
        system: Some("You are a helpful assistant.".to_string()),
        bio: Some(Bio::Multiple(vec![
            "An AI assistant".to_string(),
            "Helps users with tasks".to_string(),
        ])),
        topics: Some(vec![
            "general".to_string(),
            "coding".to_string(),
            "writing".to_string(),
        ]),
        ..Default::default()
    };

    let serialized = serde_json::to_value(&character).unwrap();

    assert_eq!(serialized["name"], "TestAgent");
    assert_eq!(serialized["system"], "You are a helpful assistant.");
}

#[test]
fn test_character_deserialization_from_typescript() {
    let typescript_json = fixtures::full_character_json();
    let character: Character = serde_json::from_value(typescript_json).unwrap();

    assert_eq!(character.name, "TestAgent");
    assert_eq!(
        character.system,
        Some("You are a helpful assistant.".to_string())
    );
    assert!(character.topics.is_some());
    let topics = character.topics.unwrap();
    assert_eq!(topics.len(), 3);
    assert!(topics.contains(&"general".to_string()));
}

#[test]
fn test_agent_serialization_matches_typescript() {
    let agent = Agent {
        id: "550e8400-e29b-41d4-a716-446655440000".to_string(),
        name: "TestAgent".to_string(),
        bio: Some(Bio::Single("A test agent for verification".to_string())),
        status: Some(AgentStatus::Active),
        enabled: Some(true),
        ..Default::default()
    };

    let serialized = serde_json::to_value(&agent).unwrap();
    let expected = fixtures::agent_json();

    assert_eq!(serialized["id"], expected["id"]);
    assert_eq!(serialized["name"], expected["name"]);
    assert_eq!(serialized["status"], expected["status"]);
    assert_eq!(serialized["enabled"], expected["enabled"]);
}

#[test]
fn test_agent_deserialization_from_typescript() {
    let typescript_json = fixtures::agent_json();
    let agent: Agent = serde_json::from_value(typescript_json).unwrap();

    assert_eq!(agent.id, "550e8400-e29b-41d4-a716-446655440000".to_string());
    assert_eq!(agent.name, "TestAgent".to_string());
    assert_eq!(agent.status, Some(AgentStatus::Active));
    assert_eq!(agent.enabled, Some(true));
}

#[test]
fn test_room_serialization_matches_typescript() {
    let room = Room {
        id: "550e8400-e29b-41d4-a716-446655440000".to_string(),
        name: Some("Test Room".to_string()),
        source: Some("test".to_string()),
        room_type: Some(ChannelType::Group),
        channel_id: Some("channel-123".to_string()),
        server_id: Some("server-456".to_string()),
        world_id: Some("550e8400-e29b-41d4-a716-446655440001".to_string()),
        ..Default::default()
    };

    let serialized = serde_json::to_value(&room).unwrap();
    let expected = fixtures::room_json();

    assert_eq!(serialized["id"], expected["id"]);
    assert_eq!(serialized["name"], expected["name"]);
}

#[test]
fn test_room_deserialization_from_typescript() {
    let typescript_json = fixtures::room_json();
    let room: Room = serde_json::from_value(typescript_json).unwrap();

    assert_eq!(room.id, "550e8400-e29b-41d4-a716-446655440000".to_string());
    assert_eq!(room.name, Some("Test Room".to_string()));
    assert_eq!(room.room_type, Some(ChannelType::Group));
}

#[test]
fn test_entity_serialization_matches_typescript() {
    let entity = Entity {
        id: "550e8400-e29b-41d4-a716-446655440000".to_string(),
        names: Some(vec!["User".to_string(), "TestUser".to_string()]),
        agent_id: Some("550e8400-e29b-41d4-a716-446655440001".to_string()),
        metadata: Some(serde_json::json!({"email": "test@example.com"})),
        ..Default::default()
    };

    let serialized = serde_json::to_value(&entity).unwrap();
    let expected = fixtures::entity_json();

    assert_eq!(serialized["id"], expected["id"]);
    assert_eq!(serialized["names"], expected["names"]);
    assert_eq!(serialized["metadata"]["email"], expected["metadata"]["email"]);
}

#[test]
fn test_entity_deserialization_from_typescript() {
    let typescript_json = fixtures::entity_json();
    let entity: Entity = serde_json::from_value(typescript_json).unwrap();

    assert_eq!(
        entity.id,
        "550e8400-e29b-41d4-a716-446655440000".to_string()
    );
    assert_eq!(
        entity.names,
        Some(vec!["User".to_string(), "TestUser".to_string()])
    );
}

#[test]
fn test_channel_type_serialization() {
    // Test all channel types serialize correctly
    let types = vec![
        (ChannelType::Dm, "DM"),
        (ChannelType::Group, "GROUP"),
        (ChannelType::Voice, "VOICE"),
        (ChannelType::Feed, "FEED"),
        (ChannelType::Thread, "THREAD"),
        (ChannelType::World, "WORLD"),
        (ChannelType::Self_, "SELF"),
        (ChannelType::Api, "API"),
    ];

    for (channel_type, expected) in types {
        let serialized = serde_json::to_value(&channel_type).unwrap();
        assert_eq!(serialized, expected);
    }
```