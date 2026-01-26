# a7046c18:packages_plugin-sql_src___tests___integration_seed_log-seed.ts:1-103

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/seed/log-seed.ts:1-103
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
/**
 * Seed data for log integration tests
 */
import {
  type Agent,
  AgentStatus,
  ChannelType,
  type Log,
  type UUID,
} from "@elizaos/core";
import { v4 } from "uuid";

/**
 * Default test agent settings for log tests
 */
export const logTestAgentSettings = {
  id: v4() as UUID,
  name: "Log Test Agent",
  username: "log_test_agent",
  system: "Test agent system prompt",
  bio: "An agent for testing log operations",
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
    logTestSetting: "log test value",
  },
  style: {
    all: [],
    chat: [],
    post: [],
  },
} as Agent;

/**
 * Test world for log tests
 */
export const logTestWorld = {
  id: v4() as UUID,
  agentId: logTestAgentSettings.id,
  serverId: v4() as UUID,
  name: "Log Test World",
  description: "A world for log integration tests",
  metadata: {},
};

/**
 * Test entity for log tests
 */
export const logTestEntity = {
  id: v4() as UUID,
  names: ["Log Test Entity"],
  agentId: logTestAgentSettings.id,
  metadata: {},
};

/**
 * Test room for log tests
 */
export const logTestRoom = {
  id: v4() as UUID,
  name: "Log Test Room",
  type: ChannelType.DM,
  agentId: logTestAgentSettings.id,
  worldId: logTestWorld.id,
  source: "log-test",
  metadata: {},
};

/**
 * Test logs
 */
export const logTestLogs = {
  basic: {
    id: v4() as UUID,
    entityId: logTestEntity.id,
    roomId: logTestRoom.id,
    body: { message: "Test log message", data: { key: "value" } },
    type: "test_log",
    createdAt: new Date(),
  } as Log,
  withMetadata: {
    id: v4() as UUID,
    entityId: logTestEntity.id,
    roomId: logTestRoom.id,
    body: {
      message: "Log with extra metadata",
      metadata: {
        priority: "high",
        source: "test_suite",
      },
    },
    type: "metadata_log",
    createdAt: new Date(),
  } as Log,
};
```