# a7046c18:packages_core_rust_src_types_plugin.rs:151-235

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/src/types/plugin.rs:151-235
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    }

    /// Get test dependencies
    pub fn test_dependencies(&self) -> &[String] {
        self.definition.test_dependencies.as_deref().unwrap_or(&[])
    }

    /// Add an action handler
    pub fn with_action(mut self, handler: Arc<dyn ActionHandler>) -> Self {
        let def = handler.definition();
        if let Some(ref mut actions) = self.definition.actions {
            actions.push(def);
        } else {
            self.definition.actions = Some(vec![def]);
        }
        self.action_handlers.push(handler);
        self
    }

    /// Add a provider handler
    pub fn with_provider(mut self, handler: Arc<dyn ProviderHandler>) -> Self {
        let def = handler.definition();
        if let Some(ref mut providers) = self.definition.providers {
            providers.push(def);
        } else {
            self.definition.providers = Some(vec![def]);
        }
        self.provider_handlers.push(handler);
        self
    }
}

/// Project agent configuration
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProjectAgentDefinition {
    /// Character configuration
    pub character: Character,
    /// Plugin names to load
    #[serde(skip_serializing_if = "Option::is_none")]
    pub plugins: Option<Vec<String>>,
}

/// Project configuration
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProjectDefinition {
    /// Agent configurations
    pub agents: Vec<ProjectAgentDefinition>,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_plugin_definition_serialization() {
        let plugin = PluginDefinition {
            name: "test-plugin".to_string(),
            description: "A test plugin".to_string(),
            dependencies: Some(vec!["other-plugin".to_string()]),
            ..Default::default()
        };

        let json = serde_json::to_string(&plugin).unwrap();
        assert!(json.contains("\"name\":\"test-plugin\""));
        assert!(json.contains("\"dependencies\":[\"other-plugin\"]"));
    }

    #[test]
    fn test_route_definition_serialization() {
        let route = RouteDefinition {
            method: HttpMethod::Get,
            path: "/api/test".to_string(),
            file_path: None,
            public: Some(true),
            name: Some("Test Route".to_string()),
            is_multipart: None,
        };

        let json = serde_json::to_string(&route).unwrap();
        assert!(json.contains("\"type\":\"GET\""));
        assert!(json.contains("\"path\":\"/api/test\""));
    }
}
```