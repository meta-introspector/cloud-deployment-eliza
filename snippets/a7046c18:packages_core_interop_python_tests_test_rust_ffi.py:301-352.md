# a7046c18:packages_core_interop_python_tests_test_rust_ffi.py:301-352

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/interop/python/tests/test_rust_ffi.py:301-352
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        """Test creating action wrappers from manifest."""
        manifest = {
            "actions": [
                {"name": "ACTION_1", "description": "First action", "similes": ["A1"]},
                {"name": "ACTION_2", "description": "Second action"},
            ]
        }

        # Simulate wrapper creation
        actions = []
        for action_def in manifest["actions"]:
            actions.append(
                {
                    "name": action_def["name"],
                    "description": action_def["description"],
                    "similes": action_def.get("similes", []),
                }
            )

        assert len(actions) == 2
        assert actions[0]["name"] == "ACTION_1"
        assert actions[0]["similes"] == ["A1"]
        assert actions[1]["similes"] == []

    def test_provider_wrapper_creation(self):
        """Test creating provider wrappers from manifest."""
        manifest = {
            "providers": [
                {
                    "name": "PROVIDER_1",
                    "description": "First provider",
                    "dynamic": True,
                    "position": 5,
                }
            ]
        }

        providers = []
        for provider_def in manifest["providers"]:
            providers.append(
                {
                    "name": provider_def["name"],
                    "description": provider_def.get("description"),
                    "dynamic": provider_def.get("dynamic", False),
                    "position": provider_def.get("position"),
                }
            )

        assert len(providers) == 1
        assert providers[0]["dynamic"] is True
        assert providers[0]["position"] == 5

```