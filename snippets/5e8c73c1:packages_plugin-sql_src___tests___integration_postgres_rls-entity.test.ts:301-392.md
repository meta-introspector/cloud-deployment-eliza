# 5e8c73c1:packages_plugin-sql_src___tests___integration_postgres_rls-entity.test.ts:301-392

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-sql/src/__tests__/integration/postgres/rls-entity.test.ts:301-392
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
  it('should allow Charlie to see ONLY room2 memories', async () => {
    await userClient.query('BEGIN');
    try {
      // Set Charlie's entity context
      await userClient.query(`SET LOCAL app.entity_id = '${charlieId}'`);

      const result = await userClient.query(`
        SELECT id, room_id, content FROM memories
      `);

      // Charlie is only in room2
      expect(result.rows).toHaveLength(1);
      expect(result.rows[0].room_id).toBe(room2Id);
      expect(result.rows[0].content.text).toContain('room2');
    } finally {
      await userClient.query('ROLLBACK');
    }
  });

  it('should block non-participant from seeing any memories', async () => {
    await userClient.query('BEGIN');
    try {
      const nonParticipantId = uuidv4();

      // Set non-participant entity context
      await userClient.query(`SET LOCAL app.entity_id = '${nonParticipantId}'`);

      const result = await userClient.query(`
        SELECT COUNT(*) as count FROM memories
      `);

      // Non-participant should see 0
      expect(parseInt(result.rows[0].count)).toBe(0);
    } finally {
      await userClient.query('ROLLBACK');
    }
  });

  it('should have entity_isolation_policy on key tables', async () => {
    // pg_policies is a system catalog, any user can query it
    const result = await userClient.query(`
      SELECT DISTINCT tablename
      FROM pg_policies
      WHERE policyname = 'entity_isolation_policy'
        AND tablename IN ('memories', 'participants', 'components', 'logs', 'tasks')
    `);

    expect(result.rows.length).toBeGreaterThanOrEqual(3);
  });

  it('should use current_entity_id() function correctly', async () => {
    await userClient.query('BEGIN');
    try {
      await userClient.query(`SET LOCAL app.entity_id = '${aliceId}'`);

      const result = await userClient.query(`SELECT current_entity_id() as eid`);

      expect(result.rows[0].eid).toBe(aliceId);
    } finally {
      await userClient.query('ROLLBACK');
    }
  });

  it('should combine Server RLS + Entity RLS (double isolation)', async () => {
    // Create a different server context client
    const wrongServerId = uuidv4();
    const wrongServerClient = new Client({
      connectionString: POSTGRES_URL,
      application_name: wrongServerId,
    });
    await wrongServerClient.connect();

    try {
      await wrongServerClient.query('BEGIN');
      try {
        // Even with correct entity_id, wrong server_id should see nothing
        await wrongServerClient.query(`SET LOCAL app.entity_id = '${aliceId}'`);

        const result = await wrongServerClient.query(`
          SELECT COUNT(*) as count FROM memories
        `);

        // Wrong server context blocks access
        expect(parseInt(result.rows[0].count)).toBe(0);
      } finally {
        await wrongServerClient.query('ROLLBACK');
      }
    } finally {
      await wrongServerClient.end();
    }
  });
});
```