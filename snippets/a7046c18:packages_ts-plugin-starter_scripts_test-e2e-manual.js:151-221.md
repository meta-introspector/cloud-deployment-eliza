# a7046c18:packages_ts-plugin-starter_scripts_test-e2e-manual.js:151-221

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/ts-plugin-starter/scripts/test-e2e-manual.js:151-221
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        },
      };

      const testState = {
        values: {},
        data: {},
        text: "",
      };

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
  {
    name: "starter_service_test",
    fn: async (runtime) => {
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
];

console.log(`Test Suite: plugin_starter_test_suite`);
console.log(`Description: E2E tests for the starter plugin`);
console.log("─".repeat(50));

let passed = 0;
let failed = 0;

// Run each test
for (const test of tests) {
  try {
    console.log(`\n▶️  Running test: ${test.name}`);
    await test.fn(mockRuntime);
    console.log(`✅ ${test.name} - PASSED`);
    passed++;
  } catch (error) {
    console.log(`❌ ${test.name} - FAILED`);
    console.log(`   Error: ${error.message}`);
    failed++;
  }
}

console.log(`\n${"─".repeat(50)}`);
console.log(`\n📊 Test Summary: ${passed} passed, ${failed} failed\n`);

process.exit(failed > 0 ? 1 : 0);
```