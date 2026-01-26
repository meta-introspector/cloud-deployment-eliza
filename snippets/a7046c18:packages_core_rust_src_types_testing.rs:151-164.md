# a7046c18:packages_core_rust_src_types_testing.rs:151-164

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/src/types/testing.rs:151-164
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        assert_eq!(results.total(), 2);
    }

    #[test]
    fn test_test_suite_definition() {
        let suite = TestSuite::new("My Suite")
            .add_test("test1", || Ok(()))
            .add_test("test2", || Ok(()));

        let def = suite.definition();
        assert_eq!(def.name, "My Suite");
        assert_eq!(def.tests.len(), 2);
    }
}
```