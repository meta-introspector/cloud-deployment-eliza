# a7046c18:packages_core_rust_src_types_service_interfaces.rs:901-1050

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/src/types/service_interfaces.rs:901-1050
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    #[serde(skip_serializing_if = "Option::is_none")]
    pub display_url: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub thumbnail: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub published_date: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub source: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub relevance_score: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub snippet: Option<String>,
}

/// Search response
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SearchResponse {
    pub query: String,
    pub results: Vec<SearchResult>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub total_results: Option<u64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub search_time: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub suggestions: Option<Vec<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub next_page_token: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub related_searches: Option<Vec<String>>,
}

/// Page info
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PageInfo {
    pub title: String,
    pub description: String,
    pub content: String,
    pub metadata: HashMap<String, String>,
    pub images: Vec<String>,
    pub links: Vec<String>,
}

/// Web search service trait
#[async_trait]
pub trait WebSearchService: Service {
    /// Perform web search
    async fn search(
        &self,
        query: &str,
        options: Option<SearchOptions>,
    ) -> Result<SearchResponse, anyhow::Error>;
    
    /// Search news
    async fn search_news(
        &self,
        query: &str,
        options: Option<SearchOptions>,
    ) -> Result<SearchResponse, anyhow::Error>;
    
    /// Search images
    async fn search_images(
        &self,
        query: &str,
        options: Option<SearchOptions>,
    ) -> Result<SearchResponse, anyhow::Error>;
    
    /// Search videos
    async fn search_videos(
        &self,
        query: &str,
        options: Option<SearchOptions>,
    ) -> Result<SearchResponse, anyhow::Error>;
    
    /// Get suggestions
    async fn get_suggestions(&self, query: &str) -> Result<Vec<String>, anyhow::Error>;
    
    /// Get trending searches
    async fn get_trending_searches(&self, region: Option<&str>) -> Result<Vec<String>, anyhow::Error>;
    
    /// Get page info
    async fn get_page_info(&self, url: &str) -> Result<PageInfo, anyhow::Error>;
}

// ============================================================================
// Email Types
// ============================================================================

/// Email address
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EmailAddress {
    pub email: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub name: Option<String>,
}

/// Email attachment
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EmailAttachment {
    pub filename: String,
    pub content: Vec<u8>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub content_type: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub content_disposition: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub cid: Option<String>,
}

/// Email message
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EmailMessage {
    pub from: EmailAddress,
    pub to: Vec<EmailAddress>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub cc: Option<Vec<EmailAddress>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub bcc: Option<Vec<EmailAddress>>,
    pub subject: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub html: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub attachments: Option<Vec<EmailAttachment>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub reply_to: Option<EmailAddress>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub date: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub message_id: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub references: Option<Vec<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub in_reply_to: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub priority: Option<String>,
}

/// Email send options
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EmailSendOptions {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub retry: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
```