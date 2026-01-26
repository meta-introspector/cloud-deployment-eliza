# a7046c18:packages_plugin-sql_src___tests___unit_pglite_adapter.test.ts:151-191

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/unit/pglite/adapter.test.ts:151-191
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      await expect(shuttingDownAdapter.getAgent(agentId)).rejects.toThrow(
        "Database is shutting down - operation rejected",
      );

      // Verify warning was logged
      expect(logger.warn).toHaveBeenCalledWith(
        expect.objectContaining({
          src: "plugin:sql",
          error: "Database is shutting down - operation rejected",
        }),
        "Database operation rejected during shutdown",
      );
    });

    it("should include descriptive error message for shutdown rejection", async () => {
      const shuttingDownManager = {
        getConnection: mock().mockReturnValue({
          query: mock().mockResolvedValue({ rows: [] }),
          transaction: mock(),
        }),
        close: mock().mockResolvedValue(undefined),
        isShuttingDown: mock().mockReturnValue(true),
      } as PGliteClientManager;

      const shuttingDownAdapter = new PgliteDatabaseAdapter(
        agentId,
        shuttingDownManager,
      );

      try {
        await shuttingDownAdapter.getAgent(agentId);
        expect.unreachable("Should have thrown");
      } catch (error: any) {
        expect(error.message).toBe(
          "Database is shutting down - operation rejected",
        );
        expect(error).toBeInstanceOf(Error);
      }
    });
  });
});
```