# a7046c18:packages_core_typescript_src___tests___runtime-generation.test.ts:301-372

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/runtime-generation.test.ts:301-372
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    expect(params.stopSequences).toEqual([]);
  });

  it("should handle missing character name for user auto-population", async () => {
    const characterNoName: Character = {
      id: stringToUuid("no-name"),
      name: "",
      bio: "Test bio",
    };

    runtime = new AgentRuntime({
      character: characterNoName,
    });
    mockUseModel = mock().mockResolvedValue("Response");
    runtime.useModel = mockUseModel;

    await runtime.generateText("Test", {
      includeCharacter: false,
    });

    const callArgs = mockUseModel.mock.calls[0];
    const params = callArgs[1];
    // Should use empty string if character name is empty
    expect(params.user).toBe("");
  });

  it("should handle minimal character for user auto-population", async () => {
    // Create runtime with minimal character (no name property set)
    runtime = new AgentRuntime({
      character: { bio: "Test" } as Character,
    });
    mockUseModel = mock().mockResolvedValue("Response");
    runtime.useModel = mockUseModel;

    await runtime.generateText("Test", {
      includeCharacter: false,
    });

    const callArgs = mockUseModel.mock.calls[0];
    const params = callArgs[1];
    // Should use undefined/empty if character name is missing
    expect(params.user === undefined || params.user === "").toBe(true);
  });

  it("should handle all parameters being undefined", async () => {
    const input = "Simple prompt";
    await runtime.generateText(input, {
      includeCharacter: false,
    });

    const callArgs = mockUseModel.mock.calls[0];
    const params = callArgs[1];

    // Verify required params exist
    expect(params.prompt).toBe("Simple prompt");
    expect(params.user).toBe("TestBot"); // Auto-populated

    // Verify optional params are not set when not provided
    expect(params.maxTokens).toBeUndefined();
    expect(params.minTokens).toBeUndefined();
    expect(params.temperature).toBeUndefined();
    expect(params.topP).toBeUndefined();
    expect(params.topK).toBeUndefined();
    expect(params.minP).toBeUndefined();
    expect(params.seed).toBeUndefined();
    expect(params.repetitionPenalty).toBeUndefined();
    expect(params.frequencyPenalty).toBeUndefined();
    expect(params.presencePenalty).toBeUndefined();
    expect(params.stopSequences).toBeUndefined();
    expect(params.responseFormat).toBeUndefined();
  });
});
```