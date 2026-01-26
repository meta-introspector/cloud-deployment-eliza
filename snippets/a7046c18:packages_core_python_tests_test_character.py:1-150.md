# a7046c18:packages_core_python_tests_test_character.py:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/tests/test_character.py:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
"""Tests for character utilities."""

import json
import os
import tempfile

import pytest

from elizaos.character import (
    CharacterLoadError,
    CharacterValidationError,
    build_character_plugins,
    load_character_from_file,
    merge_character_defaults,
    parse_character,
    validate_character_config,
)
from elizaos.types import Character


class TestParseCharacter:
    """Tests for parse_character function."""

    def test_parse_character_object(self) -> None:
        """Test parsing a Character object."""
        character = Character(name="Test", bio="A test agent")
        result = parse_character(character)
        assert result.name == "Test"
        assert result.bio == "A test agent"

    def test_parse_character_dict(self) -> None:
        """Test parsing a dictionary."""
        data = {"name": "Test", "bio": "A test agent"}
        result = parse_character(data)
        assert result.name == "Test"
        assert result.bio == "A test agent"

    def test_parse_character_invalid_dict(self) -> None:
        """Test parsing an invalid dictionary."""
        data = {"bio": "Missing name"}  # Missing required field
        with pytest.raises(CharacterValidationError):
            parse_character(data)

    def test_parse_character_file_path(self) -> None:
        """Test parsing from file path."""
        with tempfile.NamedTemporaryFile(mode="w", suffix=".json", delete=False) as f:
            json.dump({"name": "FileAgent", "bio": "From file"}, f)
            f.flush()

            try:
                result = parse_character(f.name)
                assert result.name == "FileAgent"
            finally:
                os.unlink(f.name)


class TestLoadCharacterFromFile:
    """Tests for load_character_from_file function."""

    def test_load_valid_file(self) -> None:
        """Test loading a valid character file."""
        with tempfile.NamedTemporaryFile(mode="w", suffix=".json", delete=False) as f:
            json.dump(
                {
                    "name": "FileAgent",
                    "bio": "A file-based agent",
                    "topics": ["testing"],
                },
                f,
            )
            f.flush()

            try:
                result = load_character_from_file(f.name)
                assert result.name == "FileAgent"
                assert result.topics == ["testing"]
            finally:
                os.unlink(f.name)

    def test_load_nonexistent_file(self) -> None:
        """Test loading a nonexistent file."""
        with pytest.raises(CharacterLoadError, match="not found"):
            load_character_from_file("/nonexistent/path/character.json")

    def test_load_invalid_json(self) -> None:
        """Test loading a file with invalid JSON."""
        with tempfile.NamedTemporaryFile(mode="w", suffix=".json", delete=False) as f:
            f.write("not valid json {")
            f.flush()

            try:
                with pytest.raises(CharacterLoadError, match="Invalid JSON"):
                    load_character_from_file(f.name)
            finally:
                os.unlink(f.name)


class TestValidateCharacterConfig:
    """Tests for validate_character_config function."""

    def test_valid_character(self) -> None:
        """Test validating a valid character."""
        character = Character(name="Test", bio="A test agent")
        result = validate_character_config(character)
        assert result["isValid"] is True
        assert result["errors"] == []

    def test_character_with_all_fields(self) -> None:
        """Test validating a fully configured character."""
        character = Character(
            name="CompleteAgent",
            username="complete",
            bio=["Line 1", "Line 2"],
            system="You are a complete agent.",
            topics=["all", "topics"],
            adjectives=["thorough", "complete"],
            plugins=["@elizaos/plugin-sql"],
        )
        result = validate_character_config(character)
        assert result["isValid"] is True


class TestMergeCharacterDefaults:
    """Tests for merge_character_defaults function."""

    def test_merge_empty(self) -> None:
        """Test merging with empty input."""
        result = merge_character_defaults({})
        assert result.name == "Unnamed Character"
        assert result.settings == {}
        assert result.plugins == []

    def test_merge_partial(self) -> None:
        """Test merging with partial input."""
        result = merge_character_defaults({"name": "CustomAgent", "bio": "Custom bio"})
        assert result.name == "CustomAgent"
        assert result.bio == "Custom bio"
        assert result.settings == {}

    def test_merge_preserves_values(self) -> None:
        """Test that merge preserves provided values."""
        result = merge_character_defaults(
            {
                "name": "Agent",
                "bio": "Bio",
                "settings": {"key": "value"},
                "plugins": ["plugin-1"],
            }
        )
        assert result.settings == {"key": "value"}
```