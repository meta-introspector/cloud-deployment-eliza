# a7046c18:packages_plugin-sql_src___tests___unit_pg_manager.test.ts:151-292

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/unit/pg/manager.test.ts:151-292
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      const manager = new PostgresConnectionManager(connectionUrl);

      mockPoolInstance.end.mockRejectedValue(new Error("Close failed"));

      await expect(manager.close()).rejects.toThrow("Close failed");
    });
  });

  describe("withEntityContext", () => {
    const connectionUrl = "postgresql://user:pass@localhost:5432/testdb";
    const testEntityId = "9f984e0e-1329-43f3-b2b7-02f74a148990";

    beforeEach(() => {
      // Reset environment variable
      delete process.env.ENABLE_DATA_ISOLATION;
    });

    it("should skip SET LOCAL when ENABLE_DATA_ISOLATION is not set", async () => {
      const manager = new PostgresConnectionManager(connectionUrl);
      const db = manager.getDatabase();

      // Mock the transaction method
      const mockTx = {
        execute: mock().mockResolvedValue({ rows: [] }),
        select: mock().mockReturnThis(),
        from: mock().mockReturnThis(),
      };

      const originalTransaction = db.transaction;
      db.transaction = mock(
        async (callback: (tx: typeof mockTx) => Promise<string>) => {
          return callback(mockTx);
        },
      ) as typeof db.transaction;

      const result = await manager.withEntityContext(
        testEntityId as UUID,
        async (_tx) => {
          return "success";
        },
      );

      expect(result).toBe("success");
      // SET LOCAL should NOT be called when ENABLE_DATA_ISOLATION is not true
      expect(mockTx.execute).not.toHaveBeenCalled();

      db.transaction = originalTransaction;
    });

    it("should skip SET LOCAL when entityId is null", async () => {
      process.env.ENABLE_DATA_ISOLATION = "true";

      const manager = new PostgresConnectionManager(connectionUrl);
      const db = manager.getDatabase();

      const mockTx = {
        execute: mock().mockResolvedValue({ rows: [] }),
      };

      const originalTransaction = db.transaction;
      db.transaction = mock(
        async (callback: (tx: typeof mockTx) => Promise<string>) => {
          return callback(mockTx);
        },
      ) as typeof db.transaction;

      const result = await manager.withEntityContext(null, async (_tx) => {
        return "success";
      });

      expect(result).toBe("success");
      // SET LOCAL should NOT be called when entityId is null
      expect(mockTx.execute).not.toHaveBeenCalled();

      db.transaction = originalTransaction;
    });

    it("should execute SET LOCAL with raw SQL (not parameterized) when isolation is enabled", async () => {
      process.env.ENABLE_DATA_ISOLATION = "true";

      const manager = new PostgresConnectionManager(connectionUrl);
      const db = manager.getDatabase();

      let executedQuery: any = null;
      const mockTx = {
        execute: mock((query: any) => {
          executedQuery = query;
          return Promise.resolve({ rows: [] });
        }),
      };

      const originalTransaction = db.transaction;
      db.transaction = mock(
        async (callback: (tx: typeof mockTx) => Promise<string>) => {
          return callback(mockTx);
        },
      ) as typeof db.transaction;

      await manager.withEntityContext(testEntityId as UUID, async (_tx) => {
        return "success";
      });

      expect(mockTx.execute).toHaveBeenCalled();

      // Verify the query uses sql.raw() (inline value) not parameterized
      // sql.raw() produces a query with the value embedded in queryChunks[0].value[0]
      expect(executedQuery).toBeDefined();
      const queryStr =
        executedQuery?.queryChunks?.[0]?.value?.[0] || String(executedQuery);
      expect(queryStr).toContain(testEntityId);
      expect(queryStr).not.toContain("$1");

      db.transaction = originalTransaction;
    });

    it("should propagate callback errors", async () => {
      process.env.ENABLE_DATA_ISOLATION = "true";

      const manager = new PostgresConnectionManager(connectionUrl);
      const db = manager.getDatabase();

      const mockTx = {
        execute: mock().mockResolvedValue({ rows: [] }),
      };

      const originalTransaction = db.transaction;
      db.transaction = mock(
        async (callback: (tx: typeof mockTx) => Promise<string>) => {
          return callback(mockTx);
        },
      ) as typeof db.transaction;

      await expect(
        manager.withEntityContext(testEntityId as any, async (_tx) => {
          throw new Error("Callback error");
        }),
      ).rejects.toThrow("Callback error");

      db.transaction = originalTransaction;
    });
  });
});
```