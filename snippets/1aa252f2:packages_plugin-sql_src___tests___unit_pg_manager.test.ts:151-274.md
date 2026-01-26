# 1aa252f2:packages_plugin-sql_src___tests___unit_pg_manager.test.ts:151-274

**Commit:** 1aa252f2d1973cee9ff0b8150c8e7c3d4da4cf6b
**Author:** 0xbbjoker
**Date:** Sat Jan 3 16:40:19 2026 +0100
**File:** packages/plugin-sql/src/__tests__/unit/pg/manager.test.ts:151-274
**Novelty Score:** 10.78
**Concepts:** plugin-system, postgres, testing

```
  });

  describe('withEntityContext', () => {
    const connectionUrl = 'postgresql://user:pass@localhost:5432/testdb';
    const testEntityId = '9f984e0e-1329-43f3-b2b7-02f74a148990';

    beforeEach(() => {
      // Reset environment variable
      delete process.env.ENABLE_DATA_ISOLATION;
    });

    it('should skip SET LOCAL when ENABLE_DATA_ISOLATION is not set', async () => {
      const manager = new PostgresConnectionManager(connectionUrl);
      const db = manager.getDatabase();

      // Mock the transaction method
      const mockTx = {
        execute: mock().mockResolvedValue({ rows: [] }),
        select: mock().mockReturnThis(),
        from: mock().mockReturnThis(),
      };

      const originalTransaction = db.transaction;
      db.transaction = mock(async (callback: any) => {
        return callback(mockTx);
      }) as any;

      const result = await manager.withEntityContext(testEntityId as any, async (_tx) => {
        return 'success';
      });

      expect(result).toBe('success');
      // SET LOCAL should NOT be called when ENABLE_DATA_ISOLATION is not true
      expect(mockTx.execute).not.toHaveBeenCalled();

      db.transaction = originalTransaction;
    });

    it('should skip SET LOCAL when entityId is null', async () => {
      process.env.ENABLE_DATA_ISOLATION = 'true';

      const manager = new PostgresConnectionManager(connectionUrl);
      const db = manager.getDatabase();

      const mockTx = {
        execute: mock().mockResolvedValue({ rows: [] }),
      };

      const originalTransaction = db.transaction;
      db.transaction = mock(async (callback: any) => {
        return callback(mockTx);
      }) as any;

      const result = await manager.withEntityContext(null, async (_tx) => {
        return 'success';
      });

      expect(result).toBe('success');
      // SET LOCAL should NOT be called when entityId is null
      expect(mockTx.execute).not.toHaveBeenCalled();

      db.transaction = originalTransaction;
    });

    it('should execute SET LOCAL with raw SQL (not parameterized) when isolation is enabled', async () => {
      process.env.ENABLE_DATA_ISOLATION = 'true';

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
      db.transaction = mock(async (callback: any) => {
        return callback(mockTx);
      }) as any;

      await manager.withEntityContext(testEntityId as any, async (_tx) => {
        return 'success';
      });

      expect(mockTx.execute).toHaveBeenCalled();

      // Verify the query uses sql.raw() (inline value) not parameterized
      // sql.raw() produces a query with the value embedded in queryChunks[0].value[0]
      expect(executedQuery).toBeDefined();
      const queryStr = executedQuery?.queryChunks?.[0]?.value?.[0] || String(executedQuery);
      expect(queryStr).toContain(testEntityId);
      expect(queryStr).not.toContain('$1');

      db.transaction = originalTransaction;
    });

    it('should propagate callback errors', async () => {
      process.env.ENABLE_DATA_ISOLATION = 'true';

      const manager = new PostgresConnectionManager(connectionUrl);
      const db = manager.getDatabase();

      const mockTx = {
        execute: mock().mockResolvedValue({ rows: [] }),
      };

      const originalTransaction = db.transaction;
      db.transaction = mock(async (callback: any) => {
        return callback(mockTx);
      }) as any;

      await expect(
        manager.withEntityContext(testEntityId as any, async (_tx) => {
          throw new Error('Callback error');
        })
      ).rejects.toThrow('Callback error');

      db.transaction = originalTransaction;
    });
  });
});
```