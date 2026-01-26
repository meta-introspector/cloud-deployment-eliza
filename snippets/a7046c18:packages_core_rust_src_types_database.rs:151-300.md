# a7046c18:packages_core_rust_src_types_database.rs:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/src/types/database.rs:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    pub base: BaseLogBody,
    /// Model type
    #[serde(skip_serializing_if = "Option::is_none")]
    pub model_type: Option<String>,
    /// Model key
    #[serde(skip_serializing_if = "Option::is_none")]
    pub model_key: Option<String>,
    /// Parameters
    #[serde(skip_serializing_if = "Option::is_none")]
    pub params: Option<HashMap<String, serde_json::Value>>,
    /// Prompt
    #[serde(skip_serializing_if = "Option::is_none")]
    pub prompt: Option<String>,
    /// System prompt
    #[serde(skip_serializing_if = "Option::is_none")]
    pub system_prompt: Option<String>,
    /// Timestamp
    #[serde(skip_serializing_if = "Option::is_none")]
    pub timestamp: Option<i64>,
    /// Execution time
    #[serde(skip_serializing_if = "Option::is_none")]
    pub execution_time: Option<i64>,
    /// Provider
    #[serde(skip_serializing_if = "Option::is_none")]
    pub provider: Option<String>,
    /// Action context
    #[serde(skip_serializing_if = "Option::is_none")]
    pub action_context: Option<ModelActionContext>,
    /// Response
    #[serde(skip_serializing_if = "Option::is_none")]
    pub response: Option<serde_json::Value>,
}

/// Model action context
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ModelActionContext {
    /// Action name
    pub action_name: String,
    /// Action ID
    pub action_id: UUID,
}

/// Log body for embedding logs
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EmbeddingLogBody {
    /// Base fields
    #[serde(flatten)]
    pub base: BaseLogBody,
    /// Memory ID
    #[serde(skip_serializing_if = "Option::is_none")]
    pub memory_id: Option<String>,
    /// Duration in ms
    #[serde(skip_serializing_if = "Option::is_none")]
    pub duration: Option<i64>,
}

/// Union type for log body
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(untagged)]
pub enum LogBody {
    /// Base log
    Base(BaseLogBody),
    /// Action log
    Action(ActionLogBody),
    /// Evaluator log
    Evaluator(EvaluatorLogBody),
    /// Model log
    Model(ModelLogBody),
    /// Embedding log
    Embedding(EmbeddingLogBody),
}

/// Represents a log entry
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Log {
    /// Optional unique identifier
    #[serde(skip_serializing_if = "Option::is_none")]
    pub id: Option<UUID>,
    /// Associated entity ID
    pub entity_id: UUID,
    /// Associated room ID
    #[serde(skip_serializing_if = "Option::is_none")]
    pub room_id: Option<UUID>,
    /// Log body
    pub body: LogBody,
    /// Log type
    #[serde(rename = "type")]
    pub log_type: String,
    /// Log creation timestamp
    pub created_at: String,
}

/// Run status for agent runs
#[derive(Clone, Debug, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum RunStatus {
    /// Run started
    Started,
    /// Run completed
    Completed,
    /// Run timed out
    Timeout,
    /// Run errored
    Error,
}

/// Agent run counts
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AgentRunCounts {
    /// Number of actions
    pub actions: i32,
    /// Number of model calls
    pub model_calls: i32,
    /// Number of errors
    pub errors: i32,
    /// Number of evaluators
    pub evaluators: i32,
}

/// Agent run summary
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AgentRunSummary {
    /// Run ID
    pub run_id: String,
    /// Status
    pub status: RunStatus,
    /// Start time
    #[serde(skip_serializing_if = "Option::is_none")]
    pub started_at: Option<i64>,
    /// End time
    #[serde(skip_serializing_if = "Option::is_none")]
    pub ended_at: Option<i64>,
    /// Duration in ms
    #[serde(skip_serializing_if = "Option::is_none")]
    pub duration_ms: Option<i64>,
    /// Message ID
    #[serde(skip_serializing_if = "Option::is_none")]
    pub message_id: Option<UUID>,
    /// Room ID
    #[serde(skip_serializing_if = "Option::is_none")]
    pub room_id: Option<UUID>,
    /// Entity ID
    #[serde(skip_serializing_if = "Option::is_none")]
    pub entity_id: Option<UUID>,
    /// Metadata
```