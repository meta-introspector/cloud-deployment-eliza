# a7046c18:packages_core_rust_src_runtime.rs:451-552

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/src/runtime.rs:451-552
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    }

    /// End the current run
    pub fn end_run(&self) {
        #[cfg(not(feature = "wasm"))]
        {
            // In native mode, this would need async access
            // For now, this is a no-op in native mode
        }
        #[cfg(feature = "wasm")]
        {
            let mut current = self.current_run_id.write().unwrap();
            *current = None;
        }
    }

    /// Get the current run ID
    pub fn get_current_run_id(&self) -> Option<UUID> {
        #[cfg(not(feature = "wasm"))]
        {
            // In native mode, would need async access to read
            // For now, return None
            None
        }
        #[cfg(feature = "wasm")]
        {
            let current = self.current_run_id.read().unwrap();
            current.clone()
        }
    }

    /// Stop the runtime
    pub async fn stop(&self) -> Result<()> {
        info!("Stopping AgentRuntime for agent: {}", self.agent_id);

        // Stop all services
        #[cfg(not(feature = "wasm"))]
        {
            let services = self.services.read().await;
            for (name, service) in services.iter() {
                if let Err(e) = service.stop().await {
                    error!("Failed to stop service {}: {}", name, e);
                }
            }
        }
        #[cfg(feature = "wasm")]
        {
            let services = self.services.read().unwrap();
            for (name, service) in services.iter() {
                // Note: In WASM, we'd need to handle this differently
                debug!("Service {} would be stopped", name);
            }
        }

        // Close database adapter
        if let Some(adapter) = &self.adapter {
            adapter.close().await.context("Failed to close database")?;
        }

        info!("AgentRuntime stopped successfully");
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_runtime_creation() {
        let runtime = AgentRuntime::new(RuntimeOptions {
            character: Some(Character {
                name: "TestAgent".to_string(),
                ..Default::default()
            }),
            ..Default::default()
        })
        .await
        .unwrap();

        assert_eq!(runtime.character.name, "TestAgent");
    }

    #[tokio::test]
    async fn test_runtime_settings() {
        let runtime = AgentRuntime::new(RuntimeOptions::default()).await.unwrap();

        runtime.set_setting("test_key", "test_value").await;
        let value = runtime.get_setting("test_key").await;
        assert_eq!(value, Some("test_value".to_string()));
    }

    #[tokio::test]
    async fn test_run_management() {
        let runtime = AgentRuntime::new(RuntimeOptions::default()).await.unwrap();

        let run_id = runtime.start_run(None);
        assert!(!run_id.as_str().is_empty());

        runtime.end_run();
    }
}
```