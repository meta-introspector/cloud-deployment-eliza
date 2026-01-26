# a7046c18:packages_core_rust_src_runtime.rs:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/src/runtime.rs:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
pub trait Service: Send + Sync {
    /// Get the service type
    fn service_type(&self) -> &str;

    /// Stop the service
    async fn stop(&self) -> Result<()>;
}

impl AgentRuntime {
    /// Create a new AgentRuntime
    pub async fn new(opts: RuntimeOptions) -> Result<Self> {
        let character = opts.character.unwrap_or_default();
        let agent_id = opts.agent_id.unwrap_or_else(|| {
            // Generate deterministic UUID from character name
            UUID::new_v4()
        });

        info!("Creating AgentRuntime for agent: {}", agent_id);

        let runtime = AgentRuntime {
            agent_id,
            character,
            adapter: opts.adapter,
            actions: RwLock::new(Vec::new()),
            providers: RwLock::new(Vec::new()),
            evaluators: RwLock::new(Vec::new()),
            plugins: RwLock::new(Vec::new()),
            events: RwLock::new(HashMap::new()),
            services: RwLock::new(HashMap::new()),
            settings: RwLock::new(opts.settings.unwrap_or_default()),
            current_run_id: RwLock::new(None),
            initialized: RwLock::new(false),
        };

        // Register provided plugins
        for plugin in opts.plugins {
            // Plugin registration would happen here
            debug!("Registering plugin: {}", plugin.definition.name);
        }

        Ok(runtime)
    }

    /// Initialize the runtime
    pub async fn initialize(&self) -> Result<()> {
        info!("Initializing AgentRuntime for agent: {}", self.agent_id);

        // Initialize database adapter if present
        if let Some(adapter) = &self.adapter {
            adapter
                .init()
                .await
                .context("Failed to initialize database")?;
        }

        // Mark as initialized
        #[cfg(not(feature = "wasm"))]
        {
            let mut initialized = self.initialized.write().await;
            *initialized = true;
        }
        #[cfg(feature = "wasm")]
        {
            let mut initialized = self.initialized.write().unwrap();
            *initialized = true;
        }

        info!("AgentRuntime initialized successfully");
        Ok(())
    }

    /// Register a plugin
    pub async fn register_plugin(&self, plugin: Plugin) -> Result<()> {
        debug!("Registering plugin: {}", plugin.definition.name);

        // Register actions
        for action in &plugin.action_handlers {
            #[cfg(not(feature = "wasm"))]
            {
                let mut actions = self.actions.write().await;
                actions.push(action.clone());
            }
            #[cfg(feature = "wasm")]
            {
                let mut actions = self.actions.write().unwrap();
                actions.push(action.clone());
            }
        }

        // Register providers
        for provider in &plugin.provider_handlers {
            #[cfg(not(feature = "wasm"))]
            {
                let mut providers = self.providers.write().await;
                providers.push(provider.clone());
            }
            #[cfg(feature = "wasm")]
            {
                let mut providers = self.providers.write().unwrap();
                providers.push(provider.clone());
            }
        }

        // Register evaluators
        for evaluator in &plugin.evaluator_handlers {
            #[cfg(not(feature = "wasm"))]
            {
                let mut evaluators = self.evaluators.write().await;
                evaluators.push(evaluator.clone());
            }
            #[cfg(feature = "wasm")]
            {
                let mut evaluators = self.evaluators.write().unwrap();
                evaluators.push(evaluator.clone());
            }
        }

        // Add to plugins list
        #[cfg(not(feature = "wasm"))]
        {
            let mut plugins = self.plugins.write().await;
            plugins.push(plugin);
        }
        #[cfg(feature = "wasm")]
        {
            let mut plugins = self.plugins.write().unwrap();
            plugins.push(plugin);
        }

        Ok(())
    }

    /// Get a setting value
    pub async fn get_setting(&self, key: &str) -> Option<String> {
        #[cfg(not(feature = "wasm"))]
        {
            let settings = self.settings.read().await;
            settings.get_string(key).map(String::from)
        }
        #[cfg(feature = "wasm")]
        {
            let settings = self.settings.read().unwrap();
            settings.get_string(key).map(String::from)
        }
    }

    /// Set a setting value
    pub async fn set_setting(&self, key: &str, value: &str) {
        #[cfg(not(feature = "wasm"))]
        {
```