# 5e8c73c1:packages_plugin-sql_src___tests___integration_postgres_rls-message-server-agents.test.ts:301-313

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-sql/src/__tests__/integration/postgres/rls-message-server-agents.test.ts:301-313
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
      const result = await serverAClient.query(
        `
      SELECT *
      FROM message_server_agents
      WHERE message_server_id = $1 AND agent_id = $2
    `,
        [messageServerA1Id, agentAId]
      );

      expect(result.rows.length).toBeGreaterThan(0);
    });
  }
);
```