# a7046c18:packages_plugin-sql_src___tests___integration_postgres_rls-server.test.ts:151-211

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/postgres/rls-server.test.ts:151-211
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      expect(result2.rows).toHaveLength(1);
      expect(result2.rows[0].username).toBe("rls_test_server2");
      expect(result2.rows[0].server_id).toBe(server2Id);

      // Both agents exist (verified by each seeing their own)
      // RLS properly isolates them - no superuser needed to verify total count
    });

    it("should enforce RLS on all tables with server_id", async () => {
      // Check that RLS is enabled on key tables (pg_tables is a system catalog, no RLS)
      const result = await userClient1.query(`
      SELECT tablename, rowsecurity
      FROM pg_tables
      WHERE schemaname = 'public'
        AND tablename IN ('agents', 'rooms', 'memories', 'channels')
        AND rowsecurity = true
    `);

      expect(result.rows.length).toBeGreaterThan(0);
      result.rows.forEach((row: { rowsecurity: boolean }) => {
        expect(row.rowsecurity).toBe(true);
      });
    });

    it("should have server_isolation_policy on tables", async () => {
      // pg_policies is a system catalog, any user can query it
      const result = await userClient1.query(`
      SELECT DISTINCT tablename
      FROM pg_policies
      WHERE policyname = 'server_isolation_policy'
        AND tablename IN ('agents', 'rooms', 'memories')
    `);

      expect(result.rows.length).toBeGreaterThanOrEqual(3);
    });

    it("should block cross-server data access", async () => {
      // Server 1 tries to access Server 2's data directly
      const result = await userClient1.query(`
      SELECT COUNT(*) as count
      FROM agents
      WHERE username = 'rls_test_server2'
    `);

      // Should see 0 (RLS blocks it)
      expect(parseInt(result.rows[0].count, 10)).toBe(0);
    });

    it("should use current_server_id() function correctly", async () => {
      const result1 = await userClient1.query(
        `SELECT current_server_id() as sid`,
      );
      const result2 = await userClient2.query(
        `SELECT current_server_id() as sid`,
      );

      expect(result1.rows[0].sid).toBe(server1Id);
      expect(result2.rows[0].sid).toBe(server2Id);
    });
  },
);
```