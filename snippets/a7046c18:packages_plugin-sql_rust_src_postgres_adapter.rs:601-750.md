# a7046c18:packages_plugin-sql_rust_src_postgres_adapter.rs:601-750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/rust/src/postgres/adapter.rs:601-750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        }

        Ok(())
    }

    async fn get_memories_by_world_id(
        &self,
        world_id: &UUID,
        count: Option<i32>,
        table_name: Option<&str>,
    ) -> Result<Vec<Memory>> {
        let uuid = uuid::Uuid::parse_str(world_id.as_str())?;
        let limit = count.map(|c| format!(" LIMIT {}", c)).unwrap_or_default();

        let query = if let Some(table) = table_name {
            format!(
                r#"
                SELECT id, type, created_at, content, entity_id, agent_id,
                       room_id, world_id, "unique", metadata
                FROM memories WHERE world_id = $1 AND type = $2
                ORDER BY created_at DESC
                {}
                "#,
                limit
            )
        } else {
            format!(
                r#"
                SELECT id, type, created_at, content, entity_id, agent_id,
                       room_id, world_id, "unique", metadata
                FROM memories WHERE world_id = $1
                ORDER BY created_at DESC
                {}
                "#,
                limit
            )
        };

        let rows = if table_name.is_some() {
            sqlx::query(&query)
                .bind(uuid)
                .bind(table_name.unwrap())
                .fetch_all(self.manager.get_pool())
                .await?
        } else {
            sqlx::query(&query)
                .bind(uuid)
                .fetch_all(self.manager.get_pool())
                .await?
        };

        Ok(rows
            .into_iter()
            .map(|r| {
                MemoryRecord {
                    id: r.get("id"),
                    memory_type: r.get("type"),
                    created_at: r.get("created_at"),
                    content: r.get("content"),
                    entity_id: r.get("entity_id"),
                    agent_id: r.get("agent_id"),
                    room_id: r.get("room_id"),
                    world_id: r.get("world_id"),
                    unique: r.get("unique"),
                    metadata: r.get("metadata"),
                }
                .to_memory()
            })
            .collect())
    }

    // Stub implementations for remaining methods
    async fn get_entities_by_ids(&self, _entity_ids: &[UUID]) -> Result<Vec<Entity>> {
        Ok(vec![])
    }

    async fn get_entities_for_room(
        &self,
        _room_id: &UUID,
        _include_components: bool,
    ) -> Result<Vec<Entity>> {
        Ok(vec![])
    }

    async fn create_entities(&self, _entities: &[Entity]) -> Result<bool> {
        Ok(true)
    }

    async fn update_entity(&self, _entity: &Entity) -> Result<()> {
        Ok(())
    }

    async fn get_component(
        &self,
        _entity_id: &UUID,
        _component_type: &str,
        _world_id: Option<&UUID>,
        _source_entity_id: Option<&UUID>,
    ) -> Result<Option<Component>> {
        Ok(None)
    }

    async fn get_components(
        &self,
        _entity_id: &UUID,
        _world_id: Option<&UUID>,
        _source_entity_id: Option<&UUID>,
    ) -> Result<Vec<Component>> {
        Ok(vec![])
    }

    async fn create_component(&self, _component: &Component) -> Result<bool> {
        Ok(true)
    }

    async fn update_component(&self, _component: &Component) -> Result<()> {
        Ok(())
    }

    async fn delete_component(&self, _component_id: &UUID) -> Result<()> {
        Ok(())
    }

    async fn log(&self, _params: LogParams) -> Result<()> {
        Ok(())
    }

    async fn get_logs(&self, _params: GetLogsParams) -> Result<Vec<Log>> {
        Ok(vec![])
    }

    async fn delete_log(&self, _log_id: &UUID) -> Result<()> {
        Ok(())
    }

    async fn create_world(&self, world: &World) -> Result<UUID> {
        let id = uuid::Uuid::parse_str(world.id.as_str())?;
        let agent_id = uuid::Uuid::parse_str(world.agent_id.as_str())?;
        let metadata = serde_json::to_value(&world.metadata)?;

        sqlx::query(
            r#"
            INSERT INTO worlds (id, name, agent_id, message_server_id, metadata)
            VALUES ($1, $2, $3, $4, $5)
            "#,
        )
        .bind(id)
        .bind(&world.name)
        .bind(agent_id)
        .bind(
```