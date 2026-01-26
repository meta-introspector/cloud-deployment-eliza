# a7046c18:packages_core_rust_src_types_model.rs:301-371

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/src/types/model.rs:301-371
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    /// Output type
    #[serde(skip_serializing_if = "Option::is_none")]
    pub output: Option<ObjectOutputType>,
    /// Enum values (for enum output type)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub enum_values: Option<Vec<String>>,
    /// Model type
    #[serde(skip_serializing_if = "Option::is_none")]
    pub model_type: Option<String>,
    /// Temperature
    #[serde(skip_serializing_if = "Option::is_none")]
    pub temperature: Option<f64>,
    /// Stop sequences
    #[serde(skip_serializing_if = "Option::is_none")]
    pub stop_sequences: Option<Vec<String>>,
}

/// Object output type
#[derive(Clone, Debug, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum ObjectOutputType {
    /// Object output
    Object,
    /// Array output
    Array,
    /// Enum output
    Enum,
}

/// Model handler registration
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ModelHandlerInfo {
    /// Provider name
    pub provider: String,
    /// Priority (higher = preferred)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub priority: Option<i32>,
    /// Registration order
    #[serde(skip_serializing_if = "Option::is_none")]
    pub registration_order: Option<i32>,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_generate_text_params_serialization() {
        let params = GenerateTextParams {
            prompt: "Hello, world!".to_string(),
            temperature: Some(0.7),
            max_tokens: Some(100),
            ..Default::default()
        };

        let json = serde_json::to_string(&params).unwrap();
        assert!(json.contains("\"prompt\":\"Hello, world!\""));
        assert!(json.contains("\"temperature\":0.7"));
        assert!(json.contains("\"maxTokens\":100"));
    }

    #[test]
    fn test_response_format_serialization() {
        let format = ResponseFormat::Structured {
            format_type: ResponseFormatType::JsonObject,
        };
        let json = serde_json::to_string(&format).unwrap();
        assert!(json.contains("\"type\":\"json_object\""));
    }
}
```