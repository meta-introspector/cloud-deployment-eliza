# a7046c18:packages_core_rust_src_types_service_interfaces.rs:751-900

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/src/types/service_interfaces.rs:751-900
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    
    /// Go forward
    async fn go_forward(&self) -> Result<(), anyhow::Error>;
    
    /// Refresh
    async fn refresh(&self) -> Result<(), anyhow::Error>;
}

// ============================================================================
// PDF Types
// ============================================================================

/// PDF metadata
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PdfMetadata {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub title: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub author: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub created_at: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub modified_at: Option<String>,
}

/// PDF extraction result
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PdfExtractionResult {
    pub text: String,
    pub page_count: u32,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub metadata: Option<PdfMetadata>,
}

/// PDF margins
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PdfMargins {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub top: Option<f32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub bottom: Option<f32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub left: Option<f32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub right: Option<f32>,
}

/// PDF generation options
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PdfGenerationOptions {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub format: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub orientation: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub margins: Option<PdfMargins>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub header: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub footer: Option<String>,
}

/// PDF conversion options
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PdfConversionOptions {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub quality: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub output_format: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub compression: Option<bool>,
}

/// PDF service trait
#[async_trait]
pub trait PdfService: Service {
    /// Extract text from PDF
    async fn extract_text(&self, pdf: &[u8]) -> Result<PdfExtractionResult, anyhow::Error>;
    
    /// Generate PDF from HTML
    async fn generate_pdf(
        &self,
        html_content: &str,
        options: Option<PdfGenerationOptions>,
    ) -> Result<Vec<u8>, anyhow::Error>;
    
    /// Convert file to PDF
    async fn convert_to_pdf(
        &self,
        file_path: &str,
        options: Option<PdfConversionOptions>,
    ) -> Result<Vec<u8>, anyhow::Error>;
    
    /// Merge PDFs
    async fn merge_pdfs(&self, pdfs: &[&[u8]]) -> Result<Vec<u8>, anyhow::Error>;
    
    /// Split PDF
    async fn split_pdf(&self, pdf: &[u8]) -> Result<Vec<Vec<u8>>, anyhow::Error>;
}

// ============================================================================
// Web Search Types
// ============================================================================

/// Search date range
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SearchDateRange {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub start: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub end: Option<String>,
}

/// Search options
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SearchOptions {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub limit: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub offset: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub language: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub region: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub date_range: Option<SearchDateRange>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub file_type: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub site: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub sort_by: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub safe_search: Option<String>,
}

/// Search result
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SearchResult {
    pub title: String,
    pub url: String,
    pub description: String,
```