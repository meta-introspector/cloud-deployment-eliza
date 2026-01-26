# a7046c18:packages_plugin-sql_src___tests___integration_seed_world-seed.ts:1-75

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/seed/world-seed.ts:1-75
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import {
  type Agent,
  type Entity,
  Role,
  type UUID,
  type World,
} from "@elizaos/core";
import { v4 as uuidv4 } from "uuid";

// Test IDs
export const worldTestAgentId = uuidv4() as UUID;
export const worldTestEntityId = uuidv4() as UUID;

// Test data for world integration tests
export const worldTestAgent: Agent = {
  id: worldTestAgentId,
  name: "World Test Agent",
  bio: "Test agent for world integration tests",
  settings: {
    profile: {
      short_description: "Test agent for world integration tests",
    },
  },
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

export const worldTestEntity: Entity = {
  id: worldTestEntityId,
  names: ["World Test Entity"],
  agentId: worldTestAgentId,
  components: [],
  metadata: {
    type: "user",
  },
};

// Basic test worlds
export const worldTestWorlds: World[] = [
  {
    id: uuidv4() as UUID,
    agentId: worldTestAgentId,
    name: "Test World 1",
    serverId: "test-server-1",
    metadata: {
      ownership: {
        ownerId: worldTestEntityId,
      },
      roles: {
        [worldTestEntityId]: Role.OWNER,
      },
    },
  },
  {
    id: uuidv4() as UUID,
    agentId: worldTestAgentId,
    name: "Test World 2",
    serverId: "test-server-2",
    metadata: {
      ownership: {
        ownerId: worldTestEntityId,
      },
    },
  },
  {
    id: uuidv4() as UUID,
    agentId: worldTestAgentId,
    name: "Test World 3",
    serverId: "test-server-3",
    metadata: {
      custom: "value",
      tags: ["test", "integration"],
    },
  },
];
```