# a7046c18:packages_core_python_tests_test_runtime.py:301-317

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/tests/test_runtime.py:301-317
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        assert new_run_id != run_id


class TestAgentRuntimeServices:
    """Tests for service management."""

    def test_has_service_empty(self, runtime: AgentRuntime) -> None:
        """Test has_service with no services."""
        assert runtime.has_service("test-service") is False

    def test_get_service_empty(self, runtime: AgentRuntime) -> None:
        """Test get_service with no services."""
        assert runtime.get_service("test-service") is None

    def test_get_registered_service_types_empty(self, runtime: AgentRuntime) -> None:
        """Test getting registered service types when empty."""
        assert runtime.get_registered_service_types() == []
```