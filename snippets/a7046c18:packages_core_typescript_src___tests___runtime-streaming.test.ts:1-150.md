# a7046c18:packages_core_typescript_src___tests___runtime-streaming.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/runtime-streaming.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { AgentRuntime } from "../runtime";
import {
  getStreamingContextManager,
  type IStreamingContextManager,
  runWithStreamingContext,
  type StreamingContext,
  setStreamingContextManager,
} from "../streaming-context";
import { createNodeStreamingContextManager } from "../streaming-context.node";
import type { Character } from "../types";
import {
  type GenerateTextParams,
  ModelType,
  type TextStreamResult,
} from "../types/model";
import { stringToUuid } from "../utils";
import { createMockAdapter } from "./test-helpers";

describe("useModel Streaming", () => {
  let runtime: AgentRuntime;
  let originalManager: IStreamingContextManager;

  const mockCharacter: Character = {
    id: stringToUuid("test-streaming"),
    name: "StreamBot",
    bio: "A bot for testing streaming",
  };

  // Helper to create a mock TextStreamResult
  function createMockTextStreamResult(chunks: string[]): TextStreamResult {
    let index = 0;
    return {
      textStream: {
        [Symbol.asyncIterator]: () => ({
          next: async () => {
            if (index < chunks.length) {
              return { value: chunks[index++], done: false };
            }
            return { value: undefined, done: true };
          },
        }),
      } as AsyncIterable<string>,
      text: Promise.resolve(chunks.join("")),
      usage: Promise.resolve({
        promptTokens: 10,
        completionTokens: 20,
        totalTokens: 30,
      }),
      finishReason: Promise.resolve("stop" as const),
    };
  }

  beforeEach(() => {
    originalManager = getStreamingContextManager();
    setStreamingContextManager(createNodeStreamingContextManager());

    runtime = new AgentRuntime({
      agentId: stringToUuid("test-streaming-agent"),
      character: mockCharacter,
      adapter: createMockAdapter(),
    });
  });

  afterEach(() => {
    setStreamingContextManager(originalManager);
  });

  describe("onStreamChunk callback in params", () => {
    it("should call onStreamChunk for each chunk when handler returns TextStreamResult", async () => {
      const chunks: string[] = [];
      const mockChunks = ["Hello", " ", "World", "!"];

      // Register a mock handler that returns TextStreamResult when stream: true
      runtime.registerModel(
        ModelType.TEXT_LARGE,
        async (_rt, params) => {
          const textParams = params as GenerateTextParams;
          if (textParams.stream) {
            return createMockTextStreamResult(mockChunks);
          }
          return mockChunks.join("");
        },
        "test-provider",
      );

      const result = await runtime.useModel(ModelType.TEXT_LARGE, {
        prompt: "Test prompt",
        onStreamChunk: (chunk: string) => {
          chunks.push(chunk);
        },
      });

      expect(result).toBe("Hello World!");
      expect(chunks).toEqual(mockChunks);
    });

    it("should return full text even when streaming", async () => {
      const mockChunks = ["Part1", "Part2", "Part3"];

      runtime.registerModel(
        ModelType.TEXT_LARGE,
        async (_rt, params) => {
          const textParams = params as GenerateTextParams;
          if (textParams.stream) {
            return createMockTextStreamResult(mockChunks);
          }
          return mockChunks.join("");
        },
        "test-provider",
      );

      const result = await runtime.useModel(ModelType.TEXT_LARGE, {
        prompt: "Test",
        onStreamChunk: () => {},
      });

      expect(result).toBe("Part1Part2Part3");
    });

    it("should not stream when no callback is provided", async () => {
      let streamRequested = false;

      runtime.registerModel(
        ModelType.TEXT_LARGE,
        async (_rt, params) => {
          const textParams = params as GenerateTextParams;
          streamRequested = textParams.stream === true;
          return "Non-streamed result";
        },
        "test-provider",
      );

      const result = await runtime.useModel(ModelType.TEXT_LARGE, {
        prompt: "Test",
      });

      expect(result).toBe("Non-streamed result");
      expect(streamRequested).toBe(false);
    });
  });

  describe("stream: false forces non-streaming", () => {
    it("should not stream when stream: false even with onStreamChunk", async () => {
      let streamRequested = false;
      const chunks: string[] = [];

      runtime.registerModel(
        ModelType.TEXT_LARGE,
        async (_rt, params) => {
```