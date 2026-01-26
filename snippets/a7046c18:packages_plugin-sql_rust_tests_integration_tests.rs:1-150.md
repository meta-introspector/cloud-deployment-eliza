# a7046c18:packages_plugin-sql_rust_tests_integration_tests.rs:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/rust/tests/integration_tests.rs:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
//! Integration tests for elizaOS Plugin SQL
//!
//! These tests verify database operations work correctly.

#[cfg(feature = "native")]
mod native_tests {
    use elizaos_core::{Bio, Character, Content, Memory, UUID};
    use elizaos_plugin_sql::{DatabaseAdapter, PostgresAdapter};

    /// Test creating and retrieving an agent
    #[tokio::test]
    #[ignore] // Requires PostgreSQL
    async fn test_agent_crud() {
        let connection_string = std::env::var("DATABASE_URL")
            .unwrap_or_else(|_| "postgres://localhost/eliza_test".to_string());

        let agent_id = UUID::new_v4();
        let adapter = PostgresAdapter::new(&connection_string, &agent_id)
            .await
            .expect("Failed to create adapter");

        adapter.init().await.expect("Failed to init");

        // Create character
        let character = Character {
            id: Some(agent_id.clone()),
            name: "TestAgent".to_string(),
            bio: Bio::Single("A test agent".to_string()),
            ..Default::default()
        };

        let agent = elizaos_core::Agent::from_character(character);

        // Create agent
        let created = adapter
            .create_agent(&agent)
            .await
            .expect("Failed to create agent");
        assert!(created);

        // Get agent
        let retrieved = adapter
            .get_agent(&agent_id)
            .await
            .expect("Failed to get agent");
        assert!(retrieved.is_some());

        let retrieved = retrieved.unwrap();
        assert_eq!(retrieved.character.name, "TestAgent");

        // Delete agent
        let deleted = adapter
            .delete_agent(&agent_id)
            .await
            .expect("Failed to delete agent");
        assert!(deleted);

        // Verify deleted
        let retrieved = adapter
            .get_agent(&agent_id)
            .await
            .expect("Failed to get agent");
        assert!(retrieved.is_none());
    }

    /// Test memory CRUD operations
    #[tokio::test]
    #[ignore] // Requires PostgreSQL
    async fn test_memory_crud() {
        let connection_string = std::env::var("DATABASE_URL")
            .unwrap_or_else(|_| "postgres://localhost/eliza_test".to_string());

        let agent_id = UUID::new_v4();
        let adapter = PostgresAdapter::new(&connection_string, &agent_id)
            .await
            .expect("Failed to create adapter");

        adapter.init().await.expect("Failed to init");

        // Create test data
        let entity_id = UUID::new_v4();
        let room_id = UUID::new_v4();

        let memory = Memory {
            id: None,
            entity_id: entity_id.clone(),
            agent_id: Some(agent_id.clone()),
            created_at: None,
            content: Content {
                text: Some("Test message".to_string()),
                ..Default::default()
            },
            embedding: None,
            room_id: room_id.clone(),
            world_id: None,
            unique: Some(true),
            similarity: None,
            metadata: None,
        };

        // Create memory
        let memory_id = adapter
            .create_memory(&memory, "messages", true)
            .await
            .expect("Failed to create memory");

        // Get memory
        let retrieved = adapter
            .get_memory_by_id(&memory_id)
            .await
            .expect("Failed to get memory");
        assert!(retrieved.is_some());

        let retrieved = retrieved.unwrap();
        assert_eq!(retrieved.content.text, Some("Test message".to_string()));

        // Delete memory
        adapter
            .delete_memory(&memory_id)
            .await
            .expect("Failed to delete memory");

        // Verify deleted
        let retrieved = adapter
            .get_memory_by_id(&memory_id)
            .await
            .expect("Failed to get memory");
        assert!(retrieved.is_none());
    }

    /// Test counting memories
    #[tokio::test]
    #[ignore] // Requires PostgreSQL
    async fn test_count_memories() {
        let connection_string = std::env::var("DATABASE_URL")
            .unwrap_or_else(|_| "postgres://localhost/eliza_test".to_string());

        let agent_id = UUID::new_v4();
        let adapter = PostgresAdapter::new(&connection_string, &agent_id)
            .await
            .expect("Failed to create adapter");

        adapter.init().await.expect("Failed to init");

        let room_id = UUID::new_v4();

        // Count should be 0 initially
        let count = adapter
            .count_memories(&room_id, false, Some("messages"))
            .await
```