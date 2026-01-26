# a7046c18:packages_plugin-sql_rust_src_pglite_adapter.rs:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/rust/src/pglite/adapter.rs:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
            SELECT id, type, created_at, content, entity_id, agent_id,
                   room_id, world_id, "unique", metadata
            FROM memories WHERE id = $1
        "#;

        let params = vec![JsValue::from_str(id.as_str())];
        let result = self.manager.query(sql, &params).await?;
        let rows = self.parse_rows(&result)?;

        if rows.is_empty() {
            return Ok(None);
        }

        // Parse first row
        let row = &rows[0];
        let entity_id = Reflect::get(row, &JsValue::from_str("entity_id"))
            .ok()
            .and_then(|v| v.as_string())
            .and_then(|s| UUID::new(&s).ok())
            .unwrap_or_else(UUID::new_v4);

        let room_id = Reflect::get(row, &JsValue::from_str("room_id"))
            .ok()
            .and_then(|v| v.as_string())
            .and_then(|s| UUID::new(&s).ok())
            .unwrap_or_else(UUID::new_v4);

        Ok(Some(Memory {
            id: Some(id.clone()),
            entity_id,
            agent_id: None,
            created_at: None,
            content: elizaos_core::Content::default(),
            embedding: None,
            room_id,
            world_id: None,
            unique: Some(true),
            similarity: None,
            metadata: None,
        }))
    }

    async fn get_memories_by_ids(
        &self,
        ids: &[UUID],
        _table_name: Option<&str>,
    ) -> Result<Vec<Memory>> {
        if ids.is_empty() {
            return Ok(vec![]);
        }

        let id_list = ids
            .iter()
            .map(|id| format!("'{}'", id.as_str()))
            .collect::<Vec<_>>()
            .join(",");

        let sql = format!(
            r#"
            SELECT id, type, created_at, content, entity_id, agent_id,
                   room_id, world_id, "unique", metadata
            FROM memories WHERE id IN ({})
            "#,
            id_list
        );

        let result = self.manager.query(&sql, &[]).await?;
        let _rows = self.parse_rows(&result)?;

        Ok(vec![])
    }

    async fn get_memories_by_room_ids(
        &self,
        table_name: &str,
        room_ids: &[UUID],
        limit: Option<i32>,
    ) -> Result<Vec<Memory>> {
        if room_ids.is_empty() {
            return Ok(vec![]);
        }

        let room_list = room_ids
            .iter()
            .map(|id| format!("'{}'", id.as_str()))
            .collect::<Vec<_>>()
            .join(",");

        let limit_str = limit.map(|l| format!(" LIMIT {}", l)).unwrap_or_default();

        let sql = format!(
            r#"
            SELECT id, type, created_at, content, entity_id, agent_id,
                   room_id, world_id, "unique", metadata
            FROM memories WHERE type = $1 AND room_id IN ({})
            ORDER BY created_at DESC
            {}
            "#,
            room_list, limit_str
        );

        let params = vec![JsValue::from_str(table_name)];
        let result = self.manager.query(&sql, &params).await?;
        let _rows = self.parse_rows(&result)?;

        Ok(vec![])
    }

    async fn get_cached_embeddings(
        &self,
        _params: GetCachedEmbeddingsParams,
    ) -> Result<Vec<EmbeddingSearchResult>> {
        Ok(vec![])
    }

    async fn search_memories(&self, _params: SearchMemoriesParams) -> Result<Vec<Memory>> {
        // Vector search would need PGVector extension in PGLite
        Ok(vec![])
    }

    async fn create_memory(
        &self,
        memory: &Memory,
        table_name: &str,
        _unique: bool,
    ) -> Result<UUID> {
        let id = memory.id.clone().unwrap_or_else(UUID::new_v4);
        let content = serde_json::to_string(&memory.content)?;
        let metadata = serde_json::to_string(&memory.metadata)?;

        let sql = r#"
            INSERT INTO memories (id, type, content, entity_id, agent_id, room_id, world_id, "unique", metadata)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        "#;

        let params = vec![
            JsValue::from_str(id.as_str()),
            JsValue::from_str(table_name),
            JsValue::from_str(&content),
            JsValue::from_str(memory.entity_id.as_str()),
            memory
                .agent_id
                .as_ref()
                .map(|a| JsValue::from_str(a.as_str()))
                .unwrap_or(JsValue::NULL),
            JsValue::from_str(memory.room_id.as_str()),
            memory
                .world_id
                .as_ref()
                .map(|w| JsValue::from_str(w.as_str()))
```