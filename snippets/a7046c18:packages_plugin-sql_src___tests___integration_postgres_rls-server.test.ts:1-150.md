# a7046c18:packages_plugin-sql_src___tests___integration_postgres_rls-server.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/postgres/rls-server.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { Client } from "pg";
import { v4 as uuidv4 } from "uuid";

/**
 * PostgreSQL RLS Server Integration Tests
 *
 * These tests require a real PostgreSQL database with RLS enabled.
 * Run with: docker-compose up -d postgres
 *
 * Tests verify:
 * - Server-level isolation between different elizaOS instances
 * - RLS policies are enforced for non-superuser accounts
 * - Data is completely isolated between servers
 *
 * NOTE: This test expects rls-entity.test.ts to have run first (same BATCH_RLS),
 * which creates the schema and installs RLS functions.
 *
 * Uses eliza_test user for ALL connections (not superuser) - the application_name
 * provides server context for RLS. Each server's data is set up via its own connection.
 */

// Skip these tests if POSTGRES_URL is not set (e.g., in CI without PostgreSQL)
describe.skipIf(!process.env.POSTGRES_URL)(
  "PostgreSQL RLS Server Integration",
  () => {
    let setupClient1: Client; // Setup client for server 1 (with server1 context)
    let setupClient2: Client; // Setup client for server 2 (with server2 context)
    let userClient1: Client;
    let userClient2: Client;

    const POSTGRES_URL =
      process.env.POSTGRES_URL ||
      "postgresql://eliza_test:test123@localhost:5432/eliza_test";
    const server1Id = uuidv4();
    const server2Id = uuidv4();

    beforeAll(async () => {
      // Setup clients - each with its own server context (application_name)
      // No superuser needed - eliza_test is subject to RLS, so each connection
      // can only manage data for its own server_id
      setupClient1 = new Client({
        connectionString: POSTGRES_URL,
        application_name: server1Id,
      });
      setupClient2 = new Client({
        connectionString: POSTGRES_URL,
        application_name: server2Id,
      });

      await setupClient1.connect();
      await setupClient2.connect();

      // User clients (same as setup, just clearer naming for test assertions)
      userClient1 = new Client({
        connectionString: POSTGRES_URL,
        application_name: server1Id,
      });
      userClient2 = new Client({
        connectionString: POSTGRES_URL,
        application_name: server2Id,
      });

      await userClient1.connect();
      await userClient2.connect();

      // Create servers - each setup client creates its own server
      // (servers table may not have RLS, but this pattern is consistent)
      await setupClient1.query(
        `INSERT INTO servers (id, created_at, updated_at)
       VALUES ($1, NOW(), NOW())
       ON CONFLICT (id) DO NOTHING`,
        [server1Id],
      );
      await setupClient2.query(
        `INSERT INTO servers (id, created_at, updated_at)
       VALUES ($1, NOW(), NOW())
       ON CONFLICT (id) DO NOTHING`,
        [server2Id],
      );
    });

    afterAll(async () => {
      // Cleanup - each client cleans its own server's data (RLS enforced)
      try {
        await setupClient1.query(
          `DELETE FROM agents WHERE username = 'rls_test_server1'`,
        );
        await setupClient1.query(`DELETE FROM servers WHERE id = $1`, [
          server1Id,
        ]);
      } catch (err) {
        console.warn("Cleanup error (server1):", err);
      }

      try {
        await setupClient2.query(
          `DELETE FROM agents WHERE username = 'rls_test_server2'`,
        );
        await setupClient2.query(`DELETE FROM servers WHERE id = $1`, [
          server2Id,
        ]);
      } catch (err) {
        console.warn("Cleanup error (server2):", err);
      }

      await setupClient1.end();
      await setupClient2.end();
      await userClient1.end();
      await userClient2.end();
    });

    it("should isolate agents by server_id", async () => {
      const agent1Id = uuidv4();
      const agent2Id = uuidv4();

      // Server 1 creates an agent
      await userClient1.query(
        `
      INSERT INTO agents (id, name, username, server_id, created_at, updated_at)
      VALUES ($1, 'Agent Server 1', 'rls_test_server1', $2, NOW(), NOW())
    `,
        [agent1Id, server1Id],
      );

      // Server 2 creates an agent
      await userClient2.query(
        `
      INSERT INTO agents (id, name, username, server_id, created_at, updated_at)
      VALUES ($1, 'Agent Server 2', 'rls_test_server2', $2, NOW(), NOW())
    `,
        [agent2Id, server2Id],
      );

      // Server 1 should only see its own agent
      const result1 = await userClient1.query(`
      SELECT id, name, username, server_id
      FROM agents
      WHERE username IN ('rls_test_server1', 'rls_test_server2')
    `);
      expect(result1.rows).toHaveLength(1);
      expect(result1.rows[0].username).toBe("rls_test_server1");
      expect(result1.rows[0].server_id).toBe(server1Id);

      // Server 2 should only see its own agent
      const result2 = await userClient2.query(`
      SELECT id, name, username, server_id
      FROM agents
      WHERE username IN ('rls_test_server1', 'rls_test_server2')
    `);
```