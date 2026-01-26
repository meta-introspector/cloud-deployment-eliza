# a7046c18:packages_core_rust___tests___wasm_wasm-bindings.test.ts:151-276

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/rust/__tests__/wasm/wasm-bindings.test.ts:151-276
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      if (!wasm) return;

      const memory = wasm.parseMemory(testMemoryJson);
      expect(memory.id).toBe("550e8400-e29b-41d4-a716-446655440000");
      expect(memory.entityId).toBe("550e8400-e29b-41d4-a716-446655440001");
      expect(memory.roomId).toBe("550e8400-e29b-41d4-a716-446655440002");
    });

    it("should convert memory to JSON", () => {
      if (!wasm) return;

      const memory = wasm.WasmMemory.fromJson(testMemoryJson);
      const json = memory.toJson();
      const parsed = JSON.parse(json);

      expect(parsed.id).toBe("550e8400-e29b-41d4-a716-446655440000");
      expect(parsed.content.text).toBe("Hello, world!");
    });

    it("should pass memory round-trip test", () => {
      if (!wasm) return;

      expect(wasm.testMemoryRoundTrip(testMemoryJson)).toBe(true);
    });
  });

  describe("Character Operations", () => {
    const testCharacterJson = JSON.stringify({
      name: "TestAgent",
      system: "You are a helpful assistant.",
      bio: ["An AI assistant", "Helps users"],
      topics: ["general", "coding"],
      messageExamples: [],
      postExamples: [],
      settings: {},
    });

    it("should parse character from JSON", () => {
      if (!wasm) return;

      const character = wasm.parseCharacter(testCharacterJson);
      expect(character.name).toBe("TestAgent");
      expect(character.system).toBe("You are a helpful assistant.");
    });

    it("should convert character to JSON", () => {
      if (!wasm) return;

      const character = wasm.WasmCharacter.fromJson(testCharacterJson);
      const json = character.toJson();
      const parsed = JSON.parse(json);

      expect(parsed.name).toBe("TestAgent");
    });

    it("should pass character round-trip test", () => {
      if (!wasm) return;

      expect(wasm.testCharacterRoundTrip(testCharacterJson)).toBe(true);
    });
  });

  describe("Agent Operations", () => {
    const testAgentJson = JSON.stringify({
      id: "550e8400-e29b-41d4-a716-446655440000",
      name: "TestAgent",
      bio: "A test agent",
      status: "active",
      enabled: true,
    });

    it("should parse agent from JSON", () => {
      if (!wasm) return;

      const agent = wasm.WasmAgent.fromJson(testAgentJson);
      expect(agent.id).toBe("550e8400-e29b-41d4-a716-446655440000");
      expect(agent.name).toBe("TestAgent");
    });

    it("should pass agent round-trip test", () => {
      if (!wasm) return;

      expect(wasm.testAgentRoundTrip(testAgentJson)).toBe(true);
    });
  });

  describe("Plugin Operations", () => {
    const testPluginJson = JSON.stringify({
      name: "test-plugin",
      description: "A test plugin",
      actions: [],
      evaluators: [],
      providers: [],
    });

    it("should parse plugin from JSON", () => {
      if (!wasm) return;

      const plugin = wasm.WasmPlugin.fromJson(testPluginJson);
      expect(plugin.name).toBe("test-plugin");
      expect(plugin.description).toBe("A test plugin");
    });
  });

  describe("Version", () => {
    it("should return version string", () => {
      if (!wasm) return;

      const version = wasm.getVersion();
      expect(version).toBeDefined();
      expect(typeof version).toBe("string");
      expect(version).toMatch(/^\d+\.\d+\.\d+/);
    });
  });
});

// Tests that don't require WASM to be built
describe("WASM Build Status", () => {
  it("should detect if WASM is built", () => {
    console.log(`WASM module exists: ${wasmExists}`);
    console.log(`  pkg path: ${wasmPkgPath}`);
    console.log(`  pkg-node path: ${wasmNodePath}`);
    // This test always passes, just logs status
    expect(true).toBe(true);
  });
});
```