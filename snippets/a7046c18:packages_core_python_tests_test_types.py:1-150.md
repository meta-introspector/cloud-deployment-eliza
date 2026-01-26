# a7046c18:packages_core_python_tests_test_types.py:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/tests/test_types.py:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
"""Tests for elizaOS type definitions."""

import pytest
from pydantic import ValidationError

from elizaos.types import (
    ChannelType,
    Character,
    Content,
    Entity,
    Memory,
    Plugin,
    Room,
    State,
    Task,
    TaskStatus,
    World,
    as_uuid,
)


class TestUUID:
    """Tests for UUID type and as_uuid function."""

    def test_valid_uuid(self) -> None:
        """Test valid UUID creation."""
        valid_uuid = "12345678-1234-1234-1234-123456789012"
        result = as_uuid(valid_uuid)
        assert result == valid_uuid

    def test_invalid_uuid_format(self) -> None:
        """Test invalid UUID format raises error."""
        with pytest.raises(ValueError, match="Invalid UUID format"):
            as_uuid("not-a-uuid")

    def test_empty_uuid(self) -> None:
        """Test empty string raises error."""
        with pytest.raises(ValueError, match="Invalid UUID format"):
            as_uuid("")

    def test_uuid_case_insensitive(self) -> None:
        """Test UUID is case-insensitive."""
        lower = "12345678-1234-1234-1234-123456789012"
        upper = "12345678-1234-1234-1234-123456789012".upper()
        assert as_uuid(lower) == lower
        assert as_uuid(upper) == upper


class TestContent:
    """Tests for Content model."""

    def test_minimal_content(self) -> None:
        """Test creating content with minimal fields."""
        content = Content(text="Hello world")
        assert content.text == "Hello world"
        assert content.thought is None
        assert content.actions is None

    def test_full_content(self) -> None:
        """Test creating content with all fields."""
        content = Content(
            text="Hello world",
            thought="Thinking about response",
            actions=["RESPOND", "SEARCH"],
            providers=["KNOWLEDGE"],
            source="cli",
            target="user",
        )
        assert content.text == "Hello world"
        assert content.thought == "Thinking about response"
        assert content.actions == ["RESPOND", "SEARCH"]
        assert content.providers == ["KNOWLEDGE"]

    def test_content_extra_fields(self) -> None:
        """Test that content allows extra fields."""
        content = Content(text="Hello", custom_field="custom_value")
        assert content.text == "Hello"
        assert content.model_dump().get("custom_field") == "custom_value"


class TestMemory:
    """Tests for Memory model."""

    def test_minimal_memory(self) -> None:
        """Test creating memory with minimal fields."""
        memory = Memory(
            entity_id=as_uuid("12345678-1234-1234-1234-123456789012"),
            room_id=as_uuid("12345678-1234-1234-1234-123456789013"),
            content=Content(text="Hello"),
        )
        assert memory.entity_id == "12345678-1234-1234-1234-123456789012"
        assert memory.content.text == "Hello"

    def test_memory_with_embedding(self) -> None:
        """Test creating memory with embedding."""
        embedding = [0.1, 0.2, 0.3, 0.4, 0.5]
        memory = Memory(
            entity_id=as_uuid("12345678-1234-1234-1234-123456789012"),
            room_id=as_uuid("12345678-1234-1234-1234-123456789013"),
            content=Content(text="Hello"),
            embedding=embedding,
        )
        assert memory.embedding == embedding


class TestCharacter:
    """Tests for Character model."""

    def test_minimal_character(self) -> None:
        """Test creating character with minimal fields."""
        character = Character(
            name="TestAgent",
            bio="A test agent for testing.",
        )
        assert character.name == "TestAgent"
        assert character.bio == "A test agent for testing."

    def test_full_character(self) -> None:
        """Test creating character with all fields."""
        character = Character(
            name="TestAgent",
            username="testagent",
            bio=["Line 1", "Line 2"],
            system="You are a test agent.",
            topics=["testing", "automation"],
            adjectives=["helpful", "precise"],
            plugins=["@elizaos/plugin-sql"],
            settings={"temperature": 0.7},
            secrets={"API_KEY": "secret"},
        )
        assert character.name == "TestAgent"
        assert character.username == "testagent"
        assert character.bio == ["Line 1", "Line 2"]
        assert character.topics == ["testing", "automation"]

    def test_character_validation(self) -> None:
        """Test character validation."""
        with pytest.raises(ValidationError):
            Character(name="", bio="Test")  # Empty name


class TestEntity:
    """Tests for Entity model."""

    def test_minimal_entity(self) -> None:
        """Test creating entity with minimal fields."""
        entity = Entity(
            names=["TestUser"],
            agent_id=as_uuid("12345678-1234-1234-1234-123456789012"),
        )
```