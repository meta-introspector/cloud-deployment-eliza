# a7046c18:packages_plugin-sql_rust_src_postgres_adapter.rs:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/rust/src/postgres/adapter.rs:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
            "#,
        )
        .bind(uuid)
        .fetch_optional(self.manager.get_pool())
        .await?;

        Ok(row.map(|r| {
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
        }))
    }

    async fn get_memories_by_ids(
        &self,
        ids: &[UUID],
        _table_name: Option<&str>,
    ) -> Result<Vec<Memory>> {
        let uuids: Vec<uuid::Uuid> = ids
            .iter()
            .filter_map(|id| uuid::Uuid::parse_str(id.as_str()).ok())
            .collect();

        let rows = sqlx::query(
            r#"
            SELECT id, type, created_at, content, entity_id, agent_id,
                   room_id, world_id, "unique", metadata
            FROM memories WHERE id = ANY($1)
            "#,
        )
        .bind(&uuids)
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

    async fn get_memories_by_room_ids(
        &self,
        table_name: &str,
        room_ids: &[UUID],
        limit: Option<i32>,
    ) -> Result<Vec<Memory>> {
        let uuids: Vec<uuid::Uuid> = room_ids
            .iter()
            .filter_map(|id| uuid::Uuid::parse_str(id.as_str()).ok())
            .collect();

        let limit_str = limit.map(|l| format!(" LIMIT {}", l)).unwrap_or_default();

        let query = format!(
            r#"
            SELECT id, type, created_at, content, entity_id, agent_id,
                   room_id, world_id, "unique", metadata
            FROM memories WHERE type = $1 AND room_id = ANY($2)
            ORDER BY created_at DESC
            {}
            "#,
            limit_str
        );

        let rows = sqlx::query(&query)
            .bind(table_name)
            .bind(&uuids)
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

    async fn get_cached_embeddings(
        &self,
        _params: GetCachedEmbeddingsParams,
    ) -> Result<Vec<EmbeddingSearchResult>> {
        // TODO: Implement cached embeddings query
        Ok(vec![])
    }

    async fn search_memories(&self, params: SearchMemoriesParams) -> Result<Vec<Memory>> {
        let threshold = params.match_threshold.unwrap_or(0.7);
        let count = params.count.unwrap_or(10);

        let query = embedding::search_embeddings_sql(self.embedding_dimension, count);

        let rows = sqlx::query(&query)
            .bind(&params.embedding)
            .bind(threshold)
            .fetch_all(self.manager.get_pool())
            .await?;

        Ok(rows
            .into_iter()
            .map(|r| {
                let mut memory = MemoryRecord {
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
                .to_memory();
```