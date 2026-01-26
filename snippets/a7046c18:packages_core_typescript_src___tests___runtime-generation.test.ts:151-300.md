# a7046c18:packages_core_typescript_src___tests___runtime-generation.test.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/runtime-generation.test.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  it("should preserve explicitly provided null for user parameter", async () => {
    const input = "Test prompt";
    await runtime.generateText(input, {
      includeCharacter: false,
      user: null,
    });

    expect(mockUseModel).toHaveBeenCalledTimes(1);

    const callArgs = mockUseModel.mock.calls[0];
    const params = callArgs[1];
    // Should preserve null, not override with character name
    expect(params.user).toBeNull();
  });

  it("should handle character with array bio", async () => {
    const characterWithArrayBio: Character = {
      ...mockCharacter,
      bio: ["Fact 1 about bot", "Fact 2 about bot", "Fact 3 about bot"],
    };

    runtime = new AgentRuntime({
      character: characterWithArrayBio,
    });
    mockUseModel = mock().mockResolvedValue("Response");
    runtime.useModel = mockUseModel;

    await runtime.generateText("Test input");

    const callArgs = mockUseModel.mock.calls[0];
    const params = callArgs[1];
    expect(params.prompt).toContain("Fact 1 about bot");
    expect(params.prompt).toContain("Fact 2 about bot");
    expect(params.prompt).toContain("Fact 3 about bot");
  });

  it("should handle character with minimal information", async () => {
    const minimalCharacter: Character = {
      id: stringToUuid("minimal"),
      name: "MinimalBot",
      bio: "",
    };

    runtime = new AgentRuntime({
      character: minimalCharacter,
    });
    mockUseModel = mock().mockResolvedValue("Response");
    runtime.useModel = mockUseModel;

    const input = "Test input";
    const result = await runtime.generateText(input, {
      includeCharacter: true,
    });

    expect(result.text).toBe("Response");

    // Should still work, just won't add much context
    const callArgs = mockUseModel.mock.calls[0];
    const params = callArgs[1];
    expect(params.prompt).toContain("Test input");
  });

  it("should handle empty style directives", async () => {
    const characterNoStyle: Character = {
      id: stringToUuid("no-style"),
      name: "NoStyleBot",
      bio: "A bot without style",
      system: "System prompt",
      style: {
        all: [],
        chat: [],
      },
    };

    runtime = new AgentRuntime({
      character: characterNoStyle,
    });
    mockUseModel = mock().mockResolvedValue("Response");
    runtime.useModel = mockUseModel;

    await runtime.generateText("Test");

    const callArgs = mockUseModel.mock.calls[0];
    const params = callArgs[1];
    expect(params.prompt).toContain("A bot without style");
    expect(params.prompt).toContain("System prompt");
    expect(params.prompt).not.toContain("Style:");
  });

  it("should combine all + chat style directives", async () => {
    const input = "Test input";
    await runtime.generateText(input);

    const callArgs = mockUseModel.mock.calls[0];
    const params = callArgs[1];
    expect(params.prompt).toContain("Be concise");
    expect(params.prompt).toContain("Be friendly");
    expect(params.prompt).toContain("Use casual language");
  });

  it("should return text property in result", async () => {
    mockUseModel.mockResolvedValue("Custom response");

    const result = await runtime.generateText("Any input");

    expect(result).toEqual({ text: "Custom response" });
  });

  it("should propagate errors from useModel", async () => {
    mockUseModel.mockRejectedValue(new Error("Model error"));

    await expect(runtime.generateText("Test")).rejects.toThrow("Model error");
  });

  it("should work with custom model type and character context", async () => {
    const input = "Complex reasoning task";
    await runtime.generateText(input, {
      modelType: ModelType.TEXT_REASONING_LARGE,
      temperature: 0.3,
    });

    const callArgs = mockUseModel.mock.calls[0];
    expect(callArgs[0]).toBe(ModelType.TEXT_REASONING_LARGE);

    const params = callArgs[1];
    expect(params.temperature).toBe(0.3);
    expect(params.prompt).toContain("About TestBot"); // Character context included
  });

  it("should handle responseFormat as string", async () => {
    const input = "Generate JSON";
    await runtime.generateText(input, {
      includeCharacter: false,
      responseFormat: "json",
    });

    const callArgs = mockUseModel.mock.calls[0];
    const params = callArgs[1];
    expect(params.responseFormat).toBe("json");
  });

  it("should handle empty stopSequences array", async () => {
    const input = "Test prompt";
    await runtime.generateText(input, {
      includeCharacter: false,
      stopSequences: [],
    });

    const callArgs = mockUseModel.mock.calls[0];
    const params = callArgs[1];
```