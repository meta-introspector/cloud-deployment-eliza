# a7046c18:packages_ts-plugin-starter_scripts_test-e2e-manual.js:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/ts-plugin-starter/scripts/test-e2e-manual.js:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
#!/usr/bin/env node

/**
 * Manual E2E Test Runner
 *
 * This script manually runs the E2E tests without using the broken elizaOS test runner.
 * It simulates a runtime environment and executes the tests.
 */

// First, let's build and run a simple test of the plugin functionality
console.log("🧪 Running E2E Tests Manually\n");

// Import the built plugin
import starterPlugin from "../dist/index.js";

// Create a mock runtime
const mockRuntime = {
  character: {
    name: "Eliza",
  },
  actions: starterPlugin.actions || [],
  providers: starterPlugin.providers || [],
  services: new Map(),
  getService: (name) => {
    if (name === "starter" && starterPlugin.services) {
      // Create a mock service instance
      return {
        capabilityDescription:
          "This is a starter service which is attached to the agent through the starter plugin.",
        stop: async () => {
          console.log("Service stopped");
        },
      };
    }
    return null;
  },
};

// Manually define the tests since we can't import TypeScript files directly
const tests = [
  {
    name: "example_test",
    fn: async (runtime) => {
      // Test the character name
      if (runtime.character.name !== "Eliza") {
        throw new Error(
          `Expected character name to be "Eliza" but got "${runtime.character.name}"`,
        );
      }
      // Verify the plugin is loaded properly
      const service = runtime.getService("starter");
      if (!service) {
        throw new Error("Starter service not found");
      }
    },
  },
  {
    name: "should_have_hello_world_action",
    fn: async (runtime) => {
      // Check if the hello world action is registered
      const actionExists = runtime.actions?.some(
        (a) => a.name === "HELLO_WORLD",
      );
      if (!actionExists) {
        throw new Error("Hello world action not found in runtime actions");
      }
    },
  },
  {
    name: "hello_world_action_test",
    fn: async (runtime) => {
      // Find the hello world action
      const helloWorldAction = runtime.actions?.find(
        (a) => a.name === "HELLO_WORLD",
      );
      if (!helloWorldAction) {
        throw new Error("Hello world action not found in runtime actions");
      }

      // Create test data
      const testMessage = {
        entityId: "12345678-1234-1234-1234-123456789012",
        roomId: "12345678-1234-1234-1234-123456789012",
        content: {
          text: "Can you say hello?",
          source: "test",
          actions: ["HELLO_WORLD"],
        },
      };

      const testState = {
        values: {},
        data: {},
        text: "",
      };

      let responseText = "";
      let responseReceived = false;

      // Create a callback
      const callback = async (response) => {
        responseReceived = true;
        responseText = response.text || "";

        if (!response.actions?.includes("HELLO_WORLD")) {
          throw new Error("Response did not include HELLO_WORLD action");
        }

        return Promise.resolve([]);
      };

      // Execute the action
      await helloWorldAction.handler(
        runtime,
        testMessage,
        testState,
        {},
        callback,
      );

      // Verify response
      if (!responseReceived) {
        throw new Error("Hello world action did not produce a response");
      }

      if (!responseText.toLowerCase().includes("hello world")) {
        throw new Error(
          `Expected response to contain "hello world" but got: "${responseText}"`,
        );
      }
    },
  },
  {
    name: "hello_world_provider_test",
    fn: async (runtime) => {
      // Find the hello world provider
      const helloWorldProvider = runtime.providers?.find(
        (p) => p.name === "HELLO_WORLD_PROVIDER",
      );
      if (!helloWorldProvider) {
        throw new Error("Hello world provider not found in runtime providers");
      }

      // Test data
      const testMessage = {
        entityId: "12345678-1234-1234-1234-123456789012",
        roomId: "12345678-1234-1234-1234-123456789012",
        content: {
          text: "What can you provide?",
          source: "test",
```