# a7046c18:packages_core_typescript_src___tests___roles.test.ts:301-394

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/roles.test.ts:301-394
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    });

    it("should return null when getAllWorlds returns null", async () => {
      const { logger } = await import("../logger");

      getAllWorldsMock.mockResolvedValue([]);

      const result = await findWorldsForOwner(mockRuntime, "user-123");

      expect(result).toBeNull();
      expect(logger.debug).toHaveBeenCalledWith(
        { src: "core:roles", agentId: mockRuntime.agentId },
        "No worlds found for agent",
      );
    });

    it("should return null when no worlds match the owner", async () => {
      const mockWorlds: World[] = [
        {
          id: "world-1" as UUID,
          name: "World 1",
          agentId: "agent-123" as UUID,
          messageServerId: "server-1",
          metadata: {
            ownership: {
              ownerId: "other-user-1",
            },
          },
        },
        {
          id: "world-2" as UUID,
          name: "World 2",
          agentId: "agent-123" as UUID,
          messageServerId: "server-2",
          metadata: {
            ownership: {
              ownerId: "other-user-2",
            },
          },
        },
      ];

      getAllWorldsMock.mockResolvedValue(mockWorlds);

      const result = await findWorldsForOwner(mockRuntime, "user-123");

      expect(result).toBeNull();
    });

    it("should handle worlds without metadata", async () => {
      const mockWorlds: World[] = [
        {
          id: "world-1" as UUID,
          name: "World 1",
          agentId: "agent-123" as UUID,
          messageServerId: "server-1",
          metadata: {},
        },
        {
          id: "world-2" as UUID,
          name: "World 2",
          agentId: "agent-123" as UUID,
          messageServerId: "server-2",
        } as World,
      ];

      getAllWorldsMock.mockResolvedValue(mockWorlds);

      const result = await findWorldsForOwner(mockRuntime, "user-123");

      expect(result).toBeNull();
    });

    it("should handle worlds without ownership in metadata", async () => {
      const mockWorlds: World[] = [
        {
          id: "world-1" as UUID,
          name: "World 1",
          agentId: "agent-123" as UUID,
          messageServerId: "server-1",
          metadata: {
            someOtherData: "value",
          },
        },
      ];

      getAllWorldsMock.mockResolvedValue(mockWorlds);

      const result = await findWorldsForOwner(mockRuntime, "user-123");

      expect(result).toBeNull();
    });
  });
});
```