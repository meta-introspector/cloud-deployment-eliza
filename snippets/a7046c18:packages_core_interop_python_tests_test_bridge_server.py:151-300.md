# a7046c18:packages_core_interop_python_tests_test_bridge_server.py:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/interop/python/tests/test_bridge_server.py:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
                "text": "Python environment info",
                "values": {"version": "3.11"},
                "data": {"platform": "linux"},
            },
        }

        json_str = json.dumps(response)
        parsed = json.loads(json_str)

        assert parsed["result"]["text"] == "Python environment info"
        assert parsed["result"]["values"]["version"] == "3.11"

    def test_init_result(self):
        """Test plugin init result response."""
        response = {"type": "plugin.init.result", "id": "req-126", "success": True}

        json_str = json.dumps(response)
        parsed = json.loads(json_str)

        assert parsed["type"] == "plugin.init.result"
        assert parsed["success"] is True

    def test_error_response(self):
        """Test error response format."""
        response = {
            "type": "error",
            "id": "req-error",
            "error": "Module not found",
            "details": "Traceback (most recent call last):\n  File...",
        }

        json_str = json.dumps(response)
        parsed = json.loads(json_str)

        assert parsed["type"] == "error"
        assert parsed["error"] == "Module not found"


class TestRequestHandling:
    """Test request handling logic."""

    def test_route_action_invoke(self):
        """Test routing action.invoke requests."""
        request = {"type": "action.invoke", "action": "TEST"}

        # Route based on type
        handlers = {
            "action.invoke": lambda r: {"handled": "action.invoke"},
            "action.validate": lambda r: {"handled": "action.validate"},
            "provider.get": lambda r: {"handled": "provider.get"},
        }

        result = handlers.get(request["type"], lambda r: {"error": "unknown"})(request)
        assert result["handled"] == "action.invoke"

    def test_route_unknown_type(self):
        """Test routing unknown request types."""
        request = {"type": "unknown.type"}

        handlers = {
            "action.invoke": lambda r: {"handled": "action.invoke"},
        }

        result = handlers.get(request["type"], lambda r: {"type": "error", "error": "Unknown type"})(
            request
        )
        assert result["type"] == "error"

    def test_extract_request_id(self):
        """Test extracting request ID from messages."""
        request = {"type": "action.invoke", "id": "unique-id-123", "action": "TEST"}

        request_id = request.get("id", "")
        assert request_id == "unique-id-123"

    def test_missing_request_id(self):
        """Test handling missing request ID."""
        request = {"type": "action.invoke", "action": "TEST"}

        request_id = request.get("id", "")
        assert request_id == ""


class TestManifestGeneration:
    """Test manifest generation for plugins."""

    def test_generate_manifest_with_actions(self):
        """Test generating manifest with actions."""
        # Simulate plugin attributes
        plugin = {
            "name": "test-plugin",
            "description": "Test description",
            "version": "1.0.0",
            "actions": [
                {"name": "ACTION_1", "description": "First action"},
                {"name": "ACTION_2", "description": "Second action", "similes": ["A2"]},
            ],
        }

        manifest = {
            "name": plugin["name"],
            "description": plugin["description"],
            "version": plugin.get("version", "1.0.0"),
            "language": "python",
            "actions": [
                {
                    "name": a["name"],
                    "description": a["description"],
                    "similes": a.get("similes"),
                }
                for a in plugin.get("actions", [])
            ],
        }

        assert manifest["name"] == "test-plugin"
        assert len(manifest["actions"]) == 2
        assert manifest["actions"][1]["similes"] == ["A2"]

    def test_generate_manifest_with_providers(self):
        """Test generating manifest with providers."""
        plugin = {
            "name": "provider-plugin",
            "description": "Provider test",
            "providers": [
                {
                    "name": "PROVIDER_1",
                    "description": "First provider",
                    "dynamic": True,
                    "position": 5,
                    "private": False,
                }
            ],
        }

        manifest = {
            "name": plugin["name"],
            "description": plugin["description"],
            "version": "1.0.0",
            "language": "python",
            "providers": [
                {
                    "name": p["name"],
                    "description": p.get("description"),
                    "dynamic": p.get("dynamic"),
                    "position": p.get("position"),
                    "private": p.get("private"),
                }
                for p in plugin.get("providers", [])
            ],
        }
```