# a7046c18:packages_plugin-sql_rust_src_base.rs:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/rust/src/base.rs:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
//! Base database adapter trait for elizaOS
//!
//! This module defines the DatabaseAdapter trait that all database implementations must follow.

use anyhow::Result;
use async_trait::async_trait;
use elizaos_core::{
    Agent, Component, Entity, GetMemoriesParams, Log, Memory, MemoryMetadata, Metadata,
    Participant, Relationship, Room, SearchMemoriesParams, Task, World, UUID,
};

/// Result type for embedding similarity searches
#[derive(Clone, Debug)]
pub struct EmbeddingSearchResult {
    /// Embedding vector
    pub embedding: Vec<f32>,
    /// Levenshtein score
    pub levenshtein_score: f64,
}

/// Parameters for cached embeddings query
#[derive(Clone, Debug)]
pub struct GetCachedEmbeddingsParams {
    /// Query table name
    pub query_table_name: String,
    /// Threshold for matching
    pub query_threshold: f64,
    /// Input text
    pub query_input: String,
    /// Field name
    pub query_field_name: String,
    /// Sub-field name
    pub query_field_sub_name: String,
    /// Match count
    pub query_match_count: i32,
}

/// Parameters for logging
#[derive(Clone, Debug)]
pub struct LogParams {
    /// Log body
    pub body: serde_json::Value,
    /// Entity ID
    pub entity_id: UUID,
    /// Room ID
    pub room_id: UUID,
    /// Log type
    pub log_type: String,
}

/// Parameters for getting logs
#[derive(Clone, Debug, Default)]
pub struct GetLogsParams {
    /// Entity ID filter
    pub entity_id: Option<UUID>,
    /// Room ID filter
    pub room_id: Option<UUID>,
    /// Log type filter
    pub log_type: Option<String>,
    /// Count limit
    pub count: Option<i32>,
    /// Offset
    pub offset: Option<i32>,
}

/// Parameters for creating a relationship
#[derive(Clone, Debug)]
pub struct CreateRelationshipParams {
    /// Source entity ID
    pub source_entity_id: UUID,
    /// Target entity ID
    pub target_entity_id: UUID,
    /// Tags
    pub tags: Option<Vec<String>>,
    /// Metadata
    pub metadata: Option<Metadata>,
}

/// Parameters for getting a relationship
#[derive(Clone, Debug)]
pub struct GetRelationshipParams {
    /// Source entity ID
    pub source_entity_id: UUID,
    /// Target entity ID
    pub target_entity_id: UUID,
}

/// Parameters for getting relationships
#[derive(Clone, Debug)]
pub struct GetRelationshipsParams {
    /// Entity ID
    pub entity_id: UUID,
    /// Tags filter
    pub tags: Option<Vec<String>>,
}

/// Parameters for getting tasks
#[derive(Clone, Debug, Default)]
pub struct GetTasksParams {
    /// Room ID filter
    pub room_id: Option<UUID>,
    /// Tags filter
    pub tags: Option<Vec<String>>,
    /// Entity ID filter
    pub entity_id: Option<UUID>,
}

/// User participation state
#[derive(Clone, Debug, PartialEq, Eq)]
pub enum ParticipantUserState {
    /// User is followed
    Followed,
    /// User is muted
    Muted,
}

/// Database adapter interface
///
/// This trait defines all the methods that a database adapter must implement
/// to work with elizaOS. It mirrors the TypeScript IDatabaseAdapter interface.
#[async_trait]
pub trait DatabaseAdapter: Send + Sync {
    // =========================================================================
    // Core Methods
    // =========================================================================

    /// Initialize database connection
    async fn init(&self) -> Result<()>;

    /// Initialize the adapter (alias for init)
    async fn initialize(&self, config: Option<serde_json::Value>) -> Result<()> {
        self.init().await
    }

    /// Check if the database connection is ready
    async fn is_ready(&self) -> Result<bool>;

    /// Close database connection
    async fn close(&self) -> Result<()>;

    /// Get the underlying database connection
    async fn get_connection(&self) -> Result<Box<dyn std::any::Any + Send>>;

    // =========================================================================
    // Agent Methods
    // =========================================================================

    /// Get an agent by ID
    async fn get_agent(&self, agent_id: &UUID) -> Result<Option<Agent>>;

```