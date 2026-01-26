# a7046c18:packages_plugin-sql_src___tests___integration_pglite-e2e.test.ts:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/pglite-e2e.test.ts:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        roomId,
        content: { text: "Original content" },
        metadata: {
          type: "custom",
        },
        createdAt: Date.now(),
      };

      const memoryId = await adapter.createMemory(memory, "memories");

      const updated = await adapter.updateMemory({
        id: memoryId,
        content: { text: "Updated content" },
        metadata: { type: "custom", edited: true },
      });

      expect(updated).toBe(true);

      const retrieved = await adapter.getMemoryById(memoryId);
      expect(retrieved?.content).toEqual({ text: "Updated content" });
      expect(retrieved?.metadata).toMatchObject({
        type: "custom",
        edited: true,
      });
    });

    it("should delete memories", async () => {
      const memory: Memory = {
        id: uuidv4() as UUID,
        agentId,
        entityId,
        roomId,
        content: { text: "To be deleted" },
        metadata: {
          type: "custom",
        },
        createdAt: Date.now(),
      };

      const memoryId = await adapter.createMemory(memory, "memories");
      await adapter.deleteMemory(memoryId);

      const retrieved = await adapter.getMemoryById(memoryId);
      expect(retrieved).toBeNull();
    });
  });

  describe("Component Operations", () => {
    let adapter: PgliteDatabaseAdapter;
    let agentId: UUID;
    let entityId: UUID;
    let roomId: UUID;
    let worldId: UUID;
    let sourceEntityId: UUID;

    beforeEach(async () => {
      const result = await createTestAdapter();
      adapter = result.adapter;
      agentId = result.agentId;

      // Create agent first
      await adapter.createAgent({
        id: agentId,
        name: "Test Agent",
      } as Agent);

      entityId = uuidv4() as UUID;
      roomId = uuidv4() as UUID;
      worldId = uuidv4() as UUID;
      sourceEntityId = uuidv4() as UUID;

      await adapter.createWorld({
        id: worldId,
        agentId,
        serverId: uuidv4() as UUID,
        name: "Test World",
      });

      // Create room
      await adapter.createRooms([
        {
          id: roomId,
          agentId,
          source: "test",
          type: "GROUP" as ChannelType,
          name: "Test Room",
        },
      ]);

      await adapter.createEntities([
        {
          id: entityId,
          agentId,
          names: ["Component Test Entity"],
          metadata: { custom: "data" },
        },
        {
          id: sourceEntityId,
          agentId,
          names: ["Source Test Entity"],
          metadata: { custom: "data" },
        },
      ]);
    });

    afterEach(async () => {
      await adapter.close();
    });

    it("should create and retrieve components", async () => {
      const component: Component = {
        id: uuidv4() as UUID,
        entityId,
        agentId,
        roomId,
        worldId,
        sourceEntityId,
        type: "test-component",
        data: { value: "test data" },
        createdAt: Date.now(),
      };

      const created = await adapter.createComponent(component);
      expect(created).toBe(true);

      const retrieved = await adapter.getComponent(
        entityId,
        "test-component",
        worldId,
        sourceEntityId,
      );
      expect(retrieved).toBeDefined();
      expect(retrieved?.data).toEqual({ value: "test data" });
    });

    it("should update a component", async () => {
      const component: Component = {
        id: uuidv4() as UUID,
        entityId,
        agentId,
        roomId,
        worldId,
        sourceEntityId,
        type: "update-test",
        data: { original: true },
        createdAt: Date.now(),
      };
      await adapter.createComponent(component);
      await adapter.updateComponent({
        ...component,
```