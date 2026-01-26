# a7046c18:packages_core_rust_tests_integration_tests.rs:451-600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/tests/integration_tests.rs:451-600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    ) -> Result<Option<ActionResult>> {
        Ok(Some(ActionResult {
            success: true,
            text: Some("Response quality: GOOD".to_string()),
            data: Some({
                let mut map = HashMap::new();
                map.insert(
                    "quality_score".to_string(),
                    serde_json::Value::Number(serde_json::Number::from_f64(0.85).unwrap()),
                );
                map
            }),
            ..Default::default()
        }))
    }
}

// ============================================================================
// Helper Functions
// ============================================================================

fn create_test_character() -> Character {
    Character {
        id: Some(UUID::new_v4()),
        name: "TestAgent".to_string(),
        username: Some("test_agent".to_string()),
        bio: Bio::Multiple(vec![
            "An AI assistant for testing".to_string(),
            "Helpful and thorough".to_string(),
        ]),
        system: Some("You are a helpful test agent.".to_string()),
        topics: Some(vec!["testing".to_string(), "development".to_string()]),
        adjectives: Some(vec!["helpful".to_string(), "thorough".to_string()]),
        plugins: Some(vec!["@elizaos/plugin-sql".to_string()]),
        ..Default::default()
    }
}

fn create_test_message(entity_id: UUID, room_id: UUID, text: &str) -> Memory {
    Memory {
        id: Some(UUID::new_v4()),
        entity_id,
        agent_id: None,
        room_id,
        world_id: None,
        content: Content {
            text: Some(text.to_string()),
            ..Default::default()
        },
        embedding: None,
        created_at: Some(chrono::Utc::now().timestamp_millis()),
        unique: Some(true),
        similarity: None,
        metadata: None,
    }
}

fn create_test_plugin() -> Plugin {
    let respond_action = Arc::new(RespondAction::new("Hello! I'm here to help."));
    let search_action = Arc::new(SearchAction);
    let user_context_provider = Arc::new(UserContextProvider);
    let memory_provider = Arc::new(MemoryProvider);
    let quality_evaluator = Arc::new(ResponseQualityEvaluator);

    Plugin {
        definition: PluginDefinition {
            name: "test-plugin".to_string(),
            description: "A test plugin with actions, providers, and evaluators".to_string(),
            ..Default::default()
        },
        action_handlers: vec![respond_action, search_action],
        provider_handlers: vec![user_context_provider, memory_provider],
        evaluator_handlers: vec![quality_evaluator],
        tests: vec![],
        init: None,
    }
}

// ============================================================================
// Tests
// ============================================================================

mod runtime_tests {
    use super::*;

    /// Test that we can create an agent runtime with a character
    #[tokio::test]
    async fn test_create_runtime_with_character() {
        let character = create_test_character();

        let runtime = AgentRuntime::new(RuntimeOptions {
            character: Some(character.clone()),
            ..Default::default()
        })
        .await
        .unwrap();

        assert_eq!(runtime.character.name, "TestAgent");
        assert_eq!(runtime.character.username, Some("test_agent".to_string()));
    }

    /// Test that we can initialize the runtime with a database adapter
    #[tokio::test]
    async fn test_runtime_initialization() {
        let adapter = Arc::new(MockDatabaseAdapter::default());

        let runtime = AgentRuntime::new(RuntimeOptions {
            character: Some(create_test_character()),
            adapter: Some(adapter.clone()),
            ..Default::default()
        })
        .await
        .unwrap();

        runtime.initialize().await.unwrap();

        // Verify adapter was initialized
        assert!(adapter.is_ready().await.unwrap());
    }

    /// Test loading character from JSON
    #[tokio::test]
    async fn test_load_character_from_json() {
        let json = r#"{
            "name": "JSONAgent",
            "bio": "Loaded from JSON",
            "system": "You are a JSON-loaded agent.",
            "topics": ["json", "parsing"],
            "messageExamples": [
                [
                    {"name": "user", "content": {"text": "Hello"}},
                    {"name": "JSONAgent", "content": {"text": "Hi there!"}}
                ]
            ]
        }"#;

        let character = parse_character(json).unwrap();

        assert_eq!(character.name, "JSONAgent");
        assert!(character.system.is_some());
        assert!(character.message_examples.is_some());

        let runtime = AgentRuntime::new(RuntimeOptions {
            character: Some(character),
            ..Default::default()
        })
        .await
        .unwrap();

        assert_eq!(runtime.character.name, "JSONAgent");
```