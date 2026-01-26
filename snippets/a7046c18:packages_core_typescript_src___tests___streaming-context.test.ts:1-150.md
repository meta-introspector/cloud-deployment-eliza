# a7046c18:packages_core_typescript_src___tests___streaming-context.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/streaming-context.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import {
  getStreamingContext,
  getStreamingContextManager,
  type IStreamingContextManager,
  runWithStreamingContext,
  type StreamingContext,
  setStreamingContextManager,
} from "../streaming-context";
import { createNodeStreamingContextManager } from "../streaming-context.node";
import type { UUID } from "../types";

describe("Streaming Context", () => {
  let originalManager: IStreamingContextManager;

  beforeEach(() => {
    // Store original manager
    originalManager = getStreamingContextManager();
    // Configure Node.js AsyncLocalStorage manager for tests
    setStreamingContextManager(createNodeStreamingContextManager());
  });

  afterEach(() => {
    // Restore original manager
    setStreamingContextManager(originalManager);
  });

  describe("runWithStreamingContext", () => {
    it("should make context available within the callback", async () => {
      const chunks: string[] = [];
      const context: StreamingContext = {
        onStreamChunk: async (chunk) => {
          chunks.push(chunk);
        },
        messageId: "test-message-id" as UUID,
      };

      let capturedContext: StreamingContext | undefined;

      runWithStreamingContext(context, () => {
        capturedContext = getStreamingContext();
      });

      expect(capturedContext).toBeDefined();
      expect(capturedContext?.messageId).toBe("test-message-id");
      expect(capturedContext?.onStreamChunk).toBe(context.onStreamChunk);
    });

    it("should return undefined outside of context", () => {
      const context = getStreamingContext();
      expect(context).toBeUndefined();
    });

    it("should handle undefined context", () => {
      runWithStreamingContext(undefined, () => {
        const context = getStreamingContext();
        expect(context).toBeUndefined();
      });
    });

    it("should return the result of the callback", () => {
      const result = runWithStreamingContext(undefined, () => {
        return "test-result";
      });

      expect(result).toBe("test-result");
    });

    it("should propagate errors from callback", () => {
      expect(() => {
        runWithStreamingContext(undefined, () => {
          throw new Error("Test error");
        });
      }).toThrow("Test error");
    });

    it("should work with async callbacks", async () => {
      const chunks: string[] = [];
      const context: StreamingContext = {
        onStreamChunk: async (chunk) => {
          chunks.push(chunk);
        },
      };

      const result = await runWithStreamingContext(context, async () => {
        const ctx = getStreamingContext();
        await ctx?.onStreamChunk("chunk1");
        await ctx?.onStreamChunk("chunk2");
        return "async-result";
      });

      expect(result).toBe("async-result");
      expect(chunks).toEqual(["chunk1", "chunk2"]);
    });

    it("should isolate context in parallel operations", async () => {
      const chunks1: string[] = [];
      const chunks2: string[] = [];

      const context1: StreamingContext = {
        onStreamChunk: async (chunk) => chunks1.push(chunk),
        messageId: "msg1" as UUID,
      };

      const context2: StreamingContext = {
        onStreamChunk: async (chunk) => chunks2.push(chunk),
        messageId: "msg2" as UUID,
      };

      // Run two contexts in parallel
      const [result1, result2] = await Promise.all([
        runWithStreamingContext(context1, async () => {
          await new Promise((r) => setTimeout(r, 10));
          const ctx = getStreamingContext();
          await ctx?.onStreamChunk("from-context-1");
          return ctx?.messageId;
        }),
        runWithStreamingContext(context2, async () => {
          await new Promise((r) => setTimeout(r, 5));
          const ctx = getStreamingContext();
          await ctx?.onStreamChunk("from-context-2");
          return ctx?.messageId;
        }),
      ]);

      // Each context should have its own isolated data
      expect(result1).toBe("msg1");
      expect(result2).toBe("msg2");
      expect(chunks1).toEqual(["from-context-1"]);
      expect(chunks2).toEqual(["from-context-2"]);
    });

    it("should support nested contexts", () => {
      const outerChunks: string[] = [];
      const innerChunks: string[] = [];

      const outerContext: StreamingContext = {
        onStreamChunk: async (chunk) => outerChunks.push(chunk),
        messageId: "outer" as UUID,
      };

      const innerContext: StreamingContext = {
        onStreamChunk: async (chunk) => innerChunks.push(chunk),
        messageId: "inner" as UUID,
      };

      runWithStreamingContext(outerContext, () => {
        expect(getStreamingContext()?.messageId).toBe("outer");

        runWithStreamingContext(innerContext, () => {
```