# a7046c18:packages_core_rust_src_types_service_interfaces.rs:601-750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/src/types/service_interfaces.rs:601-750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    pub width: u32,
    pub height: u32,
}

/// Browser navigation options
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BrowserNavigationOptions {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub timeout: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub wait_until: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub viewport: Option<BrowserViewport>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub user_agent: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub headers: Option<HashMap<String, String>>,
}

/// Screenshot clip region
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ScreenshotClip {
    pub x: u32,
    pub y: u32,
    pub width: u32,
    pub height: u32,
}

/// Screenshot options
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ScreenshotOptions {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub full_page: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub clip: Option<ScreenshotClip>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub format: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub quality: Option<u8>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub omit_background: Option<bool>,
}

/// Element selector
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ElementSelector {
    pub selector: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub text: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub timeout: Option<u32>,
}

/// Extracted link
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ExtractedLink {
    pub url: String,
    pub text: String,
}

/// Extracted image
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ExtractedImage {
    pub src: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub alt: Option<String>,
}

/// Extracted content from page
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ExtractedContent {
    pub text: String,
    pub html: String,
    pub links: Vec<ExtractedLink>,
    pub images: Vec<ExtractedImage>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub title: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub metadata: Option<HashMap<String, String>>,
}

/// Click options
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ClickOptions {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub timeout: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub force: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub wait_for_navigation: Option<bool>,
}

/// Type options
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TypeOptions {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub delay: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub timeout: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub clear: Option<bool>,
}

/// Browser service trait
#[async_trait]
pub trait BrowserService: Service {
    /// Navigate to URL
    async fn navigate(
        &self,
        url: &str,
        options: Option<BrowserNavigationOptions>,
    ) -> Result<(), anyhow::Error>;
    
    /// Take screenshot
    async fn screenshot(&self, options: Option<ScreenshotOptions>) -> Result<Vec<u8>, anyhow::Error>;
    
    /// Extract content
    async fn extract_content(&self, selector: Option<&str>) -> Result<ExtractedContent, anyhow::Error>;
    
    /// Click element
    async fn click(&self, selector: &str, options: Option<ClickOptions>) -> Result<(), anyhow::Error>;
    
    /// Type text
    async fn type_text(
        &self,
        selector: &str,
        text: &str,
        options: Option<TypeOptions>,
    ) -> Result<(), anyhow::Error>;
    
    /// Wait for element
    async fn wait_for_element(&self, selector: &str) -> Result<(), anyhow::Error>;
    
    /// Evaluate JavaScript
    async fn evaluate(&self, script: &str) -> Result<serde_json::Value, anyhow::Error>;
    
    /// Get current URL
    async fn get_current_url(&self) -> Result<String, anyhow::Error>;
    
    /// Go back
    async fn go_back(&self) -> Result<(), anyhow::Error>;
```