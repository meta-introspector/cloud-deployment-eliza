# a7046c18:packages_ts-plugin-starter_src___tests___e2e_plugin-starter.e2e.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/ts-plugin-starter/src/__tests__/e2e/plugin-starter.e2e.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import type {
  Content,
  HandlerCallback,
  IAgentRuntime,
  TestSuite,
} from "@elizaos/core";

/**
 * E2E (End-to-End) Test Suite for elizaOS Plugins
 * ================================================
 *
 * This file contains end-to-end tests that run within a real elizaOS runtime environment.
 * Unlike unit tests that test individual components in isolation, e2e tests validate
 * the entire plugin behavior in a production-like environment.
 *
 * NOTE: The tests are properly structured and included in the plugin build.
 * If the test runner is not detecting these tests, it may be looking at the wrong
 * plugin name or there may be a test runner configuration issue. The tests are
 * exported correctly through src/tests.ts and included in the plugin's tests array.
 *
 * HOW E2E TESTS WORK:
 * -------------------
 * 1. Tests are executed by the elizaOS test runner using `elizaos test e2e`
 * 2. Each test receives a real runtime instance with the plugin loaded
 * 3. Tests can interact with the runtime just like in production
 * 4. Tests throw errors to indicate failure (no assertion library needed)
 *
 * WRITING NEW E2E TESTS:
 * ----------------------
 * 1. Add a new test object to the `tests` array below
 * 2. Each test must have:
 *    - `name`: A unique identifier for the test
 *    - `fn`: An async function that receives the runtime and performs the test
 *
 * Example structure:
 * ```typescript
 * {
 *   name: 'my_new_test',
 *   fn: async (runtime: IAgentRuntime) => {
 *     // Your test logic here
 *     if (someCondition !== expected) {
 *       throw new Error('Test failed: reason');
 *     }
 *   }
 * }
 * ```
 *
 * BEST PRACTICES:
 * ---------------
 * - Test real user scenarios, not implementation details
 * - Use descriptive test names that explain what's being tested
 * - Include clear error messages that help diagnose failures
 * - Test both success and failure paths
 * - Clean up any resources created during tests
 *
 * AVAILABLE RUNTIME METHODS:
 * --------------------------
 * - runtime.getService(type): Get a service instance
 * - runtime.character: Access character configuration
 * - runtime.models: Access AI models
 * - runtime.db: Access database methods
 * - runtime.actions: Access registered actions
 * - runtime.providers: Access registered providers
 *
 * For more details, see the elizaOS documentation.
 */

// Define minimal interfaces for the types we need
type UUID = `${string}-${string}-${string}-${string}-${string}`;

interface Memory {
  entityId: UUID;
  roomId: UUID;
  content: {
    text: string;
    source: string;
    actions?: string[];
  };
}

interface State {
  values: Record<string, any>;
  data: Record<string, any>;
  text: string;
}

export const StarterPluginTestSuite: TestSuite = {
  name: "plugin_starter_test_suite",
  tests: [
    /**
     * Basic Plugin Verification Test
     * ------------------------------
     * This test verifies that the plugin is properly loaded and initialized
     * within the runtime environment.
     */
    {
      name: "example_test",
      fn: async (runtime: IAgentRuntime) => {
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

    /**
     * Action Registration Test
     * ------------------------
     * Verifies that custom actions are properly registered with the runtime.
     * This is important to ensure actions are available for the agent to use.
     */
    {
      name: "should_have_hello_world_action",
      fn: async (runtime: IAgentRuntime) => {
        // Access actions through runtime.actions instead of getPlugin
        const actionExists = runtime.actions?.some(
          (a) => a.name === "HELLO_WORLD",
        );
        if (!actionExists) {
          throw new Error("Hello world action not found in runtime actions");
        }
      },
    },

    /**
     * Hello World Action Response Test
     * ---------------------------------
     * This test demonstrates a complete scenario where:
     * 1. The agent is asked to say "hello"
     * 2. The HELLO_WORLD action is triggered
     * 3. The agent responds with text containing "hello world"
     *
     * This is a key pattern for testing agent behaviors - you simulate
     * a user message and verify the agent's response.
     */
    {
      name: "hello_world_action_test",
      fn: async (runtime: IAgentRuntime) => {
        // Create a test message asking the agent to say hello
        const testMessage: Memory = {
          entityId: "12345678-1234-1234-1234-123456789012" as UUID,
          roomId: "12345678-1234-1234-1234-123456789012" as UUID,
          content: {
```