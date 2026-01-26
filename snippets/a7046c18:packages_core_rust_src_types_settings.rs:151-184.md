# a7046c18:packages_core_rust_src_types_settings.rs:151-184

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/src/types/settings.rs:151-184
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    #[test]
    fn test_runtime_settings() {
        let mut settings = RuntimeSettings::new();
        settings.set_string("name", "TestAgent");
        settings.set_bool("enabled", true);
        settings.set_number("timeout", 30.0);

        assert_eq!(settings.get_string("name"), Some("TestAgent"));
        assert_eq!(settings.get_bool("enabled"), Some(true));
        assert_eq!(settings.get_number("timeout"), Some(30.0));
    }

    #[test]
    fn test_settings_serialization() {
        let mut settings = RuntimeSettings::new();
        settings.set_string("key", "value");
        settings.set_bool("flag", true);

        let json = serde_json::to_string(&settings).unwrap();
        assert!(json.contains("\"key\":\"value\""));
        assert!(json.contains("\"flag\":true"));
    }

    #[test]
    fn test_settings_from_hashmap() {
        let mut map = HashMap::new();
        map.insert("key1".to_string(), "value1".to_string());
        map.insert("key2".to_string(), "value2".to_string());

        let settings: RuntimeSettings = map.into();
        assert_eq!(settings.get_string("key1"), Some("value1"));
        assert_eq!(settings.get_string("key2"), Some("value2"));
    }
}
```