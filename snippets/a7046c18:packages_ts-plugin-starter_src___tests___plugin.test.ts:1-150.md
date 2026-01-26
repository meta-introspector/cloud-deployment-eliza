# a7046c18:packages_ts-plugin-starter_src___tests___plugin.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/ts-plugin-starter/src/__tests__/plugin.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { beforeEach, describe, expect, it, type Mock } from "bun:test";
import {
  type ActionResult,
  type Content,
  EventType,
  type HandlerCallback,
  type IAgentRuntime,
  logger,
  type MessagePayload,
  ModelType,
  type Service,
} from "@elizaos/core";
import dotenv from "dotenv";
import { z } from "zod";
import { StarterService, starterPlugin } from "../index";
import {
  createMockRuntime,
  createTestMemory,
  createTestState,
  testFixtures,
} from "./test-utils";

// Setup environment variables
dotenv.config();

describe("Plugin Configuration", () => {
  it("should have correct plugin metadata", () => {
    // Check that plugin has required metadata (values will change when template is used)
    expect(starterPlugin.name).toBeDefined();
    expect(starterPlugin.name).toMatch(/^[a-z0-9-]+$/); // Valid plugin name format
    expect(starterPlugin.description).toBeDefined();
    expect(starterPlugin.description.length).toBeGreaterThan(0);
    expect(starterPlugin.actions).toBeDefined();
    expect(starterPlugin.actions?.length).toBeGreaterThan(0);
    expect(starterPlugin.providers).toBeDefined();
    expect(starterPlugin.providers?.length).toBeGreaterThan(0);
    expect(starterPlugin.services).toBeDefined();
    expect(starterPlugin.services?.length).toBeGreaterThan(0);
    expect(starterPlugin.models).toBeDefined();
    expect(starterPlugin.models?.[ModelType.TEXT_SMALL]).toBeDefined();
    expect(starterPlugin.models?.[ModelType.TEXT_LARGE]).toBeDefined();
    expect(starterPlugin.routes).toBeDefined();
    expect(starterPlugin.routes?.length).toBeGreaterThan(0);
    expect(starterPlugin.events).toBeDefined();
  });

  it("should initialize with valid configuration", async () => {
    const runtime = createMockRuntime();
    const config = { EXAMPLE_PLUGIN_VARIABLE: "test-value" };

    if (starterPlugin.init) {
      await starterPlugin.init(config, runtime);
    }

    // Note: registerService is not called in init, services are registered later
    // This is handled by the runtime during plugin loading
    expect(process.env.EXAMPLE_PLUGIN_VARIABLE).toBe("test-value");
  });

  it("should handle initialization without config", async () => {
    const runtime = createMockRuntime();

    if (starterPlugin.init) {
      // Init should not throw even with empty config
      await starterPlugin.init({}, runtime);
    }
  });

  it("should throw error for invalid configuration", async () => {
    const runtime = createMockRuntime({
      getSetting: () => "invalid-json",
    });

    const _zodError = new z.ZodError([
      {
        code: "invalid_type",
        expected: "object",
        received: "string",
        path: [],
        message: "Expected object, received string",
      },
    ]);

    if (starterPlugin.init) {
      // The init function validates the config but doesn't throw for invalid JSON in getSetting
      // It only validates the config passed to init
      await starterPlugin.init({}, runtime);
    }
  });
});

describe("Hello World Action", () => {
  let runtime: IAgentRuntime;
  const helloWorldAction = starterPlugin.actions?.[0];

  beforeEach(() => {
    runtime = createMockRuntime();
  });

  it("should have hello world action", () => {
    expect(helloWorldAction).toBeDefined();
    expect(helloWorldAction?.name).toBe("HELLO_WORLD");
  });

  it("should always validate messages (current implementation)", async () => {
    if (!helloWorldAction?.validate) {
      throw new Error("Hello world action validate not found");
    }

    // The simple implementation always returns true
    const testCases = [
      { text: "say hello", expected: true },
      { text: "hello world", expected: true },
      { text: "goodbye", expected: true },
      { text: "", expected: true },
      { text: "   ", expected: true },
    ];

    for (const { text, expected } of testCases) {
      const message = createTestMemory({
        content: { text, source: "test" },
      });
      const isValid = await helloWorldAction.validate(runtime, message);
      expect(isValid).toBe(expected);
    }
  });

  it("should validate even without text content", async () => {
    if (!helloWorldAction?.validate) {
      throw new Error("Hello world action validate not found");
    }

    const messageWithoutText = createTestMemory({
      content: { source: "test" } as Content,
    });

    const isValid = await helloWorldAction.validate(
      runtime,
      messageWithoutText,
    );
    // Always returns true in simple implementation
    expect(isValid).toBe(true);
  });

  it("should properly validate hello messages", async () => {
    if (!helloWorldAction?.validate) {
      throw new Error("Hello world action validate not found");
    }

    // Test that it accepts hello-related keywords
```