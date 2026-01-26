# a7046c18:packages_core_interop_typescript___tests___wasm-loader.test.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/interop/typescript/__tests__/wasm-loader.test.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      expect(parsed.values.agentName).toBe("TestAgent");
      expect(parsed.values.count).toBe(5);
    });

    test("should handle null state", () => {
      const json = JSON.stringify(null);
      expect(json).toBe("null");
    });
  });

  describe("WASM Export Interface", () => {
    // Mock WASM exports to test the expected interface
    test("should define expected export functions", () => {
      // This test validates the interface contract
      const mockExports: WasmPluginExports = {
        get_manifest: () =>
          JSON.stringify({ name: "test", description: "Test" }),
        init: (_config: string) => {},
        validate_action: (_action: string, _memory: string, _state: string) =>
          true,
        invoke_action: (
          _action: string,
          _memory: string,
          _state: string,
          _options: string,
        ) => JSON.stringify({ success: true }),
        get_provider: (_provider: string, _memory: string, _state: string) =>
          JSON.stringify({ text: "test" }),
        validate_evaluator: (
          _evaluator: string,
          _memory: string,
          _state: string,
        ) => false,
        invoke_evaluator: (
          _evaluator: string,
          _memory: string,
          _state: string,
        ) => "null",
        alloc: (_size: number) => 0,
        dealloc: (_ptr: number, _size: number) => {},
      };

      expect(typeof mockExports.get_manifest).toBe("function");
      expect(typeof mockExports.init).toBe("function");
      expect(typeof mockExports.validate_action).toBe("function");
      expect(typeof mockExports.invoke_action).toBe("function");
      expect(typeof mockExports.get_provider).toBe("function");
      expect(typeof mockExports.validate_evaluator).toBe("function");
      expect(typeof mockExports.invoke_evaluator).toBe("function");
      expect(typeof mockExports.alloc).toBe("function");
      expect(typeof mockExports.dealloc).toBe("function");
    });

    test("should get manifest from exports", () => {
      const manifest: PluginManifest = {
        name: "wasm-plugin",
        description: "WASM Plugin",
        version: "1.0.0",
        language: "rust",
        actions: [{ name: "TEST", description: "Test action" }],
      };

      const mockExports: Partial<WasmPluginExports> = {
        get_manifest: () => JSON.stringify(manifest),
      };

      if (!mockExports.get_manifest) {
        throw new Error("get_manifest not defined");
      }
      const result = JSON.parse(mockExports.get_manifest());
      expect(result.name).toBe("wasm-plugin");
      expect(result.actions[0].name).toBe("TEST");
    });

    test("should invoke action through exports", () => {
      const mockExports: Partial<WasmPluginExports> = {
        validate_action: (action, memory, _state) => {
          const memObj = JSON.parse(memory);
          return (
            action === "VALID_ACTION" && memObj.content && memObj.content.text !== undefined
          );
        },
        invoke_action: (action, memory, _state, _options) => {
          const memObj = JSON.parse(memory);
          return JSON.stringify({
            success: true,
            text: `Executed ${action} with: ${memObj.content && memObj.content.text ? memObj.content.text : ""}`,
          });
        },
      };

      const memory = JSON.stringify({ content: { text: "Hello" } });
      const state = JSON.stringify({ values: {} });

      if (!mockExports.validate_action) {
        throw new Error("validate_action not defined");
      }
      expect(mockExports.validate_action("VALID_ACTION", memory, state)).toBe(
        true,
      );
      expect(
        mockExports.validate_action("INVALID_ACTION", memory, state),
      ).toBe(false);

      if (!mockExports.invoke_action) {
        throw new Error("invoke_action not defined");
      }
      const result = JSON.parse(
        mockExports.invoke_action("VALID_ACTION", memory, state, "{}"),
      );
      expect(result.success).toBe(true);
      expect(result.text).toContain("Hello");
    });

    test("should get provider data through exports", () => {
      const mockExports: Partial<WasmPluginExports> = {
        get_provider: (provider, _memory, _state) => {
          if (provider === "TIME") {
            return JSON.stringify({
              text: "Current time is 12:00",
              values: { hour: 12 },
              data: { timezone: "UTC" },
            });
          }
          return JSON.stringify({ text: null, values: null, data: null });
        },
      };

      if (!mockExports.get_provider) {
        throw new Error("get_provider not defined");
      }
      const result = JSON.parse(mockExports.get_provider("TIME", "{}", "{}"));
      expect(result.text).toBe("Current time is 12:00");
      expect(result.values.hour).toBe(12);

      const emptyResult = JSON.parse(
        mockExports.get_provider("UNKNOWN", "{}", "{}"),
      );
      expect(emptyResult.text).toBeNull();
    });
  });

  describe("Plugin Adapter Creation", () => {
    test("should create action wrapper from manifest", () => {
      const manifest: PluginManifest = {
        name: "adapter-test",
        description: "Test",
        version: "1.0.0",
        language: "rust",
        actions: [
```