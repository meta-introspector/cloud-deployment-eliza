# a7046c18:packages_core_typescript_src___tests___entities.test.ts:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/entities.test.ts:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
          },
          {
            id: "comp-3" as UUID,
            entityId: "entity-exact" as UUID,
            agentId: "agent-id-123" as UUID,
            roomId: "room-789" as UUID,
            worldId: "world-123" as UUID,
            sourceEntityId: "random-entity" as UUID, // Should be filtered out
            type: "PRIVATE",
            createdAt: Date.now(),
            data: { private: "data" },
          },
        ],
      };

      mockRuntime.getRoom = mock().mockResolvedValue(mockRoom);
      mockRuntime.getWorld = mock().mockResolvedValue(mockWorld);
      mockRuntime.getEntitiesForRoom = mock().mockResolvedValue([
        mockEntityWithComponents,
      ]);
      mockRuntime.getRelationships = mock().mockResolvedValue([]);
      mockRuntime.getMemories = mock().mockResolvedValue([]);
      mockRuntime.useModel = mock().mockResolvedValue(
        JSON.stringify({
          entityId: "entity-exact",
          type: "EXACT_MATCH",
          matches: [{ name: "ExactMatch", reason: "Exact ID match" }],
        }),
      );
      mockRuntime.getEntityById = mock().mockResolvedValue(
        mockEntityWithComponents,
      );

      // Mock parseKeyValueXml to return proper resolution
      const parseXmlSpy = spyOn(utils, "parseKeyValueXml");
      parseXmlSpy.mockReturnValue({
        entityId: "entity-exact",
        type: "EXACT_MATCH",
        matches: {
          match: [{ name: "ExactMatch", reason: "Exact ID match" }],
        },
      });

      const result = await findEntityByName(mockRuntime, mockMemory, mockState);

      expect(result).toBeDefined();
      expect(result?.id).toBe("entity-exact" as UUID);
      // Verify getEntityById was called (covers lines 274-282)
      expect(mockRuntime.getEntityById).toHaveBeenCalledWith("entity-exact");
      parseXmlSpy.mockRestore();
    });

    it("should find entity by username in components", async () => {
      const mockRoom = {
        id: "room-789" as UUID,
        worldId: null,
        createdAt: Date.now(),
      };

      const mockEntity: Entity = {
        id: "entity-user" as UUID,
        names: ["John Doe"],
        agentId: "agent-id-123" as UUID,
        metadata: {},
        components: [
          {
            id: "comp-1" as UUID,
            entityId: "entity-user" as UUID,
            agentId: "agent-id-123" as UUID,
            roomId: "room-789" as UUID,
            worldId: undefined,
            sourceEntityId: "entity-456" as UUID,
            type: "PROFILE",
            createdAt: Date.now(),
            data: { username: "johndoe123" },
          },
        ],
      };

      mockRuntime.getRoom = mock().mockResolvedValue(mockRoom);
      mockRuntime.getWorld = mock().mockResolvedValue(null);
      mockRuntime.getEntitiesForRoom = mock().mockResolvedValue([mockEntity]);
      mockRuntime.getRelationships = mock().mockResolvedValue([]);
      mockRuntime.getMemories = mock().mockResolvedValue([]);
      mockRuntime.useModel = mock().mockResolvedValue(
        JSON.stringify({
          type: "USERNAME_MATCH",
          matches: [{ name: "johndoe123", reason: "Username match" }],
        }),
      );

      // Mock parseKeyValueXml
      const parseXmlSpy = spyOn(utils, "parseKeyValueXml");
      parseXmlSpy.mockReturnValue({
        type: "USERNAME_MATCH",
        matches: {
          match: [{ name: "johndoe123", reason: "Username match" }],
        },
      });

      const result = await findEntityByName(mockRuntime, mockMemory, mockState);

      expect(result).toBeDefined();
      expect(result?.id).toBe("entity-user" as UUID);
      parseXmlSpy.mockRestore();
    });

    it("should find entity by handle in components", async () => {
      const mockRoom = {
        id: "room-789" as UUID,
        worldId: null,
        createdAt: Date.now(),
      };

      const mockEntity: Entity = {
        id: "entity-handle" as UUID,
        names: ["Jane Smith"],
        agentId: "agent-id-123" as UUID,
        metadata: {},
        components: [
          {
            id: "comp-1" as UUID,
            entityId: "entity-handle" as UUID,
            agentId: "agent-id-123" as UUID,
            roomId: "room-789" as UUID,
            worldId: undefined,
            sourceEntityId: "entity-456" as UUID,
            type: "PROFILE",
            createdAt: Date.now(),
            data: { handle: "@janesmith" },
          },
        ],
      };

      mockRuntime.getRoom = mock().mockResolvedValue(mockRoom);
      mockRuntime.getWorld = mock().mockResolvedValue(null);
      mockRuntime.getEntitiesForRoom = mock().mockResolvedValue([mockEntity]);
      mockRuntime.getRelationships = mock().mockResolvedValue([]);
      mockRuntime.getMemories = mock().mockResolvedValue([]);
      mockRuntime.useModel = mock().mockResolvedValue(
        JSON.stringify({
          type: "USERNAME_MATCH",
          matches: [{ name: "@janesmith", reason: "Handle match" }],
        }),
      );

      // Mock parseKeyValueXml
      const parseXmlSpy = spyOn(utils, "parseKeyValueXml");
      parseXmlSpy.mockReturnValue({
        type: "USERNAME_MATCH",
```