# a7046c18:packages_core_rust_tests_integration_tests.rs:1051-1200

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/tests/integration_tests.rs:1051-1200
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
            ..Default::default()
        })
        .await
        .unwrap();

        // Set and get string settings
        runtime.set_setting("API_KEY", "test-key-123").await;
        let value = runtime.get_setting("API_KEY").await;
        assert_eq!(value, Some("test-key-123".to_string()));

        // Get non-existent setting
        let missing = runtime.get_setting("MISSING_KEY").await;
        assert!(missing.is_none());
    }

    /// Test settings persistence
    #[tokio::test]
    async fn test_settings_persistence() {
        let runtime = AgentRuntime::new(RuntimeOptions {
            character: Some(create_test_character()),
            settings: Some(RuntimeSettings {
                values: {
                    let mut map = HashMap::new();
                    map.insert(
                        "PRESET_KEY".to_string(),
                        SettingValue::String("preset_value".to_string()),
                    );
                    map
                },
            }),
            ..Default::default()
        })
        .await
        .unwrap();

        // Verify preset setting exists
        let value = runtime.get_setting("PRESET_KEY").await;
        assert_eq!(value, Some("preset_value".to_string()));
    }
}

mod plugin_tests {
    use super::*;

    /// Test plugin registration
    #[tokio::test]
    async fn test_plugin_registration() {
        let runtime = AgentRuntime::new(RuntimeOptions {
            character: Some(create_test_character()),
            ..Default::default()
        })
        .await
        .unwrap();

        let plugin = create_test_plugin();
        let _plugin_name = plugin.definition.name.clone();

        runtime.register_plugin(plugin).await.unwrap();

        // Plugin should be registered (verified by being able to use its actions)
        let entity_id = UUID::new_v4();
        let room_id = UUID::new_v4();
        let message = create_test_message(entity_id, room_id, "Test message");

        let state = runtime.compose_state(&message).await.unwrap();
        let results = runtime
            .process_actions(&message, &state, None)
            .await
            .unwrap();

        // Should have action results from the plugin
        assert!(!results.is_empty());
    }

    /// Test plugin with all component types
    #[tokio::test]
    async fn test_full_plugin_integration() {
        let runtime = AgentRuntime::new(RuntimeOptions {
            character: Some(create_test_character()),
            ..Default::default()
        })
        .await
        .unwrap();

        runtime.register_plugin(create_test_plugin()).await.unwrap();

        let entity_id = UUID::new_v4();
        let room_id = UUID::new_v4();
        let message = create_test_message(entity_id, room_id, "Hello! Please search for help.");

        // Step 1: Compose state (uses providers)
        let state = runtime.compose_state(&message).await.unwrap();
        assert!(
            !state.text.is_empty(),
            "Providers should contribute to state"
        );

        // Step 2: Process actions
        let action_results = runtime
            .process_actions(&message, &state, None)
            .await
            .unwrap();
        assert!(!action_results.is_empty(), "Actions should produce results");

        // Verify both RESPOND and SEARCH actions ran
        let has_search_result = action_results.iter().any(|r| {
            r.data
                .as_ref()
                .map_or(false, |d| d.contains_key("results_count"))
        });
        assert!(has_search_result, "SEARCH action should have run");

        let has_respond_result = action_results.iter().any(|r| {
            r.data
                .as_ref()
                .map_or(false, |d| d.contains_key("response_type"))
        });
        assert!(has_respond_result, "RESPOND action should have run");
    }
}

mod database_adapter_tests {
    use super::*;

    /// Test room and entity operations
    #[tokio::test]
    async fn test_room_entity_operations() {
        let adapter = Arc::new(MockDatabaseAdapter::default());
        adapter.init().await.unwrap();

        // Create world
        let world = World {
            id: UUID::new_v4(),
            name: Some("Test World".to_string()),
            agent_id: UUID::new_v4(),
            message_server_id: None,
            metadata: None,
        };
        adapter.create_world(&world).await.unwrap();

        // Create room
        let room = Room::new("test-room", "test", elizaos_core::types::ChannelType::Group);
        let room_id = adapter.create_room(&room).await.unwrap();

        // Retrieve room
        let retrieved_room = adapter.get_room(&room_id).await.unwrap();
        assert!(retrieved_room.is_some());

        // Create entity
        let entity = Entity::new("TestUser", world.agent_id.clone());
```