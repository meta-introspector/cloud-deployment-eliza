# a7046c18:packages_plugin-sql_rust_src_base.rs:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/rust/src/base.rs:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    /// Get all agents
    async fn get_agents(&self) -> Result<Vec<Agent>>;

    /// Create a new agent
    async fn create_agent(&self, agent: &Agent) -> Result<bool>;

    /// Update an agent
    async fn update_agent(&self, agent_id: &UUID, agent: &Agent) -> Result<bool>;

    /// Delete an agent
    async fn delete_agent(&self, agent_id: &UUID) -> Result<bool>;

    // =========================================================================
    // Entity Methods
    // =========================================================================

    /// Get entities by IDs
    async fn get_entities_by_ids(&self, entity_ids: &[UUID]) -> Result<Vec<Entity>>;

    /// Get entities for a room
    async fn get_entities_for_room(
        &self,
        room_id: &UUID,
        include_components: bool,
    ) -> Result<Vec<Entity>>;

    /// Create new entities
    async fn create_entities(&self, entities: &[Entity]) -> Result<bool>;

    /// Update an entity
    async fn update_entity(&self, entity: &Entity) -> Result<()>;

    // =========================================================================
    // Component Methods
    // =========================================================================

    /// Get a component by ID
    async fn get_component(
        &self,
        entity_id: &UUID,
        component_type: &str,
        world_id: Option<&UUID>,
        source_entity_id: Option<&UUID>,
    ) -> Result<Option<Component>>;

    /// Get all components for an entity
    async fn get_components(
        &self,
        entity_id: &UUID,
        world_id: Option<&UUID>,
        source_entity_id: Option<&UUID>,
    ) -> Result<Vec<Component>>;

    /// Create a component
    async fn create_component(&self, component: &Component) -> Result<bool>;

    /// Update a component
    async fn update_component(&self, component: &Component) -> Result<()>;

    /// Delete a component
    async fn delete_component(&self, component_id: &UUID) -> Result<()>;

    // =========================================================================
    // Memory Methods
    // =========================================================================

    /// Get memories matching criteria
    async fn get_memories(&self, params: GetMemoriesParams) -> Result<Vec<Memory>>;

    /// Get a memory by ID
    async fn get_memory_by_id(&self, id: &UUID) -> Result<Option<Memory>>;

    /// Get memories by IDs
    async fn get_memories_by_ids(
        &self,
        ids: &[UUID],
        table_name: Option<&str>,
    ) -> Result<Vec<Memory>>;

    /// Get memories by room IDs
    async fn get_memories_by_room_ids(
        &self,
        table_name: &str,
        room_ids: &[UUID],
        limit: Option<i32>,
    ) -> Result<Vec<Memory>>;

    /// Get cached embeddings
    async fn get_cached_embeddings(
        &self,
        params: GetCachedEmbeddingsParams,
    ) -> Result<Vec<EmbeddingSearchResult>>;

    /// Search memories by embedding
    async fn search_memories(&self, params: SearchMemoriesParams) -> Result<Vec<Memory>>;

    /// Create a memory
    async fn create_memory(&self, memory: &Memory, table_name: &str, unique: bool) -> Result<UUID>;

    /// Update a memory
    async fn update_memory(&self, memory: &Memory) -> Result<bool>;

    /// Delete a memory
    async fn delete_memory(&self, memory_id: &UUID) -> Result<()>;

    /// Delete many memories
    async fn delete_many_memories(&self, memory_ids: &[UUID]) -> Result<()>;

    /// Delete all memories in a room
    async fn delete_all_memories(&self, room_id: &UUID, table_name: &str) -> Result<()>;

    /// Count memories in a room
    async fn count_memories(
        &self,
        room_id: &UUID,
        unique: bool,
        table_name: Option<&str>,
    ) -> Result<i64>;

    /// Ensure embedding dimension
    async fn ensure_embedding_dimension(&self, dimension: i32) -> Result<()>;

    /// Get memories by world ID
    async fn get_memories_by_world_id(
        &self,
        world_id: &UUID,
        count: Option<i32>,
        table_name: Option<&str>,
    ) -> Result<Vec<Memory>>;

    // =========================================================================
    // Logging Methods
    // =========================================================================

    /// Create a log entry
    async fn log(&self, params: LogParams) -> Result<()>;

    /// Get log entries
    async fn get_logs(&self, params: GetLogsParams) -> Result<Vec<Log>>;

    /// Delete a log entry
    async fn delete_log(&self, log_id: &UUID) -> Result<()>;

    // =========================================================================
    // World Methods
    // =========================================================================

    /// Create a world
    async fn create_world(&self, world: &World) -> Result<UUID>;

```