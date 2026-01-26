# a7046c18:packages_core_rust_src_plugin.rs:301-317

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/src/plugin.rs:301-317
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        let b_pos = names.iter().position(|&n| n == "b").unwrap();
        let c_pos = names.iter().position(|&n| n == "c").unwrap();

        assert!(a_pos < b_pos);
        assert!(b_pos < c_pos);
    }

    #[test]
    fn test_resolve_plugin_dependencies_circular() {
        let mut plugins = HashMap::new();
        plugins.insert("a".to_string(), create_test_plugin("a", vec!["b"]));
        plugins.insert("b".to_string(), create_test_plugin("b", vec!["a"]));

        let result = resolve_plugin_dependencies(&plugins, false);
        assert!(result.is_err());
    }
}
```