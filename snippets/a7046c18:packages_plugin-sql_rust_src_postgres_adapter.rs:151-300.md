# a7046c18:packages_plugin-sql_rust_src_postgres_adapter.rs:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/rust/src/postgres/adapter.rs:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

        let bio = serde_json::to_value(&agent.character.bio)?;
        let message_examples = serde_json::to_value(&agent.character.message_examples)?;
        let post_examples = serde_json::to_value(&agent.character.post_examples)?;
        let topics = serde_json::to_value(&agent.character.topics)?;
        let adjectives = serde_json::to_value(&agent.character.adjectives)?;
        let knowledge = serde_json::to_value(&agent.character.knowledge)?;
        let plugins = serde_json::to_value(&agent.character.plugins)?;
        let settings = serde_json::to_value(&agent.character.settings)?;
        let style = serde_json::to_value(&agent.character.style)?;

        sqlx::query(
            r#"
            INSERT INTO agents (id, enabled, name, username, system, bio, message_examples,
                               post_examples, topics, adjectives, knowledge, plugins, settings, style)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            ON CONFLICT (id) DO NOTHING
            "#
        )
        .bind(id)
        .bind(agent.enabled.unwrap_or(true))
        .bind(&agent.character.name)
        .bind(&agent.character.username)
        .bind(&agent.character.system)
        .bind(bio)
        .bind(message_examples)
        .bind(post_examples)
        .bind(topics)
        .bind(adjectives)
        .bind(knowledge)
        .bind(plugins)
        .bind(settings)
        .bind(style)
        .execute(self.manager.get_pool())
        .await?;

        Ok(true)
    }

    async fn update_agent(&self, agent_id: &UUID, agent: &Agent) -> Result<bool> {
        let id = uuid::Uuid::parse_str(agent_id.as_str())?;
        let bio = serde_json::to_value(&agent.character.bio)?;
        let settings = serde_json::to_value(&agent.character.settings)?;

        sqlx::query(
            r#"
            UPDATE agents SET
                name = $2,
                username = $3,
                system = $4,
                bio = $5,
                settings = $6,
                updated_at = now()
            WHERE id = $1
            "#,
        )
        .bind(id)
        .bind(&agent.character.name)
        .bind(&agent.character.username)
        .bind(&agent.character.system)
        .bind(bio)
        .bind(settings)
        .execute(self.manager.get_pool())
        .await?;

        Ok(true)
    }

    async fn delete_agent(&self, agent_id: &UUID) -> Result<bool> {
        let id = uuid::Uuid::parse_str(agent_id.as_str())?;

        sqlx::query("DELETE FROM agents WHERE id = $1")
            .bind(id)
            .execute(self.manager.get_pool())
            .await?;

        Ok(true)
    }

    // =========================================================================
    // Memory Methods
    // =========================================================================

    async fn get_memories(&self, params: GetMemoriesParams) -> Result<Vec<Memory>> {
        let mut query = String::from(
            r#"
            SELECT m.id, m.type, m.created_at, m.content, m.entity_id, m.agent_id,
                   m.room_id, m.world_id, m.unique, m.metadata
            FROM memories m
            WHERE m.type = $1
            "#,
        );

        let mut bindings: Vec<Box<dyn sqlx::Encode<'_, sqlx::Postgres> + Send + Sync>> =
            vec![Box::new(params.table_name.clone())];
        let mut param_count = 1;

        if let Some(room_id) = &params.room_id {
            param_count += 1;
            query.push_str(&format!(" AND m.room_id = ${}", param_count));
        }

        if let Some(agent_id) = &params.agent_id {
            param_count += 1;
            query.push_str(&format!(" AND m.agent_id = ${}", param_count));
        }

        query.push_str(" ORDER BY m.created_at DESC");

        if let Some(count) = params.count {
            query.push_str(&format!(" LIMIT {}", count));
        }

        if let Some(offset) = params.offset {
            query.push_str(&format!(" OFFSET {}", offset));
        }

        let rows = sqlx::query(&query)
            .bind(&params.table_name)
            .fetch_all(self.manager.get_pool())
            .await?;

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

    async fn get_memory_by_id(&self, id: &UUID) -> Result<Option<Memory>> {
        let uuid = uuid::Uuid::parse_str(id.as_str())?;

        let row = sqlx::query(
            r#"
            SELECT id, type, created_at, content, entity_id, agent_id,
                   room_id, world_id, "unique", metadata
            FROM memories WHERE id = $1
```