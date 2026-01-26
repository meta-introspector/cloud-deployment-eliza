# a7046c18:packages_core_interop_typescript___tests___wasm-loader.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/interop/typescript/__tests__/wasm-loader.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
/**
 * Tests for WASM Plugin Loader
 */

import { describe, expect, test } from "bun:test";
import type { PluginManifest, WasmPluginExports } from "../types";

// We need to test the loader logic without actual WASM files
// These tests validate the adapter patterns and JSON serialization

describe("WASM Loader", () => {
  describe("Plugin Manifest Parsing", () => {
    test("should parse a valid manifest JSON", () => {
      const manifestJson = JSON.stringify({
        name: "test-rust-plugin",
        description: "A test plugin compiled from Rust",
        version: "1.0.0",
        language: "rust",
        actions: [
          {
            name: "RUST_ACTION",
            description: "Action from Rust",
          },
        ],
        providers: [
          {
            name: "RUST_PROVIDER",
          },
        ],
      });

      const manifest: PluginManifest = JSON.parse(manifestJson);

      expect(manifest.name).toBe("test-rust-plugin");
      expect(manifest.language).toBe("rust");
      expect(manifest.actions && manifest.actions.length).toBe(1);
      expect(manifest.actions && manifest.actions[0] && manifest.actions[0].name).toBe("RUST_ACTION");
    });
  });

  describe("Action Result Serialization", () => {
    test("should serialize and deserialize action results", () => {
      const result = {
        success: true,
        text: "Action completed successfully",
        data: {
          processed: true,
          count: 42,
        },
        values: {
          key: "value",
        },
      };

      const json = JSON.stringify(result);
      const parsed = JSON.parse(json);

      expect(parsed.success).toBe(true);
      expect(parsed.text).toBe("Action completed successfully");
      expect(parsed.data.processed).toBe(true);
      expect(parsed.data.count).toBe(42);
    });

    test("should handle failure results", () => {
      const result = {
        success: false,
        error: "Something went wrong",
      };

      const json = JSON.stringify(result);
      const parsed = JSON.parse(json);

      expect(parsed.success).toBe(false);
      expect(parsed.error).toBe("Something went wrong");
    });
  });

  describe("Provider Result Serialization", () => {
    test("should serialize provider results with text", () => {
      const result = {
        text: "Provider context for the LLM",
        values: { template_var: "value" },
        data: { structured: "data" },
      };

      const json = JSON.stringify(result);
      const parsed = JSON.parse(json);

      expect(parsed.text).toBe("Provider context for the LLM");
      expect(parsed.values.template_var).toBe("value");
    });

    test("should handle empty provider results", () => {
      const result = {
        text: null,
        values: null,
        data: null,
      };

      const json = JSON.stringify(result);
      const parsed = JSON.parse(json);

      expect(parsed.text).toBeNull();
    });
  });

  describe("Memory Serialization", () => {
    test("should serialize memory objects for WASM", () => {
      const memory = {
        id: "123e4567-e89b-12d3-a456-426614174000",
        agentId: "123e4567-e89b-12d3-a456-426614174001",
        entityId: "123e4567-e89b-12d3-a456-426614174002",
        roomId: "123e4567-e89b-12d3-a456-426614174003",
        content: {
          text: "Hello from TypeScript",
          actions: ["ACTION_1", "ACTION_2"],
          source: "test",
        },
        createdAt: Date.now(),
      };

      const json = JSON.stringify(memory);
      const parsed = JSON.parse(json);

      expect(parsed.id).toBe(memory.id);
      expect(parsed.content.text).toBe("Hello from TypeScript");
      expect(parsed.content.actions).toHaveLength(2);
    });
  });

  describe("State Serialization", () => {
    test("should serialize state objects for WASM", () => {
      const state = {
        text: "Current conversation context",
        values: {
          agentName: "TestAgent",
          userName: "TestUser",
          count: 5,
        },
        data: {
          providers: {
            time: { currentTime: "2024-01-01T00:00:00Z" },
          },
        },
      };

      const json = JSON.stringify(state);
      const parsed = JSON.parse(json);

      expect(parsed.text).toBe("Current conversation context");
```