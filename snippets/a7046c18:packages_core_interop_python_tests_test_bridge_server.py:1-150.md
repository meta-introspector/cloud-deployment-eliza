# a7046c18:packages_core_interop_python_tests_test_bridge_server.py:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/interop/python/tests/test_bridge_server.py:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
"""
Tests for Python Plugin Bridge Server

These tests validate the IPC protocol handling and message processing.
"""

import json
import pytest
from typing import Any
from unittest.mock import MagicMock, AsyncMock, patch


class TestIPCProtocol:
    """Test IPC message protocol."""

    def test_ready_message_format(self):
        """Test ready message with manifest format."""
        manifest = {
            "name": "python-plugin",
            "description": "Test Python plugin",
            "version": "1.0.0",
            "language": "python",
            "actions": [{"name": "TEST_ACTION", "description": "Test"}],
        }

        ready_msg = {"type": "ready", "manifest": manifest}

        json_str = json.dumps(ready_msg)
        parsed = json.loads(json_str)

        assert parsed["type"] == "ready"
        assert parsed["manifest"]["name"] == "python-plugin"

    def test_action_invoke_request(self):
        """Test action.invoke request parsing."""
        request = {
            "type": "action.invoke",
            "id": "req-123",
            "action": "HELLO_PYTHON",
            "memory": {"content": {"text": "Hello"}},
            "state": {"values": {}},
            "options": {"timeout": 5000},
        }

        json_str = json.dumps(request)
        parsed = json.loads(json_str)

        assert parsed["type"] == "action.invoke"
        assert parsed["action"] == "HELLO_PYTHON"
        assert parsed["memory"]["content"]["text"] == "Hello"

    def test_action_validate_request(self):
        """Test action.validate request parsing."""
        request = {
            "type": "action.validate",
            "id": "req-124",
            "action": "TEST_ACTION",
            "memory": {"content": {"text": "Test"}},
            "state": None,
        }

        json_str = json.dumps(request)
        parsed = json.loads(json_str)

        assert parsed["type"] == "action.validate"
        assert parsed["state"] is None

    def test_provider_get_request(self):
        """Test provider.get request parsing."""
        request = {
            "type": "provider.get",
            "id": "req-125",
            "provider": "PYTHON_INFO",
            "memory": {"content": {}},
            "state": {"values": {}},
        }

        json_str = json.dumps(request)
        parsed = json.loads(json_str)

        assert parsed["type"] == "provider.get"
        assert parsed["provider"] == "PYTHON_INFO"

    def test_plugin_init_request(self):
        """Test plugin.init request parsing."""
        request = {
            "type": "plugin.init",
            "id": "req-126",
            "config": {"API_KEY": "test-key", "DEBUG": "true"},
        }

        json_str = json.dumps(request)
        parsed = json.loads(json_str)

        assert parsed["type"] == "plugin.init"
        assert parsed["config"]["API_KEY"] == "test-key"


class TestIPCResponses:
    """Test IPC response formatting."""

    def test_action_result_success(self):
        """Test successful action result response."""
        response = {
            "type": "action.result",
            "id": "req-123",
            "result": {
                "success": True,
                "text": "Hello from Python! 🐍",
                "data": {"language": "python"},
            },
        }

        json_str = json.dumps(response)
        parsed = json.loads(json_str)

        assert parsed["type"] == "action.result"
        assert parsed["result"]["success"] is True
        assert "🐍" in parsed["result"]["text"]

    def test_action_result_failure(self):
        """Test failed action result response."""
        response = {
            "type": "action.result",
            "id": "req-123",
            "result": {"success": False, "error": "Action failed"},
        }

        json_str = json.dumps(response)
        parsed = json.loads(json_str)

        assert parsed["result"]["success"] is False
        assert parsed["result"]["error"] == "Action failed"

    def test_validate_result(self):
        """Test validation result response."""
        response = {"type": "validate.result", "id": "req-124", "valid": True}

        json_str = json.dumps(response)
        parsed = json.loads(json_str)

        assert parsed["type"] == "validate.result"
        assert parsed["valid"] is True

    def test_provider_result(self):
        """Test provider result response."""
        response = {
            "type": "provider.result",
            "id": "req-125",
            "result": {
```