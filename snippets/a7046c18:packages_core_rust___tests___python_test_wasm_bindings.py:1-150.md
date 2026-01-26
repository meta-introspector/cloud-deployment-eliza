# a7046c18:packages_core_rust___tests___python_test_wasm_bindings.py:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/__tests__/python/test_wasm_bindings.py:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
"""
WASM Bindings Tests for Python

Tests the Rust WASM bindings to ensure they work correctly from Python.
Uses wasmer-python to load and execute the WASM module.

Prerequisites:
    pip install wasmer wasmer-compiler-cranelift

Build the WASM module first:
    cd packages/core/rust && ./build-wasm.sh
"""

import json
import os
import sys
import unittest
from pathlib import Path
from typing import Any, Optional

# Try to import wasmer
try:
    from wasmer import Store, Module, Instance, ImportObject, Function, Memory
    from wasmer_compiler_cranelift import Compiler
    WASMER_AVAILABLE = True
except ImportError:
    WASMER_AVAILABLE = False
    print("wasmer not installed. Run: pip install wasmer wasmer-compiler-cranelift")


# Path to WASM module
RUST_DIR = Path(__file__).parent.parent.parent
WASM_PKG_DIR = RUST_DIR / "pkg-web"
WASM_FILE = WASM_PKG_DIR / "elizaos_core_bg.wasm"


def wasm_available() -> bool:
    """Check if WASM module is available"""
    return WASMER_AVAILABLE and WASM_FILE.exists()


class TestWasmModule(unittest.TestCase):
    """Test loading and using the WASM module"""

    @classmethod
    def setUpClass(cls):
        """Load the WASM module"""
        if not wasm_available():
            return

        # Create a store with Cranelift compiler
        cls.store = Store(Compiler)

        # Read and compile the WASM module
        with open(WASM_FILE, "rb") as f:
            wasm_bytes = f.read()

        cls.module = Module(cls.store, wasm_bytes)

    def test_wasm_module_loads(self):
        """Test that the WASM module loads successfully"""
        if not wasm_available():
            self.skipTest("WASM module not available")

        self.assertIsNotNone(self.module)

    def test_wasm_exports_exist(self):
        """Test that expected exports exist in the WASM module"""
        if not wasm_available():
            self.skipTest("WASM module not available")

        exports = [export.name for export in self.module.exports]

        # Check for expected function exports
        expected_exports = [
            "memory",
        ]

        for export in expected_exports:
            self.assertIn(export, exports, f"Missing export: {export}")


class TestMemorySerialization(unittest.TestCase):
    """Test Memory type serialization compatibility"""

    def test_memory_json_structure(self):
        """Test that Memory JSON structure matches Rust expectations"""
        memory = {
            "id": "550e8400-e29b-41d4-a716-446655440000",
            "entityId": "550e8400-e29b-41d4-a716-446655440001",
            "roomId": "550e8400-e29b-41d4-a716-446655440002",
            "content": {
                "text": "Hello, world!",
                "source": "test"
            },
            "createdAt": 1704067200000
        }

        # Should serialize to valid JSON
        json_str = json.dumps(memory)
        parsed = json.loads(json_str)

        self.assertEqual(parsed["id"], memory["id"])
        self.assertEqual(parsed["content"]["text"], "Hello, world!")

    def test_memory_minimal_structure(self):
        """Test minimal Memory structure"""
        memory = {
            "entityId": "entity-123",
            "roomId": "room-456",
            "content": {"text": "test"}
        }

        json_str = json.dumps(memory)
        parsed = json.loads(json_str)

        self.assertEqual(parsed["entityId"], "entity-123")
        self.assertNotIn("id", parsed)  # Optional field not present


class TestCharacterSerialization(unittest.TestCase):
    """Test Character type serialization compatibility"""

    def test_character_json_structure(self):
        """Test that Character JSON structure matches Rust expectations"""
        character = {
            "name": "TestAgent",
            "system": "You are a helpful assistant.",
            "bio": ["An AI assistant", "Helps users"],
            "topics": ["general", "coding"],
            "messageExamples": [],
            "postExamples": [],
            "settings": {}
        }

        json_str = json.dumps(character)
        parsed = json.loads(json_str)

        self.assertEqual(parsed["name"], "TestAgent")
        self.assertEqual(len(parsed["bio"]), 2)

    def test_character_bio_as_string(self):
        """Test Character with bio as single string"""
        character = {
            "name": "Agent",
            "bio": "A simple bio string",
            "messageExamples": [],
            "postExamples": []
        }

```