# a7046c18:packages_core_rust_src_types_database.rs:451-483

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/src/types/database.rs:451-483
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    pub const LARGE: usize = 768;
    /// 1024 dimensions
    pub const XL: usize = 1024;
    /// 1536 dimensions
    pub const XXL: usize = 1536;
    /// 3072 dimensions
    pub const XXXL: usize = 3072;
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_run_status_serialization() {
        let status = RunStatus::Completed;
        let json = serde_json::to_string(&status).unwrap();
        assert_eq!(json, "\"completed\"");
    }

    #[test]
    fn test_get_memories_params_serialization() {
        let params = GetMemoriesParams {
            table_name: "messages".to_string(),
            count: Some(10),
            ..Default::default()
        };

        let json = serde_json::to_string(&params).unwrap();
        assert!(json.contains("\"tableName\":\"messages\""));
        assert!(json.contains("\"count\":10"));
    }
}
```