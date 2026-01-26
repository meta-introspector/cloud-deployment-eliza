# a7046c18:packages_core_typescript_src___tests___search.test.ts:1-15

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/search.test.ts:1-15
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { describe, expect, it } from "bun:test";
import { BM25 } from "../search";

describe("BM25 search", () => {
  it("indexes documents and finds matches", () => {
    const docs = [
      { text: "hello world" },
      { text: "another document" },
      { text: "world of javascript" },
    ];
    const bm = new BM25(docs, { fieldBoosts: { text: 1 } });
    const results = bm.search("world");
    expect(results[0].index).toBe(0);
  });
});
```