# a7046c18:packages_plugin-sql_rust_src_base.rs:301-430

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/rust/src/base.rs:301-430
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    /// Get a world by ID
    async fn get_world(&self, id: &UUID) -> Result<Option<World>>;

    /// Remove a world
    async fn remove_world(&self, id: &UUID) -> Result<()>;

    /// Get all worlds
    async fn get_all_worlds(&self) -> Result<Vec<World>>;

    /// Update a world
    async fn update_world(&self, world: &World) -> Result<()>;

    // =========================================================================
    // Room Methods
    // =========================================================================

    /// Get rooms by IDs
    async fn get_rooms_by_ids(&self, room_ids: &[UUID]) -> Result<Vec<Room>>;

    /// Create rooms
    async fn create_rooms(&self, rooms: &[Room]) -> Result<Vec<UUID>>;

    /// Delete a room
    async fn delete_room(&self, room_id: &UUID) -> Result<()>;

    /// Delete rooms by world ID
    async fn delete_rooms_by_world_id(&self, world_id: &UUID) -> Result<()>;

    /// Update a room
    async fn update_room(&self, room: &Room) -> Result<()>;

    /// Get rooms by world
    async fn get_rooms_by_world(&self, world_id: &UUID) -> Result<Vec<Room>>;

    // =========================================================================
    // Participant Methods
    // =========================================================================

    /// Get rooms for a participant
    async fn get_rooms_for_participant(&self, entity_id: &UUID) -> Result<Vec<UUID>>;

    /// Get rooms for participants
    async fn get_rooms_for_participants(&self, user_ids: &[UUID]) -> Result<Vec<UUID>>;

    /// Remove a participant from a room
    async fn remove_participant(&self, entity_id: &UUID, room_id: &UUID) -> Result<bool>;

    /// Get participants for an entity
    async fn get_participants_for_entity(&self, entity_id: &UUID) -> Result<Vec<Participant>>;

    /// Get participants for a room
    async fn get_participants_for_room(&self, room_id: &UUID) -> Result<Vec<UUID>>;

    /// Check if an entity is a participant in a room
    async fn is_room_participant(&self, room_id: &UUID, entity_id: &UUID) -> Result<bool>;

    /// Add participants to a room
    async fn add_participants_room(&self, entity_ids: &[UUID], room_id: &UUID) -> Result<bool>;

    /// Get participant user state
    async fn get_participant_user_state(
        &self,
        room_id: &UUID,
        entity_id: &UUID,
    ) -> Result<Option<ParticipantUserState>>;

    /// Set participant user state
    async fn set_participant_user_state(
        &self,
        room_id: &UUID,
        entity_id: &UUID,
        state: Option<ParticipantUserState>,
    ) -> Result<()>;

    // =========================================================================
    // Relationship Methods
    // =========================================================================

    /// Create a relationship
    async fn create_relationship(&self, params: CreateRelationshipParams) -> Result<bool>;

    /// Update a relationship
    async fn update_relationship(&self, relationship: &Relationship) -> Result<()>;

    /// Get a relationship
    async fn get_relationship(&self, params: GetRelationshipParams)
        -> Result<Option<Relationship>>;

    /// Get relationships for an entity
    async fn get_relationships(&self, params: GetRelationshipsParams) -> Result<Vec<Relationship>>;

    // =========================================================================
    // Cache Methods
    // =========================================================================

    /// Get a cached value
    async fn get_cache<T: serde::de::DeserializeOwned>(&self, key: &str) -> Result<Option<T>>;

    /// Set a cached value
    async fn set_cache<T: serde::Serialize + Send + Sync>(
        &self,
        key: &str,
        value: &T,
    ) -> Result<bool>;

    /// Delete a cached value
    async fn delete_cache(&self, key: &str) -> Result<bool>;

    // =========================================================================
    // Task Methods
    // =========================================================================

    /// Create a task
    async fn create_task(&self, task: &Task) -> Result<UUID>;

    /// Get tasks
    async fn get_tasks(&self, params: GetTasksParams) -> Result<Vec<Task>>;

    /// Get a task by ID
    async fn get_task(&self, id: &UUID) -> Result<Option<Task>>;

    /// Get tasks by name
    async fn get_tasks_by_name(&self, name: &str) -> Result<Vec<Task>>;

    /// Update a task
    async fn update_task(&self, id: &UUID, task: &Task) -> Result<()>;

    /// Delete a task
    async fn delete_task(&self, id: &UUID) -> Result<()>;
}
```