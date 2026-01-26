# a7046c18:packages_plugin-sql_src___tests___integration_base-adapter-methods.test.ts:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/base-adapter-methods.test.ts:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        worldId,
        entityId: testEntityId,
        sourceEntityId,
        agentId: testAgentId,
        roomId,
        data: {
          relationship: "friend",
          trust: 0.5,
        },
        createdAt: new Date(),
      };

      // Create component
      await adapter.createComponent(component);

      // Update component
      await adapter.updateComponent({
        ...component,
        data: {
          relationship: "best_friend",
          trust: 0.9,
        },
      });

      // Verify update
      const retrieved = await adapter.getComponent(
        testEntityId,
        "relationship",
        worldId,
        sourceEntityId,
      );
      expect(retrieved?.data.relationship).toBe("best_friend");
      expect(retrieved?.data.trust).toBe(0.9);
    });

    it("should handle deleteComponent", async () => {
      const worldId = uuidv4() as UUID;
      const sourceEntityId = uuidv4() as UUID;
      const roomId = uuidv4() as UUID;

      // Create world first
      await adapter.createWorld({
        id: worldId,
        agentId: testAgentId,
        serverId: uuidv4() as UUID,
        name: "Test World",
      });

      // Create room
      await adapter.createRooms([
        {
          id: roomId,
          agentId: testAgentId,
          source: "test",
          type: "GROUP" as ChannelType,
          name: "Test Room",
        },
      ]);

      // Create source entity
      await adapter.createEntities([
        {
          id: sourceEntityId,
          agentId: testAgentId,
          names: ["Source Entity"],
          metadata: {},
        },
      ]);

      const component: Component = {
        id: uuidv4() as UUID,
        type: "test",
        worldId,
        entityId: testEntityId,
        sourceEntityId,
        agentId: testAgentId,
        roomId,
        data: {},
        createdAt: new Date(),
      };

      // Create component
      await adapter.createComponent(component);

      // Delete component
      await adapter.deleteComponent(component.id);

      // Verify removal
      const retrieved = await adapter.getComponent(
        testEntityId,
        "test",
        worldId,
        sourceEntityId,
      );
      expect(retrieved).toBeNull();
    });

    it("should handle deleteEntity", async () => {
      const entity: Entity = {
        id: uuidv4() as UUID,
        agentId: testAgentId,
        names: ["Test Entity"],
        metadata: { type: "test" },
      };

      // Create entity
      await adapter.createEntities([entity]);

      // Delete entity
      if (entity.id) {
        await adapter.deleteEntity(entity.id);
      }

      // Verify removal
      const retrieved = await adapter.getEntitiesByNames({
        names: entity.names,
        agentId: testAgentId,
      });
      expect(retrieved.length).toBe(0);
    });

    it("should handle removeMemory using deleteMemory", async () => {
      const roomId = uuidv4() as UUID;

      // Create room first
      await adapter.createRooms([
        {
          id: roomId,
          agentId: testAgentId,
          source: "test",
          type: "GROUP" as ChannelType,
          name: "Test Room",
        },
      ]);

      const memoryId = uuidv4() as UUID;
      const memory: Memory = {
        id: memoryId,
        agentId: testAgentId,
        entityId: testEntityId,
        roomId: roomId,
        content: { text: "Test memory" } as Content,
        createdAt: new Date(),
        metadata: { type: "test" },
      };

      // Create memory
      await adapter.createMemory(memory, "memories");

      // Remove memory
```