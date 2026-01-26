# a7046c18:packages_core_rust_tests_integration_tests.rs:1201-1350

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/tests/integration_tests.rs:1201-1350
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        let entity_id = entity.id.clone().unwrap();
        adapter.create_entity(&entity).await.unwrap();

        // Retrieve entity
        let retrieved_entity = adapter.get_entity(&entity_id).await.unwrap();
        assert!(retrieved_entity.is_some());

        // Add participant
        let result = adapter.add_participant(&entity_id, &room_id).await.unwrap();
        assert!(result);
    }

    /// Test task operations
    #[tokio::test]
    async fn test_task_operations() {
        let adapter = Arc::new(MockDatabaseAdapter::default());
        adapter.init().await.unwrap();

        // Create task
        let task = Task::new("test-task");
        let task_id = adapter.create_task(&task).await.unwrap();

        // Retrieve task
        let retrieved = adapter.get_task(&task_id).await.unwrap();
        assert!(retrieved.is_some());
        assert_eq!(retrieved.as_ref().unwrap().name, "test-task");

        // Update task
        let mut updated_task = retrieved.unwrap();
        updated_task.description = Some("Updated description".to_string());
        adapter.update_task(&task_id, &updated_task).await.unwrap();

        let re_retrieved = adapter.get_task(&task_id).await.unwrap();
        assert_eq!(
            re_retrieved.unwrap().description,
            Some("Updated description".to_string())
        );

        // Delete task
        adapter.delete_task(&task_id).await.unwrap();
        let deleted = adapter.get_task(&task_id).await.unwrap();
        assert!(deleted.is_none());
    }
}

mod end_to_end_tests {
    use super::*;

    /// Full end-to-end test simulating an agent conversation
    #[tokio::test]
    async fn test_agent_conversation_flow() {
        // Setup
        let adapter = Arc::new(MockDatabaseAdapter::default());

        let character = create_test_character();
        let runtime = AgentRuntime::new(RuntimeOptions {
            character: Some(character),
            adapter: Some(adapter.clone()),
            ..Default::default()
        })
        .await
        .unwrap();

        runtime.initialize().await.unwrap();
        runtime.register_plugin(create_test_plugin()).await.unwrap();

        // Create conversation context
        let entity_id = UUID::new_v4();
        let room_id = UUID::new_v4();

        // Start a run
        let _run_id = runtime.start_run(Some(&room_id));

        // User sends first message
        let user_message_1 =
            create_test_message(entity_id.clone(), room_id.clone(), "Hello! Who are you?");

        // Store message
        adapter
            .create_memory(&user_message_1, "memories")
            .await
            .unwrap();

        // Agent processes message
        let state_1 = runtime.compose_state(&user_message_1).await.unwrap();
        let results_1 = runtime
            .process_actions(&user_message_1, &state_1, None)
            .await
            .unwrap();

        assert!(!results_1.is_empty());
        assert!(results_1[0].success);

        // Create and store agent response
        let agent_response_1 = create_test_message(
            runtime.agent_id.clone(),
            room_id.clone(),
            results_1[0].text.as_deref().unwrap_or("Hello!"),
        );
        adapter
            .create_memory(&agent_response_1, "memories")
            .await
            .unwrap();

        // User sends second message
        let user_message_2 = create_test_message(
            entity_id.clone(),
            room_id.clone(),
            "Can you search for information about Rust programming?",
        );
        adapter
            .create_memory(&user_message_2, "memories")
            .await
            .unwrap();

        // Agent processes second message
        let state_2 = runtime.compose_state(&user_message_2).await.unwrap();
        let results_2 = runtime
            .process_actions(&user_message_2, &state_2, None)
            .await
            .unwrap();

        // Should have both RESPOND and SEARCH results
        assert_eq!(results_2.len(), 2);

        // End the run
        runtime.end_run();

        // Verify memories were stored
        let memories = adapter
            .get_memories(GetMemoriesParams {
                room_id: Some(room_id),
                table_name: "memories".to_string(),
                ..Default::default()
            })
            .await
            .unwrap();

        // Should have at least the user messages
        assert!(
            memories.len() >= 2,
            "Should have at least user messages stored"
        );
    }

    /// Test agent with complex multi-action scenario
    #[tokio::test]
    async fn test_multi_action_scenario() {
        let adapter = Arc::new(MockDatabaseAdapter::default());

```