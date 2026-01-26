# a7046c18:packages_core_typescript_src_types_messaging.ts:151-162

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/types/messaging.ts:151-162
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

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