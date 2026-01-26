# a7046c18:packages_core_rust_tests_interop_serialization_equivalence.rs:301-347

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/tests/interop/serialization_equivalence.rs:301-347
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
}

#[test]
fn test_agent_status_serialization() {
    let statuses = vec![
        (AgentStatus::Active, "active"),
        (AgentStatus::Inactive, "inactive"),
        (AgentStatus::Paused, "paused"),
    ];

    for (status, expected) in statuses {
        let serialized = serde_json::to_value(&status).unwrap();
        assert_eq!(serialized, expected);
    }
}

#[test]
fn test_task_status_serialization() {
    let statuses = vec![
        (TaskStatus::Pending, "pending"),
        (TaskStatus::InProgress, "in_progress"),
        (TaskStatus::Completed, "completed"),
        (TaskStatus::Failed, "failed"),
        (TaskStatus::Cancelled, "cancelled"),
    ];

    for (status, expected) in statuses {
        let serialized = serde_json::to_value(&status).unwrap();
        assert_eq!(serialized, expected);
    }
}

#[test]
fn test_memory_type_serialization() {
    let types = vec![
        (MemoryType::Message, "message"),
        (MemoryType::Document, "document"),
        (MemoryType::Post, "post"),
        (MemoryType::Custom("custom".to_string()), "custom"),
    ];

    for (memory_type, expected) in types {
        let serialized = serde_json::to_value(&memory_type).unwrap();
        assert_eq!(serialized, expected);
    }
}

```