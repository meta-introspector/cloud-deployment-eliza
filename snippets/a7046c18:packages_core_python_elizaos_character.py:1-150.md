# a7046c18:packages_core_python_elizaos_character.py:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/python/elizaos/character.py:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
"""
Character utilities for elizaOS.

This module provides utilities for parsing and validating character configurations.
"""

from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any

from pydantic import ValidationError

from elizaos.types.agent import Character


class CharacterValidationError(Exception):
    """Exception raised when character validation fails."""

    def __init__(self, message: str, errors: list[str] | None = None) -> None:
        super().__init__(message)
        self.errors = errors or []


class CharacterLoadError(Exception):
    """Exception raised when character loading fails."""

    def __init__(self, message: str, cause: Exception | None = None) -> None:
        super().__init__(message)
        self.cause = cause


def parse_character(input_data: str | dict[str, Any] | Character) -> Character:
    """
    Parse character input from various formats (string path, object, or Character).

    Args:
        input_data: Character data in various formats

    Returns:
        Parsed Character object

    Raises:
        CharacterValidationError: If validation fails
        CharacterLoadError: If loading from file fails
    """
    if isinstance(input_data, Character):
        return input_data

    if isinstance(input_data, str):
        # Treat as file path
        return load_character_from_file(input_data)

    if isinstance(input_data, dict):
        return validate_and_create_character(input_data)

    raise CharacterValidationError("Invalid character input format")


def load_character_from_file(path: str) -> Character:
    """
    Load a character configuration from a JSON file.

    Args:
        path: Path to the character JSON file

    Returns:
        Parsed Character object

    Raises:
        CharacterLoadError: If loading fails
    """
    try:
        file_path = Path(path)
        if not file_path.exists():
            raise CharacterLoadError(f"Character file not found: {path}")

        with open(file_path, encoding="utf-8") as f:
            data = json.load(f)

        return validate_and_create_character(data)
    except json.JSONDecodeError as e:
        raise CharacterLoadError(f"Invalid JSON in character file: {path}", cause=e) from e
    except CharacterValidationError:
        raise
    except Exception as e:
        raise CharacterLoadError(f"Failed to load character from {path}: {e}", cause=e) from e


def validate_and_create_character(data: dict[str, Any]) -> Character:
    """
    Validate character data and create a Character instance.

    Args:
        data: Character data dictionary

    Returns:
        Validated Character object

    Raises:
        CharacterValidationError: If validation fails
    """
    try:
        return Character(**data)
    except ValidationError as e:
        errors = [f"{err['loc']}: {err['msg']}" for err in e.errors()]
        error_message = "; ".join(errors)
        raise CharacterValidationError(
            f"Character validation failed: {error_message}",
            errors=errors,
        ) from e


def validate_character_config(character: Character) -> dict[str, Any]:
    """
    Validate a character configuration.

    Args:
        character: Character to validate

    Returns:
        Validation result with isValid and errors
    """
    try:
        # Re-validate by converting to dict and back
        Character(**character.model_dump())
        return {
            "isValid": True,
            "errors": [],
        }
    except ValidationError as e:
        errors = [f"{err['loc']}: {err['msg']}" for err in e.errors()]
        return {
            "isValid": False,
            "errors": errors,
        }


def merge_character_defaults(char: dict[str, Any]) -> Character:
    """
    Merge character with default values.

    Args:
        char: Partial character configuration

    Returns:
        Complete character with defaults
    """
```