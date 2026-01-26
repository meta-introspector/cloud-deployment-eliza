# a7046c18:packages_core_typescript_src_test_resources_testSetup.ts:1-21

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/test_resources/testSetup.ts:1-21
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve paths relative to packages/core directory
const packageRoot = path.resolve(__dirname, "../..");
const envTestPath = path.join(packageRoot, ".env.test");
const envPath = path.join(packageRoot, ".env");

const result = dotenv.config({ path: envTestPath });
if (result.error) {
  console.error("Error loading .env.test. Loading .env instead");
  const result2 = dotenv.config({ path: envPath });
  if (result2.error) {
    console.error("Error loading .env:", result2.error);
  }
}
```