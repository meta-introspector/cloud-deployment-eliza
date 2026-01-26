# a7046c18:packages_core_rust_src_types_service_interfaces.rs:1351-1500

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/src/types/service_interfaces.rs:1351-1500
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
}

/// Channel permissions
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ChannelPermissions {
    pub can_send: bool,
    pub can_read: bool,
    pub can_delete: bool,
    pub can_pin: bool,
    pub can_manage: bool,
}

/// Message channel
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MessageChannel {
    pub id: Uuid,
    pub name: String,
    #[serde(rename = "type")]
    pub channel_type: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub participants: Option<Vec<MessageParticipant>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub permissions: Option<ChannelPermissions>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub last_message_at: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub message_count: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub unread_count: Option<u32>,
}

/// Messaging service trait
#[async_trait]
pub trait MessagingService: Service {
    /// Send message
    async fn send_message(
        &self,
        channel_id: &Uuid,
        content: MessageContent,
        options: Option<MessageSendOptions>,
    ) -> Result<Uuid, anyhow::Error>;

    /// Get messages
    async fn get_messages(
        &self,
        channel_id: &Uuid,
        options: Option<MessageSearchOptions>,
    ) -> Result<Vec<MessageInfo>, anyhow::Error>;

    /// Get message by ID
    async fn get_message(&self, message_id: &Uuid) -> Result<MessageInfo, anyhow::Error>;

    /// Edit message
    async fn edit_message(
        &self,
        message_id: &Uuid,
        content: MessageContent,
    ) -> Result<(), anyhow::Error>;

    /// Delete message
    async fn delete_message(&self, message_id: &Uuid) -> Result<(), anyhow::Error>;

    /// Add reaction
    async fn add_reaction(&self, message_id: &Uuid, emoji: &str) -> Result<(), anyhow::Error>;

    /// Remove reaction
    async fn remove_reaction(&self, message_id: &Uuid, emoji: &str) -> Result<(), anyhow::Error>;

    /// Pin message
    async fn pin_message(&self, message_id: &Uuid) -> Result<(), anyhow::Error>;

    /// Unpin message
    async fn unpin_message(&self, message_id: &Uuid) -> Result<(), anyhow::Error>;

    /// Get channels
    async fn get_channels(&self) -> Result<Vec<MessageChannel>, anyhow::Error>;

    /// Get channel by ID
    async fn get_channel(&self, channel_id: &Uuid) -> Result<MessageChannel, anyhow::Error>;

    /// Create channel
    async fn create_channel(
        &self,
        name: &str,
        channel_type: &str,
        description: Option<&str>,
        participants: Option<&[Uuid]>,
        private: Option<bool>,
    ) -> Result<Uuid, anyhow::Error>;

    /// Search messages
    async fn search_messages(
        &self,
        query: &str,
        options: Option<MessageSearchOptions>,
    ) -> Result<Vec<MessageInfo>, anyhow::Error>;
}

// ============================================================================
// Post/Social Media Types
// ============================================================================

/// Post media
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PostMedia {
    pub id: Uuid,
    pub url: String,
    #[serde(rename = "type")]
    pub media_type: String,
    pub mime_type: String,
    pub size: u64,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub width: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub height: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub duration: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub thumbnail: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub alt_text: Option<String>,
}

/// Post location
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PostLocation {
    pub name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub address: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub latitude: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub longitude: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub place_id: Option<String>,
}

/// Post author
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PostAuthor {
    pub id: Uuid,
```