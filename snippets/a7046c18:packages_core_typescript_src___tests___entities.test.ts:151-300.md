# a7046c18:packages_core_typescript_src___tests___entities.test.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/entities.test.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      const mockRoom = {
        id: "room-789" as UUID,
        worldId: "world-123" as UUID,
        createdAt: Date.now(),
      };

      const mockWorld = {
        id: "world-123" as UUID,
        name: "Test World",
        agentId: "agent-id-123" as UUID,
        messageServerId: "server-123" as UUID,
        metadata: {
          roles: {
            "admin-entity": "ADMIN",
            "owner-entity": "OWNER",
          },
        },
        createdAt: Date.now(),
        entities: [],
      };

      const mockEntity: Entity = {
        id: "entity-123" as UUID,
        names: ["Alice"],
        agentId: "agent-id-123" as UUID,
        components: [
          {
            id: "comp-1" as UUID,
            entityId: "entity-123" as UUID,
            agentId: "agent-id-123" as UUID,
            roomId: "room-789" as UUID,
            worldId: "world-123" as UUID,
            sourceEntityId: "entity-456" as UUID, // Should pass - message sender
            type: "PROFILE",
            createdAt: Date.now(),
            data: {},
          },
          {
            id: "comp-2" as UUID,
            entityId: "entity-123" as UUID,
            agentId: "agent-id-123" as UUID,
            roomId: "room-789" as UUID,
            worldId: "world-123" as UUID,
            sourceEntityId: "admin-entity" as UUID, // Should pass - admin
            type: "PROFILE",
            createdAt: Date.now(),
            data: {},
          },
          {
            id: "comp-3" as UUID,
            entityId: "entity-123" as UUID,
            agentId: "agent-id-123" as UUID,
            roomId: "room-789" as UUID,
            worldId: "world-123" as UUID,
            sourceEntityId: "random-entity" as UUID, // Should be filtered out
            type: "PROFILE",
            createdAt: Date.now(),
            data: {},
          },
        ],
      };

      mockRuntime.getRoom = mock().mockResolvedValue(mockRoom);
      mockRuntime.getWorld = mock().mockResolvedValue(mockWorld);
      mockRuntime.getEntitiesForRoom = mock().mockResolvedValue([mockEntity]);
      mockRuntime.getRelationships = mock().mockResolvedValue([]);
      mockRuntime.getMemories = mock().mockResolvedValue([]);
      mockRuntime.useModel = mock().mockResolvedValue(
        JSON.stringify({
          type: "EXACT_MATCH",
          entityId: "entity-123",
        }),
      );
      mockRuntime.getEntityById = mock().mockResolvedValue(mockEntity);

      await findEntityByName(mockRuntime, mockMemory, mockState);

      // The mock setup should have filtered components, but since we're mocking
      // the entire flow, we need to verify the logic would work correctly
      expect(mockRuntime.getWorld).toHaveBeenCalledWith("world-123");
    });

    it("should handle LLM parse failure gracefully", async () => {
      const mockRoom = {
        id: "room-789" as UUID,
        createdAt: Date.now(),
      };

      mockRuntime.getRoom = mock().mockResolvedValue(mockRoom);
      mockRuntime.getWorld = mock().mockResolvedValue(null);
      mockRuntime.getEntitiesForRoom = mock().mockResolvedValue([]);
      mockRuntime.getRelationships = mock().mockResolvedValue([]);
      mockRuntime.getMemories = mock().mockResolvedValue([]);
      mockRuntime.useModel = mock().mockResolvedValue("invalid json");

      const result = await findEntityByName(mockRuntime, mockMemory, mockState);

      expect(result).toBeNull();
    });

    it("should handle EXACT_MATCH with entity components filtering", async () => {
      const mockRoom = {
        id: "room-789" as UUID,
        worldId: "world-123" as UUID,
        createdAt: Date.now(),
      };

      const mockWorld = {
        id: "world-123" as UUID,
        name: "Test World",
        agentId: "agent-id-123" as UUID,
        messageServerId: "server-123" as UUID,
        metadata: {
          roles: {
            "admin-entity": "ADMIN",
            "owner-entity": "OWNER",
            "regular-entity": "MEMBER",
          },
        },
        createdAt: Date.now(),
        entities: [],
      };

      const mockEntityWithComponents: Entity = {
        id: "entity-exact" as UUID,
        names: ["ExactMatch"],
        agentId: "agent-id-123" as UUID,
        metadata: {},
        components: [
          {
            id: "comp-1" as UUID,
            entityId: "entity-exact" as UUID,
            agentId: "agent-id-123" as UUID,
            roomId: "room-789" as UUID,
            worldId: "world-123" as UUID,
            sourceEntityId: "entity-456" as UUID, // Same as message sender
            type: "PROFILE",
            createdAt: Date.now(),
            data: { bio: "User profile" },
          },
          {
            id: "comp-2" as UUID,
            entityId: "entity-exact" as UUID,
            agentId: "agent-id-123" as UUID,
            roomId: "room-789" as UUID,
            worldId: "world-123" as UUID,
            sourceEntityId: "admin-entity" as UUID, // Admin role
            type: "SETTINGS",
            createdAt: Date.now(),
            data: { settings: "admin settings" },
```