# a7046c18:packages_core_rust_tests_integration_tests.rs:601-750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/tests/integration_tests.rs:601-750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    }
}

mod action_tests {
    use super::*;

    /// Test registering and executing an action
    #[tokio::test]
    async fn test_action_registration_and_execution() {
        let runtime = AgentRuntime::new(RuntimeOptions {
            character: Some(create_test_character()),
            ..Default::default()
        })
        .await
        .unwrap();

        // Register the test plugin
        runtime.register_plugin(create_test_plugin()).await.unwrap();

        // Create a test message
        let entity_id = UUID::new_v4();
        let room_id = UUID::new_v4();
        let message = create_test_message(entity_id, room_id, "Hello, agent!");

        // Compose state
        let state = runtime.compose_state(&message).await.unwrap();

        // Process actions
        let initial_count = RESPOND_ACTION_CALL_COUNT.load(Ordering::SeqCst);
        let results = runtime
            .process_actions(&message, &state, None)
            .await
            .unwrap();

        // Verify RESPOND action was called
        assert!(RESPOND_ACTION_CALL_COUNT.load(Ordering::SeqCst) > initial_count);

        // Verify we got results
        assert!(!results.is_empty());
        assert!(results[0].success);
        assert!(results[0].text.is_some());
    }

    /// Test action validation - SEARCH action only triggers on search keywords
    #[tokio::test]
    async fn test_action_validation() {
        let runtime = AgentRuntime::new(RuntimeOptions {
            character: Some(create_test_character()),
            ..Default::default()
        })
        .await
        .unwrap();

        runtime.register_plugin(create_test_plugin()).await.unwrap();

        let entity_id = UUID::new_v4();
        let room_id = UUID::new_v4();

        // Message WITHOUT search keywords - should only trigger RESPOND
        let message1 = create_test_message(entity_id.clone(), room_id.clone(), "Just saying hello");

        let state1 = runtime.compose_state(&message1).await.unwrap();
        let results1 = runtime
            .process_actions(&message1, &state1, None)
            .await
            .unwrap();

        // Should have 1 result (RESPOND only)
        assert_eq!(results1.len(), 1);

        // Message WITH search keywords - should trigger both RESPOND and SEARCH
        let message2 = create_test_message(
            entity_id,
            room_id,
            "Please search for information about Rust",
        );

        let state2 = runtime.compose_state(&message2).await.unwrap();
        let results2 = runtime
            .process_actions(&message2, &state2, None)
            .await
            .unwrap();

        // Should have 2 results (RESPOND + SEARCH)
        assert_eq!(results2.len(), 2);
    }

    /// Test that action results contain expected data
    #[tokio::test]
    async fn test_action_result_data() {
        let runtime = AgentRuntime::new(RuntimeOptions {
            character: Some(create_test_character()),
            ..Default::default()
        })
        .await
        .unwrap();

        runtime.register_plugin(create_test_plugin()).await.unwrap();

        let entity_id = UUID::new_v4();
        let room_id = UUID::new_v4();
        let message = create_test_message(entity_id, room_id, "search for Rust documentation");

        let state = runtime.compose_state(&message).await.unwrap();
        let results = runtime
            .process_actions(&message, &state, None)
            .await
            .unwrap();

        // Find the SEARCH result
        let search_result = results.iter().find(|r| {
            r.data
                .as_ref()
                .map_or(false, |d| d.contains_key("results_count"))
        });

        assert!(search_result.is_some());
        let search_data = search_result.unwrap().data.as_ref().unwrap();
        assert_eq!(
            search_data.get("results_count").unwrap(),
            &serde_json::Value::Number(5.into())
        );
    }
}

mod provider_tests {
    use super::*;

    /// Test that providers contribute to state
    #[tokio::test]
    async fn test_provider_state_composition() {
        let runtime = AgentRuntime::new(RuntimeOptions {
            character: Some(create_test_character()),
            ..Default::default()
        })
        .await
        .unwrap();

        runtime.register_plugin(create_test_plugin()).await.unwrap();

        let entity_id = UUID::new_v4();
        let room_id = UUID::new_v4();
        let message = create_test_message(entity_id.clone(), room_id, "Hello!");

        let state = runtime.compose_state(&message).await.unwrap();

        // Verify state contains provider text
        assert!(state.text.contains("User context:"));
        assert!(state.text.contains("Recent memories:"));

```