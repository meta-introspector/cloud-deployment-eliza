# a7046c18:packages_rust-plugin-starter_src_lib.rs:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/rust-plugin-starter/src/lib.rs:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
//! elizaOS Rust Plugin Starter
//!
//! This is a template for creating elizaOS plugins in Rust that can be loaded by:
//! - TypeScript runtime (via WASM)
//! - Python runtime (via FFI)
//!
//! ## Building for TypeScript (WASM)
//!
//! ```bash
//! cargo build --target wasm32-unknown-unknown --release --features wasm
//! wasm-bindgen target/wasm32-unknown-unknown/release/elizaos_plugin_starter.wasm --out-dir dist
//! ```
//!
//! ## Building for Python (FFI)
//!
//! ```bash
//! cargo build --release --features ffi
//! # The .so/.dylib/.dll will be in target/release/
//! ```

use serde::{Deserialize, Serialize};
use std::collections::HashMap;

// ============================================================================
// Plugin Types
// ============================================================================

/// Memory content from the agent
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct Content {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub actions: Option<Vec<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub source: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub data: Option<HashMap<String, serde_json::Value>>,
}

/// Memory from the agent
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct Memory {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub id: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub agent_id: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub entity_id: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub room_id: Option<String>,
    #[serde(default)]
    pub content: Content,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub created_at: Option<i64>,
}

/// State from the agent
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct State {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text: Option<String>,
    #[serde(default)]
    pub values: HashMap<String, serde_json::Value>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub data: Option<HashMap<String, serde_json::Value>>,
}

/// Action result
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ActionResult {
    pub success: bool,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub error: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub data: Option<HashMap<String, serde_json::Value>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub values: Option<HashMap<String, serde_json::Value>>,
}

impl ActionResult {
    pub fn success() -> Self {
        Self {
            success: true,
            ..Default::default()
        }
    }

    pub fn success_with_text(text: impl Into<String>) -> Self {
        Self {
            success: true,
            text: Some(text.into()),
            ..Default::default()
        }
    }

    pub fn failure(error: impl Into<String>) -> Self {
        Self {
            success: false,
            error: Some(error.into()),
            ..Default::default()
        }
    }
}

/// Provider result
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct ProviderResult {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub values: Option<HashMap<String, serde_json::Value>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub data: Option<HashMap<String, serde_json::Value>>,
}

/// Handler options
#[derive(Debug, Clone, Serialize, Deserialize, Default)]
#[serde(rename_all = "camelCase")]
pub struct HandlerOptions {
    #[serde(flatten)]
    pub extra: HashMap<String, serde_json::Value>,
}

// ============================================================================
// Plugin Implementation
// ============================================================================

/// The main plugin struct
pub struct StarterPlugin {
    config: HashMap<String, String>,
    initialized: bool,
}

impl Default for StarterPlugin {
    fn default() -> Self {
        Self::new()
    }
}

impl StarterPlugin {
    /// Create a new plugin instance
    pub fn new() -> Self {
```