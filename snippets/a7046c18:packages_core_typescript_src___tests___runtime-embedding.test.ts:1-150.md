# a7046c18:packages_core_typescript_src___tests___runtime-embedding.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/runtime-embedding.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { beforeEach, describe, expect, it, mock } from "bun:test";
import { AgentRuntime } from "../runtime.ts";
import { EventType, type Memory, type UUID } from "../types";
import type { EmbeddingGenerationPayload } from "../types/events.ts";
import { stringToUuid } from "../utils.ts";
import { createMockAdapter } from "./test-helpers";

describe("AgentRuntime - queueEmbeddingGeneration", () => {
  let runtime: AgentRuntime;
  let emittedEvents: Array<{ event: string; payload: unknown }> = [];

  beforeEach(() => {
    emittedEvents = [];

    // Create runtime with test configuration
    runtime = new AgentRuntime({
      agentId: stringToUuid("test-agent"),
      character: {
        id: stringToUuid("test-character"),
        name: "Test Character",
        username: "test_character",
        system: "Test system prompt",
        bio: "Test bio",
      },
      adapter: createMockAdapter(),
      conversationLength: 10,
    });

    // Track emitted events
    const originalEmitEvent = runtime.emitEvent.bind(runtime);
    runtime.emitEvent = mock(
      async (event: string | string[], payload: unknown) => {
        const events = Array.isArray(event) ? event : [event];
        for (const e of events) {
          emittedEvents.push({ event: e, payload });
        }
        return originalEmitEvent(event, payload);
      },
    );
  });

  describe("queueEmbeddingGeneration", () => {
    it("should emit EMBEDDING_GENERATION_REQUESTED event for memory with text", async () => {
      const memory: Memory = {
        id: "test-memory-id" as UUID,
        entityId: "test-entity" as UUID,
        agentId: "test-agent" as UUID,
        roomId: "test-room" as UUID,
        content: { text: "Test memory content" },
        createdAt: Date.now(),
      };

      await runtime.queueEmbeddingGeneration(memory, "normal");

      const event = emittedEvents.find(
        (e) => e.event === EventType.EMBEDDING_GENERATION_REQUESTED,
      );
      expect(event).toBeDefined();
      expect(event?.payload).toMatchObject({
        runtime,
        memory,
        priority: "normal",
        source: "runtime",
        retryCount: 0,
        maxRetries: 3,
      });
    });

    it("should skip memory that already has embeddings", async () => {
      const memory: Memory = {
        id: "test-memory-id" as UUID,
        entityId: "test-entity" as UUID,
        agentId: "test-agent" as UUID,
        roomId: "test-room" as UUID,
        content: { text: "Test memory content" },
        embedding: [0.1, 0.2, 0.3, 0.4, 0.5],
        createdAt: Date.now(),
      };

      await runtime.queueEmbeddingGeneration(memory, "normal");

      const event = emittedEvents.find(
        (e) => e.event === EventType.EMBEDDING_GENERATION_REQUESTED,
      );
      expect(event).toBeUndefined();
    });

    it("should skip memory without text content", async () => {
      const memory: Memory = {
        id: "test-memory-id" as UUID,
        entityId: "test-entity" as UUID,
        agentId: "test-agent" as UUID,
        roomId: "test-room" as UUID,
        content: {},
        createdAt: Date.now(),
      };

      await runtime.queueEmbeddingGeneration(memory, "normal");

      const event = emittedEvents.find(
        (e) => e.event === EventType.EMBEDDING_GENERATION_REQUESTED,
      );
      expect(event).toBeUndefined();
    });

    it("should support different priority levels", async () => {
      const memories = [
        {
          memory: {
            id: "high-priority" as UUID,
            entityId: "test-entity" as UUID,
            agentId: "test-agent" as UUID,
            roomId: "test-room" as UUID,
            content: { text: "High priority content" },
            createdAt: Date.now(),
          },
          priority: "high" as const,
        },
        {
          memory: {
            id: "normal-priority" as UUID,
            entityId: "test-entity" as UUID,
            agentId: "test-agent" as UUID,
            roomId: "test-room" as UUID,
            content: { text: "Normal priority content" },
            createdAt: Date.now(),
          },
          priority: "normal" as const,
        },
        {
          memory: {
            id: "low-priority" as UUID,
            entityId: "test-entity" as UUID,
            agentId: "test-agent" as UUID,
            roomId: "test-room" as UUID,
            content: { text: "Low priority content" },
            createdAt: Date.now(),
          },
          priority: "low" as const,
        },
      ];

      for (const { memory, priority } of memories) {
        await runtime.queueEmbeddingGeneration(memory, priority);
      }

      const events = emittedEvents.filter(
        (e) => e.event === EventType.EMBEDDING_GENERATION_REQUESTED,
      );
      expect(events).toHaveLength(3);
```