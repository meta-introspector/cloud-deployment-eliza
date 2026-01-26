# a7046c18:packages_plugin-sql_src___tests___integration_seed_memory-seed.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/seed/memory-seed.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import {
  type Agent,
  ChannelType,
  type Entity,
  type Memory,
  type Room,
  type UUID,
  type World,
} from "@elizaos/core";
import { v4 as uuidv4 } from "uuid";

// Test IDs
export const memoryTestAgentId = uuidv4() as UUID;
export const memoryTestEntityId = uuidv4() as UUID;
export const memoryTestRoomId = uuidv4() as UUID;
export const memoryTestWorldId = uuidv4() as UUID;

// Test data for memory integration tests
export const memoryTestAgent: Agent = {
  id: memoryTestAgentId,
  name: "Memory Test Agent",
  bio: "Test agent for memory integration tests",
  settings: {
    profile: {
      short_description: "Test agent for memory integration tests",
    },
  },
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

export const memoryTestEntity: Entity = {
  id: memoryTestEntityId,
  names: ["Memory Test Entity"],
  agentId: memoryTestAgentId,
  components: [],
  metadata: {
    type: "user",
    worldId: memoryTestWorldId,
  },
};

export const memoryTestWorld: World = {
  id: memoryTestWorldId,
  agentId: memoryTestAgentId,
  name: "Memory Test World",
  serverId: "test-server",
  metadata: {},
};

export const memoryTestRoom: Room = {
  id: memoryTestRoomId,
  name: "Memory Test Room",
  agentId: memoryTestAgentId,
  source: "test",
  type: ChannelType.GROUP,
  worldId: memoryTestWorldId,
  metadata: {},
};

// Helper function to generate random embedding vectors
export const generateEmbedding = (dimension: number = 384): number[] => {
  const vector = Array(dimension)
    .fill(0)
    .map(() => Math.random() * 2 - 1);
  // Normalize
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  return vector.map((val) => Number((val / magnitude).toFixed(6)));
};

// Basic memory test objects
export const memoryTestMemories: Memory[] = [
  {
    id: uuidv4() as UUID,
    entityId: memoryTestEntityId,
    roomId: memoryTestRoomId,
    agentId: memoryTestAgentId,
    createdAt: Date.now() - 3600000, // 1 hour ago
    unique: true,
    content: {
      text: "This is a test memory for integration testing #1",
      type: "text",
    },
    metadata: {
      type: "chat",
      source: "integration-test",
    },
  },
  {
    id: uuidv4() as UUID,
    entityId: memoryTestEntityId,
    roomId: memoryTestRoomId,
    agentId: memoryTestAgentId,
    createdAt: Date.now() - 7200000, // 2 hours ago
    unique: true,
    content: {
      text: "This is a test memory for integration testing #2",
      type: "text",
    },
    metadata: {
      type: "chat",
      source: "integration-test",
    },
  },
  {
    id: uuidv4() as UUID,
    entityId: memoryTestEntityId,
    roomId: memoryTestRoomId,
    agentId: memoryTestAgentId,
    createdAt: Date.now() - 10800000, // 3 hours ago
    unique: true,
    content: {
      text: "This is a test memory for integration testing #3",
      type: "text",
    },
    metadata: {
      type: "chat",
      source: "integration-test",
    },
  },
];

// Memory test objects with embeddings
export const memoryTestMemoriesWithEmbedding: Memory[] = [
  {
    ...memoryTestMemories[0],
    id: uuidv4() as UUID,
    embedding: generateEmbedding(384),
    content: {
      text: "This is a test memory with embedding dimension 384",
      type: "text",
    },
  },
  {
    ...memoryTestMemories[1],
    id: uuidv4() as UUID,
    embedding: generateEmbedding(384),
    content: {
      text: "This is a test memory with embedding dimension 384",
      type: "text",
    },
  },
  {
    ...memoryTestMemories[2],
    id: uuidv4() as UUID,
    embedding: generateEmbedding(384),
    content: {
      text: "This is a test memory with embedding dimension 384",
      type: "text",
    },
```