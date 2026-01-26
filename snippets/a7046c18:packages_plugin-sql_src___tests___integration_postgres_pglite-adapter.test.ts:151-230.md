# a7046c18:packages_plugin-sql_src___tests___integration_postgres_pglite-adapter.test.ts:151-230

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/postgres/pglite-adapter.test.ts:151-230
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      const mockManager = new PGliteClientManager(mockClient as any);
      const mockAdapter = new PgliteDatabaseAdapter(
        uuidv4() as UUID,
        mockManager,
      );

      // Close the manager to simulate a connection issue
      await mockManager.close();

      // Check that adapter reports not ready
      const isReady = await mockAdapter.isReady();
      expect(isReady).toBe(false);
    });
  });

  describe("Agent Operations", () => {
    it("should create an agent", async () => {
      const result = await adapter.createAgent({
        id: agentId,
        name: "Test Agent",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        bio: "Test agent bio",
      } as any);

      expect(result).toBe(true);
    });

    it("should retrieve an agent", async () => {
      // Create agent first
      await adapter.createAgent({
        id: agentId,
        name: "Test Agent",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        bio: "Test agent bio",
      } as any);

      const agent = await adapter.getAgent(agentId);
      expect(agent).toBeDefined();
      expect(agent?.name).toBe("Test Agent");
    });

    it("should update an agent", async () => {
      // Create agent first
      await adapter.createAgent({
        id: agentId,
        name: "Test Agent",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        bio: "Test agent bio",
      } as any);

      // Update agent
      await adapter.updateAgent(agentId, {
        name: "Updated Agent",
      });

      const agent = await adapter.getAgent(agentId);
      expect(agent?.name).toBe("Updated Agent");
    });

    it("should delete an agent", async () => {
      // Create agent first
      await adapter.createAgent({
        id: agentId,
        name: "Test Agent",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        bio: "Test agent bio",
      } as any);

      const deleted = await adapter.deleteAgent(agentId);
      expect(deleted).toBe(true);

      const agent = await adapter.getAgent(agentId);
      expect(agent).toBeNull();
    });
  });
});
```