# a7046c18:packages_core_typescript_src___tests___plugin.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/plugin.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import {
  isValidPluginShape,
  loadPlugin,
  normalizePluginName,
  resolvePluginDependencies,
  resolvePlugins,
  tryInstallPlugin,
} from "../plugin";
import type { Plugin } from "../types";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("Plugin Functions", () => {
  let originalEnv: Record<string, string | undefined>;

  beforeEach(() => {
    originalEnv = { ...process.env };
  });

  afterEach(() => {
    for (const k of Object.keys(process.env)) {
      if (!(k in originalEnv)) {
        delete process.env[k];
      }
    }
    for (const [k, v] of Object.entries(originalEnv)) {
      process.env[k] = v;
    }
  });

  describe("isValidPlugin", () => {
    test("should return true for valid plugin shape", () => {
      const plugin = {
        name: "test-plugin",
        description: "A test plugin",
        actions: [],
        services: [],
      };

      expect(isValidPluginShape(plugin)).toBe(true);
    });

    test("should return false for invalid plugin shape", () => {
      const invalidPlugin = {
        name: "test-plugin",
        // Missing required properties
      };

      expect(isValidPluginShape(invalidPlugin)).toBe(false);
    });

    test("should return false for null or undefined", () => {
      expect(isValidPluginShape(null)).toBe(false);
      expect(isValidPluginShape(undefined)).toBe(false);
    });

    test("should return false for non-object types", () => {
      expect(isValidPluginShape("string")).toBe(false);
      expect(isValidPluginShape(123)).toBe(false);
      expect(isValidPluginShape(true)).toBe(false);
    });
  });

  describe("loadPlugin", () => {
    test("should validate and return plugin object when provided", async () => {
      const plugin: Plugin = {
        name: "test-plugin",
        description: "A test plugin",
        actions: [],
        services: [],
        providers: [],
        evaluators: [],
      };

      const result = await loadPlugin(plugin);

      expect(result).toBe(plugin);
      expect(result?.name).toBe("test-plugin");
    });

    test("should return null for invalid plugin object", async () => {
      const invalidPlugin = {
        // Missing name
        description: "Invalid plugin",
      } as any;

      const result = await loadPlugin(invalidPlugin);

      expect(result).toBeNull();
    });

    test("should handle plugin loading errors gracefully", async () => {
      // Test with a non-existent plugin
      const result = await loadPlugin("@elizaos/non-existent-plugin");

      expect(result).toBeNull();
    });

    test.skipIf(!process.env.RUN_INTEGRATION_TESTS)(
      "should load bootstrap plugin successfully",
      async () => {
        const result = await loadPlugin("@elizaos/plugin-bootstrap");

        expect(result).toBeDefined();
        expect(result?.name).toBe("bootstrap");
      },
    );
  });

  describe("resolvePlugins", () => {
    test("should resolve simple plugin array", async () => {
      const pluginA: Plugin = {
        name: "plugin-a",
        description: "Plugin A",
        actions: [],
        services: [],
      };

      const pluginB: Plugin = {
        name: "plugin-b",
        description: "Plugin B",
        actions: [],
        services: [],
      };

      const resolved = await resolvePlugins([pluginA, pluginB]);

      expect(resolved).toHaveLength(2);
      expect(resolved.some((p) => p.name === "plugin-a")).toBe(true);
      expect(resolved.some((p) => p.name === "plugin-b")).toBe(true);
    });

    test("should resolve plugin dependencies", async () => {
      const pluginA: Plugin = {
        name: "plugin-a",
        description: "Plugin A",
        actions: [],
        services: [],
      };

      const pluginB: Plugin = {
        name: "plugin-b",
        description: "Plugin B",
        dependencies: ["plugin-a"],
        actions: [],
        services: [],
      };
```