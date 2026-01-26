# a7046c18:packages_core_rust_src_types_events.rs:301-385

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/src/types/events.rs:301-385
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    #[serde(flatten)]
    pub base: EventPayload,
    /// Model provider
    pub provider: String,
    /// Model type
    #[serde(rename = "type")]
    pub model_type: String,
    /// Prompt
    pub prompt: String,
    /// Token usage
    #[serde(skip_serializing_if = "Option::is_none")]
    pub tokens: Option<TokenUsage>,
}

/// Token usage information
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TokenUsage {
    /// Prompt tokens
    pub prompt: i32,
    /// Completion tokens
    pub completion: i32,
    /// Total tokens
    pub total: i32,
}

/// Payload for embedding generation events
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EmbeddingGenerationPayload {
    /// Base payload
    #[serde(flatten)]
    pub base: EventPayload,
    /// Memory being embedded
    pub memory: Memory,
    /// Priority level
    #[serde(skip_serializing_if = "Option::is_none")]
    pub priority: Option<EmbeddingPriority>,
    /// Retry count
    #[serde(skip_serializing_if = "Option::is_none")]
    pub retry_count: Option<i32>,
    /// Max retries
    #[serde(skip_serializing_if = "Option::is_none")]
    pub max_retries: Option<i32>,
    /// Generated embedding
    #[serde(skip_serializing_if = "Option::is_none")]
    pub embedding: Option<Vec<f32>>,
    /// Error if failed
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error: Option<String>,
    /// Run ID
    #[serde(skip_serializing_if = "Option::is_none")]
    pub run_id: Option<UUID>,
}

/// Embedding priority levels
#[derive(Clone, Debug, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum EmbeddingPriority {
    /// High priority
    High,
    /// Normal priority
    Normal,
    /// Low priority
    Low,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_event_type_serialization() {
        let event = EventType::MessageReceived;
        let json = serde_json::to_string(&event).unwrap();
        assert_eq!(json, "\"MESSAGE_RECEIVED\"");
    }

    #[test]
    fn test_run_status_serialization() {
        let status = RunStatus::Completed;
        let json = serde_json::to_string(&status).unwrap();
        assert_eq!(json, "\"completed\"");
    }
}
```