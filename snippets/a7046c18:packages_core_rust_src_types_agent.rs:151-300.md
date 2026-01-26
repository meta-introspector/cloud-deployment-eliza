# a7046c18:packages_core_rust_src_types_agent.rs:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/src/types/agent.rs:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    }

    /// Get the bio as a single string
    pub fn bio_string(&self) -> String {
        match &self.bio {
            Bio::Single(s) => s.clone(),
            Bio::Multiple(v) => v.join("\n"),
        }
    }
}

impl Default for Character {
    fn default() -> Self {
        Character {
            id: None,
            name: "Unnamed Character".to_string(),
            username: None,
            system: None,
            templates: None,
            bio: Bio::Single(String::new()),
            message_examples: None,
            post_examples: None,
            topics: None,
            adjectives: None,
            knowledge: None,
            plugins: None,
            settings: None,
            secrets: None,
            style: None,
        }
    }
}

/// Biography can be a single string or multiple strings
#[derive(Clone, Debug, Serialize)]
#[serde(untagged)]
pub enum Bio {
    /// Single string bio
    Single(String),
    /// Multiple string bio
    Multiple(Vec<String>),
}

fn deserialize_bio<'de, D>(deserializer: D) -> Result<Bio, D::Error>
where
    D: serde::Deserializer<'de>,
{
    use serde::de::Error;

    let value = serde_json::Value::deserialize(deserializer)?;
    match value {
        serde_json::Value::String(s) => Ok(Bio::Single(s)),
        serde_json::Value::Array(arr) => {
            let strings: Result<Vec<String>, _> = arr
                .into_iter()
                .map(|v| {
                    v.as_str()
                        .map(String::from)
                        .ok_or_else(|| D::Error::custom("expected string in bio array"))
                })
                .collect();
            Ok(Bio::Multiple(strings?))
        }
        _ => Err(D::Error::custom("bio must be string or array of strings")),
    }
}

/// Agent status enumeration
#[derive(Clone, Debug, Default, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum AgentStatus {
    /// Agent is active
    #[default]
    Active,
    /// Agent is inactive
    Inactive,
}

/// Represents an operational agent, extending Character with runtime status
#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Agent {
    /// Character configuration
    #[serde(flatten)]
    pub character: Character,
    /// Whether agent is enabled
    #[serde(skip_serializing_if = "Option::is_none")]
    pub enabled: Option<bool>,
    /// Current status
    #[serde(skip_serializing_if = "Option::is_none")]
    pub status: Option<AgentStatus>,
    /// Creation timestamp
    pub created_at: i64,
    /// Last update timestamp
    pub updated_at: i64,
}

impl Agent {
    /// Create a new agent from a character
    pub fn from_character(character: Character) -> Self {
        let now = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap()
            .as_millis() as i64;

        Agent {
            character,
            enabled: Some(true),
            status: Some(AgentStatus::Active),
            created_at: now,
            updated_at: now,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_character_from_json() {
        let json = r#"{
            "name": "TestAgent",
            "bio": "A test agent for testing purposes"
        }"#;

        let character = Character::from_json(json).unwrap();
        assert_eq!(character.name, "TestAgent");
        assert_eq!(character.bio_string(), "A test agent for testing purposes");
    }

    #[test]
    fn test_character_with_array_bio() {
        let json = r#"{
            "name": "TestAgent",
            "bio": ["Line 1", "Line 2", "Line 3"]
        }"#;

        let character = Character::from_json(json).unwrap();
        assert_eq!(character.bio_string(), "Line 1\nLine 2\nLine 3");
    }

    #[test]
    fn test_agent_serialization() {
        let character = Character {
            name: "TestAgent".to_string(),
            bio: Bio::Single("Test bio".to_string()),
            ..Default::default()
        };

```