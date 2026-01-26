# a7046c18:packages_core_rust_src_types_events.rs:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/src/types/events.rs:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    pub room_id: Option<UUID>,
    /// Entity metadata
    #[serde(skip_serializing_if = "Option::is_none")]
    pub metadata: Option<EntityEventMetadata>,
}

/// Metadata for entity events
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EntityEventMetadata {
    /// Original platform ID
    pub original_id: String,
    /// Username
    pub username: String,
    /// Display name
    #[serde(skip_serializing_if = "Option::is_none")]
    pub display_name: Option<String>,
    /// Additional data
    #[serde(flatten)]
    pub extra: HashMap<String, serde_json::Value>,
}

/// Payload for message-related events
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MessagePayload {
    /// Base payload
    #[serde(flatten)]
    pub base: EventPayload,
    /// Message memory
    pub message: Memory,
}

/// Payload for channel cleared events
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ChannelClearedPayload {
    /// Base payload
    #[serde(flatten)]
    pub base: EventPayload,
    /// Room ID
    pub room_id: UUID,
    /// Channel ID
    pub channel_id: String,
    /// Number of memories cleared
    pub memory_count: usize,
}

/// Payload for invoke events
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct InvokePayload {
    /// Base payload
    #[serde(flatten)]
    pub base: EventPayload,
    /// World ID
    pub world_id: UUID,
    /// User ID
    pub user_id: String,
    /// Room ID
    pub room_id: UUID,
}

/// Run status
#[derive(Clone, Debug, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum RunStatus {
    /// Run started
    Started,
    /// Run completed
    Completed,
    /// Run timed out
    Timeout,
}

/// Payload for run events
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RunEventPayload {
    /// Base payload
    #[serde(flatten)]
    pub base: EventPayload,
    /// Run ID
    pub run_id: UUID,
    /// Message ID
    pub message_id: UUID,
    /// Room ID
    pub room_id: UUID,
    /// Entity ID
    pub entity_id: UUID,
    /// Start time
    pub start_time: i64,
    /// Run status
    pub status: RunStatus,
    /// End time
    #[serde(skip_serializing_if = "Option::is_none")]
    pub end_time: Option<i64>,
    /// Duration in milliseconds
    #[serde(skip_serializing_if = "Option::is_none")]
    pub duration: Option<i64>,
    /// Error message
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error: Option<String>,
}

/// Payload for action events
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ActionEventPayload {
    /// Base payload
    #[serde(flatten)]
    pub base: EventPayload,
    /// Room ID
    pub room_id: UUID,
    /// World ID
    pub world: UUID,
    /// Content
    pub content: Content,
    /// Message ID
    #[serde(skip_serializing_if = "Option::is_none")]
    pub message_id: Option<UUID>,
}

/// Payload for evaluator events
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EvaluatorEventPayload {
    /// Base payload
    #[serde(flatten)]
    pub base: EventPayload,
    /// Evaluator ID
    pub evaluator_id: UUID,
    /// Evaluator name
    pub evaluator_name: String,
    /// Start time
    #[serde(skip_serializing_if = "Option::is_none")]
    pub start_time: Option<i64>,
    /// Whether completed
    #[serde(skip_serializing_if = "Option::is_none")]
    pub completed: Option<bool>,
    /// Error message
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error: Option<String>,
}

/// Payload for model events
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ModelEventPayload {
    /// Base payload
```