# a7046c18:packages_plugin-sql_src___tests___unit_index.browser.test.ts:1-36

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/unit/index.browser.test.ts:1-36
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { describe, expect, it, type Mock, mock } from "bun:test";
import type { IAgentRuntime, UUID } from "@elizaos/core";
import { plugin } from "../../index.browser";

describe("plugin-sql browser entrypoint", () => {
  it("skips adapter registration when runtime is ready", async () => {
    const runtime = {
      agentId: "00000000-0000-0000-0000-000000000000" as UUID,
      isReady: mock(() => Promise.resolve(true)),
      registerDatabaseAdapter: mock(() => {}),
    } as Partial<IAgentRuntime> as IAgentRuntime;

    await plugin.init?.({}, runtime);

    expect(runtime.isReady).toHaveBeenCalledTimes(1);
    expect(runtime.registerDatabaseAdapter).not.toHaveBeenCalled();
  });

  it("registers PGlite adapter when readiness check fails", async () => {
    const runtime = {
      agentId: "00000000-0000-0000-0000-000000000001" as UUID,
      isReady: mock(() => Promise.reject(new Error("no adapter"))),
      registerDatabaseAdapter: mock(() => {}),
    } as Partial<IAgentRuntime> as IAgentRuntime;

    await plugin.init?.({}, runtime);

    expect(runtime.isReady).toHaveBeenCalledTimes(1);
    expect(runtime.registerDatabaseAdapter).toHaveBeenCalledTimes(1);
    // Ensure an object resembling an adapter is passed
    const arg = (runtime.registerDatabaseAdapter as Mock).mock.calls[0][0];
    expect(arg).toBeDefined();
    expect(typeof arg.init).toBe("function");
    expect(typeof arg.isReady).toBe("function");
  });
});
```