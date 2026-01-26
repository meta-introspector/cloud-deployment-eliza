# a7046c18:packages_core_interop_typescript___tests___python-bridge.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/interop/typescript/__tests__/python-bridge.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
/**
 * Tests for Python Plugin Bridge
 */

import { describe, expect, test } from "bun:test";
import type {
  ActionInvokeRequest,
  ActionResultResponse,
  IPCRequest,
  PluginManifest,
  ProviderGetRequest,
  ProviderResultResponse,
  ValidationResponse,
} from "../types";

describe("Python Bridge", () => {
  describe("IPC Protocol", () => {
    test("should format action.invoke request correctly", () => {
      const request: ActionInvokeRequest = {
        type: "action.invoke",
        id: "req-001",
        action: "HELLO_PYTHON",
        memory: {
          id: "123",
          content: { text: "Hello" },
        } as any,
        state: {
          values: { key: "value" },
        } as any,
        options: { timeout: 5000 },
      };

      const json = JSON.stringify(request);
      const parsed = JSON.parse(json);

      expect(parsed.type).toBe("action.invoke");
      expect(parsed.action).toBe("HELLO_PYTHON");
      expect(parsed.memory.content.text).toBe("Hello");
    });

    test("should format action.validate request correctly", () => {
      const request: IPCRequest = {
        type: "action.validate",
        id: "req-002",
        action: "VALIDATE_ACTION",
        memory: { content: { text: "Test" } } as any,
        state: null,
      };

      const json = JSON.stringify(request);
      const parsed = JSON.parse(json);

      expect(parsed.type).toBe("action.validate");
      expect(parsed.action).toBe("VALIDATE_ACTION");
    });

    test("should format provider.get request correctly", () => {
      const request: ProviderGetRequest = {
        type: "provider.get",
        id: "req-003",
        provider: "PYTHON_INFO",
        memory: { content: {} } as any,
        state: { values: {}, text: "" } as any,
      };

      const json = JSON.stringify(request);
      const parsed = JSON.parse(json);

      expect(parsed.type).toBe("provider.get");
      expect(parsed.provider).toBe("PYTHON_INFO");
    });

    test("should format plugin.init request correctly", () => {
      const request: IPCRequest = {
        type: "plugin.init",
        id: "req-004",
        config: {
          API_KEY: "test-key",
          DEBUG: "true",
        },
      };

      const json = JSON.stringify(request);
      const parsed = JSON.parse(json);

      expect(parsed.type).toBe("plugin.init");
      expect(parsed.config.API_KEY).toBe("test-key");
    });
  });

  describe("IPC Response Parsing", () => {
    test("should parse action.result response", () => {
      const responseJson = JSON.stringify({
        type: "action.result",
        id: "req-001",
        result: {
          success: true,
          text: "Hello from Python! 🐍",
          data: { language: "python" },
        },
      });

      const response: ActionResultResponse = JSON.parse(responseJson);

      expect(response.type).toBe("action.result");
      expect(response.result.success).toBe(true);
      expect(response.result.text).toBe("Hello from Python! 🐍");
    });

    test("should parse validate.result response", () => {
      const responseJson = JSON.stringify({
        type: "validate.result",
        id: "req-002",
        valid: true,
      });

      const response: ValidationResponse = JSON.parse(responseJson);

      expect(response.type).toBe("validate.result");
      expect(response.valid).toBe(true);
    });

    test("should parse provider.result response", () => {
      const responseJson = JSON.stringify({
        type: "provider.result",
        id: "req-003",
        result: {
          text: "Python environment info",
          values: { version: "3.11" },
          data: { platform: "linux" },
        },
      });

      const response: ProviderResultResponse = JSON.parse(responseJson);

      expect(response.type).toBe("provider.result");
      expect(response.result.text).toBe("Python environment info");
      expect(response.result.values && response.result.values.version).toBe("3.11");
    });

    test("should parse error response", () => {
      const responseJson = JSON.stringify({
        type: "error",
        id: "req-005",
        error: "Module not found",
        details: "Traceback...",
      });

      const response = JSON.parse(responseJson);

```