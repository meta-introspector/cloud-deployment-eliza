# a7046c18:packages_plugin-sql_src___tests___unit_utils.browser.test.ts:1-22

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/unit/utils.browser.test.ts:1-22
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { describe, expect, it } from "bun:test";
import {
  expandTildePath,
  resolveEnvFile,
  resolvePgliteDir,
} from "../../utils.browser";

describe("utils.browser", () => {
  it("expandTildePath returns input unchanged in browser", () => {
    expect(expandTildePath("~/data")).toBe("~/data");
    expect(expandTildePath("/absolute/path")).toBe("/absolute/path");
  });

  it("resolveEnvFile returns placeholder value", () => {
    expect(resolveEnvFile()).toBe(".env");
  });

  it("resolvePgliteDir returns stable placeholder", () => {
    expect(resolvePgliteDir()).toBe("in-memory");
    expect(resolvePgliteDir("/any/path")).toBe("in-memory");
  });
});
```