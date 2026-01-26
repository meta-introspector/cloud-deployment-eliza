# a7046c18:packages_core_rust_src_types_state.rs:151-160

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/src/types/state.rs:151-160
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    #[test]
    fn test_state_serialization() {
        let mut state = State::with_text("Test context");
        state.set_value("key", serde_json::json!("value"));

        let json = serde_json::to_string(&state).unwrap();
        assert!(json.contains("\"text\":\"Test context\""));
        assert!(json.contains("\"key\":\"value\""));
    }
}
```