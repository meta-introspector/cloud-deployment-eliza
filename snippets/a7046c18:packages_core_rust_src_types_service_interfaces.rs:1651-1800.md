# a7046c18:packages_core_rust_src_types_service_interfaces.rs:1651-1800

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/src/types/service_interfaces.rs:1651-1800
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    pub enable_comments: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub enable_sharing: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub content_warning: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub sensitive: Option<bool>,
}

/// Post search options
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PostSearchOptions {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub query: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub author: Option<Uuid>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub platform: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub tags: Option<Vec<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub mentions: Option<Vec<Uuid>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub since: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub before: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub limit: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub offset: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub has_media: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub has_location: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub visibility: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub sort_by: Option<String>,
}

/// Demographics data
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DemographicsData {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub age: Option<HashMap<String, u64>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub gender: Option<HashMap<String, u64>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub location: Option<HashMap<String, u64>>,
}

/// Performing hour
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PerformingHour {
    pub hour: u32,
    pub engagement: u64,
}

/// Post analytics
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PostAnalytics {
    pub post_id: Uuid,
    pub platform: String,
    pub impressions: u64,
    pub reach: u64,
    pub engagement: PostEngagement,
    pub clicks: u64,
    pub shares: u64,
    pub saves: u64,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub demographics: Option<DemographicsData>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub top_performing_hours: Option<Vec<PerformingHour>>,
}

/// Post service trait
#[async_trait]
pub trait PostService: Service {
    /// Create post
    async fn create_post(
        &self,
        content: PostContent,
        options: Option<PostCreateOptions>,
    ) -> Result<Uuid, anyhow::Error>;

    /// Get posts
    async fn get_posts(
        &self,
        options: Option<PostSearchOptions>,
    ) -> Result<Vec<PostInfo>, anyhow::Error>;

    /// Get post by ID
    async fn get_post(&self, post_id: &Uuid) -> Result<PostInfo, anyhow::Error>;

    /// Edit post
    async fn edit_post(&self, post_id: &Uuid, content: PostContent) -> Result<(), anyhow::Error>;

    /// Delete post
    async fn delete_post(&self, post_id: &Uuid) -> Result<(), anyhow::Error>;

    /// Like/unlike post
    async fn like_post(&self, post_id: &Uuid, like: bool) -> Result<(), anyhow::Error>;

    /// Share post
    async fn share_post(
        &self,
        post_id: &Uuid,
        comment: Option<&str>,
    ) -> Result<Uuid, anyhow::Error>;

    /// Save/unsave post
    async fn save_post(&self, post_id: &Uuid, save: bool) -> Result<(), anyhow::Error>;

    /// Comment on post
    async fn comment_on_post(
        &self,
        post_id: &Uuid,
        content: PostContent,
    ) -> Result<Uuid, anyhow::Error>;

    /// Get comments
    async fn get_comments(
        &self,
        post_id: &Uuid,
        options: Option<PostSearchOptions>,
    ) -> Result<Vec<PostInfo>, anyhow::Error>;

    /// Schedule post
    async fn schedule_post(
        &self,
        content: PostContent,
        scheduled_at: &str,
        options: Option<PostCreateOptions>,
    ) -> Result<Uuid, anyhow::Error>;

    /// Get post analytics
    async fn get_post_analytics(&self, post_id: &Uuid) -> Result<PostAnalytics, anyhow::Error>;

    /// Get trending posts
    async fn get_trending_posts(
        &self,
        options: Option<PostSearchOptions>,
    ) -> Result<Vec<PostInfo>, anyhow::Error>;

    /// Search posts
    async fn search_posts(
```