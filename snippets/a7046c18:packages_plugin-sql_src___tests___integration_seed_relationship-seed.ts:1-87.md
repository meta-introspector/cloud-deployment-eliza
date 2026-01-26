# a7046c18:packages_plugin-sql_src___tests___integration_seed_relationship-seed.ts:1-87

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/seed/relationship-seed.ts:1-87
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import type { Agent, Entity, Relationship, UUID } from "@elizaos/core";
import { v4 as uuidv4 } from "uuid";

// Test IDs for relationship tests
export const relationshipTestAgentId = uuidv4() as UUID;
export const relationshipTestSourceEntityId = uuidv4() as UUID;
export const relationshipTestTargetEntityId = uuidv4() as UUID;

// Test data for relationship integration tests
export const relationshipTestAgent: Agent = {
  id: relationshipTestAgentId,
  name: "Relationship Test Agent",
  bio: "Test agent for relationship integration tests",
  settings: {
    profile: {
      short_description: "Test agent for relationship integration tests",
    },
  },
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

export const relationshipTestSourceEntity: Entity = {
  id: relationshipTestSourceEntityId,
  names: ["Source Entity"],
  agentId: relationshipTestAgentId,
  components: [],
  metadata: {
    type: "user",
  },
};

export const relationshipTestTargetEntity: Entity = {
  id: relationshipTestTargetEntityId,
  names: ["Target Entity"],
  agentId: relationshipTestAgentId,
  components: [],
  metadata: {
    type: "user",
  },
};

// Test relationships
export const relationshipTestRelationships: Relationship[] = [
  {
    id: uuidv4() as UUID,
    sourceEntityId: relationshipTestSourceEntityId,
    targetEntityId: relationshipTestTargetEntityId,
    agentId: relationshipTestAgentId,
    tags: ["friend"],
    metadata: {
      type: "social",
      strength: "high",
    },
    createdAt: Date.now().toString(),
  },
  {
    id: uuidv4() as UUID,
    sourceEntityId: relationshipTestTargetEntityId,
    targetEntityId: relationshipTestSourceEntityId,
    agentId: relationshipTestAgentId,
    tags: ["colleague"],
    metadata: {
      type: "professional",
      strength: "medium",
    },
    createdAt: Date.now().toString(),
  },
];

// Helper function to create a relationship with custom tags and metadata
export const createTestRelationship = (
  sourceId: UUID,
  targetId: UUID,
  tags: string[] = [],
  metadata: Record<string, any> = {},
): Relationship => {
  return {
    id: uuidv4() as UUID,
    sourceEntityId: sourceId,
    targetEntityId: targetId,
    agentId: relationshipTestAgentId,
    tags,
    metadata,
    createdAt: Date.now().toString(),
  };
};
```