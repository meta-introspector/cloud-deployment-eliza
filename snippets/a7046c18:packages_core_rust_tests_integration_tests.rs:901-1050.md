# a7046c18:packages_core_rust_tests_integration_tests.rs:901-1050

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/tests/integration_tests.rs:901-1050
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        for memory in &memories {
            assert_eq!(memory.room_id.as_str(), room_id.as_str());
        }
    }

    /// Test searching memories with embeddings
    #[tokio::test]
    async fn test_search_memories_with_embedding() {
        let adapter = Arc::new(MockDatabaseAdapter::default());

        let room_id = UUID::new_v4();
        let entity_id = UUID::new_v4();

        // Create memory with embedding
        let mut memory_with_embedding =
            create_test_message(entity_id.clone(), room_id.clone(), "Embedded memory");
        memory_with_embedding.embedding = Some(vec![0.1, 0.2, 0.3, 0.4, 0.5]);
        adapter
            .create_memory(&memory_with_embedding, "memories")
            .await
            .unwrap();

        // Create memory without embedding
        let memory_without_embedding =
            create_test_message(entity_id, room_id.clone(), "No embedding");
        adapter
            .create_memory(&memory_without_embedding, "memories")
            .await
            .unwrap();

        // Search memories (should only return those with embeddings)
        let params = SearchMemoriesParams {
            embedding: vec![0.1, 0.2, 0.3, 0.4, 0.5],
            room_id: Some(room_id),
            count: Some(10),
            table_name: "memories".to_string(),
            match_threshold: None,
            unique: None,
            query: None,
            world_id: None,
            entity_id: None,
        };

        let results = adapter.search_memories(params).await.unwrap();

        // Should only find the memory with embedding
        assert_eq!(results.len(), 1);
        assert!(results[0].embedding.is_some());
    }
}

mod event_tests {
    use super::*;
    use std::sync::atomic::AtomicBool;

    /// Test event registration and emission
    #[tokio::test]
    async fn test_event_handling() {
        let runtime = AgentRuntime::new(RuntimeOptions {
            character: Some(create_test_character()),
            ..Default::default()
        })
        .await
        .unwrap();

        let event_received = Arc::new(AtomicBool::new(false));
        let event_received_clone = event_received.clone();

        // Register event handler
        let handler: Arc<dyn Fn(EventPayload) -> Result<()> + Send + Sync> = Arc::new(move |_| {
            event_received_clone.store(true, Ordering::SeqCst);
            Ok(())
        });

        runtime
            .register_event(EventType::MessageReceived, handler)
            .await;

        // Emit event
        let payload = EventPayload {
            source: "test".to_string(),
            extra: HashMap::new(),
        };

        runtime
            .emit_event(EventType::MessageReceived, payload)
            .await
            .unwrap();

        // Verify event was received
        assert!(event_received.load(Ordering::SeqCst));
    }
}

mod run_management_tests {
    use super::*;

    /// Test run ID management
    #[tokio::test]
    async fn test_run_lifecycle() {
        let runtime = AgentRuntime::new(RuntimeOptions {
            character: Some(create_test_character()),
            ..Default::default()
        })
        .await
        .unwrap();

        let room_id = UUID::new_v4();

        // Start a run
        let run_id = runtime.start_run(Some(&room_id));

        // Verify run ID was generated
        assert!(!run_id.as_str().is_empty());

        // End the run
        runtime.end_run();
    }

    /// Test that multiple runs generate unique IDs
    #[tokio::test]
    async fn test_unique_run_ids() {
        let runtime = AgentRuntime::new(RuntimeOptions {
            character: Some(create_test_character()),
            ..Default::default()
        })
        .await
        .unwrap();

        let room_id = UUID::new_v4();

        let run_id_1 = runtime.start_run(Some(&room_id));
        runtime.end_run();

        let run_id_2 = runtime.start_run(Some(&room_id));
        runtime.end_run();

        // Run IDs should be different
        assert_ne!(run_id_1.as_str(), run_id_2.as_str());
    }
}

mod settings_tests {
    use super::*;

    /// Test runtime settings
    #[tokio::test]
    async fn test_runtime_settings() {
        let runtime = AgentRuntime::new(RuntimeOptions {
            character: Some(create_test_character()),
```