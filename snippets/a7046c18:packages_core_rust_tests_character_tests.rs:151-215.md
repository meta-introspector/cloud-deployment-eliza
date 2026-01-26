# a7046c18:packages_core_rust_tests_character_tests.rs:151-215

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/tests/character_tests.rs:151-215
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
/// Test building plugins with OpenAI key
#[test]
fn test_build_plugins_with_openai() {
    let mut env = HashMap::new();
    env.insert("OPENAI_API_KEY".to_string(), "test-key".to_string());

    let plugins = build_character_plugins(&env);

    assert!(plugins.contains(&"@elizaos/plugin-openai".to_string()));
    // Should not have ollama fallback
    assert!(!plugins.contains(&"@elizaos/plugin-ollama".to_string()));
}

/// Test building plugins with Discord token
#[test]
fn test_build_plugins_with_discord() {
    let mut env = HashMap::new();
    env.insert("DISCORD_API_TOKEN".to_string(), "test-token".to_string());

    let plugins = build_character_plugins(&env);

    assert!(plugins.contains(&"@elizaos/plugin-discord".to_string()));
}

/// Test building plugins with elizaOS Cloud
#[test]
fn test_build_plugins_with_cloud() {
    let mut env = HashMap::new();
    env.insert("ELIZAOS_CLOUD_API_KEY".to_string(), "test-key".to_string());

    let plugins = build_character_plugins(&env);

    assert!(plugins.contains(&"@elizaos/plugin-elizacloud".to_string()));
    // Should not have local SQL plugin
    assert!(!plugins.contains(&"@elizaos/plugin-sql".to_string()));
}

/// Test building plugins with IGNORE_BOOTSTRAP
#[test]
fn test_build_plugins_ignore_bootstrap() {
    let mut env = HashMap::new();
    env.insert("IGNORE_BOOTSTRAP".to_string(), "true".to_string());

    let plugins = build_character_plugins(&env);

    assert!(!plugins.contains(&"@elizaos/plugin-bootstrap".to_string()));
}

/// Test character bio_string method
#[test]
fn test_character_bio_string() {
    let single = Character {
        name: "Test".to_string(),
        bio: Bio::Single("Single bio".to_string()),
        ..Default::default()
    };
    assert_eq!(single.bio_string(), "Single bio");

    let multiple = Character {
        name: "Test".to_string(),
        bio: Bio::Multiple(vec!["Line 1".to_string(), "Line 2".to_string()]),
        ..Default::default()
    };
    assert_eq!(multiple.bio_string(), "Line 1\nLine 2");
}
```