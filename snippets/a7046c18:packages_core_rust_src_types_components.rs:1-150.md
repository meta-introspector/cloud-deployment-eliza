# a7046c18:packages_core_rust_src_types_components.rs:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/src/types/components.rs:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
//! Component types for elizaOS
//!
//! Contains Action, Provider, Evaluator, Handler, and related types.

use async_trait::async_trait;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::future::Future;
use std::pin::Pin;
use std::sync::Arc;

use super::{Content, Memory, State};

/// Example content with associated user for demonstration
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ActionExample {
    /// User associated with the example
    pub name: String,
    /// Content of the example
    pub content: Content,
}

/// Result returned by an action after execution
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ActionResult {
    /// Optional text description of the result
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text: Option<String>,
    /// Values to merge into the state
    #[serde(skip_serializing_if = "Option::is_none")]
    pub values: Option<HashMap<String, serde_json::Value>>,
    /// Data payload containing action-specific results
    #[serde(skip_serializing_if = "Option::is_none")]
    pub data: Option<HashMap<String, serde_json::Value>>,
    /// Whether the action succeeded
    pub success: bool,
    /// Error information if the action failed
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error: Option<String>,
}

impl ActionResult {
    /// Create a successful result
    pub fn success() -> Self {
        ActionResult {
            success: true,
            ..Default::default()
        }
    }

    /// Create a successful result with text
    pub fn success_with_text(text: &str) -> Self {
        ActionResult {
            success: true,
            text: Some(text.to_string()),
            ..Default::default()
        }
    }

    /// Create a failed result
    pub fn failure(error: &str) -> Self {
        ActionResult {
            success: false,
            error: Some(error.to_string()),
            ..Default::default()
        }
    }
}

/// Context provided to actions during execution
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ActionContext {
    /// Results from previously executed actions in this run
    pub previous_results: Vec<ActionResult>,
}

impl ActionContext {
    /// Get a specific previous result by action name
    pub fn get_previous_result(&self, _action_name: &str) -> Option<&ActionResult> {
        // In a real implementation, this would look up by name
        self.previous_results.last()
    }
}

/// Step in an action plan
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ActionPlanStep {
    /// Action name
    pub action: String,
    /// Step status
    pub status: ActionStepStatus,
    /// Error if failed
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error: Option<String>,
    /// Result if completed
    #[serde(skip_serializing_if = "Option::is_none")]
    pub result: Option<ActionResult>,
}

/// Status of an action step
#[derive(Clone, Debug, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum ActionStepStatus {
    /// Not yet started
    Pending,
    /// Successfully completed
    Completed,
    /// Failed to complete
    Failed,
}

/// Multi-step action plan
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ActionPlan {
    /// AI's reasoning for this execution plan
    pub thought: String,
    /// Total number of steps
    pub total_steps: usize,
    /// Current step (1-based)
    pub current_step: usize,
    /// Array of steps
    pub steps: Vec<ActionPlanStep>,
}

/// Options passed to action handlers
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HandlerOptions {
    /// Context with previous action results
    #[serde(skip_serializing_if = "Option::is_none")]
    pub action_context: Option<ActionContext>,
    /// Multi-step action plan
    #[serde(skip_serializing_if = "Option::is_none")]
    pub action_plan: Option<ActionPlan>,
    /// Additional options
    #[serde(flatten)]
    pub extra: HashMap<String, serde_json::Value>,
}

/// Result from a provider
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProviderResult {
    /// Human-readable text for LLM prompt inclusion
    #[serde(skip_serializing_if = "Option::is_none")]
```