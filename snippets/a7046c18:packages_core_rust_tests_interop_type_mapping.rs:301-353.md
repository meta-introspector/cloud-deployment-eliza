# a7046c18:packages_core_rust_tests_interop_type_mapping.rs:301-353

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/tests/interop/type_mapping.rs:301-353
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    ];

    for (event_type, expected) in types {
        let json = serde_json::to_value(&event_type).unwrap();
        assert_eq!(json, expected);
    }
}

/// Test that MemoryMetadata handles embeddings correctly
#[test]
fn test_memory_metadata_with_embedding() {
    let metadata = MemoryMetadata {
        memory_type: Some(MemoryType::Message),
        source: Some("test".to_string()),
        embedding: Some(vec![0.1, 0.2, 0.3, 0.4]),
        ..Default::default()
    };

    let json = serde_json::to_value(&metadata).unwrap();

    assert!(json["embedding"].is_array());
    let embedding = json["embedding"].as_array().unwrap();
    assert_eq!(embedding.len(), 4);
}

/// Test deserialization of complex nested structures
#[test]
fn test_complex_nested_deserialization() {
    let json = serde_json::json!({
        "name": "TestAgent",
        "system": "You are helpful",
        "bio": ["Line 1", "Line 2"],
        "topics": ["topic1", "topic2"],
        "settings": {
            "model": "gpt-4",
            "secrets": {
                "API_KEY": "secret"
            }
        },
        "messageExamples": [
            [
                {"name": "user", "content": {"text": "Hello"}},
                {"name": "agent", "content": {"text": "Hi!"}}
            ]
        ]
    });

    let character: Character = serde_json::from_value(json).unwrap();

    assert_eq!(character.name, "TestAgent");
    assert!(character.settings.is_some());
}

```