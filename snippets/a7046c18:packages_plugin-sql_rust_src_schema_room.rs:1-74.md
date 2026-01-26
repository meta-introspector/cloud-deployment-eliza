# a7046c18:packages_plugin-sql_rust_src_schema_room.rs:1-74

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/rust/src/schema/room.rs:1-74
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
//! Room schema for elizaOS database

/// SQL for creating the rooms table
pub const CREATE_ROOMS_TABLE: &str = r#"
CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    name TEXT,
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    source TEXT NOT NULL,
    type TEXT NOT NULL,
    channel_id TEXT,
    message_server_id UUID,
    world_id UUID REFERENCES worlds(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}'::jsonb
)
"#;

/// SQL for creating indexes on rooms table
pub const CREATE_ROOMS_INDEXES: &str = r#"
CREATE INDEX IF NOT EXISTS idx_rooms_agent_id ON rooms (agent_id);
CREATE INDEX IF NOT EXISTS idx_rooms_world_id ON rooms (world_id);
CREATE INDEX IF NOT EXISTS idx_rooms_channel_id ON rooms (channel_id);
"#;

/// Room record structure
#[derive(Clone, Debug)]
pub struct RoomRecord {
    pub id: uuid::Uuid,
    pub created_at: chrono::DateTime<chrono::Utc>,
    pub name: Option<String>,
    pub agent_id: Option<uuid::Uuid>,
    pub source: String,
    pub room_type: String,
    pub channel_id: Option<String>,
    pub message_server_id: Option<uuid::Uuid>,
    pub world_id: Option<uuid::Uuid>,
    pub metadata: serde_json::Value,
}

impl RoomRecord {
    /// Convert to elizaOS Room type
    pub fn to_room(&self) -> elizaos_core::Room {
        use elizaos_core::{ChannelType, Room, UUID};

        let room_type = match self.room_type.as_str() {
            "SELF" => ChannelType::SelfChannel,
            "DM" => ChannelType::Dm,
            "GROUP" => ChannelType::Group,
            "VOICE_DM" => ChannelType::VoiceDm,
            "VOICE_GROUP" => ChannelType::VoiceGroup,
            "FEED" => ChannelType::Feed,
            "THREAD" => ChannelType::Thread,
            "WORLD" => ChannelType::World,
            "FORUM" => ChannelType::Forum,
            "API" => ChannelType::Api,
            _ => ChannelType::Dm,
        };

        Room {
            id: UUID::new(&self.id.to_string()).unwrap(),
            name: self.name.clone(),
            agent_id: self.agent_id.map(|u| UUID::new(&u.to_string()).unwrap()),
            source: self.source.clone(),
            room_type,
            channel_id: self.channel_id.clone(),
            message_server_id: self
                .message_server_id
                .map(|u| UUID::new(&u.to_string()).unwrap()),
            world_id: self.world_id.map(|u| UUID::new(&u.to_string()).unwrap()),
            metadata: serde_json::from_value(self.metadata.clone()).ok(),
        }
    }
}
```