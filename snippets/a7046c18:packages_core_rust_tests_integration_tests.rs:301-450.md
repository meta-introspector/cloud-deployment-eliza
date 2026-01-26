# a7046c18:packages_core_rust_tests_integration_tests.rs:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/tests/integration_tests.rs:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
#[async_trait]
impl ActionHandler for SearchAction {
    fn definition(&self) -> ActionDefinition {
        ActionDefinition {
            name: "SEARCH".to_string(),
            description: "Search for information".to_string(),
            similes: Some(vec!["find".to_string(), "lookup".to_string()]),
            examples: None,
        }
    }

    async fn validate(&self, message: &Memory, _state: Option<&State>) -> bool {
        // Validate that the message contains search keywords
        if let Some(text) = &message.content.text {
            text.to_lowercase().contains("search")
                || text.to_lowercase().contains("find")
                || text.to_lowercase().contains("lookup")
        } else {
            false
        }
    }

    async fn handle(
        &self,
        message: &Memory,
        _state: Option<&State>,
        _options: Option<&HandlerOptions>,
    ) -> Result<Option<ActionResult>> {
        let query = message.content.text.as_deref().unwrap_or("");

        Ok(Some(ActionResult {
            success: true,
            text: Some(format!("Search results for: {}", query)),
            data: Some({
                let mut map = HashMap::new();
                map.insert(
                    "results_count".to_string(),
                    serde_json::Value::Number(5.into()),
                );
                map
            }),
            ..Default::default()
        }))
    }
}

// ============================================================================
// Mock Provider Handler - User Context Provider
// ============================================================================

/// Mock provider that provides user context
struct UserContextProvider;

#[async_trait]
impl ProviderHandler for UserContextProvider {
    fn definition(&self) -> ProviderDefinition {
        ProviderDefinition {
            name: "USER_CONTEXT".to_string(),
            description: Some("Provides context about the current user".to_string()),
            dynamic: Some(false),
            position: Some(0),
            private: Some(false),
        }
    }

    async fn get(&self, message: &Memory, _state: &State) -> Result<ProviderResult> {
        Ok(ProviderResult {
            text: Some(format!(
                "User context: Speaking with entity {}",
                message.entity_id
            )),
            values: Some({
                let mut map = HashMap::new();
                map.insert(
                    "entity_id".to_string(),
                    serde_json::Value::String(message.entity_id.to_string()),
                );
                map
            }),
            data: None,
        })
    }
}

// ============================================================================
// Mock Provider Handler - Memory Provider
// ============================================================================

/// Mock provider that provides recent memories
struct MemoryProvider;

#[async_trait]
impl ProviderHandler for MemoryProvider {
    fn definition(&self) -> ProviderDefinition {
        ProviderDefinition {
            name: "MEMORY".to_string(),
            description: Some("Provides recent conversation history".to_string()),
            dynamic: Some(true),
            position: Some(1),
            private: Some(false),
        }
    }

    async fn get(&self, _message: &Memory, _state: &State) -> Result<ProviderResult> {
        Ok(ProviderResult {
            text: Some("Recent memories: [Memory 1] [Memory 2] [Memory 3]".to_string()),
            values: Some({
                let mut map = HashMap::new();
                map.insert(
                    "memory_count".to_string(),
                    serde_json::Value::Number(3.into()),
                );
                map
            }),
            data: None,
        })
    }
}

// ============================================================================
// Mock Evaluator Handler - Response Quality Evaluator
// ============================================================================

/// Mock evaluator that evaluates response quality
struct ResponseQualityEvaluator;

#[async_trait]
impl EvaluatorHandler for ResponseQualityEvaluator {
    fn definition(&self) -> EvaluatorDefinition {
        EvaluatorDefinition {
            name: "RESPONSE_QUALITY".to_string(),
            description: "Evaluates the quality of agent responses".to_string(),
            always_run: Some(true),
            similes: Some(vec!["quality_check".to_string()]),
            examples: vec![EvaluationExample {
                prompt: "Evaluate if the response is helpful".to_string(),
                messages: vec![],
                outcome: "Response is helpful and relevant".to_string(),
            }],
        }
    }

    async fn validate(&self, _message: &Memory, _state: Option<&State>) -> bool {
        true // Always validate for testing
    }

    async fn handle(
        &self,
        _message: &Memory,
        _state: Option<&State>,
```