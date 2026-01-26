# a7046c18:packages_core_rust_src_plugin.rs:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/src/plugin.rs:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
//! Plugin loading and management for elizaOS
//!
//! This module provides functions for loading, validating, and resolving plugin dependencies.

use crate::types::{Plugin, PluginDefinition};
use anyhow::Result;
use std::collections::{HashMap, HashSet};
use tracing::{debug, error, warn};

/// Validate a plugin's structure
///
/// # Arguments
/// * `plugin` - The plugin definition to validate
///
/// # Returns
/// A Result indicating whether the plugin is valid
pub fn validate_plugin(plugin: &PluginDefinition) -> Result<()> {
    if plugin.name.is_empty() {
        anyhow::bail!("Plugin must have a name");
    }

    if plugin.description.is_empty() {
        anyhow::bail!("Plugin must have a description");
    }

    // Validate actions if present
    if let Some(actions) = &plugin.actions {
        for action in actions {
            if action.name.is_empty() {
                anyhow::bail!("Action must have a name");
            }
        }
    }

    // Validate providers if present
    if let Some(providers) = &plugin.providers {
        for provider in providers {
            if provider.name.is_empty() {
                anyhow::bail!("Provider must have a name");
            }
        }
    }

    Ok(())
}

/// Load a plugin by name
///
/// Note: In the Rust implementation, plugins are typically compiled in or loaded
/// via dynamic libraries. This function serves as a placeholder for the plugin
/// loading mechanism.
///
/// # Arguments
/// * `name` - The plugin name to load
///
/// # Returns
/// A Result containing the loaded Plugin or an error
pub fn load_plugin(name: &str) -> Result<Plugin> {
    debug!("Loading plugin: {}", name);

    // In a real implementation, this would:
    // 1. Check if the plugin is already loaded
    // 2. Load the plugin from a dynamic library or registry
    // 3. Validate the plugin
    // 4. Return the plugin

    // For now, return an error indicating the plugin needs to be provided
    anyhow::bail!(
        "Plugin '{}' not found. In Rust, plugins must be compiled in or loaded dynamically.",
        name
    )
}

/// Normalize a plugin name by extracting the short name from scoped packages
///
/// # Examples
/// - `@elizaos/plugin-discord` -> `discord`
/// - `@elizaos/plugin-sql` -> `sql`
/// - `bootstrap` -> `bootstrap`
pub fn normalize_plugin_name(name: &str) -> String {
    // Match patterns like @elizaos/plugin-{name}
    if let Some(captures) = name.strip_prefix("@elizaos/plugin-") {
        return captures.to_string();
    }
    if let Some(captures) = name.strip_prefix("@").and_then(|s| s.split('/').nth(1)) {
        if let Some(short) = captures.strip_prefix("plugin-") {
            return short.to_string();
        }
    }
    name.to_string()
}

/// Resolve plugin dependencies with circular dependency detection
///
/// Performs topological sorting of plugins to ensure dependencies are loaded
/// in the correct order.
///
/// # Arguments
/// * `plugins` - Map of plugin name to Plugin
/// * `is_test_mode` - Whether to include test dependencies
///
/// # Returns
/// Ordered vector of plugins with dependencies resolved
pub fn resolve_plugin_dependencies(
    plugins: &HashMap<String, Plugin>,
    is_test_mode: bool,
) -> Result<Vec<&Plugin>> {
    let mut resolution_order: Vec<String> = Vec::new();
    let mut visited: HashSet<String> = HashSet::new();
    let mut visiting: HashSet<String> = HashSet::new();

    // Build lookup map with multiple name variants
    let mut lookup: HashMap<String, &Plugin> = HashMap::new();
    for (key, plugin) in plugins {
        lookup.insert(key.clone(), plugin);
        lookup.insert(plugin.definition.name.clone(), plugin);
        let normalized = normalize_plugin_name(key);
        if normalized != *key {
            lookup.insert(normalized, plugin);
        }
    }

    fn visit(
        name: &str,
        lookup: &HashMap<String, &Plugin>,
        visited: &mut HashSet<String>,
        visiting: &mut HashSet<String>,
        resolution_order: &mut Vec<String>,
        is_test_mode: bool,
    ) -> Result<()> {
        let plugin = match lookup.get(name) {
            Some(p) => p,
            None => {
                let normalized = normalize_plugin_name(name);
                match lookup.get(&normalized) {
                    Some(p) => p,
                    None => {
                        warn!("Plugin dependency not found: {}", name);
                        return Ok(());
                    }
                }
            }
        };

        let canonical_name = &plugin.definition.name;

        if visited.contains(canonical_name) {
            return Ok(());
        }

```