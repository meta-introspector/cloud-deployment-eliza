# a7046c18:packages_plugin-sql_src___tests___integration_seed_memory-seed.ts:151-235

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/seed/memory-seed.ts:151-235
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  },
];

// Document and fragments for testing document operations
export const documentMemoryId = uuidv4() as UUID;
export const memoryTestDocument: Memory = {
  id: documentMemoryId,
  entityId: memoryTestEntityId,
  roomId: memoryTestRoomId,
  agentId: memoryTestAgentId,
  createdAt: Date.now(),
  unique: true,
  content: {
    text: "This is a test document memory",
    type: "text",
  },
  metadata: {
    type: "document",
    documentId: documentMemoryId,
    timestamp: Date.now(),
    title: "Test Document",
    source: "integration-test",
  },
};

// Fragment memories that belong to the document
export const memoryTestFragments: Memory[] = Array(3)
  .fill(0)
  .map((_, index) => ({
    id: uuidv4() as UUID,
    entityId: memoryTestEntityId,
    roomId: memoryTestRoomId,
    agentId: memoryTestAgentId,
    createdAt: Date.now(),
    unique: true,
    content: {
      text: `This is fragment ${index + 1} of the test document`,
      type: "text",
    },
    embedding: generateEmbedding(384),
    metadata: {
      type: "fragment",
      documentId: documentMemoryId,
      position: index,
      source: "integration-test",
    },
  }));

// Helper function to create similar memory for vector similarity testing
export const createSimilarMemoryVector = (
  baseMemory: Memory,
  similarity: number,
): Memory => {
  // Only works if baseMemory has an embedding
  if (!baseMemory.embedding || !Array.isArray(baseMemory.embedding)) {
    throw new Error("Base memory must have an embedding");
  }

  // Create a somewhat similar vector (higher similarity means more similar)
  const dimension = baseMemory.embedding.length;
  const noise = generateEmbedding(dimension);

  // Blend the original vector with noise based on similarity
  const blendedVector = baseMemory.embedding.map((value, idx) => {
    return value * similarity + noise[idx] * (1 - similarity);
  });

  // Normalize the resulting vector
  const magnitude = Math.sqrt(
    blendedVector.reduce((sum, val) => sum + val * val, 0),
  );
  const normalizedVector = blendedVector.map((val) =>
    Number((val / magnitude).toFixed(6)),
  );

  return {
    ...baseMemory,
    id: uuidv4() as UUID,
    embedding: normalizedVector,
    content: {
      ...baseMemory.content,
      text: `Similar to: ${baseMemory.content.text}`,
    },
  };
};
```