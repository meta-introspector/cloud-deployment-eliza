# a7046c18:packages_core_typescript_src___tests___entities.test.ts:601-750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/entities.test.ts:601-750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      const mockEntity: Entity = {
        id: "entity-1" as UUID,
        names: ["Charlie"],
        agentId: "agent-id-123" as UUID,
        metadata: {},
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
            data: { hobbies: ["reading", "gaming"] },
          },
          {
            id: "comp-2" as UUID,
            entityId: "entity-1" as UUID,
            agentId: "agent-id-123" as UUID,
            roomId: "room-123" as UUID,
            worldId: "world-123" as UUID,
            sourceEntityId: "source-123" as UUID,
            type: "PROFILE",
            createdAt: Date.now(),
            data: { hobbies: ["gaming", "music"] }, // Duplicate "gaming"
          },
        ],
      };

      mockRuntime.getRoom = mock().mockResolvedValue(mockRoom);
      mockRuntime.getEntitiesForRoom = mock().mockResolvedValue([mockEntity]);

      const result = await getEntityDetails({
        runtime: mockRuntime,
        roomId: "room-123" as UUID,
      });

      const parsedData = JSON.parse(result[0].data);
      // Note: Due to how Object.assign works in the implementation,
      // the second component's hobbies array overwrites the first one
      expect(parsedData.hobbies).toEqual(["gaming", "music"]);
    });
  });

  describe("formatEntities", () => {
    it("should format single entity with basic info", () => {
      const entities: Entity[] = [
        {
          id: "entity-1" as UUID,
          names: ["Alice"],
          agentId: "agent-id-123" as UUID,
          metadata: { bio: "Test bio" },
        },
      ];

      const result = formatEntities({ entities });

      expect(result).toContain('"Alice"');
      expect(result).toContain("ID: entity-1");
      expect(result).toContain('Data: {"bio":"Test bio"}');
    });

    it("should format multiple entities", () => {
      const entities: Entity[] = [
        {
          id: "entity-1" as UUID,
          names: ["Alice", "Alice Smith"],
          agentId: "agent-id-123" as UUID,
          metadata: { role: "Developer" },
        },
        {
          id: "entity-2" as UUID,
          names: ["Bob"],
          agentId: "agent-id-123" as UUID,
          metadata: { role: "Manager" },
        },
      ];

      const result = formatEntities({ entities });

      expect(result).toContain('"Alice" aka "Alice Smith"');
      expect(result).toContain('"Bob"');
      expect(result).toContain("ID: entity-1");
      expect(result).toContain("ID: entity-2");
      expect(result).toContain('{"role":"Developer"}');
      expect(result).toContain('{"role":"Manager"}');
    });

    it("should handle entities without metadata", () => {
      const entities: Entity[] = [
        {
          id: "entity-1" as UUID,
          names: ["Charlie"],
          agentId: "agent-id-123" as UUID,
        },
      ];

      const result = formatEntities({ entities });

      expect(result).toContain('"Charlie"');
      expect(result).toContain("ID: entity-1");
      expect(result).not.toContain("Data:");
    });

    it("should handle empty entities array", () => {
      const result = formatEntities({ entities: [] });
      expect(result).toBe("");
    });

    it("should handle entities with empty metadata", () => {
      const entities: Entity[] = [
        {
          id: "entity-1" as UUID,
          names: ["David"],
          agentId: "agent-id-123" as UUID,
          metadata: {},
        },
      ];

      const result = formatEntities({ entities });

      expect(result).toContain('"David"');
      expect(result).toContain("ID: entity-1");
      expect(result).not.toContain("Data:");
    });
  });

  it("createUniqueUuid combines user and agent ids", () => {
    const runtime = {
      agentId: "agent" as UUID,
    } as Partial<IAgentRuntime> as IAgentRuntime;
    const id = createUniqueUuid(runtime, "user");
    const expected = index.stringToUuid("user:agent");
    expect(id).toBe(expected);
  });

  it("formatEntities outputs joined string", () => {
    const entities: Entity[] = [
      {
        id: "1" as UUID,
        names: ["A"],
        metadata: {},
        agentId: "agent-1" as UUID,
      },
      {
        id: "2" as UUID,
        names: ["B"],
        metadata: { extra: true },
```