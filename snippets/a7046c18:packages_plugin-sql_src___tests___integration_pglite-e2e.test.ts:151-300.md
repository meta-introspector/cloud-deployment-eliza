# a7046c18:packages_plugin-sql_src___tests___integration_pglite-e2e.test.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/pglite-e2e.test.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      const created = await adapter.createEntities(entities);
      expect(created).toBe(true);

      const entityIds = entities
        .map((e) => e.id)
        .filter((id): id is UUID => id !== undefined);
      const retrieved = await adapter.getEntitiesByIds(entityIds);
      expect(retrieved).toHaveLength(2);

      // Sort by name to ensure consistent order
      const sortedRetrieved = retrieved?.sort((a, b) =>
        a.names[0].localeCompare(b.names[0]),
      );
      expect(sortedRetrieved?.[0].names).toContain("Entity One");
      expect(sortedRetrieved?.[1].metadata).toEqual({ custom: "data" });

      await adapter.close();
    });

    it("should update an entity", async () => {
      const { adapter, agentId } = await createTestAdapter();

      // Create agent first
      await adapter.createAgent({
        id: agentId,
        name: "Test Agent",
      } as Agent);

      const entity: Entity = {
        id: uuidv4() as UUID,
        agentId,
        names: ["Original"],
        metadata: { custom: "data" },
      };

      await adapter.createEntities([entity]);

      await adapter.updateEntity({
        ...entity,
        names: ["Updated"],
        metadata: { updated: true },
      });

      const retrieved = await adapter.getEntitiesByIds([entity.id!]);
      expect(retrieved?.[0].names).toContain("Updated");
      expect(retrieved?.[0].metadata).toEqual({ updated: true });

      await adapter.close();
    });
  });

  describe("Memory Operations", () => {
    let adapter: PgliteDatabaseAdapter;
    let agentId: UUID;
    let roomId: UUID;
    let entityId: UUID;

    beforeEach(async () => {
      const result = await createTestAdapter();
      adapter = result.adapter;
      agentId = result.agentId;

      // Create agent first
      await adapter.createAgent({
        id: agentId,
        name: "Test Agent",
      } as Agent);

      roomId = uuidv4() as UUID;
      entityId = uuidv4() as UUID;

      // Create room first
      await adapter.createRooms([
        {
          id: roomId,
          agentId,
          source: "test",
          type: "GROUP" as ChannelType,
          name: "Test Room",
        },
      ]);

      // Create required entity
      await adapter.createEntities([
        {
          id: entityId,
          agentId,
          names: ["Test Entity"],
          metadata: { custom: "data" },
        },
      ]);
    });

    afterEach(async () => {
      await adapter.close();
    });

    it("should create and retrieve memories", async () => {
      const memory: Memory = {
        id: uuidv4() as UUID,
        agentId,
        entityId,
        roomId,
        content: { text: "Test memory content" },
        metadata: {
          type: "custom",
        },
        createdAt: Date.now(),
      };

      const memoryId = await adapter.createMemory(memory, "memories");
      expect(memoryId).toBeDefined();

      const retrieved = await adapter.getMemoryById(memoryId);
      expect(retrieved).toBeDefined();
      expect(retrieved?.content).toEqual({ text: "Test memory content" });
    });

    it("should search memories by embedding", async () => {
      const embedding = Array(384).fill(0.1);
      const memory: Memory = {
        id: uuidv4() as UUID,
        agentId,
        entityId,
        roomId,
        content: { text: "Searchable memory" },
        metadata: {
          type: "custom",
        },
        embedding,
        createdAt: Date.now(),
      };

      await adapter.createMemory(memory, "memories");

      const results = await adapter.searchMemories({
        tableName: "memories",
        embedding,
        count: 10,
      });

      expect(results).toHaveLength(1);
      expect(results[0].content).toEqual({ text: "Searchable memory" });
    });

    it("should update memory content", async () => {
      const memory: Memory = {
        id: uuidv4() as UUID,
        agentId,
        entityId,
```