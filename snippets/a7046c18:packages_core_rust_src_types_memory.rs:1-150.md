# a7046c18:packages_core_rust_src_types_memory.rs:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/src/types/memory.rs:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
//! Memory types for elizaOS
//!
//! Contains Memory, MemoryMetadata, and related types for storing agent memories.

use super::{Content, UUID};
use serde::{Deserialize, Serialize};

/// Memory type enumeration for built-in memory types
#[derive(Clone, Debug, Default, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum MemoryType {
    /// Represents a whole document or a large piece of text
    Document,
    /// A chunk or segment of a document
    Fragment,
    /// A conversational message
    #[default]
    Message,
    /// A descriptive piece of information
    Description,
    /// Custom memory type
    Custom,
}

/// Defines the scope of a memory
#[derive(Clone, Debug, Default, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum MemoryScope {
    /// Accessible to multiple entities
    Shared,
    /// Private to a single entity
    Private,
    /// Scoped to a specific room
    #[default]
    Room,
}

/// Base interface for all memory metadata types
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BaseMetadata {
    /// The kind of memory
    #[serde(rename = "type")]
    pub memory_type: String,
    /// Source of the memory
    #[serde(skip_serializing_if = "Option::is_none")]
    pub source: Option<String>,
    /// Source entity ID
    #[serde(skip_serializing_if = "Option::is_none")]
    pub source_id: Option<UUID>,
    /// Visibility scope
    #[serde(skip_serializing_if = "Option::is_none")]
    pub scope: Option<MemoryScope>,
    /// Timestamp in milliseconds
    #[serde(skip_serializing_if = "Option::is_none")]
    pub timestamp: Option<i64>,
    /// Tags for categorization
    #[serde(skip_serializing_if = "Option::is_none")]
    pub tags: Option<Vec<String>>,
}

/// Document-specific metadata
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DocumentMetadata {
    /// Base metadata fields
    #[serde(flatten)]
    pub base: BaseMetadata,
}

/// Fragment-specific metadata
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct FragmentMetadata {
    /// Base metadata fields
    #[serde(flatten)]
    pub base: BaseMetadata,
    /// Parent document ID
    pub document_id: UUID,
    /// Position in document
    pub position: i32,
}

/// Message-specific metadata
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MessageMetadata {
    /// Base metadata fields
    #[serde(flatten)]
    pub base: BaseMetadata,
}

/// Description-specific metadata
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DescriptionMetadata {
    /// Base metadata fields
    #[serde(flatten)]
    pub base: BaseMetadata,
}

/// Union type for all memory metadata
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(untagged)]
pub enum MemoryMetadata {
    /// Document metadata
    Document(DocumentMetadata),
    /// Fragment metadata
    Fragment(FragmentMetadata),
    /// Message metadata
    Message(MessageMetadata),
    /// Description metadata
    Description(DescriptionMetadata),
    /// Custom metadata (catch-all)
    Custom(serde_json::Value),
}

impl Default for MemoryMetadata {
    fn default() -> Self {
        MemoryMetadata::Custom(serde_json::Value::Object(serde_json::Map::new()))
    }
}

/// Represents a stored memory/message
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Memory {
    /// Optional unique identifier
    #[serde(skip_serializing_if = "Option::is_none")]
    pub id: Option<UUID>,
    /// Associated entity ID (user)
    pub entity_id: UUID,
    /// Associated agent ID
    #[serde(skip_serializing_if = "Option::is_none")]
    pub agent_id: Option<UUID>,
    /// Creation timestamp in milliseconds since epoch
    #[serde(skip_serializing_if = "Option::is_none")]
    pub created_at: Option<i64>,
    /// Memory content
    pub content: Content,
    /// Embedding vector for semantic search
    #[serde(skip_serializing_if = "Option::is_none")]
    pub embedding: Option<Vec<f32>>,
    /// Associated room ID
    pub room_id: UUID,
    /// Associated world ID
    #[serde(skip_serializing_if = "Option::is_none")]
    pub world_id: Option<UUID>,
    /// Whether memory is unique (used to prevent duplicates)
    #[serde(skip_serializing_if = "Option::is_none")]
```