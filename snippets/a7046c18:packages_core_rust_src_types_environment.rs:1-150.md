# a7046c18:packages_core_rust_src_types_environment.rs:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/src/types/environment.rs:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
//! Environment types for elizaOS
//!
//! Contains Entity, Room, World, Component, Relationship, and related types.

use super::{Metadata, UUID};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

/// Component attached to an entity
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Component {
    /// Unique identifier
    pub id: UUID,
    /// Entity this component belongs to
    pub entity_id: UUID,
    /// Agent ID
    pub agent_id: UUID,
    /// Room ID
    pub room_id: UUID,
    /// World ID
    pub world_id: UUID,
    /// Source entity ID
    pub source_entity_id: UUID,
    /// Component type name
    #[serde(rename = "type")]
    pub component_type: String,
    /// Creation timestamp
    pub created_at: i64,
    /// Component data
    pub data: Metadata,
}

/// Represents a user/entity account
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Entity {
    /// Unique identifier, optional on creation
    #[serde(skip_serializing_if = "Option::is_none")]
    pub id: Option<UUID>,
    /// Names of the entity
    pub names: Vec<String>,
    /// Additional metadata
    pub metadata: Metadata,
    /// Agent ID this entity is related to
    pub agent_id: UUID,
    /// Optional array of components
    #[serde(skip_serializing_if = "Option::is_none")]
    pub components: Option<Vec<Component>>,
}

impl Entity {
    /// Create a new entity with the given name
    pub fn new(name: &str, agent_id: UUID) -> Self {
        Entity {
            id: Some(UUID::new_v4()),
            names: vec![name.to_string()],
            metadata: HashMap::new(),
            agent_id,
            components: None,
        }
    }
}

/// Defines roles within a system
#[derive(Clone, Debug, Default, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "UPPERCASE")]
pub enum Role {
    /// Highest level of control
    Owner,
    /// Administrative privileges
    Admin,
    /// No specific role
    #[default]
    None,
}

/// World ownership metadata
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WorldOwnership {
    /// Owner ID
    pub owner_id: String,
}

/// World metadata
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WorldMetadata {
    /// Ownership information
    #[serde(skip_serializing_if = "Option::is_none")]
    pub ownership: Option<WorldOwnership>,
    /// Role assignments
    #[serde(skip_serializing_if = "Option::is_none")]
    pub roles: Option<HashMap<String, Role>>,
    /// Additional metadata
    #[serde(flatten)]
    pub extra: HashMap<String, serde_json::Value>,
}

/// Represents a world/server
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct World {
    /// Unique identifier
    pub id: UUID,
    /// World name
    #[serde(skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,
    /// Agent ID
    pub agent_id: UUID,
    /// Message server ID
    #[serde(skip_serializing_if = "Option::is_none")]
    pub message_server_id: Option<UUID>,
    /// World metadata
    #[serde(skip_serializing_if = "Option::is_none")]
    pub metadata: Option<WorldMetadata>,
}

impl World {
    /// Create a new world
    pub fn new(name: &str, agent_id: UUID) -> Self {
        World {
            id: UUID::new_v4(),
            name: Some(name.to_string()),
            agent_id,
            message_server_id: None,
            metadata: None,
        }
    }
}

/// Channel type enumeration
#[derive(Clone, Debug, Default, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "UPPERCASE")]
pub enum ChannelType {
    /// Messages to self
    #[serde(rename = "SELF")]
    SelfChannel,
    /// Direct messages between two participants
    #[default]
    Dm,
    /// Group messages with multiple participants
    Group,
    /// Voice direct messages
    VoiceDm,
    /// Voice channels with multiple participants
    VoiceGroup,
    /// Social media feed
    Feed,
```