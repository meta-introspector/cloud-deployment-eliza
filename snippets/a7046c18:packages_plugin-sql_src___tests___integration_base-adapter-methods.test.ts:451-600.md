# a7046c18:packages_plugin-sql_src___tests___integration_base-adapter-methods.test.ts:451-600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/base-adapter-methods.test.ts:451-600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      await adapter.deleteMemory(memoryId);

      // Verify removal
      const retrieved = await adapter.getMemoryById(memoryId);
      expect(retrieved).toBeNull();
    });

    it("should handle deleteRoom", async () => {
      const room: Room = {
        id: uuidv4() as UUID,
        agentId: testAgentId,
        source: "test",
        type: "GROUP" as ChannelType,
        name: "Test Room",
      };

      // Create room
      await adapter.createRooms([room]);

      // Delete room
      await adapter.deleteRoom(room.id);

      // Verify removal - use getRoomsByIds to check
      const retrieved = await adapter.getRoomsByIds([room.id]);
      expect(retrieved?.length).toBe(0);
    });

    it("should handle entity operations with metadata", async () => {
      const entity: Entity = {
        id: uuidv4() as UUID,
        agentId: testAgentId,
        names: ["Test Entity"],
        metadata: {
          category: "person",
          age: 25,
          tags: ["developer", "engineer"],
          nested: {
            level: 1,
            data: "test",
          },
        },
      };

      await adapter.createEntities([entity]);
      const retrieved = await adapter.getEntitiesByNames({
        names: entity.names,
        agentId: testAgentId,
      });

      expect(retrieved.length).toBe(1);
      expect(retrieved[0]?.metadata?.category).toBe("person");
      expect(retrieved[0]?.metadata?.age).toBe(25);
      expect(retrieved[0]?.metadata?.tags).toEqual(["developer", "engineer"]);
      expect(
        (retrieved[0]?.metadata?.nested as Record<string, unknown>)?.level,
      ).toBe(1);
    });

    it("should handle component operations with complex params", async () => {
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
        type: "inventory",
        worldId,
        entityId: testEntityId,
        sourceEntityId,
        agentId: testAgentId,
        roomId,
        data: {
          items: [
            { id: "sword", quantity: 1, damage: 10 },
            { id: "shield", quantity: 1, defense: 5 },
          ],
          maxCapacity: 10,
          currentWeight: 25.5,
        },
        createdAt: new Date(),
      };

      await adapter.createComponent(component);
      const retrieved = await adapter.getComponent(
        testEntityId,
        "inventory",
        worldId,
        sourceEntityId,
      );

      expect(retrieved).toBeDefined();
      expect(retrieved?.data.items).toHaveLength(2);
      expect(retrieved?.data.maxCapacity).toBe(10);
      expect(retrieved?.data.currentWeight).toBe(25.5);
    });
  });

  describe("Search and Filtering", () => {
    beforeEach(async () => {
      // Clean up any existing entities from previous tests
      const existingEntities = await adapter.searchEntitiesByName({
        query: "",
        agentId: testAgentId,
        limit: 100,
      });
      for (const entity of existingEntities) {
        if (entity.id) {
          await adapter.deleteEntity(entity.id);
        }
      }
    });

    it("should search entities by name and limit results", async () => {
      // Create multiple entities
      const entities: Entity[] = [
        {
          id: uuidv4() as UUID,
          agentId: testAgentId,
          names: ["Alice Smith", "Alicia"],
          metadata: { type: "person" },
        },
```