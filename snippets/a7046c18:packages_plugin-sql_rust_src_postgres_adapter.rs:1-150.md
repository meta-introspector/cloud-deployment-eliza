# a7046c18:packages_plugin-sql_rust_src_postgres_adapter.rs:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/rust/src/postgres/adapter.rs:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
//! PostgreSQL adapter implementation for elizaOS

use anyhow::{Context, Result};
use async_trait::async_trait;
use sqlx::Row;
use tracing::{debug, error};

use crate::base::*;
use crate::schema::*;
use elizaos_core::{
    Agent, Component, Entity, GetMemoriesParams, Log, Memory, Metadata, Participant, Relationship,
    Room, SearchMemoriesParams, Task, World, UUID,
};

use super::PostgresConnectionManager;

/// PostgreSQL database adapter
pub struct PostgresAdapter {
    manager: PostgresConnectionManager,
    agent_id: uuid::Uuid,
    embedding_dimension: i32,
}

impl PostgresAdapter {
    /// Create a new PostgreSQL adapter
    pub async fn new(connection_string: &str, agent_id: &UUID) -> Result<Self> {
        let manager = PostgresConnectionManager::new(connection_string).await?;
        let agent_uuid = uuid::Uuid::parse_str(agent_id.as_str()).context("Invalid agent ID")?;

        Ok(PostgresAdapter {
            manager,
            agent_id: agent_uuid,
            embedding_dimension: embedding::DEFAULT_DIMENSION,
        })
    }

    /// Get the connection manager
    pub fn manager(&self) -> &PostgresConnectionManager {
        &self.manager
    }
}

#[async_trait]
impl DatabaseAdapter for PostgresAdapter {
    async fn init(&self) -> Result<()> {
        self.manager.run_migrations().await
    }

    async fn is_ready(&self) -> Result<bool> {
        self.manager.test_connection().await
    }

    async fn close(&self) -> Result<()> {
        self.manager.close().await;
        Ok(())
    }

    async fn get_connection(&self) -> Result<Box<dyn std::any::Any + Send>> {
        Ok(Box::new(self.manager.get_pool().clone()))
    }

    // =========================================================================
    // Agent Methods
    // =========================================================================

    async fn get_agent(&self, agent_id: &UUID) -> Result<Option<Agent>> {
        let id = uuid::Uuid::parse_str(agent_id.as_str())?;

        let row = sqlx::query(
            r#"
            SELECT id, enabled, server_id, created_at, updated_at, name, username,
                   system, bio, message_examples, post_examples, topics, adjectives,
                   knowledge, plugins, settings, style
            FROM agents WHERE id = $1
            "#,
        )
        .bind(id)
        .fetch_optional(self.manager.get_pool())
        .await?;

        Ok(row.map(|r| {
            let record = AgentRecord {
                id: r.get("id"),
                enabled: r.get("enabled"),
                server_id: r.get("server_id"),
                created_at: r.get("created_at"),
                updated_at: r.get("updated_at"),
                name: r.get("name"),
                username: r.get("username"),
                system: r.get("system"),
                bio: r.get("bio"),
                message_examples: r.get("message_examples"),
                post_examples: r.get("post_examples"),
                topics: r.get("topics"),
                adjectives: r.get("adjectives"),
                knowledge: r.get("knowledge"),
                plugins: r.get("plugins"),
                settings: r.get("settings"),
                style: r.get("style"),
            };
            record.to_agent()
        }))
    }

    async fn get_agents(&self) -> Result<Vec<Agent>> {
        let rows = sqlx::query(
            r#"
            SELECT id, enabled, server_id, created_at, updated_at, name, username,
                   system, bio, message_examples, post_examples, topics, adjectives,
                   knowledge, plugins, settings, style
            FROM agents
            "#,
        )
        .fetch_all(self.manager.get_pool())
        .await?;

        Ok(rows
            .into_iter()
            .map(|r| {
                let record = AgentRecord {
                    id: r.get("id"),
                    enabled: r.get("enabled"),
                    server_id: r.get("server_id"),
                    created_at: r.get("created_at"),
                    updated_at: r.get("updated_at"),
                    name: r.get("name"),
                    username: r.get("username"),
                    system: r.get("system"),
                    bio: r.get("bio"),
                    message_examples: r.get("message_examples"),
                    post_examples: r.get("post_examples"),
                    topics: r.get("topics"),
                    adjectives: r.get("adjectives"),
                    knowledge: r.get("knowledge"),
                    plugins: r.get("plugins"),
                    settings: r.get("settings"),
                    style: r.get("style"),
                };
                record.to_agent()
            })
            .collect())
    }

    async fn create_agent(&self, agent: &Agent) -> Result<bool> {
        let id = agent
            .character
            .id
            .as_ref()
            .map(|u| uuid::Uuid::parse_str(u.as_str()).unwrap())
            .unwrap_or_else(uuid::Uuid::new_v4);
```