# a7046c18:packages_core_rust_src_types_agent.rs:301-308

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/src/types/agent.rs:301-308
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        let agent = Agent::from_character(character);
        let json = serde_json::to_string(&agent).unwrap();

        assert!(json.contains("\"name\":\"TestAgent\""));
        assert!(json.contains("\"createdAt\""));
        assert!(json.contains("\"updatedAt\""));
    }
}
```