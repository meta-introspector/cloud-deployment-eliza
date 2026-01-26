# a7046c18:packages_core_rust_src_character.rs:301-321

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/src/character.rs:301-321
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    fn test_build_character_plugins_empty_env() {
        let env = HashMap::new();
        let plugins = build_character_plugins(&env);

        // Should include sql and bootstrap and ollama fallback
        assert!(plugins.contains(&"@elizaos/plugin-sql".to_string()));
        assert!(plugins.contains(&"@elizaos/plugin-bootstrap".to_string()));
        assert!(plugins.contains(&"@elizaos/plugin-ollama".to_string()));
    }

    #[test]
    fn test_build_character_plugins_with_openai() {
        let mut env = HashMap::new();
        env.insert("OPENAI_API_KEY".to_string(), "test-key".to_string());

        let plugins = build_character_plugins(&env);

        assert!(plugins.contains(&"@elizaos/plugin-openai".to_string()));
        assert!(!plugins.contains(&"@elizaos/plugin-ollama".to_string())); // No fallback
    }
}
```