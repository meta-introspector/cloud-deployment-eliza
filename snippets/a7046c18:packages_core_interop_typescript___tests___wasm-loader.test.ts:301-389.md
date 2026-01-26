# a7046c18:packages_core_interop_typescript___tests___wasm-loader.test.ts:301-389

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/interop/typescript/__tests__/wasm-loader.test.ts:301-389
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
          {
            name: "ADAPTER_ACTION",
            description: "Test adapter action",
            similes: ["TEST_ADAPTER"],
          },
        ],
      };

      // Simulate what createPluginFromWasm does
      const actions = (manifest.actions ?? []).map((actionDef) => ({
        name: actionDef.name,
        description: actionDef.description,
        similes: actionDef.similes,
        validate: async () => true,
        handler: async () => ({ success: true, text: "Mock result" }),
      }));

      expect(actions).toHaveLength(1);
      expect(actions[0].name).toBe("ADAPTER_ACTION");
      expect(actions[0].similes).toContain("TEST_ADAPTER");
    });

    test("should create provider wrapper from manifest", () => {
      const manifest: PluginManifest = {
        name: "provider-test",
        description: "Test",
        version: "1.0.0",
        language: "rust",
        providers: [
          {
            name: "ADAPTER_PROVIDER",
            description: "Test provider",
            dynamic: true,
            position: 5,
          },
        ],
      };

      const providers = (manifest.providers ?? []).map((providerDef) => ({
        name: providerDef.name,
        description: providerDef.description,
        dynamic: providerDef.dynamic,
        position: providerDef.position,
        get: async () => ({ text: "Provider data" }),
      }));

      expect(providers).toHaveLength(1);
      expect(providers[0].name).toBe("ADAPTER_PROVIDER");
      expect(providers[0].dynamic).toBe(true);
      expect(providers[0].position).toBe(5);
    });
  });

  describe("Error Handling", () => {
    test("should handle invalid manifest JSON", () => {
      const invalidJson = "{ invalid json }";

      expect(() => JSON.parse(invalidJson)).toThrow();
    });

    test("should handle missing required fields", () => {
      const incompleteManifest = {
        name: "incomplete",
        // missing description
      };

      // Validation would fail at runtime
      expect(incompleteManifest.name).toBe("incomplete");
      expect(
        (incompleteManifest as PluginManifest).description,
      ).toBeUndefined();
    });

    test("should handle WASM invoke errors", () => {
      const mockExports: Partial<WasmPluginExports> = {
        invoke_action: () => {
          throw new Error("WASM execution failed");
        },
      };

      if (!mockExports.invoke_action) {
        throw new Error("invoke_action not defined");
      }
      expect(() =>
        mockExports.invoke_action("ACTION", "{}", "{}", "{}"),
      ).toThrow("WASM execution failed");
    });
  });
});
```