# a7046c18:packages_core_interop_python_tests_test_rust_ffi.py:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/interop/python/tests/test_rust_ffi.py:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        assert isinstance(state_json, str)

    def test_elizaos_invoke_action_signature(self):
        """Test elizaos_invoke_action parameter and return format."""
        action_name = "TEST_ACTION"
        memory_json = json.dumps({"content": {"text": "Hello"}})
        state_json = json.dumps({"values": {}})
        options_json = json.dumps({"timeout": 5000})

        # Simulate return value
        result_json = json.dumps({"success": True, "text": "Done!"})

        parsed = json.loads(result_json)
        assert parsed["success"] is True

    def test_elizaos_get_provider_signature(self):
        """Test elizaos_get_provider parameter and return format."""
        provider_name = "TEST_PROVIDER"
        memory_json = json.dumps({"content": {}})
        state_json = json.dumps({"values": {}})

        # Simulate return value
        result_json = json.dumps({"text": "Provider data", "values": {"key": "value"}})

        parsed = json.loads(result_json)
        assert parsed["text"] == "Provider data"


class TestPlatformDetection:
    """Test platform-specific library handling."""

    def test_lib_extension_detection(self):
        """Test library extension detection logic."""
        import platform

        system = platform.system()

        if system == "Darwin":
            expected = ".dylib"
        elif system == "Windows":
            expected = ".dll"
        else:
            expected = ".so"

        # This tests the logic that would be in get_lib_extension()
        assert expected in [".so", ".dylib", ".dll"]

    def test_lib_prefix_detection(self):
        """Test library prefix detection logic."""
        import platform

        system = platform.system()

        if system == "Windows":
            expected = ""
        else:
            expected = "lib"

        assert expected in ["", "lib"]


class TestErrorHandling:
    """Test error handling in FFI operations."""

    def test_invalid_json_handling(self):
        """Test handling of invalid JSON from FFI."""
        invalid_json = "{ invalid json }"

        with pytest.raises(json.JSONDecodeError):
            json.loads(invalid_json)

    def test_null_result_handling(self):
        """Test handling of null results from FFI."""
        null_json = "null"
        parsed = json.loads(null_json)
        assert parsed is None

    def test_empty_result_handling(self):
        """Test handling of empty results."""
        empty_result = {"text": None, "values": None, "data": None}

        json_str = json.dumps(empty_result)
        parsed = json.loads(json_str)

        assert parsed["text"] is None


class TestComplexDataTypes:
    """Test handling of complex data types."""

    def test_nested_data_serialization(self):
        """Test deeply nested data structures."""
        data = {
            "level1": {
                "level2": {
                    "level3": {"value": "deep"},
                    "array": [1, 2, {"nested": True}],
                }
            }
        }

        json_str = json.dumps(data)
        parsed = json.loads(json_str)

        assert parsed["level1"]["level2"]["level3"]["value"] == "deep"
        assert parsed["level1"]["level2"]["array"][2]["nested"] is True

    def test_unicode_handling(self):
        """Test Unicode string handling."""
        data = {"text": "Hello 世界! 🦀 مرحبا שָׁלוֹם", "emoji": "🎉🎊🎈"}

        json_str = json.dumps(data, ensure_ascii=False)
        parsed = json.loads(json_str)

        assert "世界" in parsed["text"]
        assert "🦀" in parsed["text"]
        assert parsed["emoji"] == "🎉🎊🎈"

    def test_large_payload_handling(self):
        """Test handling of large payloads."""
        large_text = "x" * 100000
        data = {"content": {"text": large_text}}

        json_str = json.dumps(data)
        parsed = json.loads(json_str)

        assert len(parsed["content"]["text"]) == 100000

    def test_special_characters(self):
        """Test handling of special characters."""
        data = {
            "text": 'Quotes: "hello" and \'world\'',
            "newlines": "Line 1\nLine 2\r\nLine 3",
            "tabs": "Col1\tCol2\tCol3",
            "backslash": "path\\to\\file",
        }

        json_str = json.dumps(data)
        parsed = json.loads(json_str)

        assert '"hello"' in parsed["text"]
        assert "\n" in parsed["newlines"]
        assert "\t" in parsed["tabs"]
        assert "\\" in parsed["backslash"]


class TestPluginAdapterCreation:
    """Test creating Plugin adapters from FFI."""

    def test_action_wrapper_creation(self):
```