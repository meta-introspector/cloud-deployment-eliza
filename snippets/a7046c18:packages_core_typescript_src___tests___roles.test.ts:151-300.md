# a7046c18:packages_core_typescript_src___tests___roles.test.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/roles.test.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

    it("should check original ID format when first check fails", async () => {
      const mockWorld: World = {
        id: "world-123" as UUID,
        name: "Test World",
        agentId: "agent-123" as UUID,
        messageServerId: "server-123",
        metadata: {
          roles: {
            ["user-456-789-abc-def-012345678901" as UUID]: Role.OWNER,
          },
        },
      };

      getWorldMock.mockResolvedValue(mockWorld);

      // Even though the code has duplicate checks for entityId, it should return NONE
      // since 'user-123' is not in the roles
      const role = await getUserServerRole(
        mockRuntime,
        "user-123",
        "server-123",
      );
      expect(role).toBe(Role.NONE);
    });

    it("should return role for different role types", async () => {
      const mockWorld: World = {
        id: "world-123" as UUID,
        name: "Test World",
        agentId: "agent-123" as UUID,
        messageServerId: "server-123",
        metadata: {
          roles: {
            ["owner-user-123-456-789-abcdef0123" as UUID]: Role.OWNER,
            ["admin-user-123-456-789-abcdef0123" as UUID]: Role.ADMIN,
            ["none-user-123-456-789-abcdef01234" as UUID]: Role.NONE,
          },
        },
      };

      getWorldMock.mockResolvedValue(mockWorld);

      const ownerRole = await getUserServerRole(
        mockRuntime,
        "owner-user-123-456-789-abcdef0123",
        "server-123",
      );
      expect(ownerRole).toBe(Role.OWNER);

      const adminRole = await getUserServerRole(
        mockRuntime,
        "admin-user-123-456-789-abcdef0123",
        "server-123",
      );
      expect(adminRole).toBe(Role.ADMIN);

      const noneRole = await getUserServerRole(
        mockRuntime,
        "none-user-123-456-789-abcdef01234",
        "server-123",
      );
      expect(noneRole).toBe(Role.NONE);
    });
  });

  describe("findWorldsForOwner", () => {
    it("should find worlds where user is owner", async () => {
      const mockWorlds: World[] = [
        {
          id: "world-1" as UUID,
          name: "World 1",
          agentId: "agent-123" as UUID,
          messageServerId: "server-1",
          metadata: {
            ownership: {
              ownerId: "user-123",
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
              ownerId: "other-user",
            },
          },
        },
        {
          id: "world-3" as UUID,
          name: "World 3",
          agentId: "agent-123" as UUID,
          messageServerId: "server-3",
          metadata: {
            ownership: {
              ownerId: "user-123",
            },
          },
        },
      ];

      getAllWorldsMock.mockResolvedValue(mockWorlds);

      const ownerWorlds = await findWorldsForOwner(mockRuntime, "user-123");

      expect(ownerWorlds).toBeDefined();
      expect(ownerWorlds?.length).toBe(2);
      expect(ownerWorlds?.[0].id).toBe("world-1" as UUID);
      expect(ownerWorlds?.[1].id).toBe("world-3" as UUID);
    });

    it("should return null when entityId is empty", async () => {
      const { logger } = await import("../logger");

      const result = await findWorldsForOwner(mockRuntime, "");

      expect(result).toBeNull();
      expect(logger.error).toHaveBeenCalledWith(
        { src: "core:roles", agentId: mockRuntime.agentId },
        "User ID is required to find server",
      );
    });

    it("should return null when entityId is null", async () => {
      const { logger } = await import("../logger");

      const result = await findWorldsForOwner(mockRuntime, null as string); // Testing with null value

      expect(result).toBeNull();
      expect(logger.error).toHaveBeenCalledWith(
        { src: "core:roles", agentId: mockRuntime.agentId },
        "User ID is required to find server",
      );
    });

    it("should return null when no worlds exist", async () => {
      const { logger } = await import("../logger");

      getAllWorldsMock.mockResolvedValue([]);

      const result = await findWorldsForOwner(mockRuntime, "user-123");

      expect(result).toBeNull();
      expect(logger.debug).toHaveBeenCalledWith(
        { src: "core:roles", agentId: mockRuntime.agentId },
        "No worlds found for agent",
      );
```