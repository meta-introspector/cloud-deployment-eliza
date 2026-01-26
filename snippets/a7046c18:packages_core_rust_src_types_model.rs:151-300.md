# a7046c18:packages_core_rust_src_types_model.rs:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/src/types/model.rs:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    JsonObject,
    /// Plain text format
    Text,
}

/// Token usage information
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TokenUsageInfo {
    /// Prompt tokens
    pub prompt_tokens: i32,
    /// Completion tokens
    pub completion_tokens: i32,
    /// Total tokens
    pub total_tokens: i32,
}

/// Text stream chunk
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TextStreamChunk {
    /// Text content
    pub text: String,
    /// Whether this is the final chunk
    pub done: bool,
}

/// Generate text options (simplified API)
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GenerateTextOptions {
    /// Include character personality
    #[serde(skip_serializing_if = "Option::is_none")]
    pub include_character: Option<bool>,
    /// Model type to use
    #[serde(skip_serializing_if = "Option::is_none")]
    pub model_type: Option<String>,
    /// Maximum tokens
    #[serde(skip_serializing_if = "Option::is_none")]
    pub max_tokens: Option<i32>,
    /// Temperature
    #[serde(skip_serializing_if = "Option::is_none")]
    pub temperature: Option<f64>,
}

/// Generate text result
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GenerateTextResult {
    /// Generated text
    pub text: String,
}

/// Text embedding parameters
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TextEmbeddingParams {
    /// Text to embed
    pub text: String,
}

/// Tokenize text parameters
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TokenizeTextParams {
    /// Text to tokenize
    pub prompt: String,
    /// Model type
    pub model_type: String,
}

/// Detokenize text parameters
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DetokenizeTextParams {
    /// Tokens to convert
    pub tokens: Vec<i32>,
    /// Model type
    pub model_type: String,
}

/// Image generation parameters
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ImageGenerationParams {
    /// Prompt describing the image
    pub prompt: String,
    /// Image dimensions
    #[serde(skip_serializing_if = "Option::is_none")]
    pub size: Option<String>,
    /// Number of images
    #[serde(skip_serializing_if = "Option::is_none")]
    pub count: Option<i32>,
}

/// Image description parameters
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ImageDescriptionParams {
    /// Image URL
    pub image_url: String,
    /// Optional guiding prompt
    #[serde(skip_serializing_if = "Option::is_none")]
    pub prompt: Option<String>,
}

/// Image description result
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ImageDescriptionResult {
    /// Image title
    pub title: String,
    /// Image description
    pub description: String,
}

/// Transcription parameters
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TranscriptionParams {
    /// Audio URL
    pub audio_url: String,
    /// Optional guiding prompt
    #[serde(skip_serializing_if = "Option::is_none")]
    pub prompt: Option<String>,
}

/// Text to speech parameters
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TextToSpeechParams {
    /// Text to convert
    pub text: String,
    /// Voice to use
    #[serde(skip_serializing_if = "Option::is_none")]
    pub voice: Option<String>,
    /// Speaking speed
    #[serde(skip_serializing_if = "Option::is_none")]
    pub speed: Option<f64>,
}

/// Object generation parameters
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ObjectGenerationParams {
    /// Prompt describing the object
    pub prompt: String,
    /// JSON schema for validation
    #[serde(skip_serializing_if = "Option::is_none")]
    pub schema: Option<serde_json::Value>,
```