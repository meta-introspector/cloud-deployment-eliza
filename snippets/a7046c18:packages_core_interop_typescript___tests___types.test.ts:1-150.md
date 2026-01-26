# a7046c18:packages_core_interop_typescript___tests___types.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/interop/typescript/__tests__/types.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
/**
 * Tests for interop types
 */

import { describe, expect, test } from "bun:test";
import type {
  ActionInvokeRequest,
  ActionManifest,
  ActionResultResponse,
  InteropProtocol,
  PluginLanguage,
  PluginManifest,
  ProviderGetRequest,
  ProviderManifest,
  ProviderResultResponse,
} from "../types";

describe("Interop Types", () => {
  describe("PluginManifest", () => {
    test("should validate complete manifest structure", () => {
      const manifest: PluginManifest = {
        name: "test-plugin",
        description: "A test plugin",
        version: "1.0.0",
        language: "rust",
        interop: {
          protocol: "wasm",
          wasmPath: "./dist/test.wasm",
        },
        config: {
          API_KEY: "test-key",
        },
        dependencies: ["other-plugin"],
        actions: [
          {
            name: "TEST_ACTION",
            description: "Test action",
            similes: ["TEST", "TESTING"],
          },
        ],
        providers: [
          {
            name: "TEST_PROVIDER",
            description: "Test provider",
            dynamic: true,
            position: 1,
            private: false,
          },
        ],
        evaluators: [
          {
            name: "TEST_EVALUATOR",
            description: "Test evaluator",
            alwaysRun: true,
            similes: ["EVALUATE"],
          },
        ],
        services: [
          {
            type: "test-service",
            description: "A test service",
          },
        ],
        routes: [
          {
            path: "/api/test",
            method: "GET",
            name: "test-route",
            public: true,
          },
        ],
        events: {
          MESSAGE_RECEIVED: ["handleMessage"],
        },
      };

      // Type validation - if this compiles, types are correct
      expect(manifest.name).toBe("test-plugin");
      expect(manifest.language).toBe("rust");
      expect(manifest.interop && manifest.interop.protocol).toBe("wasm");
      expect(manifest.actions && manifest.actions.length).toBe(1);
      expect(manifest.providers && manifest.providers.length).toBe(1);
    });

    test("should allow minimal manifest", () => {
      const minimal: PluginManifest = {
        name: "minimal-plugin",
        description: "Minimal",
        version: "1.0.0",
        language: "typescript",
      };

      expect(minimal.name).toBe("minimal-plugin");
      expect(minimal.actions).toBeUndefined();
    });
  });

  describe("InteropProtocol", () => {
    test("should accept valid protocols", () => {
      const protocols: InteropProtocol[] = ["wasm", "ffi", "ipc", "native"];

      expect(protocols).toHaveLength(4);
      expect(protocols).toContain("wasm");
      expect(protocols).toContain("ffi");
      expect(protocols).toContain("ipc");
      expect(protocols).toContain("native");
    });
  });

  describe("PluginLanguage", () => {
    test("should accept valid languages", () => {
      const languages: PluginLanguage[] = ["typescript", "rust", "python"];

      expect(languages).toHaveLength(3);
      expect(languages).toContain("typescript");
      expect(languages).toContain("rust");
      expect(languages).toContain("python");
    });
  });

  describe("IPC Messages", () => {
    test("should create valid ActionInvokeRequest", () => {
      const request: ActionInvokeRequest = {
        type: "action.invoke",
        id: "req-123",
        action: "TEST_ACTION",
        memory: {
          id: "mem-1",
          content: { text: "Hello" },
        } as any,
        state: {
          text: "Current state",
          values: {},
        } as any,
        options: { timeout: 5000 },
      };

      expect(request.type).toBe("action.invoke");
      expect(request.action).toBe("TEST_ACTION");
      expect(request.id).toBe("req-123");
    });

    test("should create valid ActionResultResponse", () => {
      const response: ActionResultResponse = {
        type: "action.result",
        id: "req-123",
        result: {
          success: true,
          text: "Action completed",
          data: { key: "value" },
```