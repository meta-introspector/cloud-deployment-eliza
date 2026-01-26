# a7046c18:packages_plugin-sql_rust_src_schema_cache.rs:1-36

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/rust/src/schema/cache.rs:1-36
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
//! Cache schema for elizaOS database

/// SQL for creating the cache table
pub const CREATE_CACHE_TABLE: &str = r#"
CREATE TABLE IF NOT EXISTS cache (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ
)
"#;

/// SQL for creating indexes on cache table
pub const CREATE_CACHE_INDEXES: &str = r#"
CREATE INDEX IF NOT EXISTS idx_cache_expires_at ON cache (expires_at);
"#;

/// Cache record structure
#[derive(Clone, Debug)]
pub struct CacheRecord {
    pub key: String,
    pub value: serde_json::Value,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub expires_at: Option<chrono::DateTime<chrono::Utc>>,
}

impl CacheRecord {
    /// Check if the cache entry is expired
    pub fn is_expired(&self) -> bool {
        if let Some(expires_at) = self.expires_at {
            chrono::Utc::now() > expires_at
        } else {
            false
        }
    }
}
```