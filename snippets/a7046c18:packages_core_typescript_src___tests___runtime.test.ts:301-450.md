# a7046c18:packages_core_typescript_src___tests___runtime.test.ts:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/runtime.test.ts:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        updatedAt: Date.now(),
        enabled: true,
      });

      (
        mockDatabaseAdapter.getEntitiesByIds as BunMockFunction<
          IDatabaseAdapter["getEntitiesByIds"]
        >
      ).mockResolvedValue([
        {
          id: agentId,
          agentId: agentId,
          names: [mockCharacter.name],
          metadata: {},
        },
      ]);
      (
        mockDatabaseAdapter.getEntitiesByIds as BunMockFunction<
          IDatabaseAdapter["getEntitiesByIds"]
        >
      ).mockResolvedValue([
        {
          id: agentId,
          agentId: agentId,
          names: [mockCharacter.name],
          metadata: {},
        },
      ]);
      (
        mockDatabaseAdapter.getRoomsByIds as BunMockFunction<
          IDatabaseAdapter["getRoomsByIds"]
        >
      ).mockResolvedValue([]);
      (
        mockDatabaseAdapter.getParticipantsForRoom as BunMockFunction<
          IDatabaseAdapter["getParticipantsForRoom"]
        >
      ).mockResolvedValue([]);

      await runtime.initialize(); // Initialize to process registrations

      expect(runtime.actions.some((a) => a.name === "TestAction")).toBe(true);
      expect(runtime.providers.some((p) => p.name === "TestProvider")).toBe(
        true,
      );
      expect(runtime.models.has(ModelType.TEXT_SMALL)).toBe(true);
      ensureAgentExistsSpy.mockRestore();
    });
  });

  describe("Initialization", () => {
    let ensureAgentExistsSpy: ReturnType<
      typeof spyOn<AgentRuntime, "ensureAgentExists">
    >;
    beforeEach(() => {
      // Mock adapter calls needed for a successful initialize
      ensureAgentExistsSpy = spyOn(
        AgentRuntime.prototype,
        "ensureAgentExists",
      ).mockResolvedValue({
        ...mockCharacter,
        id: agentId, // ensureAgentExists should return the agent
        createdAt: Date.now(),
        updatedAt: Date.now(),
        enabled: true,
      });
      (
        mockDatabaseAdapter.getEntitiesByIds as BunMockFunction<
          IDatabaseAdapter["getEntitiesByIds"]
        >
      ).mockResolvedValue([
        {
          id: agentId,
          agentId: agentId,
          names: [mockCharacter.name],
          metadata: {},
        },
      ]);
      (
        mockDatabaseAdapter.getEntitiesByIds as BunMockFunction<
          IDatabaseAdapter["getEntitiesByIds"]
        >
      ).mockResolvedValue([
        {
          id: agentId,
          agentId: agentId,
          names: [mockCharacter.name],
          metadata: {},
        },
      ]);
      (
        mockDatabaseAdapter.getRoomsByIds as BunMockFunction<
          IDatabaseAdapter["getRoomsByIds"]
        >
      ).mockResolvedValue([]);
      (
        mockDatabaseAdapter.getParticipantsForRoom as BunMockFunction<
          IDatabaseAdapter["getParticipantsForRoom"]
        >
      ).mockResolvedValue([]);
      // mockDatabaseAdapter.getAgent is NOT called by initialize anymore after ensureAgentExists returns the agent
    });

    afterEach(() => {
      ensureAgentExistsSpy.mockRestore();
    });

    it("should call adapter.init and core setup methods for an existing agent", async () => {
      await runtime.initialize();

      expect(mockDatabaseAdapter.init).toHaveBeenCalledTimes(1);
      expect(runtime.ensureAgentExists).toHaveBeenCalledWith(mockCharacter);
      // expect(mockDatabaseAdapter.getAgent).toHaveBeenCalledWith(agentId); // This is no longer called
      expect(mockDatabaseAdapter.getEntitiesByIds).toHaveBeenCalledWith([
        agentId,
      ]);
      expect(mockDatabaseAdapter.getRoomsByIds).toHaveBeenCalledWith([agentId]);
      expect(mockDatabaseAdapter.createRooms).toHaveBeenCalled();
      expect(mockDatabaseAdapter.addParticipantsRoom).toHaveBeenCalledWith(
        [agentId],
        agentId,
      );
    });

    it("should create a new agent if one does not exist", async () => {
      // No need to override the spy, initialize should handle it.
      await runtime.initialize();

      expect(mockDatabaseAdapter.init).toHaveBeenCalledTimes(1);
      expect(runtime.ensureAgentExists).toHaveBeenCalledWith(mockCharacter);
      expect(mockDatabaseAdapter.getEntitiesByIds).toHaveBeenCalledWith([
        agentId,
      ]);
      expect(mockDatabaseAdapter.getRoomsByIds).toHaveBeenCalledWith([agentId]);
      expect(mockDatabaseAdapter.createRooms).toHaveBeenCalled();
      expect(mockDatabaseAdapter.addParticipantsRoom).toHaveBeenCalledWith(
        [agentId],
        agentId,
      );
    });

    it("should skip adapter.init when adapter is already ready (idempotent initialize)", async () => {
      // Simulate adapter already initialized
      adapterReady = true;

      await runtime.initialize();

      expect(mockDatabaseAdapter.isReady).toHaveBeenCalled();
      expect(mockDatabaseAdapter.init).not.toHaveBeenCalled();
      expect(runtime.ensureAgentExists).toHaveBeenCalledWith(mockCharacter);
```