# a7046c18:packages_plugin-sql_src___tests___integration_postgres_rls-message-server-agents.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/postgres/rls-message-server-agents.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { Client } from "pg";
import { v4 as uuidv4 } from "uuid";

/**
 * PostgreSQL RLS Integration Tests for message_server_agents
 *
 * Tests verify that Server A cannot see message_server_agents entries from Server B
 * This ensures proper isolation of Discord/Telegram server associations
 *
 * NOTE: This test expects rls-entity.test.ts to have run first (same BATCH_RLS),
 * which creates the schema and installs RLS functions.
 *
 * Uses eliza_test user for ALL connections (not superuser) - the application_name
 * provides server context for RLS. Each server's data is set up via its own connection.
 */

describe.skipIf(!process.env.POSTGRES_URL)(
  "PostgreSQL RLS - message_server_agents Isolation",
  () => {
    let setupClientA: Client; // Setup client for server A
    let setupClientB: Client; // Setup client for server B
    let serverAClient: Client;
    let serverBClient: Client;

    const POSTGRES_URL =
      process.env.POSTGRES_URL ||
      "postgresql://eliza_test:test123@localhost:5432/eliza_test";
    const serverAId = uuidv4();
    const serverBId = uuidv4();
    const agentAId = uuidv4();
    const agentBId = uuidv4();
    const messageServerA1Id = uuidv4();
    const messageServerA2Id = uuidv4();
    const messageServerB1Id = uuidv4();

    beforeAll(async () => {
      // Setup clients - each with its own server context
      setupClientA = new Client({
        connectionString: POSTGRES_URL,
        application_name: serverAId,
      });
      setupClientB = new Client({
        connectionString: POSTGRES_URL,
        application_name: serverBId,
      });

      await setupClientA.connect();
      await setupClientB.connect();

      // User clients (same as setup, just clearer naming)
      serverAClient = new Client({
        connectionString: POSTGRES_URL,
        application_name: serverAId,
      });
      serverBClient = new Client({
        connectionString: POSTGRES_URL,
        application_name: serverBId,
      });

      await serverAClient.connect();
      await serverBClient.connect();

      // Create RLS servers (servers table has no RLS)
      await setupClientA.query(
        `INSERT INTO servers (id, created_at, updated_at)
         VALUES ($1, NOW(), NOW())
         ON CONFLICT (id) DO NOTHING`,
        [serverAId],
      );
      await setupClientB.query(
        `INSERT INTO servers (id, created_at, updated_at)
         VALUES ($1, NOW(), NOW())
         ON CONFLICT (id) DO NOTHING`,
        [serverBId],
      );

      // Create agents for each server (each client creates its own server's agent)
      await setupClientA.query(
        `INSERT INTO agents (id, name, username, server_id, created_at, updated_at)
         VALUES ($1, 'Agent A', 'rls_test_agent_a', $2, NOW(), NOW())
         ON CONFLICT (id) DO NOTHING`,
        [agentAId, serverAId],
      );
      await setupClientB.query(
        `INSERT INTO agents (id, name, username, server_id, created_at, updated_at)
         VALUES ($1, 'Agent B', 'rls_test_agent_b', $2, NOW(), NOW())
         ON CONFLICT (id) DO NOTHING`,
        [agentBId, serverBId],
      );

      // Create message servers (each client creates its own)
      await setupClientA.query(
        `INSERT INTO message_servers (id, source_type, source_id, name, server_id, created_at, updated_at)
         VALUES
           ($1, 'discord', 'discord_a1', 'Discord Server A1', $3, NOW(), NOW()),
           ($2, 'discord', 'discord_a2', 'Discord Server A2', $3, NOW(), NOW())
         ON CONFLICT (id) DO NOTHING`,
        [messageServerA1Id, messageServerA2Id, serverAId],
      );
      await setupClientB.query(
        `INSERT INTO message_servers (id, source_type, source_id, name, server_id, created_at, updated_at)
         VALUES ($1, 'discord', 'discord_b1', 'Discord Server B1', $2, NOW(), NOW())
         ON CONFLICT (id) DO NOTHING`,
        [messageServerB1Id, serverBId],
      );
    });

    afterAll(async () => {
      // Cleanup - each client cleans its own server's data (RLS enforced)
      try {
        await setupClientA.query(
          `DELETE FROM message_server_agents WHERE agent_id = $1`,
          [agentAId],
        );
        await setupClientA.query(
          `DELETE FROM message_servers WHERE id IN ($1, $2)`,
          [messageServerA1Id, messageServerA2Id],
        );
        await setupClientA.query(`DELETE FROM agents WHERE id = $1`, [
          agentAId,
        ]);
        await setupClientA.query(`DELETE FROM servers WHERE id = $1`, [
          serverAId,
        ]);
      } catch (err) {
        console.warn("Cleanup error (server A):", err);
      }

      try {
        await setupClientB.query(
          `DELETE FROM message_server_agents WHERE agent_id = $1`,
          [agentBId],
        );
        await setupClientB.query(`DELETE FROM message_servers WHERE id = $1`, [
          messageServerB1Id,
        ]);
        await setupClientB.query(`DELETE FROM agents WHERE id = $1`, [
          agentBId,
        ]);
        await setupClientB.query(`DELETE FROM servers WHERE id = $1`, [
          serverBId,
        ]);
      } catch (err) {
        console.warn("Cleanup error (server B):", err);
      }

      await setupClientA.end();
      await setupClientB.end();
      await serverAClient.end();
```