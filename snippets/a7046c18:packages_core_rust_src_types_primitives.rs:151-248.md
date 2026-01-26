# a7046c18:packages_core_rust_src_types_primitives.rs:151-248

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/src/types/primitives.rs:151-248
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    /// Platform native mention
    PlatformMention,
    /// Reply to a message
    Reply,
    /// Thread reply
    Thread,
    /// No mention
    None,
}

/// Represents the content of a memory, message, or other information
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Content {
    /// The agent's internal thought process
    #[serde(skip_serializing_if = "Option::is_none")]
    pub thought: Option<String>,
    /// The main text content visible to users
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text: Option<String>,
    /// Optional actions to be performed
    #[serde(skip_serializing_if = "Option::is_none")]
    pub actions: Option<Vec<String>>,
    /// Optional providers to use for context generation
    #[serde(skip_serializing_if = "Option::is_none")]
    pub providers: Option<Vec<String>>,
    /// Optional source/origin of the content
    #[serde(skip_serializing_if = "Option::is_none")]
    pub source: Option<String>,
    /// Optional target/destination for responses
    #[serde(skip_serializing_if = "Option::is_none")]
    pub target: Option<String>,
    /// URL of the original message/post
    #[serde(skip_serializing_if = "Option::is_none")]
    pub url: Option<String>,
    /// UUID of parent message if this is a reply/thread
    #[serde(skip_serializing_if = "Option::is_none")]
    pub in_reply_to: Option<UUID>,
    /// Array of media attachments
    #[serde(skip_serializing_if = "Option::is_none")]
    pub attachments: Option<Vec<Media>>,
    /// Channel type
    #[serde(skip_serializing_if = "Option::is_none")]
    pub channel_type: Option<super::ChannelType>,
    /// Platform-provided metadata about mentions
    #[serde(skip_serializing_if = "Option::is_none")]
    pub mention_context: Option<MentionContext>,
    /// Internal message ID used for streaming coordination
    #[serde(skip_serializing_if = "Option::is_none")]
    pub response_message_id: Option<UUID>,
    /// Additional dynamic properties
    #[serde(flatten)]
    pub extra: HashMap<String, serde_json::Value>,
}

/// A generic type for metadata objects
pub type Metadata = HashMap<String, serde_json::Value>;

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_uuid_validation() {
        // Valid UUID
        let valid = UUID::new("550e8400-e29b-41d4-a716-446655440000");
        assert!(valid.is_ok());

        // Invalid UUID
        let invalid = UUID::new("not-a-uuid");
        assert!(invalid.is_err());
    }

    #[test]
    fn test_uuid_v4_generation() {
        let uuid = UUID::new_v4();
        assert!(UUID_REGEX.is_match(uuid.as_str()));
    }

    #[test]
    fn test_content_serialization() {
        let content = Content {
            text: Some("Hello, world!".to_string()),
            ..Default::default()
        };

        let json = serde_json::to_string(&content).unwrap();
        assert!(json.contains("\"text\":\"Hello, world!\""));

        // Ensure camelCase
        let content2 = Content {
            in_reply_to: Some(UUID::new_v4()),
            ..Default::default()
        };
        let json2 = serde_json::to_string(&content2).unwrap();
        assert!(json2.contains("\"inReplyTo\""));
    }
}
```