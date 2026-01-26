# a7046c18:packages_core_rust_tests_integration_tests.rs:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/tests/integration_tests.rs:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
//! Integration tests for elizaOS Core
//!
//! These tests verify the complete agent runtime functionality including:
//! - Action handling and execution
//! - Provider context gathering
//! - Evaluator execution
//! - Memory CRUD operations
//! - Event handling
//! - Plugin registration

use anyhow::Result;
use async_trait::async_trait;
use elizaos_core::{
    parse_character,
    runtime::{AgentRuntime, DatabaseAdapter, RuntimeOptions},
    types::{
        ActionDefinition, ActionHandler, ActionResult, Bio, Character, Content, Entity,
        EvaluationExample, EvaluatorDefinition, EvaluatorHandler, EventPayload, EventType,
        GetMemoriesParams, HandlerOptions, Memory, Plugin, PluginDefinition, ProviderDefinition,
        ProviderHandler, ProviderResult, Room, RuntimeSettings, SearchMemoriesParams, SettingValue,
        State, Task, World, UUID,
    },
};
use std::collections::HashMap;
use std::sync::atomic::{AtomicUsize, Ordering};
use std::sync::{Arc, Mutex};

// ============================================================================
// Mock Database Adapter
// ============================================================================

/// In-memory database adapter for testing
#[derive(Default)]
struct MockDatabaseAdapter {
    memories: Mutex<HashMap<String, Memory>>,
    agents: Mutex<HashMap<String, elizaos_core::Agent>>,
    rooms: Mutex<HashMap<String, Room>>,
    entities: Mutex<HashMap<String, Entity>>,
    worlds: Mutex<HashMap<String, World>>,
    tasks: Mutex<HashMap<String, Task>>,
    initialized: Mutex<bool>,
}

#[async_trait]
impl DatabaseAdapter for MockDatabaseAdapter {
    async fn init(&self) -> Result<()> {
        let mut initialized = self.initialized.lock().unwrap();
        *initialized = true;
        Ok(())
    }

    async fn close(&self) -> Result<()> {
        let mut initialized = self.initialized.lock().unwrap();
        *initialized = false;
        Ok(())
    }

    async fn is_ready(&self) -> Result<bool> {
        let initialized = self.initialized.lock().unwrap();
        Ok(*initialized)
    }

    async fn get_agent(&self, agent_id: &UUID) -> Result<Option<elizaos_core::Agent>> {
        let agents = self.agents.lock().unwrap();
        Ok(agents.get(agent_id.as_str()).cloned())
    }

    async fn create_agent(&self, agent: &elizaos_core::Agent) -> Result<bool> {
        let mut agents = self.agents.lock().unwrap();
        if let Some(id) = &agent.character.id {
            agents.insert(id.as_str().to_string(), agent.clone());
            Ok(true)
        } else {
            Ok(false)
        }
    }

    async fn update_agent(&self, agent_id: &UUID, agent: &elizaos_core::Agent) -> Result<bool> {
        let mut agents = self.agents.lock().unwrap();
        agents.insert(agent_id.as_str().to_string(), agent.clone());
        Ok(true)
    }

    async fn delete_agent(&self, agent_id: &UUID) -> Result<bool> {
        let mut agents = self.agents.lock().unwrap();
        Ok(agents.remove(agent_id.as_str()).is_some())
    }

    async fn get_memories(&self, params: GetMemoriesParams) -> Result<Vec<Memory>> {
        let memories = self.memories.lock().unwrap();
        let mut result: Vec<Memory> = memories.values().cloned().collect();

        // Filter by room_id if provided
        if let Some(room_id) = &params.room_id {
            result.retain(|m| m.room_id.as_str() == room_id.as_str());
        }

        // Filter by count
        if let Some(count) = params.count {
            result.truncate(count as usize);
        }

        Ok(result)
    }

    async fn search_memories(&self, params: SearchMemoriesParams) -> Result<Vec<Memory>> {
        // For testing, return memories that match the embedding dimension check
        let memories = self.memories.lock().unwrap();
        let mut result: Vec<Memory> = memories
            .values()
            .filter(|m| m.embedding.is_some())
            .cloned()
            .collect();

        if let Some(count) = params.count {
            result.truncate(count as usize);
        }

        Ok(result)
    }

    async fn create_memory(&self, memory: &Memory, _table_name: &str) -> Result<UUID> {
        let mut memories = self.memories.lock().unwrap();
        let id = memory.id.clone().unwrap_or_else(UUID::new_v4);
        let mut new_memory = memory.clone();
        new_memory.id = Some(id.clone());
        memories.insert(id.as_str().to_string(), new_memory);
        Ok(id)
    }

    async fn update_memory(&self, memory: &Memory) -> Result<bool> {
        let mut memories = self.memories.lock().unwrap();
        if let Some(id) = &memory.id {
            memories.insert(id.as_str().to_string(), memory.clone());
            Ok(true)
        } else {
            Ok(false)
        }
    }

    async fn delete_memory(&self, memory_id: &UUID) -> Result<()> {
        let mut memories = self.memories.lock().unwrap();
        memories.remove(memory_id.as_str());
        Ok(())
    }

    async fn get_memory_by_id(&self, id: &UUID) -> Result<Option<Memory>> {
        let memories = self.memories.lock().unwrap();
        Ok(memories.get(id.as_str()).cloned())
    }
```