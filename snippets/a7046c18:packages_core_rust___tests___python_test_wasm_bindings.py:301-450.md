# a7046c18:packages_core_rust___tests___python_test_wasm_bindings.py:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/__tests__/python/test_wasm_bindings.py:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        content = {"text": "Just text"}

        json_str = json.dumps(content)
        parsed = json.loads(json_str)

        self.assertEqual(parsed["text"], "Just text")


class TestUUIDCompatibility(unittest.TestCase):
    """Test UUID format compatibility"""

    def test_uuid_format(self):
        """Test standard UUID format"""
        uuid = "550e8400-e29b-41d4-a716-446655440000"

        # Check format
        self.assertEqual(len(uuid), 36)
        self.assertEqual(uuid.count("-"), 4)

        # Check parts
        parts = uuid.split("-")
        self.assertEqual(len(parts[0]), 8)
        self.assertEqual(len(parts[1]), 4)
        self.assertEqual(len(parts[2]), 4)
        self.assertEqual(len(parts[3]), 4)
        self.assertEqual(len(parts[4]), 12)

    def test_uuid_lowercase(self):
        """Test that UUIDs are lowercase"""
        uuid = "550e8400-e29b-41d4-a716-446655440000"
        self.assertEqual(uuid, uuid.lower())


class TestEdgeCases(unittest.TestCase):
    """Test edge cases in serialization"""

    def test_empty_strings(self):
        """Test handling of empty strings"""
        memory = {
            "entityId": "entity-123",
            "roomId": "room-456",
            "content": {"text": ""}
        }

        json_str = json.dumps(memory)
        parsed = json.loads(json_str)

        self.assertEqual(parsed["content"]["text"], "")

    def test_unicode_characters(self):
        """Test handling of unicode characters"""
        memory = {
            "entityId": "entity-123",
            "roomId": "room-456",
            "content": {"text": "Hello 世界 🎉 émojis and ñ characters"}
        }

        json_str = json.dumps(memory, ensure_ascii=False)
        parsed = json.loads(json_str)

        self.assertIn("世界", parsed["content"]["text"])
        self.assertIn("🎉", parsed["content"]["text"])

    def test_large_numbers(self):
        """Test handling of large numbers"""
        memory = {
            "entityId": "entity-123",
            "roomId": "room-456",
            "content": {"text": "test"},
            "createdAt": 9007199254740991  # Number.MAX_SAFE_INTEGER
        }

        json_str = json.dumps(memory)
        parsed = json.loads(json_str)

        self.assertEqual(parsed["createdAt"], 9007199254740991)

    def test_nested_objects(self):
        """Test handling of deeply nested objects"""
        data = {
            "level1": {
                "level2": {
                    "level3": {
                        "level4": {
                            "value": "deep"
                        }
                    }
                }
            }
        }

        json_str = json.dumps(data)
        parsed = json.loads(json_str)

        self.assertEqual(
            parsed["level1"]["level2"]["level3"]["level4"]["value"],
            "deep"
        )


class TestTaskSerialization(unittest.TestCase):
    """Test Task type serialization compatibility"""

    def test_task_status_values(self):
        """Test valid task status values"""
        valid_statuses = ["PENDING", "IN_PROGRESS", "COMPLETED", "FAILED", "CANCELLED"]

        for status in valid_statuses:
            task = {
                "id": "task-123",
                "status": status
            }
            json_str = json.dumps(task)
            parsed = json.loads(json_str)
            self.assertEqual(parsed["status"], status)


class TestModelTypeSerialization(unittest.TestCase):
    """Test ModelType enum serialization"""

    def test_model_type_values(self):
        """Test valid model type values"""
        valid_types = [
            "TEXT_SMALL",
            "TEXT_LARGE",
            "TEXT_EMBEDDING",
            "IMAGE_DESCRIPTION",
            "IMAGE_GENERATION",
            "AUDIO_TRANSCRIPTION",
            "TEXT_TO_SPEECH"
        ]

        for model_type in valid_types:
            data = {"modelType": model_type}
            json_str = json.dumps(data)
            parsed = json.loads(json_str)
            self.assertEqual(parsed["modelType"], model_type)


class TestEventTypeSerialization(unittest.TestCase):
    """Test EventType enum serialization"""

    def test_event_type_values(self):
        """Test valid event type values"""
        valid_types = [
            "WORLD_JOINED",
            "WORLD_LEFT",
            "WORLD_CONNECTED",
            "MESSAGE_RECEIVED",
            "MESSAGE_SENT",
```