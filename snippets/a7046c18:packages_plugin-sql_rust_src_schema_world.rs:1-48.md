# a7046c18:packages_plugin-sql_rust_src_schema_world.rs:1-48

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/rust/src/schema/world.rs:1-48
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
//! World schema for elizaOS database

/// SQL for creating the worlds table
pub const CREATE_WORLDS_TABLE: &str = r#"
CREATE TABLE IF NOT EXISTS worlds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    name TEXT,
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE NOT NULL,
    message_server_id UUID,
    metadata JSONB DEFAULT '{}'::jsonb
)
"#;

/// SQL for creating indexes on worlds table
pub const CREATE_WORLDS_INDEXES: &str = r#"
CREATE INDEX IF NOT EXISTS idx_worlds_agent_id ON worlds (agent_id);
"#;

/// World record structure
#[derive(Clone, Debug)]
pub struct WorldRecord {
    pub id: uuid::Uuid,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub name: Option<String>,
    pub agent_id: uuid::Uuid,
    pub message_server_id: Option<uuid::Uuid>,
    pub metadata: serde_json::Value,
}

impl WorldRecord {
    /// Convert to elizaOS World type
    pub fn to_world(&self) -> elizaos_core::World {
        use elizaos_core::{World, WorldMetadata, UUID};

        let metadata: Option<WorldMetadata> = serde_json::from_value(self.metadata.clone()).ok();

        World {
            id: UUID::new(&self.id.to_string()).unwrap(),
            name: self.name.clone(),
            agent_id: UUID::new(&self.agent_id.to_string()).unwrap(),
            message_server_id: self
                .message_server_id
                .map(|u| UUID::new(&u.to_string()).unwrap()),
            metadata,
        }
    }
}
```