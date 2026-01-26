# 5e8c73c1:packages_core_src_types_messaging.ts:151-162

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/types/messaging.ts:151-162
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
   * Agent responses (only in sync mode)
   * Empty in async mode - use onResponse callback instead
   */
  agentResponses?: Content[];

  /** Usage information for billing (only in sync mode) */
  usage?: {
    inputTokens: number;
    outputTokens: number;
    model: string;
  };
}
```