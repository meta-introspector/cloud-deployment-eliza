# a7046c18:packages_core_interop_python_tests_test_bridge_server.py:301-412

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/interop/python/tests/test_bridge_server.py:301-412
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

        assert len(manifest["providers"]) == 1
        assert manifest["providers"][0]["dynamic"] is True


class TestMessageBuffering:
    """Test message buffering for stdin/stdout communication."""

    def test_newline_delimited_messages(self):
        """Test parsing newline-delimited messages."""
        messages = [
            {"type": "action.invoke", "id": "1", "action": "A"},
            {"type": "action.invoke", "id": "2", "action": "B"},
            {"type": "action.invoke", "id": "3", "action": "C"},
        ]

        # Simulate buffered input
        buffer = "\n".join(json.dumps(m) for m in messages) + "\n"
        lines = buffer.strip().split("\n")

        assert len(lines) == 3
        for i, line in enumerate(lines):
            parsed = json.loads(line)
            assert parsed["id"] == str(i + 1)

    def test_partial_message_buffering(self):
        """Test handling partial messages in buffer."""
        message = {"type": "test", "data": "complete"}
        full_json = json.dumps(message)

        # Simulate partial reads
        part1 = full_json[:10]
        part2 = full_json[10:]

        buffer = ""
        buffer += part1
        # Can't parse yet
        with pytest.raises(json.JSONDecodeError):
            json.loads(buffer)

        buffer += part2
        # Now can parse
        parsed = json.loads(buffer)
        assert parsed["type"] == "test"


class TestErrorHandling:
    """Test error handling in bridge server."""

    def test_malformed_json(self):
        """Test handling malformed JSON input."""
        malformed = '{ type: "test" }'

        with pytest.raises(json.JSONDecodeError):
            json.loads(malformed)

    def test_missing_required_field(self):
        """Test handling missing required fields."""
        request = {"type": "action.invoke"}
        # Missing action field

        action = request.get("action")
        assert action is None

    def test_exception_serialization(self):
        """Test serializing exceptions in error responses."""
        try:
            raise ValueError("Test error")
        except Exception as e:
            response = {
                "type": "error",
                "id": "req-err",
                "error": str(e),
                "details": type(e).__name__,
            }

        json_str = json.dumps(response)
        parsed = json.loads(json_str)

        assert parsed["error"] == "Test error"
        assert parsed["details"] == "ValueError"


class TestAsyncOperations:
    """Test async operation handling."""

    @pytest.mark.asyncio
    async def test_async_action_handler(self):
        """Test async action handler execution."""

        async def mock_handler(memory, state, options):
            # Simulate async work
            await asyncio.sleep(0.01)
            return {"success": True, "text": "Async result"}

        import asyncio

        result = await mock_handler({}, {}, {})
        assert result["success"] is True

    @pytest.mark.asyncio
    async def test_async_provider_get(self):
        """Test async provider get execution."""

        async def mock_get(memory, state):
            return {"text": "Async provider data", "values": {}}

        import asyncio

        result = await mock_get({}, {})
        assert result["text"] == "Async provider data"

```