# a7046c18:packages_core_rust_src_character.rs:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/src/character.rs:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        if env
            .get("GOOGLE_GENERATIVE_AI_API_KEY")
            .map(|s| !s.trim().is_empty())
            .unwrap_or(false)
        {
            plugins.push("@elizaos/plugin-google-genai".to_string());
        }
    }

    // Platform plugins
    if env
        .get("DISCORD_API_TOKEN")
        .map(|s| !s.trim().is_empty())
        .unwrap_or(false)
    {
        plugins.push("@elizaos/plugin-discord".to_string());
    }
    if has_twitter_config(env) {
        plugins.push("@elizaos/plugin-twitter".to_string());
    }
    if env
        .get("TELEGRAM_BOT_TOKEN")
        .map(|s| !s.trim().is_empty())
        .unwrap_or(false)
    {
        plugins.push("@elizaos/plugin-telegram".to_string());
    }

    // Bootstrap plugin (unless disabled)
    let ignore_bootstrap = env
        .get("IGNORE_BOOTSTRAP")
        .map(|s| {
            let s = s.trim().to_lowercase();
            s == "true" || s == "1" || s == "yes"
        })
        .unwrap_or(false);

    if !ignore_bootstrap {
        plugins.push("@elizaos/plugin-bootstrap".to_string());
    }

    // Ollama fallback (only if no other LLM providers and not using cloud)
    if !use_eliza_cloud
        && !env
            .get("ANTHROPIC_API_KEY")
            .map(|s| !s.trim().is_empty())
            .unwrap_or(false)
        && !env
            .get("OPENROUTER_API_KEY")
            .map(|s| !s.trim().is_empty())
            .unwrap_or(false)
        && !env
            .get("OPENAI_API_KEY")
            .map(|s| !s.trim().is_empty())
            .unwrap_or(false)
        && !env
            .get("GOOGLE_GENERATIVE_AI_API_KEY")
            .map(|s| !s.trim().is_empty())
            .unwrap_or(false)
    {
        plugins.push("@elizaos/plugin-ollama".to_string());
    }

    plugins
}

fn has_twitter_config(env: &HashMap<String, String>) -> bool {
    env.get("TWITTER_API_KEY")
        .map(|s| !s.trim().is_empty())
        .unwrap_or(false)
        && env
            .get("TWITTER_API_SECRET_KEY")
            .map(|s| !s.trim().is_empty())
            .unwrap_or(false)
        && env
            .get("TWITTER_ACCESS_TOKEN")
            .map(|s| !s.trim().is_empty())
            .unwrap_or(false)
        && env
            .get("TWITTER_ACCESS_TOKEN_SECRET")
            .map(|s| !s.trim().is_empty())
            .unwrap_or(false)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_character_basic() {
        let json = r#"{
            "name": "TestAgent",
            "bio": "A test agent for testing purposes"
        }"#;

        let character = parse_character(json).unwrap();
        assert_eq!(character.name, "TestAgent");
    }

    #[test]
    fn test_parse_character_with_array_bio() {
        let json = r#"{
            "name": "TestAgent",
            "bio": ["Line 1", "Line 2"]
        }"#;

        let character = parse_character(json).unwrap();
        assert_eq!(character.name, "TestAgent");
        match &character.bio {
            Bio::Multiple(v) => assert_eq!(v.len(), 2),
            _ => panic!("Expected multiple bio"),
        }
    }

    #[test]
    fn test_validate_character() {
        let character = Character {
            name: "TestAgent".to_string(),
            bio: Bio::Single("A test agent".to_string()),
            ..Default::default()
        };

        assert!(validate_character(&character).is_ok());
    }

    #[test]
    fn test_validate_character_empty_name() {
        let character = Character {
            name: "".to_string(),
            bio: Bio::Single("A test agent".to_string()),
            ..Default::default()
        };

        assert!(validate_character(&character).is_err());
    }

    #[test]
    fn test_merge_character_defaults() {
        let character = Character {
            name: "TestAgent".to_string(),
            bio: Bio::Single("".to_string()),
            ..Default::default()
        };

        let merged = merge_character_defaults(character);
        assert!(merged.settings.is_some());
        assert!(merged.plugins.is_some());
    }

    #[test]
```