# 5e8c73c1:packages_core_src_runtime.ts:3151-3154

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/runtime.ts:3151-3154
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
  hasElizaOS(): this is IAgentRuntime & { elizaOS: IElizaOS } {
    return this.elizaOS !== undefined;
  }
}
```