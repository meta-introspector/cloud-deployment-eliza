# a7046c18:packages_core_typescript_src___tests___database.test.ts:751-793

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/database.test.ts:751-793
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    });
    expect(embeddings).toHaveLength(1);
    expect(embeddings[0].embedding).toEqual([0.1, 0.2, 0.3]);
  });

  it("should search memories based on embedding", async () => {
    const memories = await adapter.searchMemories({
      tableName: "test_table",
      roomId: "room-id" as `${string}-${string}-${string}-${string}-${string}`,
      embedding: [0.1, 0.2, 0.3],
      match_threshold: 0.5,
      count: 3,
      unique: true,
    });
    expect(memories).toHaveLength(1);
    expect(memories[0].roomId).toBe("room-id" as UUID);
  });

  it("should get an account by user ID", async () => {
    const account = await adapter.getEntityById("test-user-id" as UUID);
    expect(account).not.toBeNull();
    expect(account?.metadata?.username).toBe("testuser");
  });

  it("should create a new account", async () => {
    const newEntity: Entity = {
      id: "new-user-id" as UUID,
      names: ["New Entity"],
      metadata: {
        username: "newuser",
        name: "New Entity",
      },
      agentId: "agent-id" as UUID,
    };
    const result = await adapter.createEntity(newEntity);
    expect(result).toBe(true);
  });

  it("should return entities by room ID", async () => {
    const entities = await adapter.getEntities({ roomId });
    expect(entities).toHaveLength(1);
  });
});
```