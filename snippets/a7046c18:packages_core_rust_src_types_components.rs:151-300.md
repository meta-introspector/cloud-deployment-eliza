# a7046c18:packages_core_rust_src_types_components.rs:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/src/types/components.rs:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    pub text: Option<String>,
    /// Key-value pairs for template variable substitution
    #[serde(skip_serializing_if = "Option::is_none")]
    pub values: Option<HashMap<String, serde_json::Value>>,
    /// Structured data for programmatic access
    #[serde(skip_serializing_if = "Option::is_none")]
    pub data: Option<HashMap<String, serde_json::Value>>,
}

/// Example for evaluating agent behavior
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EvaluationExample {
    /// Evaluation context
    pub prompt: String,
    /// Example messages
    pub messages: Vec<ActionExample>,
    /// Expected outcome
    pub outcome: String,
}

// Type aliases for handler functions (these will be trait objects in practice)
/// Handler callback function type
pub type HandlerCallback =
    Arc<dyn Fn(Content) -> Pin<Box<dyn Future<Output = Vec<Memory>> + Send>> + Send + Sync>;

/// Action definition for serialization
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ActionDefinition {
    /// Action name
    pub name: String,
    /// Detailed description
    pub description: String,
    /// Similar action descriptions
    #[serde(skip_serializing_if = "Option::is_none")]
    pub similes: Option<Vec<String>>,
    /// Example usages
    #[serde(skip_serializing_if = "Option::is_none")]
    pub examples: Option<Vec<Vec<ActionExample>>>,
}

/// Provider definition for serialization
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProviderDefinition {
    /// Provider name
    pub name: String,
    /// Provider description
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    /// Whether the provider is dynamic
    #[serde(skip_serializing_if = "Option::is_none")]
    pub dynamic: Option<bool>,
    /// Position in provider list
    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<i32>,
    /// Whether the provider is private
    #[serde(skip_serializing_if = "Option::is_none")]
    pub private: Option<bool>,
}

/// Evaluator definition for serialization
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EvaluatorDefinition {
    /// Evaluator name
    pub name: String,
    /// Detailed description
    pub description: String,
    /// Whether to always run
    #[serde(skip_serializing_if = "Option::is_none")]
    pub always_run: Option<bool>,
    /// Similar evaluator descriptions
    #[serde(skip_serializing_if = "Option::is_none")]
    pub similes: Option<Vec<String>>,
    /// Example evaluations
    pub examples: Vec<EvaluationExample>,
}

/// Trait for action handlers
#[async_trait]
pub trait ActionHandler: Send + Sync {
    /// Get the action definition
    fn definition(&self) -> ActionDefinition;

    /// Validate if the action should run
    async fn validate(&self, message: &Memory, state: Option<&State>) -> bool;

    /// Execute the action
    async fn handle(
        &self,
        message: &Memory,
        state: Option<&State>,
        options: Option<&HandlerOptions>,
    ) -> Result<Option<ActionResult>, anyhow::Error>;
}

/// Trait for provider handlers
#[async_trait]
pub trait ProviderHandler: Send + Sync {
    /// Get the provider definition
    fn definition(&self) -> ProviderDefinition;

    /// Get provider data
    async fn get(&self, message: &Memory, state: &State) -> Result<ProviderResult, anyhow::Error>;
}

/// Trait for evaluator handlers
#[async_trait]
pub trait EvaluatorHandler: Send + Sync {
    /// Get the evaluator definition
    fn definition(&self) -> EvaluatorDefinition;

    /// Validate if the evaluator should run
    async fn validate(&self, message: &Memory, state: Option<&State>) -> bool;

    /// Execute the evaluator
    async fn handle(
        &self,
        message: &Memory,
        state: Option<&State>,
    ) -> Result<Option<ActionResult>, anyhow::Error>;
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_action_result_serialization() {
        let result = ActionResult::success_with_text("Done!");
        let json = serde_json::to_string(&result).unwrap();

        assert!(json.contains("\"success\":true"));
        assert!(json.contains("\"text\":\"Done!\""));
    }

    #[test]
    fn test_action_definition_serialization() {
        let action = ActionDefinition {
            name: "test_action".to_string(),
            description: "A test action".to_string(),
            similes: Some(vec!["similar action".to_string()]),
            examples: None,
        };

        let json = serde_json::to_string(&action).unwrap();
        assert!(json.contains("\"name\":\"test_action\""));
    }
```