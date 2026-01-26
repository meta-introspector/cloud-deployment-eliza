# a7046c18:packages_core_rust_src_types_model.rs:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/src/types/model.rs:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
//! Model types for elizaOS
//!
//! Contains model types, parameters, and results for AI model interactions.

use serde::{Deserialize, Serialize};

/// Model type names
pub mod model_type {
    /// Small text model (kept for backwards compatibility)
    pub const SMALL: &str = "TEXT_SMALL";
    /// Medium text model (kept for backwards compatibility)
    pub const MEDIUM: &str = "TEXT_LARGE";
    /// Large text model (kept for backwards compatibility)
    pub const LARGE: &str = "TEXT_LARGE";
    /// Small text model
    pub const TEXT_SMALL: &str = "TEXT_SMALL";
    /// Large text model
    pub const TEXT_LARGE: &str = "TEXT_LARGE";
    /// Text embedding model
    pub const TEXT_EMBEDDING: &str = "TEXT_EMBEDDING";
    /// Text tokenizer encode
    pub const TEXT_TOKENIZER_ENCODE: &str = "TEXT_TOKENIZER_ENCODE";
    /// Text tokenizer decode
    pub const TEXT_TOKENIZER_DECODE: &str = "TEXT_TOKENIZER_DECODE";
    /// Small reasoning model
    pub const TEXT_REASONING_SMALL: &str = "REASONING_SMALL";
    /// Large reasoning model
    pub const TEXT_REASONING_LARGE: &str = "REASONING_LARGE";
    /// Text completion model
    pub const TEXT_COMPLETION: &str = "TEXT_COMPLETION";
    /// Image generation model
    pub const IMAGE: &str = "IMAGE";
    /// Image description model
    pub const IMAGE_DESCRIPTION: &str = "IMAGE_DESCRIPTION";
    /// Transcription model
    pub const TRANSCRIPTION: &str = "TRANSCRIPTION";
    /// Text to speech model
    pub const TEXT_TO_SPEECH: &str = "TEXT_TO_SPEECH";
    /// Audio processing model
    pub const AUDIO: &str = "AUDIO";
    /// Video processing model
    pub const VIDEO: &str = "VIDEO";
    /// Small object generation model
    pub const OBJECT_SMALL: &str = "OBJECT_SMALL";
    /// Large object generation model
    pub const OBJECT_LARGE: &str = "OBJECT_LARGE";
}

/// Model settings keys
pub mod model_settings {
    // Default settings
    /// Default maximum tokens setting key
    pub const DEFAULT_MAX_TOKENS: &str = "DEFAULT_MAX_TOKENS";
    /// Default temperature setting key
    pub const DEFAULT_TEMPERATURE: &str = "DEFAULT_TEMPERATURE";
    /// Default top-p setting key
    pub const DEFAULT_TOP_P: &str = "DEFAULT_TOP_P";
    /// Default top-k setting key
    pub const DEFAULT_TOP_K: &str = "DEFAULT_TOP_K";
    /// Default min-p setting key
    pub const DEFAULT_MIN_P: &str = "DEFAULT_MIN_P";
    /// Default seed setting key
    pub const DEFAULT_SEED: &str = "DEFAULT_SEED";
    /// Default repetition penalty setting key
    pub const DEFAULT_REPETITION_PENALTY: &str = "DEFAULT_REPETITION_PENALTY";
    /// Default frequency penalty setting key
    pub const DEFAULT_FREQUENCY_PENALTY: &str = "DEFAULT_FREQUENCY_PENALTY";
    /// Default presence penalty setting key
    pub const DEFAULT_PRESENCE_PENALTY: &str = "DEFAULT_PRESENCE_PENALTY";

    // Legacy keys
    /// Legacy model max token setting key
    pub const MODEL_MAX_TOKEN: &str = "MODEL_MAX_TOKEN";
    /// Legacy model temperature setting key
    pub const MODEL_TEMPERATURE: &str = "MODEL_TEMPERATURE";
    /// Legacy model frequency penalty setting key
    pub const MODEL_FREQ_PENALTY: &str = "MODEL_FREQ_PENALTY";
    /// Legacy model presence penalty setting key
    pub const MODEL_PRESENCE_PENALTY: &str = "MODEL_PRESENCE_PENALTY";
}

/// Parameters for generating text
#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct GenerateTextParams {
    /// The input prompt
    pub prompt: String,
    /// Maximum tokens to generate
    #[serde(skip_serializing_if = "Option::is_none")]
    pub max_tokens: Option<i32>,
    /// Minimum tokens to generate
    #[serde(skip_serializing_if = "Option::is_none")]
    pub min_tokens: Option<i32>,
    /// Temperature for randomness (0.0-1.0)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub temperature: Option<f64>,
    /// Nucleus sampling parameter
    #[serde(skip_serializing_if = "Option::is_none")]
    pub top_p: Option<f64>,
    /// Top-k sampling
    #[serde(skip_serializing_if = "Option::is_none")]
    pub top_k: Option<i32>,
    /// Minimum probability threshold
    #[serde(skip_serializing_if = "Option::is_none")]
    pub min_p: Option<f64>,
    /// Random seed
    #[serde(skip_serializing_if = "Option::is_none")]
    pub seed: Option<i64>,
    /// Repetition penalty
    #[serde(skip_serializing_if = "Option::is_none")]
    pub repetition_penalty: Option<f64>,
    /// Frequency penalty
    #[serde(skip_serializing_if = "Option::is_none")]
    pub frequency_penalty: Option<f64>,
    /// Presence penalty
    #[serde(skip_serializing_if = "Option::is_none")]
    pub presence_penalty: Option<f64>,
    /// Stop sequences
    #[serde(skip_serializing_if = "Option::is_none")]
    pub stop_sequences: Option<Vec<String>>,
    /// User identifier
    #[serde(skip_serializing_if = "Option::is_none")]
    pub user: Option<String>,
    /// Response format
    #[serde(skip_serializing_if = "Option::is_none")]
    pub response_format: Option<ResponseFormat>,
    /// Enable streaming
    #[serde(skip_serializing_if = "Option::is_none")]
    pub stream: Option<bool>,
}

/// Response format specification
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(untagged)]
pub enum ResponseFormat {
    /// Structured format
    Structured {
        /// Format type
        #[serde(rename = "type")]
        format_type: ResponseFormatType,
    },
    /// String format
    String(String),
}

/// Response format type
#[derive(Clone, Debug, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum ResponseFormatType {
    /// JSON object format
```