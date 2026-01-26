# a7046c18:packages_core_rust_src_types_primitives.rs:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/src/types/primitives.rs:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
//! Primitive types for elizaOS
//!
//! Contains UUID, Content, Media, and other fundamental types.

use lazy_static::lazy_static;
use regex::Regex;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::fmt;
use thiserror::Error;

lazy_static! {
    static ref UUID_REGEX: Regex =
        Regex::new(r"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$").unwrap();
}

/// Error type for UUID operations
#[derive(Error, Debug)]
pub enum UUIDError {
    /// Invalid UUID format
    #[error("Invalid UUID format: {0}")]
    InvalidFormat(String),
}

/// A universally unique identifier (UUID) type
///
/// This type wraps a String and validates that it conforms to the UUID format.
/// It serializes transparently as a string in JSON.
#[derive(Clone, Debug, PartialEq, Eq, Hash, Serialize, Deserialize)]
#[serde(transparent)]
pub struct UUID(String);

impl UUID {
    /// Create a new UUID from a string, validating the format
    pub fn new(id: &str) -> Result<Self, UUIDError> {
        if !UUID_REGEX.is_match(&id.to_lowercase()) {
            return Err(UUIDError::InvalidFormat(id.to_string()));
        }
        Ok(UUID(id.to_lowercase()))
    }

    /// Create a new random UUID (v4)
    pub fn new_v4() -> Self {
        UUID(uuid::Uuid::new_v4().to_string())
    }

    /// Get the string representation
    pub fn as_str(&self) -> &str {
        &self.0
    }

    /// Convert to owned String
    pub fn into_string(self) -> String {
        self.0
    }
}

impl fmt::Display for UUID {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{}", self.0)
    }
}

impl TryFrom<&str> for UUID {
    type Error = UUIDError;

    fn try_from(value: &str) -> Result<Self, Self::Error> {
        UUID::new(value)
    }
}

impl TryFrom<String> for UUID {
    type Error = UUIDError;

    fn try_from(value: String) -> Result<Self, Self::Error> {
        UUID::new(&value)
    }
}

impl From<uuid::Uuid> for UUID {
    fn from(value: uuid::Uuid) -> Self {
        UUID(value.to_string())
    }
}

/// Helper function to safely cast a string to strongly typed UUID
pub fn as_uuid(id: &str) -> Result<UUID, UUIDError> {
    UUID::new(id)
}

/// Content type enumeration for media
#[derive(Clone, Debug, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum ContentType {
    /// Image content
    Image,
    /// Video content
    Video,
    /// Audio content
    Audio,
    /// Document content
    Document,
    /// Link content
    Link,
}

/// Represents a media attachment
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Media {
    /// Unique identifier
    pub id: String,
    /// Media URL
    pub url: String,
    /// Media title
    #[serde(skip_serializing_if = "Option::is_none")]
    pub title: Option<String>,
    /// Media source
    #[serde(skip_serializing_if = "Option::is_none")]
    pub source: Option<String>,
    /// Media description
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    /// Text content
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text: Option<String>,
    /// Content type
    #[serde(skip_serializing_if = "Option::is_none")]
    pub content_type: Option<ContentType>,
}

/// Platform-provided metadata about mentions
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MentionContext {
    /// Platform native mention (@Discord, @Telegram, etc.)
    pub is_mention: bool,
    /// Reply to agent's message
    pub is_reply: bool,
    /// In a thread with agent
    pub is_thread: bool,
    /// Platform-specific mention type for debugging/logging
    #[serde(skip_serializing_if = "Option::is_none")]
    pub mention_type: Option<MentionType>,
}

/// Types of mentions
#[derive(Clone, Debug, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum MentionType {
```