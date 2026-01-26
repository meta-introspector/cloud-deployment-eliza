# a7046c18:packages_core_rust_src_types_service_interfaces.rs:1501-1650

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/src/types/service_interfaces.rs:1501-1650
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    pub username: String,
    pub display_name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub avatar: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub verified: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub follower_count: Option<u64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub following_count: Option<u64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub bio: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub website: Option<String>,
}

/// Post engagement
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PostEngagement {
    pub likes: u64,
    pub shares: u64,
    pub comments: u64,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub views: Option<u64>,
    pub has_liked: bool,
    pub has_shared: bool,
    pub has_commented: bool,
    pub has_saved: bool,
}

/// Link preview
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PostLinkPreview {
    pub url: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub title: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub image: Option<String>,
}

/// Poll option
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PollOption {
    pub text: String,
    pub votes: u64,
}

/// Post poll
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PostPoll {
    pub question: String,
    pub options: Vec<PollOption>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub expires_at: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub multiple_choice: Option<bool>,
}

/// Post content
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PostContent {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub html: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub media: Option<Vec<PostMedia>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub location: Option<PostLocation>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub tags: Option<Vec<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub mentions: Option<Vec<Uuid>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub links: Option<Vec<PostLinkPreview>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub poll: Option<PostPoll>,
}

/// Post thread
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PostThread {
    pub id: Uuid,
    pub position: u32,
    pub total: u32,
}

/// Cross-posted info
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CrossPostedInfo {
    pub platform: String,
    pub platform_id: String,
    pub url: String,
}

/// Post info
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PostInfo {
    pub id: Uuid,
    pub author: PostAuthor,
    pub content: PostContent,
    pub platform: String,
    pub platform_id: String,
    pub url: String,
    pub created_at: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub edited_at: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub scheduled_at: Option<String>,
    pub engagement: PostEngagement,
    pub visibility: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub reply_to: Option<Uuid>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub thread: Option<PostThread>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub cross_posted: Option<Vec<CrossPostedInfo>>,
}

/// Post create options
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PostCreateOptions {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub platforms: Option<Vec<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub scheduled_at: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub visibility: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub reply_to: Option<Uuid>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub thread: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub location: Option<PostLocation>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub tags: Option<Vec<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub mentions: Option<Vec<Uuid>>,
    #[serde(skip_serializing_if = "Option::is_none")]
```