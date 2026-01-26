# a7046c18:packages_plugin-sql_rust_src_pglite_adapter.rs:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/rust/src/pglite/adapter.rs:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
//! PGLite adapter implementation for elizaOS WASM environments

#![cfg(feature = "wasm")]

use anyhow::Result;
use async_trait::async_trait;
use js_sys::{Array, Reflect};
use wasm_bindgen::JsValue;

use crate::base::*;
use elizaos_core::{
    Agent, Component, Entity, GetMemoriesParams, Log, Memory, Metadata, Participant, Relationship,
    Room, SearchMemoriesParams, Task, World, UUID,
};

use super::PgLiteManager;

/// PGLite database adapter for WASM environments
pub struct PgLiteAdapter {
    manager: PgLiteManager,
    agent_id: String,
}

impl PgLiteAdapter {
    /// Create a new PGLite adapter
    pub async fn new(data_dir: Option<&str>, agent_id: &UUID) -> Result<Self> {
        let manager = PgLiteManager::new(data_dir).await?;

        Ok(PgLiteAdapter {
            manager,
            agent_id: agent_id.to_string(),
        })
    }

    /// Initialize with a JavaScript PGLite instance
    pub async fn init_with_js(&mut self, pglite_js: JsValue) -> Result<()> {
        self.manager.init(pglite_js).await
    }

    /// Helper to parse query results into a Vec of rows
    fn parse_rows(&self, result: &JsValue) -> Result<Vec<JsValue>> {
        let rows = Reflect::get(result, &JsValue::from_str("rows"))
            .map_err(|e| anyhow::anyhow!("Failed to get rows: {:?}", e))?;

        let rows_array = Array::from(&rows);
        Ok(rows_array.iter().collect())
    }
}

#[async_trait(?Send)]
impl DatabaseAdapter for PgLiteAdapter {
    async fn init(&self) -> Result<()> {
        self.manager.run_migrations().await
    }

    async fn is_ready(&self) -> Result<bool> {
        Ok(self.manager.is_initialized())
    }

    async fn close(&self) -> Result<()> {
        self.manager.close().await
    }

    async fn get_connection(&self) -> Result<Box<dyn std::any::Any + Send>> {
        // Return a placeholder since we can't return the JS object directly
        Ok(Box::new(()))
    }

    // Agent methods - delegated through JS interop
    async fn get_agent(&self, agent_id: &UUID) -> Result<Option<Agent>> {
        let sql = r#"
            SELECT id, enabled, server_id, created_at, updated_at, name, username,
                   system, bio, message_examples, post_examples, topics, adjectives,
                   knowledge, plugins, settings, style
            FROM agents WHERE id = $1
        "#;

        let params = vec![JsValue::from_str(agent_id.as_str())];
        let result = self.manager.query(sql, &params).await?;
        let rows = self.parse_rows(&result)?;

        if rows.is_empty() {
            return Ok(None);
        }

        // Parse the first row into an Agent
        let row = &rows[0];
        let character = elizaos_core::Character {
            id: Some(agent_id.clone()),
            name: Reflect::get(row, &JsValue::from_str("name"))
                .ok()
                .and_then(|v| v.as_string())
                .unwrap_or_default(),
            ..Default::default()
        };

        Ok(Some(elizaos_core::Agent {
            character,
            enabled: Some(true),
            status: None,
            created_at: 0,
            updated_at: 0,
        }))
    }

    async fn get_agents(&self) -> Result<Vec<Agent>> {
        let sql = "SELECT * FROM agents";
        let result = self.manager.query(sql, &[]).await?;
        let rows = self.parse_rows(&result)?;

        Ok(rows
            .into_iter()
            .filter_map(|row| {
                let id = Reflect::get(&row, &JsValue::from_str("id"))
                    .ok()
                    .and_then(|v| v.as_string())
                    .and_then(|s| UUID::new(&s).ok())?;

                let name = Reflect::get(&row, &JsValue::from_str("name"))
                    .ok()
                    .and_then(|v| v.as_string())
                    .unwrap_or_default();

                let character = elizaos_core::Character {
                    id: Some(id),
                    name,
                    ..Default::default()
                };

                Some(elizaos_core::Agent {
                    character,
                    enabled: Some(true),
                    status: None,
                    created_at: 0,
                    updated_at: 0,
                })
            })
            .collect())
    }

    async fn create_agent(&self, agent: &Agent) -> Result<bool> {
        let id = agent
            .character
            .id
            .as_ref()
            .map(|u| u.to_string())
            .unwrap_or_else(|| UUID::new_v4().to_string());

        let bio = serde_json::to_string(&agent.character.bio)?;
        let settings = serde_json::to_string(&agent.character.settings)?;
```