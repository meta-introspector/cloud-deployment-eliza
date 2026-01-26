# a7046c18:packages_plugin-sql_rust_src_pglite_adapter.rs:451-600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/rust/src/pglite/adapter.rs:451-600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
                .unwrap_or(JsValue::NULL),
            JsValue::from_bool(memory.unique.unwrap_or(true)),
            JsValue::from_str(&metadata),
        ];

        self.manager.query(sql, &params).await?;
        Ok(id)
    }

    async fn update_memory(&self, memory: &Memory) -> Result<bool> {
        let id = memory
            .id
            .as_ref()
            .ok_or_else(|| anyhow::anyhow!("Memory ID is required"))?;
        let content = serde_json::to_string(&memory.content)?;
        let metadata = serde_json::to_string(&memory.metadata)?;

        let sql = r#"
            UPDATE memories SET content = $2, metadata = $3 WHERE id = $1
        "#;

        let params = vec![
            JsValue::from_str(id.as_str()),
            JsValue::from_str(&content),
            JsValue::from_str(&metadata),
        ];

        self.manager.query(sql, &params).await?;
        Ok(true)
    }

    async fn delete_memory(&self, memory_id: &UUID) -> Result<()> {
        let sql = "DELETE FROM memories WHERE id = $1";
        let params = vec![JsValue::from_str(memory_id.as_str())];
        self.manager.query(sql, &params).await?;
        Ok(())
    }

    async fn delete_many_memories(&self, memory_ids: &[UUID]) -> Result<()> {
        if memory_ids.is_empty() {
            return Ok(());
        }

        let id_list = memory_ids
            .iter()
            .map(|id| format!("'{}'", id.as_str()))
            .collect::<Vec<_>>()
            .join(",");

        let sql = format!("DELETE FROM memories WHERE id IN ({})", id_list);
        self.manager.exec(&sql).await?;
        Ok(())
    }

    async fn delete_all_memories(&self, room_id: &UUID, table_name: &str) -> Result<()> {
        let sql = "DELETE FROM memories WHERE room_id = $1 AND type = $2";
        let params = vec![
            JsValue::from_str(room_id.as_str()),
            JsValue::from_str(table_name),
        ];
        self.manager.query(sql, &params).await?;
        Ok(())
    }

    async fn count_memories(
        &self,
        room_id: &UUID,
        _unique: bool,
        table_name: Option<&str>,
    ) -> Result<i64> {
        let sql = if let Some(table) = table_name {
            format!(
                "SELECT COUNT(*) as count FROM memories WHERE room_id = $1 AND type = '{}'",
                table
            )
        } else {
            "SELECT COUNT(*) as count FROM memories WHERE room_id = $1".to_string()
        };

        let params = vec![JsValue::from_str(room_id.as_str())];
        let result = self.manager.query(&sql, &params).await?;
        let rows = self.parse_rows(&result)?;

        if let Some(row) = rows.first() {
            let count = Reflect::get(row, &JsValue::from_str("count"))
                .ok()
                .and_then(|v| v.as_f64())
                .unwrap_or(0.0);
            Ok(count as i64)
        } else {
            Ok(0)
        }
    }

    async fn ensure_embedding_dimension(&self, _dimension: i32) -> Result<()> {
        Ok(())
    }

    async fn get_memories_by_world_id(
        &self,
        _world_id: &UUID,
        _count: Option<i32>,
        _table_name: Option<&str>,
    ) -> Result<Vec<Memory>> {
        Ok(vec![])
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
```