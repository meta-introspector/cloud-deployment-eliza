# a7046c18:packages_plugin-sql_src___tests___integration_seed_entity-seed.ts:1-81

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/seed/entity-seed.ts:1-81
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
/**
 * Seed data for entity integration tests
 */
import { type Agent, AgentStatus, type UUID } from "@elizaos/core";
import { v4 } from "uuid";

/**
 * Default test agent settings for entity tests
 */
export const entityTestAgentSettings = {
  id: v4() as UUID,
  name: "Entity Test Agent",
  username: "entity_test_agent",
  system: "Test agent system prompt",
  bio: "An agent for testing entity operations",
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
    entityTestSetting: "entity test value",
  },
  style: {
    all: [],
    chat: [],
    post: [],
  },
} as Agent;

/**
 * Test entity data
 */
export const testEntities = {
  basicEntity: {
    id: v4() as UUID,
    names: ["Basic Entity"],
    metadata: {
      type: "basic",
      description: "A basic entity for testing",
    },
    agentId: entityTestAgentSettings.id as UUID,
  },
  complexEntity: {
    id: v4() as UUID,
    names: ["Complex Entity", "Alternative Name"],
    metadata: {
      type: "complex",
      description: "A complex entity for testing",
      properties: {
        strength: 10,
        intelligence: 15,
        isSpecial: true,
      },
      tags: ["test", "entity", "complex"],
    },
    agentId: entityTestAgentSettings.id as UUID,
  },
  entityToUpdate: {
    id: v4() as UUID,
    names: ["Entity to Update"],
    metadata: {
      type: "updatable",
      version: 1,
    },
    agentId: entityTestAgentSettings.id as UUID,
  },
  entityWithComponent: {
    id: v4() as UUID,
    names: ["Entity with Component"],
    metadata: {
      type: "component-holder",
    },
    agentId: entityTestAgentSettings.id as UUID,
  },
};
```