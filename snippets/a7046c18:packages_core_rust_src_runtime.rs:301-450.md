# a7046c18:packages_core_rust_src_runtime.rs:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/src/runtime.rs:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
            let mut settings = self.settings.write().await;
            settings.set_string(key, value);
        }
        #[cfg(feature = "wasm")]
        {
            let mut settings = self.settings.write().unwrap();
            settings.set_string(key, value);
        }
    }

    /// Compose state for a message
    pub async fn compose_state(&self, message: &Memory) -> Result<State> {
        let mut state = State::new();

        // Get providers
        #[cfg(not(feature = "wasm"))]
        let providers = self.providers.read().await;
        #[cfg(feature = "wasm")]
        let providers = self.providers.read().unwrap();

        // Run each provider to gather context
        for provider in providers.iter() {
            let def = provider.definition();
            if def.private.unwrap_or(false) {
                continue; // Skip private providers unless explicitly called
            }

            match provider.get(message, &state).await {
                Ok(result) => {
                    // Merge provider result into state
                    if let Some(text) = result.text {
                        if !state.text.is_empty() {
                            state.text.push('\n');
                        }
                        state.text.push_str(&text);
                    }
                    if let Some(values) = result.values {
                        for (k, v) in values {
                            state.values.insert(k, v);
                        }
                    }
                }
                Err(e) => {
                    warn!("Provider {} failed: {}", def.name, e);
                }
            }
        }

        Ok(state)
    }

    /// Process actions for a message
    pub async fn process_actions(
        &self,
        message: &Memory,
        state: &State,
        options: Option<&HandlerOptions>,
    ) -> Result<Vec<ActionResult>> {
        let mut results = Vec::new();

        #[cfg(not(feature = "wasm"))]
        let actions = self.actions.read().await;
        #[cfg(feature = "wasm")]
        let actions = self.actions.read().unwrap();

        for action in actions.iter() {
            // Validate if action should run
            if !action.validate(message, Some(state)).await {
                continue;
            }

            let def = action.definition();
            debug!("Executing action: {}", def.name);

            match action.handle(message, Some(state), options).await {
                Ok(Some(result)) => {
                    results.push(result);
                }
                Ok(None) => {
                    // Action completed but returned no result
                }
                Err(e) => {
                    error!("Action {} failed: {}", def.name, e);
                    results.push(ActionResult::failure(&e.to_string()));
                }
            }
        }

        Ok(results)
    }

    /// Emit an event
    pub async fn emit_event(&self, event_type: EventType, payload: EventPayload) -> Result<()> {
        let event_name = format!("{:?}", event_type);

        #[cfg(not(feature = "wasm"))]
        let events = self.events.read().await;
        #[cfg(feature = "wasm")]
        let events = self.events.read().unwrap();

        if let Some(handlers) = events.get(&event_name) {
            for handler in handlers {
                if let Err(e) = handler(payload.clone()) {
                    error!("Event handler failed for {}: {}", event_name, e);
                }
            }
        }

        Ok(())
    }

    /// Register an event handler
    pub async fn register_event(&self, event_type: EventType, handler: EventHandler) {
        let event_name = format!("{:?}", event_type);

        #[cfg(not(feature = "wasm"))]
        {
            let mut events = self.events.write().await;
            events
                .entry(event_name)
                .or_insert_with(Vec::new)
                .push(handler);
        }
        #[cfg(feature = "wasm")]
        {
            let mut events = self.events.write().unwrap();
            events
                .entry(event_name)
                .or_insert_with(Vec::new)
                .push(handler);
        }
    }

    /// Start a new run
    pub fn start_run(&self, room_id: Option<&UUID>) -> UUID {
        let run_id = UUID::new_v4();

        #[cfg(not(feature = "wasm"))]
        {
            // In native mode, we'd need async access, but this is a sync method
            // The run_id is still tracked via the return value
        }
        #[cfg(feature = "wasm")]
        {
            let mut current = self.current_run_id.write().unwrap();
            *current = Some(run_id.clone());
        }

        debug!("Started run: {} for room: {:?}", run_id, room_id);
        run_id
```