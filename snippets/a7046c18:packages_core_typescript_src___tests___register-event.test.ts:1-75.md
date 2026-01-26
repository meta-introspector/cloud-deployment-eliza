# a7046c18:packages_core_typescript_src___tests___register-event.test.ts:1-75

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/register-event.test.ts:1-75
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { beforeEach, describe, expect, it } from "bun:test";
import { AgentRuntime } from "../runtime";
import type { Character, EventPayload } from "../types";
import { stringToUuid } from "../utils";

interface CustomEventPayload extends EventPayload {
  customField: string;
  count: number;
}

describe("registerEvent", () => {
  let runtime: AgentRuntime;

  const mockCharacter: Character = {
    id: stringToUuid("test-character"),
    name: "TestBot",
    bio: "A test bot",
  };

  beforeEach(() => {
    runtime = new AgentRuntime({
      character: mockCharacter,
    });
  });

  it("should register and emit custom typed events", async () => {
    const receivedPayloads: CustomEventPayload[] = [];

    runtime.registerEvent<CustomEventPayload>(
      "CUSTOM_EVENT",
      async (params) => {
        receivedPayloads.push(params);
      },
    );

    await runtime.emitEvent("CUSTOM_EVENT", {
      customField: "test-value",
      count: 42,
    });

    expect(receivedPayloads).toHaveLength(1);
    expect(receivedPayloads[0].customField).toBe("test-value");
    expect(receivedPayloads[0].count).toBe(42);
    // emitEvent injects runtime and source
    expect(receivedPayloads[0].runtime).toBeDefined();
    expect(receivedPayloads[0].source).toBeDefined();
  });

  it("should support multiple handlers for same event", async () => {
    let handler1Called = false;
    let handler2Called = false;

    runtime.registerEvent<CustomEventPayload>(
      "MULTI_HANDLER_EVENT",
      async () => {
        handler1Called = true;
      },
    );

    runtime.registerEvent<CustomEventPayload>(
      "MULTI_HANDLER_EVENT",
      async () => {
        handler2Called = true;
      },
    );

    await runtime.emitEvent("MULTI_HANDLER_EVENT", {
      customField: "test",
      count: 1,
    });

    expect(handler1Called).toBe(true);
    expect(handler2Called).toBe(true);
  });
});
```