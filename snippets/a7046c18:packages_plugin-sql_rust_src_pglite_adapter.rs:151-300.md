# a7046c18:packages_plugin-sql_rust_src_pglite_adapter.rs:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/rust/src/pglite/adapter.rs:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

        let sql = r#"
            INSERT INTO agents (id, enabled, name, username, system, bio, settings)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            ON CONFLICT (id) DO NOTHING
        "#;

        let params = vec![
            JsValue::from_str(&id),
            JsValue::from_bool(agent.enabled.unwrap_or(true)),
            JsValue::from_str(&agent.character.name),
            agent
                .character
                .username
                .as_ref()
                .map(|u| JsValue::from_str(u))
                .unwrap_or(JsValue::NULL),
            agent
                .character
                .system
                .as_ref()
                .map(|s| JsValue::from_str(s))
                .unwrap_or(JsValue::NULL),
            JsValue::from_str(&bio),
            JsValue::from_str(&settings),
        ];

        self.manager.query(sql, &params).await?;
        Ok(true)
    }

    async fn update_agent(&self, agent_id: &UUID, agent: &Agent) -> Result<bool> {
        let bio = serde_json::to_string(&agent.character.bio)?;
        let settings = serde_json::to_string(&agent.character.settings)?;

        let sql = r#"
            UPDATE agents SET
                name = $2,
                username = $3,
                system = $4,
                bio = $5,
                settings = $6,
                updated_at = now()
            WHERE id = $1
        "#;

        let params = vec![
            JsValue::from_str(agent_id.as_str()),
            JsValue::from_str(&agent.character.name),
            agent
                .character
                .username
                .as_ref()
                .map(|u| JsValue::from_str(u))
                .unwrap_or(JsValue::NULL),
            agent
                .character
                .system
                .as_ref()
                .map(|s| JsValue::from_str(s))
                .unwrap_or(JsValue::NULL),
            JsValue::from_str(&bio),
            JsValue::from_str(&settings),
        ];

        self.manager.query(sql, &params).await?;
        Ok(true)
    }

    async fn delete_agent(&self, agent_id: &UUID) -> Result<bool> {
        let sql = "DELETE FROM agents WHERE id = $1";
        let params = vec![JsValue::from_str(agent_id.as_str())];
        self.manager.query(sql, &params).await?;
        Ok(true)
    }

    // Memory methods
    async fn get_memories(&self, params: GetMemoriesParams) -> Result<Vec<Memory>> {
        let mut sql = String::from(
            r#"
            SELECT id, type, created_at, content, entity_id, agent_id,
                   room_id, world_id, "unique", metadata
            FROM memories WHERE type = $1
            "#,
        );

        let mut js_params = vec![JsValue::from_str(&params.table_name)];

        if params.room_id.is_some() {
            sql.push_str(" AND room_id = $2");
            js_params.push(JsValue::from_str(params.room_id.as_ref().unwrap().as_str()));
        }

        sql.push_str(" ORDER BY created_at DESC");

        if let Some(count) = params.count {
            sql.push_str(&format!(" LIMIT {}", count));
        }

        let result = self.manager.query(&sql, &js_params).await?;
        let rows = self.parse_rows(&result)?;

        // Convert rows to Memory objects
        Ok(rows
            .into_iter()
            .filter_map(|row| {
                let id = Reflect::get(&row, &JsValue::from_str("id"))
                    .ok()
                    .and_then(|v| v.as_string())
                    .and_then(|s| UUID::new(&s).ok())?;

                let entity_id = Reflect::get(&row, &JsValue::from_str("entity_id"))
                    .ok()
                    .and_then(|v| v.as_string())
                    .and_then(|s| UUID::new(&s).ok())
                    .unwrap_or_else(UUID::new_v4);

                let room_id = Reflect::get(&row, &JsValue::from_str("room_id"))
                    .ok()
                    .and_then(|v| v.as_string())
                    .and_then(|s| UUID::new(&s).ok())
                    .unwrap_or_else(UUID::new_v4);

                let content_str = Reflect::get(&row, &JsValue::from_str("content"))
                    .ok()
                    .and_then(|v| v.as_string())
                    .unwrap_or_default();

                let content: elizaos_core::Content =
                    serde_json::from_str(&content_str).unwrap_or_default();

                Some(Memory {
                    id: Some(id),
                    entity_id,
                    agent_id: None,
                    created_at: None,
                    content,
                    embedding: None,
                    room_id,
                    world_id: None,
                    unique: Some(true),
                    similarity: None,
                    metadata: None,
                })
            })
            .collect())
    }

    async fn get_memory_by_id(&self, id: &UUID) -> Result<Option<Memory>> {
        let sql = r#"
```