# a7046c18:packages_core_rust_src_types_task.rs:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/src/types/task.rs:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
//! Task types for elizaOS
//!
//! Contains Task, TaskWorker, and related types for task management.

use serde::{Deserialize, Serialize};

use super::{Metadata, UUID};

/// Task status
#[derive(Clone, Debug, Default, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum TaskStatus {
    /// Task is pending
    #[default]
    Pending,
    /// Task is in progress
    InProgress,
    /// Task completed
    Completed,
    /// Task failed
    Failed,
    /// Task cancelled
    Cancelled,
}

/// Represents a task
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Task {
    /// Unique identifier
    #[serde(skip_serializing_if = "Option::is_none")]
    pub id: Option<UUID>,
    /// Task name
    pub name: String,
    /// Task description
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    /// Task status
    #[serde(skip_serializing_if = "Option::is_none")]
    pub status: Option<TaskStatus>,
    /// Room ID
    #[serde(skip_serializing_if = "Option::is_none")]
    pub room_id: Option<UUID>,
    /// World ID
    #[serde(skip_serializing_if = "Option::is_none")]
    pub world_id: Option<UUID>,
    /// Entity ID
    #[serde(skip_serializing_if = "Option::is_none")]
    pub entity_id: Option<UUID>,
    /// Tags for filtering
    #[serde(skip_serializing_if = "Option::is_none")]
    pub tags: Option<Vec<String>>,
    /// Task metadata
    #[serde(skip_serializing_if = "Option::is_none")]
    pub metadata: Option<Metadata>,
    /// Creation timestamp
    #[serde(skip_serializing_if = "Option::is_none")]
    pub created_at: Option<i64>,
    /// Update timestamp
    #[serde(skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<i64>,
    /// Scheduled execution time
    #[serde(skip_serializing_if = "Option::is_none")]
    pub scheduled_at: Option<i64>,
    /// Repeat interval in milliseconds
    #[serde(skip_serializing_if = "Option::is_none")]
    pub repeat_interval: Option<i64>,
    /// Task data
    #[serde(skip_serializing_if = "Option::is_none")]
    pub data: Option<serde_json::Value>,
}

impl Task {
    /// Create a new task
    pub fn new(name: &str) -> Self {
        Task {
            id: Some(UUID::new_v4()),
            name: name.to_string(),
            description: None,
            status: Some(TaskStatus::Pending),
            room_id: None,
            world_id: None,
            entity_id: None,
            tags: None,
            metadata: None,
            created_at: Some(current_timestamp()),
            updated_at: Some(current_timestamp()),
            scheduled_at: None,
            repeat_interval: None,
            data: None,
        }
    }

    /// Create a scheduled task
    pub fn scheduled(name: &str, scheduled_at: i64) -> Self {
        let mut task = Task::new(name);
        task.scheduled_at = Some(scheduled_at);
        task
    }

    /// Create a repeating task
    pub fn repeating(name: &str, interval_ms: i64) -> Self {
        let mut task = Task::new(name);
        task.repeat_interval = Some(interval_ms);
        task
    }
}

/// Task worker definition
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TaskWorkerDefinition {
    /// Worker name
    pub name: String,
    /// Worker description
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
}

/// Parameters for getting tasks
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GetTasksParams {
    /// Room ID filter
    #[serde(skip_serializing_if = "Option::is_none")]
    pub room_id: Option<UUID>,
    /// Tags filter
    #[serde(skip_serializing_if = "Option::is_none")]
    pub tags: Option<Vec<String>>,
    /// Entity ID filter
    #[serde(skip_serializing_if = "Option::is_none")]
    pub entity_id: Option<UUID>,
}

fn current_timestamp() -> i64 {
    std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap()
        .as_millis() as i64
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_task_creation() {
        let task = Task::new("test-task");
        assert_eq!(task.name, "test-task");
        assert_eq!(task.status, Some(TaskStatus::Pending));
```