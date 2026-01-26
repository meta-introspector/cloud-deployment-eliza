# a7046c18:packages_plugin-sql_src___tests___integration_seed_agent-seed.ts:1-19

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/seed/agent-seed.ts:1-19
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
/**
 * Seed data for agent integration tests
 */
import type { Agent } from "@elizaos/core";

/**
 * Test agent data used across agent integration tests
 */
export const testAgent: Agent = {
  name: "Integration Test Agent",
  username: "test_agent",
  bio: "A test agent for integration tests",
  enabled: true,
  settings: {
    testSetting: "test value",
  },
  createdAt: Date.now(),
  updatedAt: Date.now(),
};
```