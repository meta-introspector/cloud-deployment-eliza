# a7046c18:packages_plugin-sql_rust_src_postgres_adapter.rs:451-600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/rust/src/postgres/adapter.rs:451-600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

                memory.similarity = r.try_get("similarity").ok();
                memory
            })
            .collect())
    }

    async fn create_memory(
        &self,
        memory: &Memory,
        table_name: &str,
        _unique: bool,
    ) -> Result<UUID> {
        let record = MemoryRecord::from_memory(memory, table_name);

        sqlx::query(
            r#"
            INSERT INTO memories (id, type, content, entity_id, agent_id, room_id, world_id, "unique", metadata)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            "#
        )
        .bind(record.id)
        .bind(&record.memory_type)
        .bind(&record.content)
        .bind(record.entity_id)
        .bind(record.agent_id)
        .bind(record.room_id)
        .bind(record.world_id)
        .bind(record.unique)
        .bind(&record.metadata)
        .execute(self.manager.get_pool())
        .await?;

        // If memory has embedding, store it
        if let Some(embedding) = &memory.embedding {
            sqlx::query(
                r#"
                INSERT INTO embeddings (id, embedding)
                VALUES ($1, $2::vector)
                "#,
            )
            .bind(record.id)
            .bind(embedding)
            .execute(self.manager.get_pool())
            .await?;
        }

        Ok(UUID::new(&record.id.to_string()).unwrap())
    }

    async fn update_memory(&self, memory: &Memory) -> Result<bool> {
        let id = memory
            .id
            .as_ref()
            .ok_or_else(|| anyhow::anyhow!("Memory ID is required"))?;
        let uuid = uuid::Uuid::parse_str(id.as_str())?;
        let content = serde_json::to_value(&memory.content)?;
        let metadata = serde_json::to_value(&memory.metadata)?;

        sqlx::query(
            r#"
            UPDATE memories SET
                content = $2,
                metadata = $3
            WHERE id = $1
            "#,
        )
        .bind(uuid)
        .bind(&content)
        .bind(&metadata)
        .execute(self.manager.get_pool())
        .await?;

        Ok(true)
    }

    async fn delete_memory(&self, memory_id: &UUID) -> Result<()> {
        let uuid = uuid::Uuid::parse_str(memory_id.as_str())?;

        sqlx::query("DELETE FROM memories WHERE id = $1")
            .bind(uuid)
            .execute(self.manager.get_pool())
            .await?;

        Ok(())
    }

    async fn delete_many_memories(&self, memory_ids: &[UUID]) -> Result<()> {
        let uuids: Vec<uuid::Uuid> = memory_ids
            .iter()
            .filter_map(|id| uuid::Uuid::parse_str(id.as_str()).ok())
            .collect();

        sqlx::query("DELETE FROM memories WHERE id = ANY($1)")
            .bind(&uuids)
            .execute(self.manager.get_pool())
            .await?;

        Ok(())
    }

    async fn delete_all_memories(&self, room_id: &UUID, table_name: &str) -> Result<()> {
        let uuid = uuid::Uuid::parse_str(room_id.as_str())?;

        sqlx::query("DELETE FROM memories WHERE room_id = $1 AND type = $2")
            .bind(uuid)
            .bind(table_name)
            .execute(self.manager.get_pool())
            .await?;

        Ok(())
    }

    async fn count_memories(
        &self,
        room_id: &UUID,
        _unique: bool,
        table_name: Option<&str>,
    ) -> Result<i64> {
        let uuid = uuid::Uuid::parse_str(room_id.as_str())?;

        let query = if let Some(table) = table_name {
            sqlx::query_scalar::<_, i64>(
                "SELECT COUNT(*) FROM memories WHERE room_id = $1 AND type = $2",
            )
            .bind(uuid)
            .bind(table)
        } else {
            sqlx::query_scalar::<_, i64>("SELECT COUNT(*) FROM memories WHERE room_id = $1")
                .bind(uuid)
        };

        let count = query.fetch_one(self.manager.get_pool()).await?;
        Ok(count)
    }

    async fn ensure_embedding_dimension(&self, dimension: i32) -> Result<()> {
        // Re-create embeddings table with new dimension if needed
        if dimension != self.embedding_dimension {
            sqlx::query("DROP TABLE IF EXISTS embeddings")
                .execute(self.manager.get_pool())
                .await?;

            sqlx::query(&embedding::create_embeddings_table_sql(dimension))
                .execute(self.manager.get_pool())
                .await?;

            sqlx::query(embedding::CREATE_EMBEDDINGS_INDEXES)
                .execute(self.manager.get_pool())
                .await?;
```