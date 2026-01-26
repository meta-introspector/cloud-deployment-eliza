# a7046c18:packages_core_rust_src_types_database.rs:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/src/types/database.rs:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    #[serde(skip_serializing_if = "Option::is_none")]
    pub metadata: Option<HashMap<String, serde_json::Value>>,
    /// Counts
    #[serde(skip_serializing_if = "Option::is_none")]
    pub counts: Option<AgentRunCounts>,
}

/// Result for agent run summaries query
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct AgentRunSummaryResult {
    /// Run summaries
    pub runs: Vec<AgentRunSummary>,
    /// Total count
    pub total: i32,
    /// Whether there are more results
    pub has_more: bool,
}

/// Parameters for getting memories
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GetMemoriesParams {
    /// Entity ID filter
    #[serde(skip_serializing_if = "Option::is_none")]
    pub entity_id: Option<UUID>,
    /// Agent ID filter
    #[serde(skip_serializing_if = "Option::is_none")]
    pub agent_id: Option<UUID>,
    /// Number of results
    #[serde(skip_serializing_if = "Option::is_none")]
    pub count: Option<i32>,
    /// Offset for pagination
    #[serde(skip_serializing_if = "Option::is_none")]
    pub offset: Option<i32>,
    /// Only unique memories
    #[serde(skip_serializing_if = "Option::is_none")]
    pub unique: Option<bool>,
    /// Table name
    pub table_name: String,
    /// Start timestamp
    #[serde(skip_serializing_if = "Option::is_none")]
    pub start: Option<i64>,
    /// End timestamp
    #[serde(skip_serializing_if = "Option::is_none")]
    pub end: Option<i64>,
    /// Room ID filter
    #[serde(skip_serializing_if = "Option::is_none")]
    pub room_id: Option<UUID>,
    /// World ID filter
    #[serde(skip_serializing_if = "Option::is_none")]
    pub world_id: Option<UUID>,
}

/// Parameters for searching memories
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SearchMemoriesParams {
    /// Embedding vector
    pub embedding: Vec<f32>,
    /// Match threshold
    #[serde(skip_serializing_if = "Option::is_none")]
    pub match_threshold: Option<f64>,
    /// Number of results
    #[serde(skip_serializing_if = "Option::is_none")]
    pub count: Option<i32>,
    /// Only unique memories
    #[serde(skip_serializing_if = "Option::is_none")]
    pub unique: Option<bool>,
    /// Table name
    pub table_name: String,
    /// Query string
    #[serde(skip_serializing_if = "Option::is_none")]
    pub query: Option<String>,
    /// Room ID filter
    #[serde(skip_serializing_if = "Option::is_none")]
    pub room_id: Option<UUID>,
    /// World ID filter
    #[serde(skip_serializing_if = "Option::is_none")]
    pub world_id: Option<UUID>,
    /// Entity ID filter
    #[serde(skip_serializing_if = "Option::is_none")]
    pub entity_id: Option<UUID>,
}

/// Result for embedding similarity searches
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EmbeddingSearchResult {
    /// Embedding vector
    pub embedding: Vec<f32>,
    /// Levenshtein score
    pub levenshtein_score: f64,
}

/// Options for memory retrieval
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MemoryRetrievalOptions {
    /// Room ID
    pub room_id: UUID,
    /// Number of results
    #[serde(skip_serializing_if = "Option::is_none")]
    pub count: Option<i32>,
    /// Only unique
    #[serde(skip_serializing_if = "Option::is_none")]
    pub unique: Option<bool>,
    /// Start timestamp
    #[serde(skip_serializing_if = "Option::is_none")]
    pub start: Option<i64>,
    /// End timestamp
    #[serde(skip_serializing_if = "Option::is_none")]
    pub end: Option<i64>,
    /// Agent ID
    #[serde(skip_serializing_if = "Option::is_none")]
    pub agent_id: Option<UUID>,
}

/// Options for memory search
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MemorySearchOptions {
    /// Embedding vector
    pub embedding: Vec<f32>,
    /// Match threshold
    #[serde(skip_serializing_if = "Option::is_none")]
    pub match_threshold: Option<f64>,
    /// Number of results
    #[serde(skip_serializing_if = "Option::is_none")]
    pub count: Option<i32>,
    /// Room ID
    pub room_id: UUID,
    /// Agent ID
    #[serde(skip_serializing_if = "Option::is_none")]
    pub agent_id: Option<UUID>,
    /// Only unique
    #[serde(skip_serializing_if = "Option::is_none")]
    pub unique: Option<bool>,
    /// Metadata filter
    #[serde(skip_serializing_if = "Option::is_none")]
    pub metadata: Option<MemoryMetadata>,
}

/// Allowed vector dimensions
pub mod vector_dims {
    /// 384 dimensions
    pub const SMALL: usize = 384;
    /// 512 dimensions
    pub const MEDIUM: usize = 512;
    /// 768 dimensions
```