# a7046c18:packages_plugin-sql_src___tests___integration_postgres_rls-message-server-agents.test.ts:301-326

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/postgres/rls-message-server-agents.test.ts:301-326
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    });

    it("should prevent Server B from modifying Server A associations", async () => {
      // Server B tries to delete Server A's association
      await serverBClient.query(
        `
      DELETE FROM message_server_agents
      WHERE message_server_id = $1 AND agent_id = $2
    `,
        [messageServerA1Id, agentAId],
      );

      // Verify with Server A that its association still exists (delete was blocked by RLS)
      const result = await serverAClient.query(
        `
      SELECT *
      FROM message_server_agents
      WHERE message_server_id = $1 AND agent_id = $2
    `,
        [messageServerA1Id, agentAId],
      );

      expect(result.rows.length).toBeGreaterThan(0);
    });
  },
);
```