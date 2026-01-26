# a7046c18:packages_plugin-sql_src___tests___integration_seed_cache-seed.ts:1-81

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/seed/cache-seed.ts:1-81
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
/**
 * Seed data for cache integration tests
 */
import { type Agent, AgentStatus, type UUID } from "@elizaos/core";
import { v4 } from "uuid";

/**
 * Default test agent settings for cache tests
 */
export const cacheTestAgentSettings = {
  id: v4() as UUID,
  name: "Cache Test Agent",
  username: "cache_test_agent",
  system: "Test agent system prompt",
  bio: "An agent for testing cache operations",
  enabled: true,
  status: AgentStatus.ACTIVE,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  messageExamples: [],
  postExamples: [],
  topics: [],
  adjectives: [],
  knowledge: [],
  plugins: [],
  settings: {
    cacheTestSetting: "cache test value",
  },
  style: {
    all: [],
    chat: [],
    post: [],
  },
} as Agent;

/**
 * Test cache values
 */
export const testCacheEntries = {
  stringValue: {
    key: "test_string",
    value: "test value",
  },
  numberValue: {
    key: "test_number",
    value: 42,
  },
  objectValue: {
    key: "test_object",
    value: {
      name: "Test Object",
      properties: {
        id: 1,
        active: true,
      },
      tags: ["test", "cache", "integration"],
    },
  },
  arrayValue: {
    key: "test_array",
    value: [1, 2, 3, "four", { five: 5 }],
  },
};

/**
 * Test cache with expiration settings
 */
export const testCacheWithExpiration = {
  expired: {
    key: "expired_cache",
    value: "This value has expired",
    // Set expiration to 1 hour in the past
    expiresAt: Date.now() - 60 * 60 * 1000,
  },
  notExpired: {
    key: "not_expired_cache",
    value: "This value has not expired",
    // Set expiration to 1 hour in the future
    expiresAt: Date.now() + 60 * 60 * 1000,
  },
};
```