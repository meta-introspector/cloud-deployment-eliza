# a7046c18:packages_plugin-sql_rust_src_schema_participant.rs:1-29

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/rust/src/schema/participant.rs:1-29
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
//! Participant schema for elizaOS database

/// SQL for creating the participants table
pub const CREATE_PARTICIPANTS_TABLE: &str = r#"
CREATE TABLE IF NOT EXISTS participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_id UUID REFERENCES entities(id) ON DELETE CASCADE NOT NULL,
    room_id UUID REFERENCES rooms(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    user_state TEXT
)
"#;

/// SQL for creating indexes on participants table
pub const CREATE_PARTICIPANTS_INDEXES: &str = r#"
CREATE INDEX IF NOT EXISTS idx_participants_entity_id ON participants (entity_id);
CREATE INDEX IF NOT EXISTS idx_participants_room_id ON participants (room_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_participants_unique ON participants (entity_id, room_id);
"#;

/// Participant record structure
#[derive(Clone, Debug)]
pub struct ParticipantRecord {
    pub id: uuid::Uuid,
    pub entity_id: uuid::Uuid,
    pub room_id: uuid::Uuid,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub user_state: Option<String>,
}
```