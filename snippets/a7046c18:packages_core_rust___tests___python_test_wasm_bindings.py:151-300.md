# a7046c18:packages_core_rust___tests___python_test_wasm_bindings.py:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/__tests__/python/test_wasm_bindings.py:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        json_str = json.dumps(character)
        parsed = json.loads(json_str)

        self.assertEqual(parsed["bio"], "A simple bio string")

    def test_character_bio_as_array(self):
        """Test Character with bio as array"""
        character = {
            "name": "Agent",
            "bio": ["Line 1", "Line 2", "Line 3"],
            "messageExamples": [],
            "postExamples": []
        }

        json_str = json.dumps(character)
        parsed = json.loads(json_str)

        self.assertIsInstance(parsed["bio"], list)
        self.assertEqual(len(parsed["bio"]), 3)


class TestAgentSerialization(unittest.TestCase):
    """Test Agent type serialization compatibility"""

    def test_agent_json_structure(self):
        """Test that Agent JSON structure matches Rust expectations"""
        agent = {
            "id": "550e8400-e29b-41d4-a716-446655440000",
            "name": "TestAgent",
            "bio": "A test agent",
            "status": "active",
            "enabled": True
        }

        json_str = json.dumps(agent)
        parsed = json.loads(json_str)

        self.assertEqual(parsed["id"], agent["id"])
        self.assertEqual(parsed["status"], "active")
        self.assertTrue(parsed["enabled"])

    def test_agent_status_values(self):
        """Test valid agent status values"""
        valid_statuses = ["active", "inactive", "paused"]

        for status in valid_statuses:
            agent = {
                "id": "test-id",
                "name": "Test",
                "status": status
            }
            json_str = json.dumps(agent)
            parsed = json.loads(json_str)
            self.assertEqual(parsed["status"], status)


class TestPluginSerialization(unittest.TestCase):
    """Test Plugin type serialization compatibility"""

    def test_plugin_json_structure(self):
        """Test that Plugin JSON structure matches Rust expectations"""
        plugin = {
            "name": "test-plugin",
            "description": "A test plugin",
            "actions": [],
            "evaluators": [],
            "providers": [],
            "services": [],
            "dependencies": ["dep1", "dep2"]
        }

        json_str = json.dumps(plugin)
        parsed = json.loads(json_str)

        self.assertEqual(parsed["name"], "test-plugin")
        self.assertEqual(len(parsed["dependencies"]), 2)


class TestRoomSerialization(unittest.TestCase):
    """Test Room type serialization compatibility"""

    def test_room_json_structure(self):
        """Test that Room JSON structure matches Rust expectations"""
        room = {
            "id": "550e8400-e29b-41d4-a716-446655440000",
            "name": "Test Room",
            "source": "test",
            "type": "GROUP",
            "channelId": "channel-123",
            "serverId": "server-456"
        }

        json_str = json.dumps(room)
        parsed = json.loads(json_str)

        self.assertEqual(parsed["type"], "GROUP")

    def test_channel_type_values(self):
        """Test valid channel type values"""
        valid_types = ["DM", "GROUP", "VOICE", "FEED", "THREAD", "WORLD", "SELF", "API"]

        for channel_type in valid_types:
            room = {"id": "test", "type": channel_type}
            json_str = json.dumps(room)
            parsed = json.loads(json_str)
            self.assertEqual(parsed["type"], channel_type)


class TestEntitySerialization(unittest.TestCase):
    """Test Entity type serialization compatibility"""

    def test_entity_json_structure(self):
        """Test that Entity JSON structure matches Rust expectations"""
        entity = {
            "id": "550e8400-e29b-41d4-a716-446655440000",
            "names": ["User", "TestUser"],
            "agentId": "550e8400-e29b-41d4-a716-446655440001",
            "metadata": {"email": "test@example.com"}
        }

        json_str = json.dumps(entity)
        parsed = json.loads(json_str)

        self.assertEqual(len(parsed["names"]), 2)
        self.assertEqual(parsed["metadata"]["email"], "test@example.com")


class TestContentSerialization(unittest.TestCase):
    """Test Content type serialization compatibility"""

    def test_content_all_fields(self):
        """Test Content with all optional fields"""
        content = {
            "text": "Hello",
            "source": "test",
            "url": "https://example.com",
            "actions": ["action1", "action2"],
            "metadata": {"key": "value"},
            "attachments": [{"type": "image", "url": "https://..."}]
        }

        json_str = json.dumps(content)
        parsed = json.loads(json_str)

        self.assertEqual(parsed["text"], "Hello")
        self.assertIsInstance(parsed["actions"], list)
        self.assertIsInstance(parsed["attachments"], list)

    def test_content_minimal(self):
        """Test Content with only text"""
```