# a7046c18:packages_core_rust_src_types_task.rs:151-171

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/src/types/task.rs:151-171
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        assert!(task.id.is_some());
    }

    #[test]
    fn test_task_serialization() {
        let task = Task::new("test-task");
        let json = serde_json::to_string(&task).unwrap();

        assert!(json.contains("\"name\":\"test-task\""));
        // Status is now snake_case
        assert!(json.contains("\"status\":\"pending\""));
    }

    #[test]
    fn test_task_status_in_progress() {
        let mut task = Task::new("running-task");
        task.status = Some(TaskStatus::InProgress);
        let json = serde_json::to_string(&task).unwrap();
        assert!(json.contains("\"status\":\"in_progress\""));
    }
}
```