# a7046c18:packages_plugin-sql_rust_src_postgres_adapter.rs:751-900

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/rust/src/postgres/adapter.rs:751-900
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
            world
                .message_server_id
                .as_ref()
                .map(|u| uuid::Uuid::parse_str(u.as_str()).ok())
                .flatten(),
        )
        .bind(&metadata)
        .execute(self.manager.get_pool())
        .await?;

        Ok(world.id.clone())
    }

    async fn get_world(&self, id: &UUID) -> Result<Option<World>> {
        let uuid = uuid::Uuid::parse_str(id.as_str())?;

        let row = sqlx::query(
            "SELECT id, name, agent_id, message_server_id, metadata FROM worlds WHERE id = $1",
        )
        .bind(uuid)
        .fetch_optional(self.manager.get_pool())
        .await?;

        Ok(row.map(|r| {
            WorldRecord {
                id: r.get("id"),
                created_at: chrono::Utc::now(),
                name: r.get("name"),
                agent_id: r.get("agent_id"),
                message_server_id: r.get("message_server_id"),
                metadata: r.get("metadata"),
            }
            .to_world()
        }))
    }

    async fn remove_world(&self, id: &UUID) -> Result<()> {
        let uuid = uuid::Uuid::parse_str(id.as_str())?;
        sqlx::query("DELETE FROM worlds WHERE id = $1")
            .bind(uuid)
            .execute(self.manager.get_pool())
            .await?;
        Ok(())
    }

    async fn get_all_worlds(&self) -> Result<Vec<World>> {
        Ok(vec![])
    }

    async fn update_world(&self, _world: &World) -> Result<()> {
        Ok(())
    }

    async fn get_rooms_by_ids(&self, _room_ids: &[UUID]) -> Result<Vec<Room>> {
        Ok(vec![])
    }

    async fn create_rooms(&self, _rooms: &[Room]) -> Result<Vec<UUID>> {
        Ok(vec![])
    }

    async fn delete_room(&self, _room_id: &UUID) -> Result<()> {
        Ok(())
    }

    async fn delete_rooms_by_world_id(&self, _world_id: &UUID) -> Result<()> {
        Ok(())
    }

    async fn update_room(&self, _room: &Room) -> Result<()> {
        Ok(())
    }

    async fn get_rooms_by_world(&self, _world_id: &UUID) -> Result<Vec<Room>> {
        Ok(vec![])
    }

    async fn get_rooms_for_participant(&self, _entity_id: &UUID) -> Result<Vec<UUID>> {
        Ok(vec![])
    }

    async fn get_rooms_for_participants(&self, _user_ids: &[UUID]) -> Result<Vec<UUID>> {
        Ok(vec![])
    }

    async fn remove_participant(&self, _entity_id: &UUID, _room_id: &UUID) -> Result<bool> {
        Ok(true)
    }

    async fn get_participants_for_entity(&self, _entity_id: &UUID) -> Result<Vec<Participant>> {
        Ok(vec![])
    }

    async fn get_participants_for_room(&self, _room_id: &UUID) -> Result<Vec<UUID>> {
        Ok(vec![])
    }

    async fn is_room_participant(&self, _room_id: &UUID, _entity_id: &UUID) -> Result<bool> {
        Ok(false)
    }

    async fn add_participants_room(&self, _entity_ids: &[UUID], _room_id: &UUID) -> Result<bool> {
        Ok(true)
    }

    async fn get_participant_user_state(
        &self,
        _room_id: &UUID,
        _entity_id: &UUID,
    ) -> Result<Option<ParticipantUserState>> {
        Ok(None)
    }

    async fn set_participant_user_state(
        &self,
        _room_id: &UUID,
        _entity_id: &UUID,
        _state: Option<ParticipantUserState>,
    ) -> Result<()> {
        Ok(())
    }

    async fn create_relationship(&self, _params: CreateRelationshipParams) -> Result<bool> {
        Ok(true)
    }

    async fn update_relationship(&self, _relationship: &Relationship) -> Result<()> {
        Ok(())
    }

    async fn get_relationship(
        &self,
        _params: GetRelationshipParams,
    ) -> Result<Option<Relationship>> {
        Ok(None)
    }

    async fn get_relationships(
        &self,
        _params: GetRelationshipsParams,
    ) -> Result<Vec<Relationship>> {
        Ok(vec![])
    }

    async fn get_cache<T: serde::de::DeserializeOwned>(&self, key: &str) -> Result<Option<T>> {
        let row = sqlx::query("SELECT value FROM cache WHERE key = $1")
            .bind(key)
            .fetch_optional(self.manager.get_pool())
            .await?;

```