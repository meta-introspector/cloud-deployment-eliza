# a7046c18:packages_plugin-sql_src___tests___integration_postgres_rls-message-server-agents.test.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/postgres/rls-message-server-agents.test.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      await serverBClient.end();
    });

    it("should isolate message_server_agents entries by server_id", async () => {
      // Server A creates associations
      await serverAClient.query(
        `
      INSERT INTO message_server_agents (message_server_id, agent_id)
      VALUES ($1, $2), ($3, $2)
    `,
        [messageServerA1Id, agentAId, messageServerA2Id],
      );

      // Server B creates association
      await serverBClient.query(
        `
      INSERT INTO message_server_agents (message_server_id, agent_id)
      VALUES ($1, $2)
    `,
        [messageServerB1Id, agentBId],
      );

      // Server A should only see its own associations (2 entries)
      const resultA = await serverAClient.query(`
      SELECT message_server_id, agent_id, server_id
      FROM message_server_agents
      ORDER BY message_server_id
    `);
      expect(resultA.rows).toHaveLength(2);
      expect(resultA.rows[0].agent_id).toBe(agentAId);
      expect(resultA.rows[1].agent_id).toBe(agentAId);
      expect(resultA.rows[0].server_id).toBe(serverAId);
      expect(resultA.rows[1].server_id).toBe(serverAId);

      // Server B should only see its own association (1 entry)
      const resultB = await serverBClient.query(`
      SELECT message_server_id, agent_id, server_id
      FROM message_server_agents
      ORDER BY message_server_id
    `);
      expect(resultB.rows).toHaveLength(1);
      expect(resultB.rows[0].agent_id).toBe(agentBId);
      expect(resultB.rows[0].server_id).toBe(serverBId);

      // Both servers have their data (verified by individual queries above)
      // RLS properly isolates them - no superuser needed to verify total count
    });

    it("should auto-populate server_id with current_server_id()", async () => {
      // Insert without specifying server_id
      await serverAClient.query(
        `
      INSERT INTO message_server_agents (message_server_id, agent_id)
      VALUES ($1, $2)
      ON CONFLICT DO NOTHING
    `,
        [messageServerA1Id, agentAId],
      );

      // Verify server_id was set automatically (query with same server context)
      const result = await serverAClient.query(
        `
      SELECT server_id
      FROM message_server_agents
      WHERE message_server_id = $1 AND agent_id = $2
    `,
        [messageServerA1Id, agentAId],
      );

      expect(result.rows[0].server_id).toBe(serverAId);
    });

    it("should prevent Server A from seeing Server B message servers via JOIN", async () => {
      // Server A tries to find all message_servers via JOIN
      const result = await serverAClient.query(
        `
      SELECT ms.id, ms.name, msa.agent_id
      FROM message_servers ms
      LEFT JOIN message_server_agents msa ON ms.id = msa.message_server_id
      WHERE ms.id IN ($1, $2, $3)
    `,
        [messageServerA1Id, messageServerA2Id, messageServerB1Id],
      );

      // Server A should only see its own message_servers (A1, A2)
      // Server B's message_server (B1) should not be visible due to Server RLS on message_servers table
      expect(result.rows.length).toBeLessThan(3);

      // All visible rows should belong to Server A
      result.rows.forEach((row) => {
        expect([messageServerA1Id, messageServerA2Id]).toContain(row.id);
      });
    });

    it("should have server_isolation_policy applied", async () => {
      // pg_policies is a system catalog, any user can query it
      const result = await serverAClient.query(`
      SELECT policyname, cmd, qual
      FROM pg_policies
      WHERE tablename = 'message_server_agents'
        AND policyname = 'server_isolation_policy'
    `);

      expect(result.rows).toHaveLength(1);
      expect(result.rows[0].qual).toContain("server_id = current_server_id()");
    });

    it("should have server_id column with DEFAULT current_server_id()", async () => {
      // information_schema is accessible by any user
      const result = await serverAClient.query(`
      SELECT column_name, column_default
      FROM information_schema.columns
      WHERE table_name = 'message_server_agents'
        AND column_name = 'server_id'
    `);

      expect(result.rows).toHaveLength(1);
      expect(result.rows[0].column_default).toContain("current_server_id()");
    });

    it("should prevent Server A from querying Server B associations even with known UUIDs", async () => {
      // This simulates what getAgentsForMessageServer() does in production
      // Server A tries to query agents for Server B's message server (messageServerB1Id)
      // Even though Server A knows the UUID, RLS should prevent seeing the data

      const result = await serverAClient.query(
        `
      SELECT agent_id
      FROM message_server_agents
      WHERE message_server_id = $1
    `,
        [messageServerB1Id],
      );

      // Server A should see NOTHING because RLS filters by server_id
      expect(result.rows).toHaveLength(0);

      // Verify with Server B that its association exists (same data, different context)
      const serverBResult = await serverBClient.query(
        `
      SELECT agent_id, server_id
      FROM message_server_agents
      WHERE message_server_id = $1
    `,
        [messageServerB1Id],
      );

      expect(serverBResult.rows).toHaveLength(1);
      expect(serverBResult.rows[0].agent_id).toBe(agentBId);
      expect(serverBResult.rows[0].server_id).toBe(serverBId);
```