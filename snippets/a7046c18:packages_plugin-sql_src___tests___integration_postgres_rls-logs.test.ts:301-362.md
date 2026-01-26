# a7046c18:packages_plugin-sql_src___tests___integration_postgres_rls-logs.test.ts:301-362

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/postgres/rls-logs.test.ts:301-362
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      WHERE room_id = $1
    `,
        [alicePrivateRoomId],
      );
      await bobClient.query("COMMIT");

      // Bob should NOT see Alice's private logs (RLS blocks)
      expect(result.rows).toHaveLength(0);
    });

    it("should block Alice from seeing Bob private room logs", async () => {
      await aliceClient.query("BEGIN");
      await aliceClient.query(`SET LOCAL app.entity_id = '${aliceId}'`);
      const result = await aliceClient.query(
        `
      SELECT id, entity_id, room_id, type
      FROM logs
      WHERE room_id = $1
    `,
        [bobPrivateRoomId],
      );
      await aliceClient.query("COMMIT");

      // Alice should NOT see Bob's private logs (RLS blocks)
      expect(result.rows).toHaveLength(0);
    });

    it("should block queries when entity_id is NOT set (STRICT mode)", async () => {
      // Without SET LOCAL app.entity_id, should see 0 results
      const result = await aliceClient.query(`
      SELECT id, entity_id, room_id, type
      FROM logs
      ORDER BY created_at DESC
    `);

      // STRICT mode: NO rows visible without entity context
      expect(result.rows).toHaveLength(0);
    });

    it("should verify logs table is in STRICT mode (memories, logs, components, tasks)", async () => {
      const result = await setupClient.query(`
      SELECT
        c.relname as table_name,
        p.polname as policy_name,
        pg_get_expr(p.polqual, p.polrelid) as policy_qual
      FROM pg_policy p
      JOIN pg_class c ON p.polrelid = c.oid
      WHERE c.relname = 'logs'
        AND p.polname = 'entity_isolation_policy'
    `);

      expect(result.rows).toHaveLength(1);
      const policyQual = result.rows[0].policy_qual;

      // STRICT mode should have: (current_entity_id() IS NOT NULL) AND (room_id IN ...)
      // PERMISSIVE mode would have: (current_entity_id() IS NULL) OR (room_id IN ...)
      expect(policyQual).toContain("current_entity_id()");
      expect(policyQual).toContain("IS NOT NULL"); // STRICT check
      expect(policyQual).toContain("room_id"); // snake_case column name
    });
  },
);
```