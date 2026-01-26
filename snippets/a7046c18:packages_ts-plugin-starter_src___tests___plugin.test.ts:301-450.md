# a7046c18:packages_ts-plugin-starter_src___tests___plugin.test.ts:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/ts-plugin-starter/src/__tests__/plugin.test.ts:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
describe("Hello World Provider", () => {
  const provider = starterPlugin.providers?.[0];
  let runtime: IAgentRuntime;

  beforeEach(() => {
    runtime = createMockRuntime();
  });

  it("should have hello world provider", () => {
    expect(provider).toBeDefined();
    expect(provider?.name).toBe("HELLO_WORLD_PROVIDER");
  });

  it("should provide hello world data", async () => {
    if (!provider?.get) {
      throw new Error("Hello world provider not found");
    }

    const message = createTestMemory();
    const state = createTestState();

    const result = await provider.get(runtime, message, state);

    expect(result).toHaveProperty("text", "I am a provider");
    expect(result).toHaveProperty("data");
    expect(result).toHaveProperty("values");
    expect(result.data).toEqual({});
    expect(result.values).toEqual({});
  });

  it("should provide consistent structure across calls", async () => {
    if (!provider?.get) {
      throw new Error("Hello world provider not found");
    }

    const message = createTestMemory();
    const state = createTestState();

    const result1 = await provider.get(runtime, message, state);
    const result2 = await provider.get(runtime, message, state);

    // Simple provider returns consistent static results
    expect(result1.text).toBe("I am a provider");
    expect(result2.text).toBe("I am a provider");
    expect(result1.data).toEqual({});
    expect(result2.data).toEqual({});
    expect(result1.values).toEqual({});
    expect(result2.values).toEqual({});
  });

  it("should handle different input states", async () => {
    if (!provider?.get) {
      throw new Error("Hello world provider not found");
    }

    const message = createTestMemory({
      content: { text: "different message" },
    });
    const customState = createTestState({
      values: { custom: "value" },
      data: { custom: "data" },
    });

    const result = await provider.get(runtime, message, customState);

    // Provider output is static in simple implementation
    expect(result.text).toBe("I am a provider");
    expect(result.data).toEqual({});
    expect(result.values).toEqual({});
  });
});

describe("Model Handlers", () => {
  let runtime: IAgentRuntime;

  beforeEach(() => {
    runtime = createMockRuntime();
  });

  it("should handle TEXT_SMALL model", async () => {
    const handler = starterPlugin.models?.[ModelType.TEXT_SMALL];
    if (!handler) {
      throw new Error("TEXT_SMALL model handler not found");
    }

    const result = await handler(
      {
        params: {
          prompt: "Test prompt",
          temperature: 0.7,
        },
      },
      runtime,
    );

    expect(result).toContain("Never gonna give you up");
  });

  it("should handle TEXT_LARGE model with custom parameters", async () => {
    const handler = starterPlugin.models?.[ModelType.TEXT_LARGE];
    if (!handler) {
      throw new Error("TEXT_LARGE model handler not found");
    }

    const result = await handler(
      {
        params: {
          prompt: "Test prompt with custom settings",
          temperature: 0.9,
          maxTokens: 500,
        },
      },
      runtime,
    );

    expect(result).toContain("Never gonna make you cry");
  });

  it("should handle empty prompt", async () => {
    const handler = starterPlugin.models?.[ModelType.TEXT_SMALL];
    if (!handler) {
      throw new Error("TEXT_SMALL model handler not found");
    }

    const result = await handler(
      {
        params: {
          prompt: "",
          temperature: 0.7,
        },
      },
      runtime,
    );

    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("should handle missing parameters", async () => {
    const handler = starterPlugin.models?.[ModelType.TEXT_LARGE];
    if (!handler) {
      throw new Error("TEXT_LARGE model handler not found");
    }

    const result = await handler(
      {
        params: {
          prompt: "Test prompt",
        },
      },
```