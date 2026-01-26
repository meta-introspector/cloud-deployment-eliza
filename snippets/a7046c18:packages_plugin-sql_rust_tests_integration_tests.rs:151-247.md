# a7046c18:packages_plugin-sql_rust_tests_integration_tests.rs:151-247

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/rust/tests/integration_tests.rs:151-247
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
            .expect("Failed to count memories");
        assert_eq!(count, 0);

        // Create some memories
        for i in 0..5 {
            let memory = Memory {
                id: None,
                entity_id: UUID::new_v4(),
                agent_id: Some(agent_id.clone()),
                created_at: None,
                content: Content {
                    text: Some(format!("Test message {}", i)),
                    ..Default::default()
                },
                embedding: None,
                room_id: room_id.clone(),
                world_id: None,
                unique: Some(true),
                similarity: None,
                metadata: None,
            };

            adapter
                .create_memory(&memory, "messages", true)
                .await
                .expect("Failed to create memory");
        }

        // Count should be 5 now
        let count = adapter
            .count_memories(&room_id, false, Some("messages"))
            .await
            .expect("Failed to count memories");
        assert_eq!(count, 5);

        // Delete all
        adapter
            .delete_all_memories(&room_id, "messages")
            .await
            .expect("Failed to delete all memories");

        // Count should be 0 again
        let count = adapter
            .count_memories(&room_id, false, Some("messages"))
            .await
            .expect("Failed to count memories");
        assert_eq!(count, 0);
    }

    /// Test cache operations
    #[tokio::test]
    #[ignore] // Requires PostgreSQL
    async fn test_cache() {
        let connection_string = std::env::var("DATABASE_URL")
            .unwrap_or_else(|_| "postgres://localhost/eliza_test".to_string());

        let agent_id = UUID::new_v4();
        let adapter = PostgresAdapter::new(&connection_string, &agent_id)
            .await
            .expect("Failed to create adapter");

        adapter.init().await.expect("Failed to init");

        // Set cache
        let data = serde_json::json!({
            "key": "value",
            "number": 42
        });

        adapter
            .set_cache("test_key", &data)
            .await
            .expect("Failed to set cache");

        // Get cache
        let retrieved: Option<serde_json::Value> = adapter
            .get_cache("test_key")
            .await
            .expect("Failed to get cache");

        assert!(retrieved.is_some());
        assert_eq!(retrieved.unwrap(), data);

        // Delete cache
        adapter
            .delete_cache("test_key")
            .await
            .expect("Failed to delete cache");

        // Verify deleted
        let retrieved: Option<serde_json::Value> = adapter
            .get_cache("test_key")
            .await
            .expect("Failed to get cache");
        assert!(retrieved.is_none());
    }
}
```