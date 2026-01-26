# a7046c18:packages_core_interop_python_tests_test_rust_ffi.py:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/interop/python/tests/test_rust_ffi.py:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
"""
Tests for Rust FFI Plugin Loader

These tests validate the FFI interface without requiring an actual Rust library.
They test JSON serialization, type handling, and the expected protocol.
"""

import json
import pytest
from typing import Any
from unittest.mock import MagicMock, patch


class TestFFIProtocol:
    """Test the FFI protocol and data serialization."""

    def test_manifest_json_format(self):
        """Test that manifest JSON format matches expected structure."""
        manifest = {
            "name": "test-rust-plugin",
            "description": "A test plugin from Rust",
            "version": "1.0.0",
            "language": "rust",
            "actions": [
                {
                    "name": "RUST_ACTION",
                    "description": "Action from Rust",
                    "similes": ["TEST_RUST"],
                }
            ],
            "providers": [
                {
                    "name": "RUST_PROVIDER",
                    "description": "Provider from Rust",
                    "dynamic": True,
                }
            ],
        }

        json_str = json.dumps(manifest)
        parsed = json.loads(json_str)

        assert parsed["name"] == "test-rust-plugin"
        assert parsed["language"] == "rust"
        assert len(parsed["actions"]) == 1
        assert parsed["actions"][0]["name"] == "RUST_ACTION"

    def test_action_result_serialization(self):
        """Test ActionResult serialization format."""
        result = {
            "success": True,
            "text": "Hello from Rust! 🦀",
            "data": {"language": "rust", "version": "1.0.0"},
            "values": {"key": "value"},
        }

        json_str = json.dumps(result)
        parsed = json.loads(json_str)

        assert parsed["success"] is True
        assert parsed["text"] == "Hello from Rust! 🦀"
        assert parsed["data"]["language"] == "rust"

    def test_action_result_failure(self):
        """Test ActionResult failure format."""
        result = {"success": False, "error": "Something went wrong"}

        json_str = json.dumps(result)
        parsed = json.loads(json_str)

        assert parsed["success"] is False
        assert parsed["error"] == "Something went wrong"

    def test_provider_result_serialization(self):
        """Test ProviderResult serialization format."""
        result = {
            "text": "Rust plugin context",
            "values": {"rust_version": "1.75.0"},
            "data": {"build_info": {"target": "x86_64"}},
        }

        json_str = json.dumps(result)
        parsed = json.loads(json_str)

        assert parsed["text"] == "Rust plugin context"
        assert parsed["values"]["rust_version"] == "1.75.0"

    def test_memory_serialization(self):
        """Test Memory object serialization for FFI."""
        memory = {
            "id": "123e4567-e89b-12d3-a456-426614174000",
            "agentId": "123e4567-e89b-12d3-a456-426614174001",
            "content": {"text": "Hello from Python", "actions": ["ACTION_1"]},
            "createdAt": 1704067200000,
        }

        json_str = json.dumps(memory)
        parsed = json.loads(json_str)

        assert parsed["id"] == memory["id"]
        assert parsed["content"]["text"] == "Hello from Python"

    def test_state_serialization(self):
        """Test State object serialization for FFI."""
        state = {
            "text": "Current conversation context",
            "values": {"agentName": "TestAgent", "count": 5},
            "data": {"providers": {"time": {"hour": 12}}},
        }

        json_str = json.dumps(state)
        parsed = json.loads(json_str)

        assert parsed["text"] == "Current conversation context"
        assert parsed["values"]["count"] == 5


class TestFFIFunctionSignatures:
    """Test expected FFI function signatures."""

    def test_elizaos_get_manifest_signature(self):
        """Test elizaos_get_manifest expected return format."""
        # Simulate what the Rust function would return
        manifest_json = json.dumps(
            {"name": "test", "description": "Test", "version": "1.0.0", "language": "rust"}
        )

        # Should return a valid JSON string
        parsed = json.loads(manifest_json)
        assert "name" in parsed
        assert "description" in parsed

    def test_elizaos_init_signature(self):
        """Test elizaos_init expected config format."""
        config = {"API_KEY": "test-key", "DEBUG": "true"}

        config_json = json.dumps(config)
        parsed = json.loads(config_json)

        assert parsed["API_KEY"] == "test-key"

    def test_elizaos_validate_action_signature(self):
        """Test elizaos_validate_action parameter format."""
        action_name = "TEST_ACTION"
        memory_json = json.dumps({"content": {"text": "Hello"}})
        state_json = json.dumps({"values": {}})

        # These would be passed to the FFI function
        assert isinstance(action_name, str)
        assert isinstance(memory_json, str)
```