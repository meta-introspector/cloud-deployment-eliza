# a7046c18:packages_core_rust_src_types_events.rs:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/src/types/events.rs:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
//! Event types for elizaOS
//!
//! Contains event types, payloads, and handlers for the event system.

use serde::{Deserialize, Serialize};
use std::collections::HashMap;

use super::{Content, Entity, Memory, Room, World, UUID};

/// Standard event types across all platforms
#[derive(Clone, Debug, Serialize, Deserialize, PartialEq, Eq, Hash)]
#[serde(rename_all = "SCREAMING_SNAKE_CASE")]
pub enum EventType {
    // World events
    /// Agent joined a world
    WorldJoined,
    /// Agent connected to a world
    WorldConnected,
    /// Agent left a world
    WorldLeft,

    // Entity events
    /// Entity joined
    EntityJoined,
    /// Entity left
    EntityLeft,
    /// Entity updated
    EntityUpdated,

    // Room events
    /// Joined a room
    RoomJoined,
    /// Left a room
    RoomLeft,

    // Message events
    /// Message received
    MessageReceived,
    /// Message sent
    MessageSent,
    /// Message deleted
    MessageDeleted,

    // Channel events
    /// Channel cleared
    ChannelCleared,

    // Voice events
    /// Voice message received
    VoiceMessageReceived,
    /// Voice message sent
    VoiceMessageSent,

    // Interaction events
    /// Reaction received
    ReactionReceived,
    /// Post generated
    PostGenerated,
    /// Interaction received
    InteractionReceived,

    // Run events
    /// Run started
    RunStarted,
    /// Run ended
    RunEnded,
    /// Run timed out
    RunTimeout,

    // Action events
    /// Action started
    ActionStarted,
    /// Action completed
    ActionCompleted,

    // Evaluator events
    /// Evaluator started
    EvaluatorStarted,
    /// Evaluator completed
    EvaluatorCompleted,

    // Model events
    /// Model used
    ModelUsed,

    // Embedding events
    /// Embedding generation requested
    EmbeddingGenerationRequested,
    /// Embedding generation completed
    EmbeddingGenerationCompleted,
    /// Embedding generation failed
    EmbeddingGenerationFailed,

    // Control events
    /// Control message received
    ControlMessage,
}

/// Platform-specific event type prefix
#[derive(Clone, Debug, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "UPPERCASE")]
pub enum PlatformPrefix {
    /// Discord platform
    Discord,
    /// Telegram platform
    Telegram,
    /// Twitter platform
    Twitter,
}

/// Base payload interface for all events
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EventPayload {
    /// Source of the event
    pub source: String,
    /// Additional data
    #[serde(flatten)]
    pub extra: HashMap<String, serde_json::Value>,
}

/// Payload for world-related events
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WorldPayload {
    /// Base payload
    #[serde(flatten)]
    pub base: EventPayload,
    /// World data
    pub world: World,
    /// Rooms in the world
    pub rooms: Vec<Room>,
    /// Entities in the world
    pub entities: Vec<Entity>,
}

/// Payload for entity-related events
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EntityPayload {
    /// Base payload
    #[serde(flatten)]
    pub base: EventPayload,
    /// Entity ID
    pub entity_id: UUID,
    /// World ID
    #[serde(skip_serializing_if = "Option::is_none")]
    pub world_id: Option<UUID>,
    /// Room ID
    #[serde(skip_serializing_if = "Option::is_none")]
```