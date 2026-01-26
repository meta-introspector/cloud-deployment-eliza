# a7046c18:packages_core_typescript_src___tests___env.test.ts:1-23

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/env.test.ts:1-23
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { describe, expect, it } from "bun:test";
import fs from "node:fs";
import path from "node:path";

describe("Environment Setup", () => {
  it("should verify .env.test file exists", () => {
    const possiblePaths = [
      path.join(process.cwd(), ".env.test"),
      path.join(process.cwd(), "packages/core/.env.test"),
      path.join(__dirname, "../../.env.test"),
      path.join(__dirname, "../.env.test"),
      path.join(__dirname, ".env.test"),
    ];

    const existingPaths = possiblePaths.filter((p) => {
      const exists = fs.existsSync(p);
      console.log(`Path ${p} exists: ${exists}`);
      return exists;
    });

    expect(existingPaths.length).toBeGreaterThan(0);
  });
});
```