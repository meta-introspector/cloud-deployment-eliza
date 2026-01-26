# a7046c18:packages_core_interop_rust_wasm_plugin.rs:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/interop/rust/wasm_plugin.rs:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
//! WASM Plugin Bindings for elizaOS
//!
//! This module provides WASM-specific bindings for creating plugins that can be
//! loaded by the TypeScript runtime.
//!
//! # Example
//!
//! ```rust,ignore
//! use elizaos_core::interop::wasm_plugin::*;
//! use elizaos_core::types::*;
//!
//! // Define your plugin
//! struct MyPlugin;
//!
//! impl WasmPlugin for MyPlugin {
//!     fn manifest(&self) -> PluginManifest {
//!         PluginManifest {
//!             name: "my-plugin".to_string(),
//!             description: "A WASM plugin".to_string(),
//!             ..Default::default()
//!         }
//!     }
//!
//!     fn init(&mut self, config: &str) -> Result<(), String> {
//!         Ok(())
//!     }
//!
//!     // ... implement other methods ...
//! }
//!
//! // Export the plugin
//! elizaos_wasm_plugin!(MyPlugin::new());
//! ```

#![cfg(feature = "wasm")]

use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::Mutex;
use wasm_bindgen::prelude::*;

/// Plugin manifest for WASM export
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PluginManifest {
    pub name: String,
    pub description: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub version: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub config: Option<HashMap<String, serde_json::Value>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub dependencies: Option<Vec<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub actions: Option<Vec<ActionManifest>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub providers: Option<Vec<ProviderManifest>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub evaluators: Option<Vec<EvaluatorManifest>>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ActionManifest {
    pub name: String,
    pub description: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub similes: Option<Vec<String>>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProviderManifest {
    pub name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub dynamic: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub position: Option<i32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub private: Option<bool>,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EvaluatorManifest {
    pub name: String,
    pub description: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub always_run: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub similes: Option<Vec<String>>,
}

/// Action result for WASM
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
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
        ActionResult {
            success: true,
            ..Default::default()
        }
    }

    pub fn success_with_text(text: &str) -> Self {
        ActionResult {
            success: true,
            text: Some(text.to_string()),
            ..Default::default()
        }
    }

    pub fn failure(error: &str) -> Self {
        ActionResult {
            success: false,
            error: Some(error.to_string()),
            ..Default::default()
        }
    }
}

/// Provider result for WASM
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProviderResult {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub values: Option<HashMap<String, serde_json::Value>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub data: Option<HashMap<String, serde_json::Value>>,
}

/// Trait for WASM-exportable plugins
pub trait WasmPlugin: Send + Sync {
    /// Get the plugin manifest
```