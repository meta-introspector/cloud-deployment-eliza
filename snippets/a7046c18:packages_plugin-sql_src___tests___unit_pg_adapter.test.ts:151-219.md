# a7046c18:packages_plugin-sql_src___tests___unit_pg_adapter.test.ts:151-219

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/unit/pg/adapter.test.ts:151-219
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

      const getClientMock = mock();

      const poolManager = {
        getDatabase: mock().mockReturnValue(mockDb),
        getConnection: mock().mockReturnValue({}),
        getClient: getClientMock,
        testConnection: mock().mockResolvedValue(true),
        close: mock().mockResolvedValue(undefined),
        withEntityContext: mock(),
      } as PostgresConnectionManager;

      const poolAdapter = new PgDatabaseAdapter(agentId, poolManager);

      // Execute an operation
      await poolAdapter.getAgent(agentId);

      // Verify getClient was NOT called (we use pool-based db now)
      expect(getClientMock).not.toHaveBeenCalled();
    });

    it("should handle concurrent operations without race conditions", async () => {
      const results: string[] = [];
      const mockDb = {
        select: mock().mockImplementation(() => {
          return {
            from: mock().mockReturnThis(),
            where: mock().mockReturnThis(),
            limit: mock().mockImplementation(async () => {
              // Simulate async delay
              await new Promise((resolve) => setTimeout(resolve, 10));
              return [];
            }),
          };
        }),
        transaction: mock(),
      };

      const concurrentManager = {
        getDatabase: mock().mockReturnValue(mockDb),
        getConnection: mock().mockReturnValue({}),
        getClient: mock(),
        testConnection: mock().mockResolvedValue(true),
        close: mock().mockResolvedValue(undefined),
        withEntityContext: mock(),
      } as PostgresConnectionManager;

      const concurrentAdapter = new PgDatabaseAdapter(
        agentId,
        concurrentManager,
      );

      // Run multiple concurrent operations
      const operations = [
        concurrentAdapter.getAgent(agentId).then(() => results.push("op1")),
        concurrentAdapter.getAgent(agentId).then(() => results.push("op2")),
        concurrentAdapter.getAgent(agentId).then(() => results.push("op3")),
      ];

      await Promise.all(operations);

      // All operations should complete
      expect(results).toHaveLength(3);
      expect(results).toContain("op1");
      expect(results).toContain("op2");
      expect(results).toContain("op3");
    });
  });
});
```