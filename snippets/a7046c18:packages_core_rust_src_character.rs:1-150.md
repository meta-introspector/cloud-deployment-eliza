# a7046c18:packages_core_rust_src_character.rs:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/src/character.rs:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
//! Character parsing and validation for elizaOS
//!
//! This module provides functions for loading, parsing, and validating character files.

use crate::types::{Bio, Character, CharacterSettings};
use anyhow::{Context, Result};
use std::collections::HashMap;

/// Parse a character from a JSON string
///
/// # Arguments
/// * `json` - JSON string containing character data
///
/// # Returns
/// A Result containing the parsed Character or an error
///
/// # Example
/// ```rust
/// use elizaos_core::parse_character;
///
/// let json = r#"{"name": "TestAgent", "bio": "A test agent"}"#;
/// let character = parse_character(json).unwrap();
/// assert_eq!(character.name, "TestAgent");
/// ```
pub fn parse_character(json: &str) -> Result<Character> {
    serde_json::from_str(json).context("Failed to parse character JSON")
}

/// Validate a character configuration
///
/// # Arguments
/// * `character` - The character to validate
///
/// # Returns
/// A Result with validation errors if any
pub fn validate_character(character: &Character) -> Result<()> {
    // Validate name
    if character.name.is_empty() {
        anyhow::bail!("Character name is required");
    }

    // Validate bio
    let bio_str = match &character.bio {
        Bio::Single(s) => s.clone(),
        Bio::Multiple(v) => v.join(" "),
    };
    if bio_str.is_empty() {
        anyhow::bail!("Character bio is required");
    }

    // Validate plugins if present
    if let Some(plugins) = &character.plugins {
        for plugin in plugins {
            if plugin.is_empty() {
                anyhow::bail!("Empty plugin name in plugins list");
            }
        }
    }

    Ok(())
}

/// Merge character with default values
///
/// # Arguments
/// * `character` - Partial character configuration
///
/// # Returns
/// Complete character with defaults applied
pub fn merge_character_defaults(mut character: Character) -> Character {
    // Apply defaults
    if character.settings.is_none() {
        character.settings = Some(CharacterSettings::default());
    }

    if character.plugins.is_none() {
        character.plugins = Some(vec![]);
    }

    // Ensure bio is not empty
    match &character.bio {
        Bio::Single(s) if s.is_empty() => {
            character.bio = Bio::Single("An AI assistant.".to_string());
        }
        Bio::Multiple(v) if v.is_empty() => {
            character.bio = Bio::Multiple(vec!["An AI assistant.".to_string()]);
        }
        _ => {}
    }

    character
}

/// Build character plugins based on environment variables
///
/// This function determines which plugins to load based on available API keys
/// and configuration in the environment.
///
/// # Arguments
/// * `env` - Environment variables map
///
/// # Returns
/// Ordered array of plugin names to load
pub fn build_character_plugins(env: &HashMap<String, String>) -> Vec<String> {
    let mut plugins = Vec::new();

    // Check if elizaOS Cloud is configured
    let use_eliza_cloud = env
        .get("ELIZAOS_CLOUD_API_KEY")
        .map(|s| !s.trim().is_empty())
        .unwrap_or(false)
        || env
            .get("ELIZAOS_CLOUD_DATABASE")
            .map(|s| s == "true")
            .unwrap_or(false);

    // Core plugins
    if use_eliza_cloud {
        plugins.push("@elizaos/plugin-elizacloud".to_string());
    } else {
        plugins.push("@elizaos/plugin-sql".to_string());
    }

    // Text-only LLM plugins (skip if using cloud)
    if !use_eliza_cloud {
        if env
            .get("ANTHROPIC_API_KEY")
            .map(|s| !s.trim().is_empty())
            .unwrap_or(false)
        {
            plugins.push("@elizaos/plugin-anthropic".to_string());
        }
        if env
            .get("OPENROUTER_API_KEY")
            .map(|s| !s.trim().is_empty())
            .unwrap_or(false)
        {
            plugins.push("@elizaos/plugin-openrouter".to_string());
        }
    }

    // Embedding-capable plugins (skip if using cloud)
    if !use_eliza_cloud {
        if env
            .get("OPENAI_API_KEY")
            .map(|s| !s.trim().is_empty())
            .unwrap_or(false)
        {
            plugins.push("@elizaos/plugin-openai".to_string());
        }
```