# a7046c18:packages_plugin-sql_rust_src_pglite_manager.rs:151-197

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/rust/src/pglite/manager.rs:151-197
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    pub fn is_initialized(&self) -> bool {
        self.initialized
    }

    /// Run database migrations
    pub async fn run_migrations(&self) -> Result<()> {
        use crate::schema::*;

        // Create vector extension
        self.exec(embedding::ENSURE_VECTOR_EXTENSION).await?;

        // Create tables in order (respecting foreign key constraints)
        let migrations = vec![
            agent::CREATE_AGENTS_TABLE,
            agent::CREATE_AGENTS_INDEXES,
            world::CREATE_WORLDS_TABLE,
            world::CREATE_WORLDS_INDEXES,
            entity::CREATE_ENTITIES_TABLE,
            entity::CREATE_ENTITIES_INDEXES,
            room::CREATE_ROOMS_TABLE,
            room::CREATE_ROOMS_INDEXES,
            memory::CREATE_MEMORIES_TABLE,
            memory::CREATE_MEMORIES_INDEXES,
            &embedding::create_embeddings_table_sql(embedding::DEFAULT_DIMENSION),
            embedding::CREATE_EMBEDDINGS_INDEXES,
            component::CREATE_COMPONENTS_TABLE,
            component::CREATE_COMPONENTS_INDEXES,
            participant::CREATE_PARTICIPANTS_TABLE,
            participant::CREATE_PARTICIPANTS_INDEXES,
            relationship::CREATE_RELATIONSHIPS_TABLE,
            relationship::CREATE_RELATIONSHIPS_INDEXES,
            task::CREATE_TASKS_TABLE,
            task::CREATE_TASKS_INDEXES,
            log::CREATE_LOGS_TABLE,
            log::CREATE_LOGS_INDEXES,
            cache::CREATE_CACHE_TABLE,
            cache::CREATE_CACHE_INDEXES,
        ];

        for migration in migrations {
            self.exec(migration).await?;
        }

        info!("PGLite migrations completed successfully");
        Ok(())
    }
}
```