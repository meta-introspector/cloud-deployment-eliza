# a7046c18:packages_core_typescript_src_test_resources_constants.ts:1-11

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/test_resources/constants.ts:1-11
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import type { UUID } from "@elizaos/core";

export const SERVER_URL = "http://localhost:7998";
export const SUPABASE_URL = process.env.SUPABASE_URL || "";
export const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || "";
export const TEST_EMAIL = "testuser123@example.com";
export const TEST_PASSWORD = "mock_password_123!@#";
export const TEST_EMAIL_2 = "testuser234@example.com";
export const TEST_PASSWORD_2 = "mock_password_234!@#";

export const zeroUuid = "00000000-0000-0000-0000-000000000000" as UUID;
```