# a7046c18:packages_core_rust_tests_integration_tests.rs:1351-1405

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/tests/integration_tests.rs:1351-1405
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        let runtime = AgentRuntime::new(RuntimeOptions {
            character: Some(create_test_character()),
            adapter: Some(adapter.clone()),
            ..Default::default()
        })
        .await
        .unwrap();

        runtime.initialize().await.unwrap();
        runtime.register_plugin(create_test_plugin()).await.unwrap();

        let entity_id = UUID::new_v4();
        let room_id = UUID::new_v4();

        // Message that should trigger multiple actions
        let message = create_test_message(
            entity_id,
            room_id.clone(),
            "Hello! Please search for documentation and provide a summary.",
        );

        let state = runtime.compose_state(&message).await.unwrap();
        let results = runtime
            .process_actions(&message, &state, None)
            .await
            .unwrap();

        // Verify both actions executed
        assert_eq!(results.len(), 2);

        // All results should be successful
        for result in &results {
            assert!(result.success);
            assert!(result.text.is_some());
        }
    }
}

// Helper for using chrono in tests
mod chrono {
    pub struct Utc;
    impl Utc {
        pub fn now() -> Self {
            Self
        }
    }
    impl Utc {
        pub fn timestamp_millis(&self) -> i64 {
            std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_millis() as i64
        }
    }
}
```