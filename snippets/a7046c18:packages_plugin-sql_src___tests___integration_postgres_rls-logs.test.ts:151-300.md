# a7046c18:packages_plugin-sql_src___tests___integration_postgres_rls-logs.test.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/postgres/rls-logs.test.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
       VALUES ($1, $2, $3, 'useModel:TEXT_EMBEDDING', '{"model":"ada-002","tokens":50}'::jsonb, NOW())`,
        [uuidv4(), bobId, bobPrivateRoomId],
      );
      await setupClient.query("COMMIT");

      console.log("[RLS Logs Test] Test data created:", {
        aliceId: aliceId.substring(0, 8),
        bobId: bobId.substring(0, 8),
        sharedRoom: sharedRoomId.substring(0, 8),
        alicePrivateRoom: alicePrivateRoomId.substring(0, 8),
        bobPrivateRoom: bobPrivateRoomId.substring(0, 8),
      });
    });

    afterAll(async () => {
      // Cleanup test data (need entity context for STRICT tables)
      try {
        // Delete logs with entity context
        await setupClient.query("BEGIN");
        await setupClient.query(`SET LOCAL app.entity_id = '${aliceId}'`);
        await setupClient.query(`DELETE FROM logs WHERE room_id IN ($1, $2)`, [
          sharedRoomId,
          alicePrivateRoomId,
        ]);
        await setupClient.query("COMMIT");

        await setupClient.query("BEGIN");
        await setupClient.query(`SET LOCAL app.entity_id = '${bobId}'`);
        await setupClient.query(`DELETE FROM logs WHERE room_id = $1`, [
          bobPrivateRoomId,
        ]);
        await setupClient.query("COMMIT");

        // Delete other data (non-STRICT tables)
        await setupClient.query(
          `DELETE FROM participants WHERE room_id IN ($1, $2, $3)`,
          [sharedRoomId, alicePrivateRoomId, bobPrivateRoomId],
        );
        await setupClient.query(`DELETE FROM rooms WHERE id IN ($1, $2, $3)`, [
          sharedRoomId,
          alicePrivateRoomId,
          bobPrivateRoomId,
        ]);
        await setupClient.query(`DELETE FROM entities WHERE id IN ($1, $2)`, [
          aliceId,
          bobId,
        ]);
        await setupClient.query(`DELETE FROM agents WHERE id = $1`, [agentId]);
        await setupClient.query(`DELETE FROM servers WHERE id = $1`, [
          serverId,
        ]);
      } catch (err) {
        console.warn("[RLS Logs Test] Cleanup failed:", err);
      }

      // Close connections
      await setupClient?.end();
      await aliceClient?.end();
      await bobClient?.end();
    });

    it("should verify RLS is enabled on logs table", async () => {
      const result = await setupClient.query(`
      SELECT tablename, rowsecurity
      FROM pg_tables
      WHERE schemaname = 'public' AND tablename = 'logs'
    `);

      expect(result.rows).toHaveLength(1);
      expect(result.rows[0].rowsecurity).toBe(true);
    });

    it("should verify STRICT entity_isolation_policy exists on logs", async () => {
      const result = await setupClient.query(`
      SELECT policyname, permissive, cmd
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename = 'logs'
        AND policyname = 'entity_isolation_policy'
    `);

      expect(result.rows).toHaveLength(1);
      expect(result.rows[0].policyname).toBe("entity_isolation_policy");
      expect(result.rows[0].cmd).toBe("ALL"); // Applies to SELECT, INSERT, UPDATE, DELETE
    });

    it("should isolate Alice logs from Bob (Alice sees 2, Bob sees 1)", async () => {
      // Alice should see her 2 logs (shared room + private room)
      await aliceClient.query("BEGIN");
      await aliceClient.query(`SET LOCAL app.entity_id = '${aliceId}'`);
      const aliceResult = await aliceClient.query(
        `
      SELECT id, entity_id, room_id, type
      FROM logs
      WHERE entity_id = $1
      ORDER BY created_at DESC
    `,
        [aliceId],
      );
      await aliceClient.query("COMMIT");

      expect(aliceResult.rows).toHaveLength(2);
      expect(aliceResult.rows.every((row) => row.entity_id === aliceId)).toBe(
        true,
      );

      // Bob should see his 1 log (private room only)
      await bobClient.query("BEGIN");
      await bobClient.query(`SET LOCAL app.entity_id = '${bobId}'`);
      const bobResult = await bobClient.query(
        `
      SELECT id, entity_id, room_id, type
      FROM logs
      WHERE entity_id = $1
      ORDER BY created_at DESC
    `,
        [bobId],
      );
      await bobClient.query("COMMIT");

      expect(bobResult.rows).toHaveLength(1);
      expect(bobResult.rows[0].entity_id).toBe(bobId);
    });

    it("should allow Alice to see logs from shared room (Agent + Alice)", async () => {
      await aliceClient.query("BEGIN");
      await aliceClient.query(`SET LOCAL app.entity_id = '${aliceId}'`);
      const result = await aliceClient.query(
        `
      SELECT id, entity_id, room_id, type
      FROM logs
      WHERE room_id = $1
    `,
        [sharedRoomId],
      );
      await aliceClient.query("COMMIT");

      // Alice should see the log from shared room
      expect(result.rows).toHaveLength(1);
      expect(result.rows[0].room_id).toBe(sharedRoomId);
      expect(result.rows[0].entity_id).toBe(aliceId);
    });

    it("should block Bob from seeing Alice private room logs", async () => {
      await bobClient.query("BEGIN");
      await bobClient.query(`SET LOCAL app.entity_id = '${bobId}'`);
      const result = await bobClient.query(
        `
      SELECT id, entity_id, room_id, type
      FROM logs
```