# 5e8c73c1:packages_plugin-sql_src___tests___integration_postgres_rls-entity.test.ts:151-300

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-sql/src/__tests__/integration/postgres/rls-entity.test.ts:151-300
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
    // Create rooms
    await setupClient.query(
      `INSERT INTO rooms (id, agent_id, source, type, created_at)
       VALUES
         ($1, $3, 'test', 'DM', NOW()),
         ($2, $3, 'test', 'GROUP', NOW())
       ON CONFLICT (id) DO NOTHING`,
      [room1Id, room2Id, agentId]
    );

    // Create participants
    // Room1: Alice + Bob
    // Room2: Bob + Charlie
    try {
      const participantResult = await setupClient.query(
        `INSERT INTO participants (id, entity_id, room_id, agent_id, created_at)
         VALUES
           (gen_random_uuid(), $1, $2, $4, NOW()),
           (gen_random_uuid(), $3, $2, $4, NOW()),
           (gen_random_uuid(), $3, $5, $4, NOW()),
           (gen_random_uuid(), $6, $5, $4, NOW())
         ON CONFLICT DO NOTHING
         RETURNING id, entity_id`,
        [aliceId, room1Id, bobId, agentId, room2Id, charlieId]
      );
      console.log(
        '[RLS Test] Participants created:',
        participantResult.rows.length,
        participantResult.rows.map((r) => ({ e: r.entity_id?.substring(0, 8) }))
      );
    } catch (err) {
      console.error(
        '[RLS Test] Failed to create participants:',
        err instanceof Error ? err.message : String(err)
      );
      console.log('UUIDs:', { aliceId, bobId, charlieId, room1Id, room2Id, agentId });
      throw err;
    }

    // Create memories (STRICT Entity RLS - need entity context)
    // Memory in room1 (accessible to Alice and Bob)
    await setupClient.query('BEGIN');
    await setupClient.query(`SET LOCAL app.entity_id = '${aliceId}'`);
    await setupClient.query(
      `INSERT INTO memories (id, agent_id, room_id, content, type, created_at)
       VALUES (gen_random_uuid(), $1, $2, '{"text": "Message in room1"}', 'message', NOW())`,
      [agentId, room1Id]
    );
    await setupClient.query('COMMIT');

    // Memory in room2 (accessible to Bob and Charlie)
    await setupClient.query('BEGIN');
    await setupClient.query(`SET LOCAL app.entity_id = '${bobId}'`);
    await setupClient.query(
      `INSERT INTO memories (id, agent_id, room_id, content, type, created_at)
       VALUES (gen_random_uuid(), $1, $2, '{"text": "Message in room2"}', 'message', NOW())`,
      [agentId, room2Id]
    );
    await setupClient.query('COMMIT');

    console.log('[RLS Test] Test data setup complete');
  });

  afterAll(async () => {
    // Cleanup - need entity context for STRICT tables like memories
    try {
      // Delete memories with entity context
      await setupClient.query('BEGIN');
      await setupClient.query(`SET LOCAL app.entity_id = '${aliceId}'`);
      await setupClient.query(`DELETE FROM memories WHERE room_id = $1`, [room1Id]);
      await setupClient.query('COMMIT');

      await setupClient.query('BEGIN');
      await setupClient.query(`SET LOCAL app.entity_id = '${bobId}'`);
      await setupClient.query(`DELETE FROM memories WHERE room_id = $1`, [room2Id]);
      await setupClient.query('COMMIT');

      // Delete other data (non-STRICT tables)
      await setupClient.query(`DELETE FROM participants WHERE room_id IN ($1, $2)`, [
        room1Id,
        room2Id,
      ]);
      await setupClient.query(`DELETE FROM rooms WHERE id IN ($1, $2)`, [room1Id, room2Id]);
      await setupClient.query(`DELETE FROM entities WHERE id IN ($1, $2, $3)`, [
        aliceId,
        bobId,
        charlieId,
      ]);
      await setupClient.query(`DELETE FROM agents WHERE id = $1`, [agentId]);
      await setupClient.query(`DELETE FROM servers WHERE id = $1`, [serverId]);
    } catch (err) {
      console.warn('[RLS Test] Cleanup error:', err);
    }

    await setupClient.end();
    await userClient.end();
  });

  it('should block access without entity context', async () => {
    // Without entity context, user should see 0 memories (STRICT mode)
    await userClient.query('BEGIN');
    try {
      const result = await userClient.query(`
        SELECT COUNT(*) as count FROM memories
      `);

      expect(parseInt(result.rows[0].count)).toBe(0);
    } finally {
      await userClient.query('ROLLBACK');
    }
  });

  it('should allow Alice to see room1 memories', async () => {
    await userClient.query('BEGIN');
    try {
      // Set Alice's entity context
      await userClient.query(`SET LOCAL app.entity_id = '${aliceId}'`);

      const result = await userClient.query(`
        SELECT id, room_id, content FROM memories
      `);

      // Alice is in room1, so should see 1 memory
      expect(result.rows).toHaveLength(1);
      expect(result.rows[0].room_id).toBe(room1Id);
      expect(result.rows[0].content.text).toContain('room1');
    } finally {
      await userClient.query('ROLLBACK');
    }
  });

  it('should allow Bob to see BOTH room1 and room2 memories', async () => {
    await userClient.query('BEGIN');
    try {
      // Set Bob's entity context
      await userClient.query(`SET LOCAL app.entity_id = '${bobId}'`);

      const result = await userClient.query(`
        SELECT id, room_id, content FROM memories ORDER BY room_id
      `);

      // Bob is in both rooms, so should see 2 memories
      expect(result.rows).toHaveLength(2);
      expect(result.rows.map((r) => r.room_id)).toContain(room1Id);
      expect(result.rows.map((r) => r.room_id)).toContain(room2Id);
    } finally {
      await userClient.query('ROLLBACK');
    }
  });

```