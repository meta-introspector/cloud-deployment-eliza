# a7046c18:packages_core_rust_tests_integration_tests.rs:751-900

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/tests/integration_tests.rs:751-900
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        // Verify state contains provider values
        assert!(state.values.contains_key("entity_id"));
        assert!(state.values.contains_key("memory_count"));
    }

    /// Test that private providers are skipped
    #[tokio::test]
    async fn test_private_provider_skipped() {
        // Create a plugin with a private provider
        struct PrivateProvider;

        #[async_trait]
        impl ProviderHandler for PrivateProvider {
            fn definition(&self) -> ProviderDefinition {
                ProviderDefinition {
                    name: "PRIVATE_DATA".to_string(),
                    description: Some("Private provider".to_string()),
                    dynamic: Some(false),
                    position: None,
                    private: Some(true), // Mark as private
                }
            }

            async fn get(&self, _message: &Memory, _state: &State) -> Result<ProviderResult> {
                Ok(ProviderResult {
                    text: Some("PRIVATE DATA - SHOULD NOT APPEAR".to_string()),
                    values: None,
                    data: None,
                })
            }
        }

        let runtime = AgentRuntime::new(RuntimeOptions {
            character: Some(create_test_character()),
            ..Default::default()
        })
        .await
        .unwrap();

        let plugin = Plugin {
            definition: PluginDefinition {
                name: "private-plugin".to_string(),
                description: "Plugin with private provider".to_string(),
                ..Default::default()
            },
            provider_handlers: vec![Arc::new(PrivateProvider)],
            ..Default::default()
        };

        runtime.register_plugin(plugin).await.unwrap();

        let entity_id = UUID::new_v4();
        let room_id = UUID::new_v4();
        let message = create_test_message(entity_id, room_id, "Hello!");

        let state = runtime.compose_state(&message).await.unwrap();

        // Private provider text should NOT appear
        assert!(!state.text.contains("PRIVATE DATA"));
    }
}

mod memory_tests {
    use super::*;

    /// Test memory CRUD operations
    #[tokio::test]
    async fn test_memory_crud() {
        let adapter = Arc::new(MockDatabaseAdapter::default());

        let runtime = AgentRuntime::new(RuntimeOptions {
            character: Some(create_test_character()),
            adapter: Some(adapter.clone()),
            ..Default::default()
        })
        .await
        .unwrap();

        runtime.initialize().await.unwrap();

        let entity_id = UUID::new_v4();
        let room_id = UUID::new_v4();

        // Create memory
        let memory = create_test_message(entity_id.clone(), room_id.clone(), "Test memory content");
        let memory_id = adapter.create_memory(&memory, "memories").await.unwrap();

        // Read memory
        let retrieved = adapter.get_memory_by_id(&memory_id).await.unwrap();
        assert!(retrieved.is_some());
        assert_eq!(
            retrieved.as_ref().unwrap().content.text,
            memory.content.text
        );

        // Update memory
        let mut updated_memory = retrieved.unwrap();
        updated_memory.content.text = Some("Updated content".to_string());
        adapter.update_memory(&updated_memory).await.unwrap();

        let re_retrieved = adapter.get_memory_by_id(&memory_id).await.unwrap();
        assert_eq!(
            re_retrieved.unwrap().content.text,
            Some("Updated content".to_string())
        );

        // Delete memory
        adapter.delete_memory(&memory_id).await.unwrap();
        let deleted = adapter.get_memory_by_id(&memory_id).await.unwrap();
        assert!(deleted.is_none());
    }

    /// Test getting memories by room
    #[tokio::test]
    async fn test_get_memories_by_room() {
        let adapter = Arc::new(MockDatabaseAdapter::default());

        let room_id = UUID::new_v4();
        let entity_id = UUID::new_v4();

        // Create multiple memories in the same room
        for i in 0..5 {
            let memory = create_test_message(
                entity_id.clone(),
                room_id.clone(),
                &format!("Message {}", i),
            );
            adapter.create_memory(&memory, "memories").await.unwrap();
        }

        // Create a memory in a different room
        let other_room_id = UUID::new_v4();
        let other_memory =
            create_test_message(entity_id.clone(), other_room_id, "Other room message");
        adapter
            .create_memory(&other_memory, "memories")
            .await
            .unwrap();

        // Get memories for the first room
        let params = GetMemoriesParams {
            room_id: Some(room_id.clone()),
            table_name: "memories".to_string(),
            ..Default::default()
        };

        let memories = adapter.get_memories(params).await.unwrap();

        // Should only get memories from the first room
        assert_eq!(memories.len(), 5);
```