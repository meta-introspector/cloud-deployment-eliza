# a7046c18:packages_core_rust_tests_character_tests.rs:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/tests/character_tests.rs:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
//! Character loading tests for elizaOS Core
//!
//! These tests verify that character files can be loaded and parsed correctly.

use elizaos_core::{
    build_character_plugins, merge_character_defaults, parse_character,
    types::{Bio, Character},
    validate_character,
};
use std::collections::HashMap;

/// Test loading a minimal character
#[test]
fn test_load_minimal_character() {
    let json = r#"{
        "name": "Minimal Agent",
        "bio": "A minimal test agent"
    }"#;

    let character = parse_character(json).unwrap();
    assert_eq!(character.name, "Minimal Agent");
}

/// Test loading a full character with all fields
#[test]
fn test_load_full_character() {
    let json = r#"{
        "name": "Full Agent",
        "username": "full_agent",
        "bio": ["Line 1", "Line 2"],
        "system": "You are a comprehensive test agent.",
        "topics": ["testing", "development", "rust"],
        "adjectives": ["thorough", "careful", "precise"],
        "plugins": ["@elizaos/plugin-sql", "@elizaos/plugin-bootstrap"],
        "settings": {
            "debugMode": true,
            "maxTokens": 1000
        },
        "style": {
            "all": ["Be concise", "Be helpful"],
            "chat": ["Be conversational"]
        },
        "messageExamples": [
            [
                {"name": "User", "content": {"text": "Hello"}},
                {"name": "Agent", "content": {"text": "Hi there!"}}
            ]
        ],
        "postExamples": ["Example post 1", "Example post 2"]
    }"#;

    let character = parse_character(json).unwrap();

    assert_eq!(character.name, "Full Agent");
    assert_eq!(character.username, Some("full_agent".to_string()));
    assert!(character.topics.is_some());
    assert_eq!(character.topics.as_ref().unwrap().len(), 3);
    assert!(character.plugins.is_some());
    assert!(character.settings.is_some());
    assert!(character.style.is_some());
    assert!(character.message_examples.is_some());
    assert!(character.post_examples.is_some());
}

/// Test character validation with valid character
#[test]
fn test_validate_valid_character() {
    let character = Character {
        name: "Valid Agent".to_string(),
        bio: Bio::Single("A valid agent".to_string()),
        ..Default::default()
    };

    assert!(validate_character(&character).is_ok());
}

/// Test character validation with empty name
#[test]
fn test_validate_empty_name() {
    let character = Character {
        name: "".to_string(),
        bio: Bio::Single("A test agent".to_string()),
        ..Default::default()
    };

    let result = validate_character(&character);
    assert!(result.is_err());
    assert!(result.unwrap_err().to_string().contains("name"));
}

/// Test character validation with empty bio
#[test]
fn test_validate_empty_bio() {
    let character = Character {
        name: "Test Agent".to_string(),
        bio: Bio::Single("".to_string()),
        ..Default::default()
    };

    let result = validate_character(&character);
    assert!(result.is_err());
    assert!(result.unwrap_err().to_string().contains("bio"));
}

/// Test merging character defaults
#[test]
fn test_merge_defaults() {
    let character = Character {
        name: "Test Agent".to_string(),
        bio: Bio::Single("Test bio".to_string()),
        ..Default::default()
    };

    let merged = merge_character_defaults(character);

    // Should have settings and plugins after merge
    assert!(merged.settings.is_some());
    assert!(merged.plugins.is_some());
}

/// Test merging character defaults with empty bio
#[test]
fn test_merge_defaults_empty_bio() {
    let character = Character {
        name: "Test Agent".to_string(),
        bio: Bio::Single("".to_string()),
        ..Default::default()
    };

    let merged = merge_character_defaults(character);

    // Bio should be filled with default
    match &merged.bio {
        Bio::Single(s) => assert!(!s.is_empty()),
        _ => panic!("Expected single bio"),
    }
}

/// Test building plugins from empty environment
#[test]
fn test_build_plugins_empty_env() {
    let env = HashMap::new();
    let plugins = build_character_plugins(&env);

    // Should have sql, bootstrap, and ollama (fallback)
    assert!(plugins.contains(&"@elizaos/plugin-sql".to_string()));
    assert!(plugins.contains(&"@elizaos/plugin-bootstrap".to_string()));
    assert!(plugins.contains(&"@elizaos/plugin-ollama".to_string()));
}

```