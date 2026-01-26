# a7046c18:packages_core_rust_src_types_service_interfaces.rs:1051-1200

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/src/types/service_interfaces.rs:1051-1200
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    pub timeout: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub track_opens: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub track_clicks: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub tags: Option<Vec<String>>,
}

/// Email search options
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EmailSearchOptions {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub query: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub from: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub to: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub subject: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub folder: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub since: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub before: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub limit: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub offset: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub unread: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub flagged: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub has_attachments: Option<bool>,
}

/// Email folder
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EmailFolder {
    pub name: String,
    pub path: String,
    #[serde(rename = "type")]
    pub folder_type: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub message_count: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub unread_count: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub children: Option<Vec<EmailFolder>>,
}

/// Email account
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EmailAccount {
    pub email: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub provider: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub folders: Option<Vec<EmailFolder>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub quota_used: Option<u64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub quota_limit: Option<u64>,
}

/// Email service trait
#[async_trait]
pub trait EmailService: Service {
    /// Send email
    async fn send_email(
        &self,
        message: EmailMessage,
        options: Option<EmailSendOptions>,
    ) -> Result<String, anyhow::Error>;
    
    /// Get emails
    async fn get_emails(
        &self,
        options: Option<EmailSearchOptions>,
    ) -> Result<Vec<EmailMessage>, anyhow::Error>;
    
    /// Get email by ID
    async fn get_email(&self, message_id: &str) -> Result<EmailMessage, anyhow::Error>;
    
    /// Delete email
    async fn delete_email(&self, message_id: &str) -> Result<(), anyhow::Error>;
    
    /// Mark email as read
    async fn mark_email_as_read(&self, message_id: &str, read: bool) -> Result<(), anyhow::Error>;
    
    /// Flag email
    async fn flag_email(&self, message_id: &str, flagged: bool) -> Result<(), anyhow::Error>;
    
    /// Move email
    async fn move_email(&self, message_id: &str, folder_path: &str) -> Result<(), anyhow::Error>;
    
    /// Get folders
    async fn get_folders(&self) -> Result<Vec<EmailFolder>, anyhow::Error>;
    
    /// Create folder
    async fn create_folder(
        &self,
        folder_name: &str,
        parent_path: Option<&str>,
    ) -> Result<(), anyhow::Error>;
    
    /// Get account info
    async fn get_account_info(&self) -> Result<EmailAccount, anyhow::Error>;
    
    /// Search emails
    async fn search_emails(
        &self,
        query: &str,
        options: Option<EmailSearchOptions>,
    ) -> Result<Vec<EmailMessage>, anyhow::Error>;
}

// ============================================================================
// Messaging Types
// ============================================================================

/// Message participant
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MessageParticipant {
    pub id: Uuid,
    pub name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub username: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub avatar: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,
}

/// Message attachment
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MessageAttachment {
    pub id: Uuid,
    pub filename: String,
    pub url: String,
    pub mime_type: String,
```