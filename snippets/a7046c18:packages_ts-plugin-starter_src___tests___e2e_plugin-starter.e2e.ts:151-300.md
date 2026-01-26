# a7046c18:packages_ts-plugin-starter_src___tests___e2e_plugin-starter.e2e.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/ts-plugin-starter/src/__tests__/e2e/plugin-starter.e2e.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
            text: "Can you say hello?",
            source: "test",
            actions: ["HELLO_WORLD"], // Specify which action we expect to trigger
          },
        };

        // Create a test state (can include context if needed)
        const testState: State = {
          values: {},
          data: {},
          text: "",
        };

        let responseText = "";
        let responseReceived = false;

        // Find the hello world action in runtime.actions
        const helloWorldAction = runtime.actions?.find(
          (a) => a.name === "HELLO_WORLD",
        );
        if (!helloWorldAction) {
          throw new Error("Hello world action not found in runtime actions");
        }

        // Create a callback that captures the agent's response
        // This simulates how the runtime would handle the action's response
        const callback: HandlerCallback = async (response: Content) => {
          responseReceived = true;
          responseText = response.text || "";

          // Verify the response includes the expected action
          if (!response.actions?.includes("HELLO_WORLD")) {
            throw new Error("Response did not include HELLO_WORLD action");
          }

          // Return Promise<Memory[]> as required by the HandlerCallback interface
          return Promise.resolve([]);
        };

        // Execute the action - this simulates the runtime calling the action
        await helloWorldAction.handler(
          runtime,
          testMessage,
          testState,
          {},
          callback,
        );

        // Verify we received a response
        if (!responseReceived) {
          throw new Error("Hello world action did not produce a response");
        }

        // Verify the response contains "hello world" (case-insensitive)
        if (!responseText.toLowerCase().includes("hello world")) {
          throw new Error(
            `Expected response to contain "hello world" but got: "${responseText}"`,
          );
        }

        // Success! The agent responded with "hello world" as expected
      },
    },

    /**
     * Provider Functionality Test
     * ---------------------------
     * Tests that providers can supply data to the agent when needed.
     * Providers are used to fetch external data or compute values.
     */
    {
      name: "hello_world_provider_test",
      fn: async (runtime: IAgentRuntime) => {
        // Create a test message
        const testMessage: Memory = {
          entityId: "12345678-1234-1234-1234-123456789012" as UUID,
          roomId: "12345678-1234-1234-1234-123456789012" as UUID,
          content: {
            text: "What can you provide?",
            source: "test",
          },
        };

        // Create a test state
        const testState: State = {
          values: {},
          data: {},
          text: "",
        };

        // Find the hello world provider in runtime.providers
        const helloWorldProvider = runtime.providers?.find(
          (p) => p.name === "HELLO_WORLD_PROVIDER",
        );
        if (!helloWorldProvider) {
          throw new Error(
            "Hello world provider not found in runtime providers",
          );
        }

        // Test the provider
        const result = await helloWorldProvider.get(
          runtime,
          testMessage,
          testState,
        );

        if (result.text !== "I am a provider") {
          throw new Error(
            `Expected provider to return "I am a provider", got "${result.text}"`,
          );
        }
      },
    },

    /**
     * Service Lifecycle Test
     * ----------------------
     * Verifies that services can be started, accessed, and stopped properly.
     * Services run background tasks or manage long-lived resources.
     */
    {
      name: "starter_service_test",
      fn: async (runtime: IAgentRuntime) => {
        // Get the service from the runtime
        const service = runtime.getService("starter");
        if (!service) {
          throw new Error("Starter service not found");
        }

        // Check service capability description
        if (
          service.capabilityDescription !==
          "This is a starter service which is attached to the agent through the starter plugin."
        ) {
          throw new Error("Incorrect service capability description");
        }

        // Test service stop method
        await service.stop();
      },
    },

    /**
     * ADD YOUR CUSTOM TESTS HERE
     * --------------------------
     * To add a new test:
     *
     * 1. Copy this template:
     * ```typescript
```