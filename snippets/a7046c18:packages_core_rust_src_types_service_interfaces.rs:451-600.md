# a7046c18:packages_core_rust_src_types_service_interfaces.rs:451-600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/src/types/service_interfaces.rs:451-600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    /// Get supported languages
    async fn get_supported_languages(&self) -> Result<Vec<String>, anyhow::Error>;
    
    /// Get available voices
    async fn get_available_voices(&self) -> Result<Vec<VoiceInfo>, anyhow::Error>;
    
    /// Detect language
    async fn detect_language(&self, audio: &[u8]) -> Result<String, anyhow::Error>;
}

// ============================================================================
// Video Types
// ============================================================================

/// Video format information
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VideoFormat {
    pub format_id: String,
    pub url: String,
    pub extension: String,
    pub quality: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub file_size: Option<u64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub video_codec: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub audio_codec: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub resolution: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub fps: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub bitrate: Option<u32>,
}

/// Video information
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VideoInfo {
    pub url: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub title: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub duration: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub thumbnail: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub uploader: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub view_count: Option<u64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub upload_date: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub formats: Option<Vec<VideoFormat>>,
}

/// Video download options
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VideoDownloadOptions {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub format: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub quality: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub output_path: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub audio_only: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub video_only: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub subtitles: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub embed_subs: Option<bool>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub write_info_json: Option<bool>,
}

/// Video processing options
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VideoProcessingOptions {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub start_time: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub end_time: Option<f64>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub output_format: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub resolution: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub bitrate: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub framerate: Option<u32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub audio_codec: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub video_codec: Option<String>,
}

/// Video service trait
#[async_trait]
pub trait VideoService: Service {
    /// Get video info
    async fn get_video_info(&self, url: &str) -> Result<VideoInfo, anyhow::Error>;
    
    /// Download video
    async fn download_video(
        &self,
        url: &str,
        options: Option<VideoDownloadOptions>,
    ) -> Result<String, anyhow::Error>;
    
    /// Extract audio
    async fn extract_audio(
        &self,
        video_path: &str,
        output_path: Option<&str>,
    ) -> Result<String, anyhow::Error>;
    
    /// Get thumbnail
    async fn get_thumbnail(
        &self,
        video_path: &str,
        timestamp: Option<f64>,
    ) -> Result<String, anyhow::Error>;
    
    /// Convert video
    async fn convert_video(
        &self,
        video_path: &str,
        output_path: &str,
        options: Option<VideoProcessingOptions>,
    ) -> Result<String, anyhow::Error>;
    
    /// Get available formats
    async fn get_available_formats(&self, url: &str) -> Result<Vec<VideoFormat>, anyhow::Error>;
}

// ============================================================================
// Browser Types
// ============================================================================

/// Browser viewport
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BrowserViewport {
```