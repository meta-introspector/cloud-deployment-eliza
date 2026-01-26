# a7046c18:packages_plugin-sql_rust_src_schema_embedding.rs:1-90

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/rust/src/schema/embedding.rs:1-90
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
//! Embedding schema for elizaOS database
//!
//! Corresponds to the TypeScript embeddingTable in packages/plugin-sql/src/schema/embedding.ts

/// Supported embedding dimensions
pub const DIMENSION_384: i32 = 384;
pub const DIMENSION_512: i32 = 512;
pub const DIMENSION_768: i32 = 768;
pub const DIMENSION_1024: i32 = 1024;
pub const DIMENSION_1536: i32 = 1536;
pub const DIMENSION_3072: i32 = 3072;

/// Default embedding dimension
pub const DEFAULT_DIMENSION: i32 = DIMENSION_384;

/// SQL for creating the embeddings table (with dynamic dimension)
pub fn create_embeddings_table_sql(dimension: i32) -> String {
    format!(
        r#"
CREATE TABLE IF NOT EXISTS embeddings (
    id UUID PRIMARY KEY NOT NULL REFERENCES memories(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    embedding vector({}) NOT NULL
)
"#,
        dimension
    )
}

/// SQL for creating indexes on embeddings table
pub const CREATE_EMBEDDINGS_INDEXES: &str = r#"
CREATE INDEX IF NOT EXISTS idx_embeddings_hnsw ON embeddings 
USING hnsw (embedding vector_cosine_ops);
"#;

/// SQL for ensuring vector extension is installed
pub const ENSURE_VECTOR_EXTENSION: &str = r#"
CREATE EXTENSION IF NOT EXISTS vector;
"#;

/// Embedding record structure for database operations
#[derive(Clone, Debug)]
pub struct EmbeddingRecord {
    pub id: uuid::Uuid,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub embedding: Vec<f32>,
}

impl EmbeddingRecord {
    /// Create a new embedding record
    pub fn new(memory_id: uuid::Uuid, embedding: Vec<f32>) -> Self {
        EmbeddingRecord {
            id: memory_id,
            created_at: chrono::Utc::now(),
            embedding,
        }
    }

    /// Get the embedding dimension
    pub fn dimension(&self) -> usize {
        self.embedding.len()
    }
}

/// SQL for searching embeddings by similarity
pub fn search_embeddings_sql(dimension: i32, limit: i32) -> String {
    format!(
        r#"
SELECT 
    m.id,
    m.type,
    m.created_at,
    m.content,
    m.entity_id,
    m.agent_id,
    m.room_id,
    m.world_id,
    m.unique,
    m.metadata,
    e.embedding,
    1 - (e.embedding <=> $1::vector({})) as similarity
FROM memories m
JOIN embeddings e ON m.id = e.id
WHERE 1 - (e.embedding <=> $1::vector({})) > $2
ORDER BY similarity DESC
LIMIT {}
"#,
        dimension, dimension, limit
    )
}
```