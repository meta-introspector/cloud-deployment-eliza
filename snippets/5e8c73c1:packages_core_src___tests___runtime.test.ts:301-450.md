# 5e8c73c1:packages_core_src___tests___runtime.test.ts:301-450

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/core/src/__tests__/runtime.test.ts:301-450
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
      (
        mockDatabaseAdapter.getEntitiesByIds as BunMockFunction<
          IDatabaseAdapter['getEntitiesByIds']
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
        mockDatabaseAdapter.getRoomsByIds as BunMockFunction<IDatabaseAdapter['getRoomsByIds']>
      ).mockResolvedValue([]);
      (
        mockDatabaseAdapter.getParticipantsForRoom as BunMockFunction<
          IDatabaseAdapter['getParticipantsForRoom']
        >
      ).mockResolvedValue([]);

      await runtime.initialize(); // Initialize to process registrations

      expect(runtime.actions.some((a) => a.name === 'TestAction')).toBe(true);
      expect(runtime.providers.some((p) => p.name === 'TestProvider')).toBe(true);
      expect(runtime.models.has(ModelType.TEXT_SMALL)).toBe(true);
      ensureAgentExistsSpy.mockRestore();
    });
  });

  describe('Initialization', () => {
    let ensureAgentExistsSpy: ReturnType<typeof spyOn<AgentRuntime, 'ensureAgentExists'>>;
    beforeEach(() => {
      // Mock adapter calls needed for a successful initialize
      ensureAgentExistsSpy = spyOn(AgentRuntime.prototype, 'ensureAgentExists').mockResolvedValue({
        ...mockCharacter,
        id: agentId, // ensureAgentExists should return the agent
        createdAt: Date.now(),
        updatedAt: Date.now(),
        enabled: true,
      });
      (
        mockDatabaseAdapter.getEntitiesByIds as BunMockFunction<
          IDatabaseAdapter['getEntitiesByIds']
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
          IDatabaseAdapter['getEntitiesByIds']
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
        mockDatabaseAdapter.getRoomsByIds as BunMockFunction<IDatabaseAdapter['getRoomsByIds']>
      ).mockResolvedValue([]);
      (
        mockDatabaseAdapter.getParticipantsForRoom as BunMockFunction<
          IDatabaseAdapter['getParticipantsForRoom']
        >
      ).mockResolvedValue([]);
      // mockDatabaseAdapter.getAgent is NOT called by initialize anymore after ensureAgentExists returns the agent
    });

    afterEach(() => {
      ensureAgentExistsSpy.mockRestore();
    });

    it('should call adapter.init and core setup methods for an existing agent', async () => {
      await runtime.initialize();

      expect(mockDatabaseAdapter.init).toHaveBeenCalledTimes(1);
      expect(runtime.ensureAgentExists).toHaveBeenCalledWith(mockCharacter);
      // expect(mockDatabaseAdapter.getAgent).toHaveBeenCalledWith(agentId); // This is no longer called
      expect(mockDatabaseAdapter.getEntitiesByIds).toHaveBeenCalledWith([agentId]);
      expect(mockDatabaseAdapter.getRoomsByIds).toHaveBeenCalledWith([agentId]);
      expect(mockDatabaseAdapter.createRooms).toHaveBeenCalled();
      expect(mockDatabaseAdapter.addParticipantsRoom).toHaveBeenCalledWith([agentId], agentId);
    });

    it('should create a new agent if one does not exist', async () => {
      // No need to override the spy, initialize should handle it.
      await runtime.initialize();

      expect(mockDatabaseAdapter.init).toHaveBeenCalledTimes(1);
      expect(runtime.ensureAgentExists).toHaveBeenCalledWith(mockCharacter);
      expect(mockDatabaseAdapter.getEntitiesByIds).toHaveBeenCalledWith([agentId]);
      expect(mockDatabaseAdapter.getRoomsByIds).toHaveBeenCalledWith([agentId]);
      expect(mockDatabaseAdapter.createRooms).toHaveBeenCalled();
      expect(mockDatabaseAdapter.addParticipantsRoom).toHaveBeenCalledWith([agentId], agentId);
    });

    it('should skip adapter.init when adapter is already ready (idempotent initialize)', async () => {
      // Simulate adapter already initialized
      adapterReady = true;

      await runtime.initialize();

      expect(mockDatabaseAdapter.isReady).toHaveBeenCalled();
      expect(mockDatabaseAdapter.init).not.toHaveBeenCalled();
      expect(runtime.ensureAgentExists).toHaveBeenCalledWith(mockCharacter);
      expect(mockDatabaseAdapter.getEntitiesByIds).toHaveBeenCalledWith([agentId]);
      expect(mockDatabaseAdapter.getRoomsByIds).toHaveBeenCalledWith([agentId]);
      expect(mockDatabaseAdapter.createRooms).toHaveBeenCalled();
      expect(mockDatabaseAdapter.addParticipantsRoom).toHaveBeenCalledWith([agentId], agentId);
    });

    it('should call adapter.init only once across multiple initialize calls', async () => {
      // First initialize: adapterReady is false; init should be called
      await runtime.initialize();
      // Second initialize: adapterReady should now be true; init should be skipped
      await runtime.initialize();

      expect(mockDatabaseAdapter.isReady).toHaveBeenCalled();
      expect(mockDatabaseAdapter.init).toHaveBeenCalledTimes(1);
    });

    it('should throw if adapter is not available during initialize', async () => {
      // Create runtime without passing adapter
      const runtimeWithoutAdapter = new AgentRuntime({
        character: mockCharacter,
        agentId: agentId,
      });

      // Prevent unhandled rejection from internal initPromise used by services waiting on initialization
      runtimeWithoutAdapter.initPromise.catch(() => {});

      await expect(runtimeWithoutAdapter.initialize()).rejects.toThrow(
        /Database adapter not initialized/
      );
    });

    it('should skip plugin migrations when skipMigrations option is true', async () => {
      const runtimeWithMigrations = new AgentRuntime({
        character: mockCharacter,
        agentId: agentId,
        adapter: mockDatabaseAdapter,
      });
```