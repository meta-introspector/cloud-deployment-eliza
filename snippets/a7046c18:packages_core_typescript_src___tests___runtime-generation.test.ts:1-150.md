# a7046c18:packages_core_typescript_src___tests___runtime-generation.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/runtime-generation.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { beforeEach, describe, expect, it, mock } from "bun:test";
import { AgentRuntime } from "../runtime";
import type { Character } from "../types";
import { ModelType } from "../types/model";
import { stringToUuid } from "../utils";

describe("generateText", () => {
  let runtime: AgentRuntime;
  let mockUseModel: ReturnType<typeof mock<AgentRuntime["useModel"]>>;

  const mockCharacter: Character = {
    id: stringToUuid("test-character"),
    name: "TestBot",
    bio: "A helpful AI assistant for testing",
    system: "You are a friendly and helpful assistant.",
    style: {
      all: ["Be concise", "Be friendly"],
      chat: ["Use casual language"],
    },
  };

  beforeEach(() => {
    // Create a minimal runtime instance
    runtime = new AgentRuntime({
      character: mockCharacter,
    });

    // Mock the useModel method
    mockUseModel = mock().mockResolvedValue("Generated response text");
    runtime.useModel = mockUseModel;
  });

  it("should generate text with character context by default", async () => {
    const input = "Tell me about quantum computing";
    const result = await runtime.generateText(input);

    expect(result).toHaveProperty("text");
    expect(result.text).toBe("Generated response text");
    expect(mockUseModel).toHaveBeenCalledTimes(1);

    // Verify the model was called with TEXT_LARGE
    const callArgs = mockUseModel.mock.calls[0];
    expect(callArgs[0]).toBe(ModelType.TEXT_LARGE);

    // Verify the prompt includes character context
    const params = callArgs[1];
    expect(params.prompt).toContain("About TestBot");
    expect(params.prompt).toContain("A helpful AI assistant for testing");
    expect(params.prompt).toContain("You are a friendly and helpful assistant");
    expect(params.prompt).toContain("Be concise");
    expect(params.prompt).toContain("Tell me about quantum computing");
  });

  it("should generate text without character context when includeCharacter is false", async () => {
    const input = "Translate to Spanish: Hello";
    const result = await runtime.generateText(input, {
      includeCharacter: false,
    });

    expect(result).toHaveProperty("text");
    expect(result.text).toBe("Generated response text");
    expect(mockUseModel).toHaveBeenCalledTimes(1);

    // Verify the prompt does NOT include character context
    const callArgs = mockUseModel.mock.calls[0];
    const params = callArgs[1];
    expect(params.prompt).toBe("Translate to Spanish: Hello");
    expect(params.prompt).not.toContain("About TestBot");
  });

  it("should use specified model type", async () => {
    const input = "Simple task";
    await runtime.generateText(input, {
      modelType: ModelType.TEXT_SMALL,
    });

    expect(mockUseModel).toHaveBeenCalledTimes(1);

    // Verify TEXT_SMALL was used
    const callArgs = mockUseModel.mock.calls[0];
    expect(callArgs[0]).toBe(ModelType.TEXT_SMALL);
  });

  it("should pass through generation parameters", async () => {
    const input = "Write a creative story";
    await runtime.generateText(input, {
      includeCharacter: false,
      temperature: 0.9,
      topP: 0.95,
      topK: 40,
      minP: 0.05,
      seed: 42,
      repetitionPenalty: 1.1,
      maxTokens: 500,
      minTokens: 50,
      frequencyPenalty: 0.5,
      presencePenalty: 0.3,
      stopSequences: ["\n\n", "END"],
      user: "custom-user-id",
      responseFormat: { type: "json_object" },
    });

    expect(mockUseModel).toHaveBeenCalledTimes(1);

    const callArgs = mockUseModel.mock.calls[0];
    const params = callArgs[1];
    expect(params.temperature).toBe(0.9);
    expect(params.topP).toBe(0.95);
    expect(params.topK).toBe(40);
    expect(params.minP).toBe(0.05);
    expect(params.seed).toBe(42);
    expect(params.repetitionPenalty).toBe(1.1);
    expect(params.maxTokens).toBe(500);
    expect(params.minTokens).toBe(50);
    expect(params.frequencyPenalty).toBe(0.5);
    expect(params.presencePenalty).toBe(0.3);
    expect(params.stopSequences).toEqual(["\n\n", "END"]);
    expect(params.user).toBe("custom-user-id");
    expect(params.responseFormat).toEqual({ type: "json_object" });
  });

  it("should auto-populate user from character name when not provided", async () => {
    const input = "Test prompt";
    await runtime.generateText(input, {
      includeCharacter: false,
    });

    expect(mockUseModel).toHaveBeenCalledTimes(1);

    const callArgs = mockUseModel.mock.calls[0];
    const params = callArgs[1];
    // Should auto-populate from character name
    expect(params.user).toBe("TestBot");
  });

  it("should preserve explicitly provided empty string for user parameter", async () => {
    const input = "Test prompt";
    await runtime.generateText(input, {
      includeCharacter: false,
      user: "",
    });

    expect(mockUseModel).toHaveBeenCalledTimes(1);

    const callArgs = mockUseModel.mock.calls[0];
    const params = callArgs[1];
    // Should preserve empty string, not override with character name
    expect(params.user).toBe("");
  });

```