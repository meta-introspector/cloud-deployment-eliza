# a7046c18:packages_core_rust_src_types_database.rs:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/src/types/database.rs:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
//! Database types for elizaOS
//!
//! Contains database-related types, log types, and query parameters.

use serde::{Deserialize, Serialize};
use std::collections::HashMap;

use super::{MemoryMetadata, UUID};

/// Base log body type with common properties
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BaseLogBody {
    /// Run ID
    #[serde(skip_serializing_if = "Option::is_none")]
    pub run_id: Option<String>,
    /// Status
    #[serde(skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,
    /// Message ID
    #[serde(skip_serializing_if = "Option::is_none")]
    pub message_id: Option<UUID>,
    /// Room ID
    #[serde(skip_serializing_if = "Option::is_none")]
    pub room_id: Option<UUID>,
    /// Entity ID
    #[serde(skip_serializing_if = "Option::is_none")]
    pub entity_id: Option<UUID>,
    /// Additional metadata
    #[serde(skip_serializing_if = "Option::is_none")]
    pub metadata: Option<HashMap<String, serde_json::Value>>,
    /// Extra fields
    #[serde(flatten)]
    pub extra: HashMap<String, serde_json::Value>,
}

/// Log body for action logs
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ActionLogBody {
    /// Base fields
    #[serde(flatten)]
    pub base: BaseLogBody,
    /// Action name
    #[serde(skip_serializing_if = "Option::is_none")]
    pub action: Option<String>,
    /// Action ID
    #[serde(skip_serializing_if = "Option::is_none")]
    pub action_id: Option<String>,
    /// Message
    #[serde(skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,
    /// State snapshot
    #[serde(skip_serializing_if = "Option::is_none")]
    pub state: Option<serde_json::Value>,
    /// Responses
    #[serde(skip_serializing_if = "Option::is_none")]
    pub responses: Option<serde_json::Value>,
    /// Content with actions
    #[serde(skip_serializing_if = "Option::is_none")]
    pub content: Option<ActionLogContent>,
    /// Result
    #[serde(skip_serializing_if = "Option::is_none")]
    pub result: Option<ActionLogResult>,
    /// Whether using legacy return format
    #[serde(skip_serializing_if = "Option::is_none")]
    pub is_legacy_return: Option<bool>,
    /// Prompts used
    #[serde(skip_serializing_if = "Option::is_none")]
    pub prompts: Option<Vec<PromptLogEntry>>,
    /// Prompt count
    #[serde(skip_serializing_if = "Option::is_none")]
    pub prompt_count: Option<i32>,
    /// Plan step
    #[serde(skip_serializing_if = "Option::is_none")]
    pub plan_step: Option<String>,
    /// Plan thought
    #[serde(skip_serializing_if = "Option::is_none")]
    pub plan_thought: Option<String>,
}

/// Action log content
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ActionLogContent {
    /// Actions
    #[serde(skip_serializing_if = "Option::is_none")]
    pub actions: Option<Vec<String>>,
    /// Extra fields
    #[serde(flatten)]
    pub extra: HashMap<String, serde_json::Value>,
}

/// Action log result
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ActionLogResult {
    /// Success flag
    #[serde(skip_serializing_if = "Option::is_none")]
    pub success: Option<bool>,
    /// Data payload
    #[serde(skip_serializing_if = "Option::is_none")]
    pub data: Option<serde_json::Value>,
    /// Text result
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text: Option<String>,
    /// Error message
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error: Option<String>,
    /// Extra fields
    #[serde(flatten)]
    pub extra: HashMap<String, serde_json::Value>,
}

/// Prompt log entry
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PromptLogEntry {
    /// Model type
    pub model_type: String,
    /// Prompt text
    pub prompt: String,
    /// Timestamp
    pub timestamp: i64,
}

/// Log body for evaluator logs
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EvaluatorLogBody {
    /// Base fields
    #[serde(flatten)]
    pub base: BaseLogBody,
    /// Evaluator name
    #[serde(skip_serializing_if = "Option::is_none")]
    pub evaluator: Option<String>,
    /// Message
    #[serde(skip_serializing_if = "Option::is_none")]
    pub message: Option<String>,
    /// State snapshot
    #[serde(skip_serializing_if = "Option::is_none")]
    pub state: Option<serde_json::Value>,
}

/// Log body for model logs
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ModelLogBody {
    /// Base fields
    #[serde(flatten)]
```