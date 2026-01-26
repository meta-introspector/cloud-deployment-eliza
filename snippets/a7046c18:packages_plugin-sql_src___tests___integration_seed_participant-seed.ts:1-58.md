# a7046c18:packages_plugin-sql_src___tests___integration_seed_participant-seed.ts:1-58

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/seed/participant-seed.ts:1-58
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import {
  type Agent,
  ChannelType,
  type Entity,
  type Room,
  type UUID,
  type World,
} from "@elizaos/core";
import { v4 as uuidv4 } from "uuid";

// Test IDs
export const participantTestAgentId = uuidv4() as UUID;
export const participantTestEntityId = uuidv4() as UUID;
export const participantTestRoomId = uuidv4() as UUID;
export const participantTestWorldId = uuidv4() as UUID;

// Test data for participant integration tests
export const participantTestAgent: Agent = {
  id: participantTestAgentId,
  name: "Participant Test Agent",
  bio: "Test agent for participant integration tests",
  settings: {
    profile: {
      short_description: "Test agent for participant integration tests",
    },
  },
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

export const participantTestEntity: Entity = {
  id: participantTestEntityId,
  names: ["Participant Test Entity"],
  agentId: participantTestAgentId,
  components: [],
  metadata: {
    type: "user",
    worldId: participantTestWorldId,
  },
};

export const participantTestWorld: World = {
  id: participantTestWorldId,
  agentId: participantTestAgentId,
  name: "Participant Test World",
  serverId: "test-server",
  metadata: {},
};

export const participantTestRoom: Room = {
  id: participantTestRoomId,
  name: "Participant Test Room",
  agentId: participantTestAgentId,
  source: "test",
  type: ChannelType.GROUP,
  worldId: participantTestWorldId,
  metadata: {},
};
```