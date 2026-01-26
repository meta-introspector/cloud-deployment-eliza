# a7046c18:packages_core_rust_src_types_agent.rs:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/src/types/agent.rs:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
//! Agent and Character types for elizaOS
//!
//! Contains Character, Agent, and related configuration types.

use super::{Content, UUID};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

/// Example message for demonstration
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MessageExample {
    /// Associated user name
    pub name: String,
    /// Message content
    pub content: Content,
}

/// Template type - can be a string or a function (represented as string in JSON)
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(untagged)]
pub enum TemplateType {
    /// Simple string template
    String(String),
    /// Template with state interpolation (stored as string)
    Function(String),
}

/// Directory item for knowledge loading
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DirectoryItem {
    /// Path to the directory
    pub directory: String,
    /// Whether to load recursively
    #[serde(skip_serializing_if = "Option::is_none")]
    pub recursive: Option<bool>,
    /// File extensions to include
    #[serde(skip_serializing_if = "Option::is_none")]
    pub extensions: Option<Vec<String>>,
}

/// Knowledge item - can be a string path or structured item
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(untagged)]
pub enum KnowledgeItem {
    /// Simple path string
    Path(String),
    /// Path with shared flag
    PathWithShared {
        /// Path to knowledge file
        path: String,
        /// Whether knowledge is shared
        #[serde(skip_serializing_if = "Option::is_none")]
        shared: Option<bool>,
    },
    /// Directory item
    Directory(DirectoryItem),
}

/// Style configuration for the character
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct StyleConfig {
    /// Style guidelines for all contexts
    #[serde(skip_serializing_if = "Option::is_none")]
    pub all: Option<Vec<String>>,
    /// Style guidelines for chat
    #[serde(skip_serializing_if = "Option::is_none")]
    pub chat: Option<Vec<String>>,
    /// Style guidelines for posts
    #[serde(skip_serializing_if = "Option::is_none")]
    pub post: Option<Vec<String>>,
}

/// Character settings
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
pub struct CharacterSettings {
    /// Settings values
    #[serde(flatten)]
    pub values: HashMap<String, serde_json::Value>,
}

/// Character secrets
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
pub struct CharacterSecrets {
    /// Secret values
    #[serde(flatten)]
    pub values: HashMap<String, serde_json::Value>,
}

/// Configuration for an agent's character
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Character {
    /// Optional unique identifier
    #[serde(skip_serializing_if = "Option::is_none")]
    pub id: Option<UUID>,
    /// Character name
    pub name: String,
    /// Optional username
    #[serde(skip_serializing_if = "Option::is_none")]
    pub username: Option<String>,
    /// Optional system prompt
    #[serde(skip_serializing_if = "Option::is_none")]
    pub system: Option<String>,
    /// Optional prompt templates
    #[serde(skip_serializing_if = "Option::is_none")]
    pub templates: Option<HashMap<String, TemplateType>>,
    /// Character biography (can be string or array)
    #[serde(deserialize_with = "deserialize_bio")]
    pub bio: Bio,
    /// Example messages
    #[serde(skip_serializing_if = "Option::is_none")]
    pub message_examples: Option<Vec<Vec<MessageExample>>>,
    /// Example posts
    #[serde(skip_serializing_if = "Option::is_none")]
    pub post_examples: Option<Vec<String>>,
    /// Known topics
    #[serde(skip_serializing_if = "Option::is_none")]
    pub topics: Option<Vec<String>>,
    /// Character traits
    #[serde(skip_serializing_if = "Option::is_none")]
    pub adjectives: Option<Vec<String>>,
    /// Optional knowledge base
    #[serde(skip_serializing_if = "Option::is_none")]
    pub knowledge: Option<Vec<KnowledgeItem>>,
    /// Available plugins
    #[serde(skip_serializing_if = "Option::is_none")]
    pub plugins: Option<Vec<String>>,
    /// Optional configuration
    #[serde(skip_serializing_if = "Option::is_none")]
    pub settings: Option<CharacterSettings>,
    /// Optional secrets
    #[serde(skip_serializing_if = "Option::is_none")]
    pub secrets: Option<CharacterSecrets>,
    /// Writing style guides
    #[serde(skip_serializing_if = "Option::is_none")]
    pub style: Option<StyleConfig>,
}

impl Character {
    /// Parse a character from JSON string
    pub fn from_json(json: &str) -> Result<Self, serde_json::Error> {
        serde_json::from_str(json)
    }

    /// Serialize character to JSON string
    pub fn to_json(&self) -> Result<String, serde_json::Error> {
        serde_json::to_string(self)
```