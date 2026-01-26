# a7046c18:packages_core_rust_src_runtime.rs:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/src/runtime.rs:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
//! AgentRuntime implementation for elizaOS
//!
//! This module provides the core runtime for elizaOS agents.

use crate::types::{
    ActionHandler, ActionResult, Agent, Character, Entity, EvaluatorHandler, EventPayload,
    EventType, GetMemoriesParams, HandlerOptions, Memory, Plugin, ProviderHandler, Room,
    RuntimeSettings, SearchMemoriesParams, State, Task, World, UUID,
};
use anyhow::{Context, Result};
use std::collections::HashMap;
use std::sync::Arc;
use tracing::{debug, error, info, warn};

// RwLock type - different for native (async) vs wasm (sync)
#[cfg(not(feature = "wasm"))]
use tokio::sync::RwLock;

#[cfg(feature = "wasm")]
use std::sync::RwLock;

/// Database adapter trait for runtime storage operations
#[async_trait::async_trait]
pub trait DatabaseAdapter: Send + Sync {
    /// Initialize the database
    async fn init(&self) -> Result<()>;

    /// Close the database connection
    async fn close(&self) -> Result<()>;

    /// Check if the database is ready
    async fn is_ready(&self) -> Result<bool>;

    /// Get an agent by ID
    async fn get_agent(&self, agent_id: &UUID) -> Result<Option<Agent>>;

    /// Create an agent
    async fn create_agent(&self, agent: &Agent) -> Result<bool>;

    /// Update an agent
    async fn update_agent(&self, agent_id: &UUID, agent: &Agent) -> Result<bool>;

    /// Delete an agent
    async fn delete_agent(&self, agent_id: &UUID) -> Result<bool>;

    /// Get memories
    async fn get_memories(&self, params: GetMemoriesParams) -> Result<Vec<Memory>>;

    /// Search memories by embedding
    async fn search_memories(&self, params: SearchMemoriesParams) -> Result<Vec<Memory>>;

    /// Create a memory
    async fn create_memory(&self, memory: &Memory, table_name: &str) -> Result<UUID>;

    /// Update a memory
    async fn update_memory(&self, memory: &Memory) -> Result<bool>;

    /// Delete a memory
    async fn delete_memory(&self, memory_id: &UUID) -> Result<()>;

    /// Get a memory by ID
    async fn get_memory_by_id(&self, id: &UUID) -> Result<Option<Memory>>;

    /// Create a world
    async fn create_world(&self, world: &World) -> Result<UUID>;

    /// Get a world by ID
    async fn get_world(&self, id: &UUID) -> Result<Option<World>>;

    /// Create a room
    async fn create_room(&self, room: &Room) -> Result<UUID>;

    /// Get a room by ID
    async fn get_room(&self, id: &UUID) -> Result<Option<Room>>;

    /// Create an entity
    async fn create_entity(&self, entity: &Entity) -> Result<bool>;

    /// Get an entity by ID
    async fn get_entity(&self, id: &UUID) -> Result<Option<Entity>>;

    /// Add a participant to a room
    async fn add_participant(&self, entity_id: &UUID, room_id: &UUID) -> Result<bool>;

    /// Create a task
    async fn create_task(&self, task: &Task) -> Result<UUID>;

    /// Get a task by ID
    async fn get_task(&self, id: &UUID) -> Result<Option<Task>>;

    /// Update a task
    async fn update_task(&self, id: &UUID, task: &Task) -> Result<()>;

    /// Delete a task
    async fn delete_task(&self, id: &UUID) -> Result<()>;
}

/// Runtime options for creating an AgentRuntime
#[derive(Default)]
pub struct RuntimeOptions {
    /// Character configuration
    pub character: Option<Character>,
    /// Agent ID (generated if not provided)
    pub agent_id: Option<UUID>,
    /// Plugins to load
    pub plugins: Vec<Plugin>,
    /// Database adapter
    pub adapter: Option<Arc<dyn DatabaseAdapter>>,
    /// Runtime settings
    pub settings: Option<RuntimeSettings>,
}

/// Event handler function type
pub type EventHandler = Arc<dyn Fn(EventPayload) -> Result<()> + Send + Sync>;

/// Model handler function type
pub type ModelHandler =
    Arc<dyn Fn(&str, serde_json::Value) -> Result<serde_json::Value> + Send + Sync>;

/// The core runtime for an elizaOS agent
pub struct AgentRuntime {
    /// Agent ID
    pub agent_id: UUID,
    /// Character configuration
    pub character: Character,
    /// Database adapter
    adapter: Option<Arc<dyn DatabaseAdapter>>,
    /// Registered actions
    actions: RwLock<Vec<Arc<dyn ActionHandler>>>,
    /// Registered providers
    providers: RwLock<Vec<Arc<dyn ProviderHandler>>>,
    /// Registered evaluators
    evaluators: RwLock<Vec<Arc<dyn EvaluatorHandler>>>,
    /// Loaded plugins
    plugins: RwLock<Vec<Plugin>>,
    /// Event handlers
    events: RwLock<HashMap<String, Vec<EventHandler>>>,
    /// Services
    services: RwLock<HashMap<String, Arc<dyn Service>>>,
    /// Runtime settings
    settings: RwLock<RuntimeSettings>,
    /// Current run ID (used in WASM mode)
    #[cfg_attr(not(feature = "wasm"), allow(dead_code))]
    current_run_id: RwLock<Option<UUID>>,
    /// Initialization promise/future resolved
    initialized: RwLock<bool>,
}

/// Service trait for long-running services
#[async_trait::async_trait]
```