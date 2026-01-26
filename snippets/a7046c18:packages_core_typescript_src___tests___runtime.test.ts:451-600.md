# a7046c18:packages_core_typescript_src___tests___runtime.test.ts:451-600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/typescript/src/__tests__/runtime.test.ts:451-600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
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

    it("should call adapter.init only once across multiple initialize calls", async () => {
      // First initialize: adapterReady is false; init should be called
      await runtime.initialize();
      // Second initialize: adapterReady should now be true; init should be skipped
      await runtime.initialize();

      expect(mockDatabaseAdapter.isReady).toHaveBeenCalled();
      expect(mockDatabaseAdapter.init).toHaveBeenCalledTimes(1);
    });

    it("should throw if adapter is not available during initialize", async () => {
      // Create runtime without passing adapter
      const runtimeWithoutAdapter = new AgentRuntime({
        character: mockCharacter,
        agentId: agentId,
      });

      // Prevent unhandled rejection from internal initPromise used by services waiting on initialization
      runtimeWithoutAdapter.initPromise.catch(() => {});

      await expect(runtimeWithoutAdapter.initialize()).rejects.toThrow(
        /Database adapter not initialized/,
      );
    });

    it("should skip plugin migrations when skipMigrations option is true", async () => {
      const runtimeWithMigrations = new AgentRuntime({
        character: mockCharacter,
        agentId: agentId,
        adapter: mockDatabaseAdapter,
      });

      // Spy on runPluginMigrations
      const runMigrationsSpy = spyOn(
        runtimeWithMigrations,
        "runPluginMigrations" as keyof AgentRuntime,
      );

      // Initialize with skipMigrations = true
      await runtimeWithMigrations.initialize({ skipMigrations: true });

      // Verify migrations were not called
      expect(runMigrationsSpy).not.toHaveBeenCalled();
    });

    it("should run plugin migrations by default when skipMigrations is not specified", async () => {
      const runtimeDefault = new AgentRuntime({
        character: mockCharacter,
        agentId: agentId,
        adapter: mockDatabaseAdapter,
      });

      // Spy on runPluginMigrations
      const runMigrationsSpy = spyOn(
        runtimeDefault,
        "runPluginMigrations" as keyof AgentRuntime,
      );

      // Initialize without skipMigrations option (default behavior)
      await runtimeDefault.initialize();

      // Verify migrations were called
      expect(runMigrationsSpy).toHaveBeenCalled();
    });

    // Add more tests for initialize: existing entity, existing room, knowledge processing etc.
  });

  describe("State Composition", () => {
    it("should call provider get methods", async () => {
      const provider1Get = mock().mockResolvedValue({
        text: "p1_text",
        values: { p1_val: 1 },
      });
      const provider2Get = mock().mockResolvedValue({
        text: "p2_text",
        values: { p2_val: 2 },
      });
      const provider1: Provider = { name: "P1", get: provider1Get };
      const provider2: Provider = { name: "P2", get: provider2Get };

      runtime.registerProvider(provider1);
      runtime.registerProvider(provider2);

      const message = createMockMemory(
        "test message",
        undefined,
        undefined,
        undefined,
        agentId,
      );
      const state = await runtime.composeState(message);

      expect(provider1Get).toHaveBeenCalledTimes(1);
      // The cached state passed will be the initial empty-ish one
      expect(provider1Get).toHaveBeenCalledWith(runtime, message, {
        values: {},
        data: {},
        text: "",
      });
      expect(provider2Get).toHaveBeenCalledTimes(1);
      expect(provider2Get).toHaveBeenCalledWith(runtime, message, {
        values: {},
        data: {},
        text: "",
      });
      expect(state.text).toContain("p1_text");
      expect(state.text).toContain("p2_text");
      expect(state.values).toHaveProperty("p1_val", 1);
      expect(state.values).toHaveProperty("p2_val", 2);
      // Check combined values includes provider outputs
      expect(state.values).toHaveProperty("providers"); // Check if the combined text is stored
      expect(state.data?.providers?.P1?.values).toEqual({ p1_val: 1 }); // Check provider data cache
      expect(state.data?.providers?.P2?.values).toEqual({ p2_val: 2 });
    });

    it("should filter providers", async () => {
      const provider1Get = mock().mockResolvedValue({ text: "p1_text" });
      const provider2Get = mock().mockResolvedValue({ text: "p2_text" });
      const provider1: Provider = { name: "P1", get: provider1Get };
      const provider2: Provider = { name: "P2", get: provider2Get };

      runtime.registerProvider(provider1);
      runtime.registerProvider(provider2);

      const message = createMockMemory(
        "test message",
        undefined,
        undefined,
        undefined,
        agentId,
      );
      const state = await runtime.composeState(message, ["P1"], true); // Filter to only P1

      expect(provider1Get).toHaveBeenCalledTimes(1);
      expect(provider2Get).not.toHaveBeenCalled();
      expect(state.text).toBe("p1_text");
    });

```