# a7046c18:packages_core_typescript_src___tests___entities.test.ts:451-600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/entities.test.ts:451-600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        matches: {
          match: [{ name: "@janesmith", reason: "Handle match" }],
        },
      });

      const result = await findEntityByName(mockRuntime, mockMemory, mockState);

      expect(result).toBeDefined();
      expect(result?.id).toBe("entity-handle" as UUID);
      parseXmlSpy.mockRestore();
    });
  });

  describe("createUniqueUuid", () => {
    it("should return agent ID when base user ID matches agent ID", () => {
      const result = createUniqueUuid(mockRuntime, "agent-id-123");
      expect(result).toBe("agent-id-123" as UUID);
    });

    it("should create UUID from combined string for different IDs", () => {
      const stringToUuidSpy = spyOn(index, "stringToUuid");
      stringToUuidSpy.mockReturnValue("unique-uuid-123" as UUID);

      const result = createUniqueUuid(mockRuntime, "user-456");

      expect(result).toBe("unique-uuid-123" as UUID);
      expect(stringToUuidSpy).toHaveBeenCalledWith("user-456:agent-id-123");
      stringToUuidSpy.mockRestore();
    });

    it("should handle UUID type as base user ID", () => {
      const stringToUuidSpy = spyOn(index, "stringToUuid");
      stringToUuidSpy.mockReturnValue("unique-uuid-456" as UUID);

      const result = createUniqueUuid(mockRuntime, "user-789" as UUID);

      expect(result).toBe("unique-uuid-456" as UUID);
      expect(stringToUuidSpy).toHaveBeenCalledWith("user-789:agent-id-123");
      stringToUuidSpy.mockRestore();
    });
  });

  describe("getEntityDetails", () => {
    it("should retrieve and format entity details for a room", async () => {
      const mockRoom = {
        id: "room-123" as UUID,
        source: "discord",
        createdAt: Date.now(),
      };

      const mockEntities: Entity[] = [
        {
          id: "entity-1" as UUID,
          names: ["Alice", "Alice Smith"],
          agentId: "agent-id-123" as UUID,
          metadata: {
            bio: "Test bio",
            discord: { name: "Alice#1234" },
          },
          components: [
            {
              id: "comp-1" as UUID,
              entityId: "entity-1" as UUID,
              agentId: "agent-id-123" as UUID,
              roomId: "room-123" as UUID,
              worldId: "world-123" as UUID,
              sourceEntityId: "source-123" as UUID,
              type: "PROFILE",
              createdAt: Date.now(),
              data: { avatar: "avatar.jpg" },
            },
            {
              id: "comp-2" as UUID,
              entityId: "entity-1" as UUID,
              agentId: "agent-id-123" as UUID,
              roomId: "room-123" as UUID,
              worldId: "world-123" as UUID,
              sourceEntityId: "source-123" as UUID,
              type: "SETTINGS",
              createdAt: Date.now(),
              data: { theme: "dark" },
            },
          ],
        },
        {
          id: "entity-2" as UUID,
          names: ["Bob"],
          agentId: "agent-id-123" as UUID,
          metadata: {},
          components: [],
        },
      ];

      mockRuntime.getRoom = mock().mockResolvedValue(mockRoom);
      mockRuntime.getEntitiesForRoom = mock().mockResolvedValue(mockEntities);

      const result = await getEntityDetails({
        runtime: mockRuntime,
        roomId: "room-123" as UUID,
      });

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: "entity-1",
        name: "Alice#1234", // Uses discord name from metadata
        names: ["Alice", "Alice Smith"],
        data: expect.stringContaining("avatar"),
      });
      expect(result[1]).toEqual({
        id: "entity-2",
        name: "Bob",
        names: ["Bob"],
        data: "{}",
      });
    });

    it("should handle deduplication of entities", async () => {
      const mockRoom = {
        id: "room-123" as UUID,
        createdAt: Date.now(),
      };

      const duplicateEntity = {
        id: "entity-1" as UUID,
        names: ["Alice"],
        agentId: "agent-id-123" as UUID,
        metadata: {},
        components: [],
      };

      mockRuntime.getRoom = mock().mockResolvedValue(mockRoom);
      mockRuntime.getEntitiesForRoom = mock().mockResolvedValue([
        duplicateEntity,
        duplicateEntity, // Duplicate
      ]);

      const result = await getEntityDetails({
        runtime: mockRuntime,
        roomId: "room-123" as UUID,
      });

      expect(result).toHaveLength(1);
    });

    it("should merge array data in components", async () => {
      const mockRoom = {
        id: "room-123" as UUID,
        createdAt: Date.now(),
      };

```