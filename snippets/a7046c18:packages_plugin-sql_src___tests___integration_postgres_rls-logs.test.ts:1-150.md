# a7046c18:packages_plugin-sql_src___tests___integration_postgres_rls-logs.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/postgres/rls-logs.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import { Client } from "pg";
import { v4 as uuidv4 } from "uuid";

/**
 * PostgreSQL RLS Logs Integration Tests
 *
 * These tests verify that the `logs` table has STRICT Entity RLS isolation.
 * Logs contain sensitive user activity data (model usage, embeddings, etc.)
 * and must be isolated by entity participation in rooms.
 *
 * Tests verify:
 * - Logs are isolated by entity (user can only see their own logs)
 * - Logs from shared rooms are visible to all participants
 * - Logs from non-participant rooms are blocked
 * - withEntityContext() is required for log insertion
 *
 * NOTE: This test expects rls-entity.test.ts to have run first (same BATCH_RLS),
 * which creates the schema and installs RLS functions.
 *
 * Uses eliza_test user for ALL connections (not superuser) - the application_name
 * provides server context for RLS.
 */

describe.skipIf(!process.env.POSTGRES_URL)(
  "PostgreSQL RLS - Logs Isolation (STRICT)",
  () => {
    let setupClient: Client; // Setup client with server context
    let aliceClient: Client;
    let bobClient: Client;

    const POSTGRES_URL =
      process.env.POSTGRES_URL ||
      "postgresql://eliza_test:test123@localhost:5432/eliza_test";
    const serverId = uuidv4();
    const aliceId = uuidv4();
    const bobId = uuidv4();
    const agentId = uuidv4();
    const sharedRoomId = uuidv4(); // Alice + Agent
    const alicePrivateRoomId = uuidv4(); // Alice only
    const bobPrivateRoomId = uuidv4(); // Bob only

    beforeAll(async () => {
      // Setup client with server context (for creating test data)
      setupClient = new Client({
        connectionString: POSTGRES_URL,
        application_name: serverId,
      });
      await setupClient.connect();

      // Alice client with Entity RLS context
      aliceClient = new Client({
        connectionString: POSTGRES_URL,
        application_name: serverId,
      });
      await aliceClient.connect();

      // Bob client with Entity RLS context
      bobClient = new Client({
        connectionString: POSTGRES_URL,
        application_name: serverId,
      });
      await bobClient.connect();

      // Setup test data (with server context via application_name)
      // servers table has no RLS, so any connection can insert
      await setupClient.query(
        `INSERT INTO servers (id, created_at, updated_at)
       VALUES ($1, NOW(), NOW())
       ON CONFLICT (id) DO NOTHING`,
        [serverId],
      );

      await setupClient.query(
        `INSERT INTO agents (id, name, username, server_id, created_at, updated_at)
       VALUES ($1, 'Log Test Agent', $2, $3, NOW(), NOW())
       ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name`,
        [agentId, `log_test_agent_${serverId.substring(0, 8)}`, serverId],
      );

      await setupClient.query(
        `INSERT INTO entities (id, agent_id, names, metadata, created_at)
       VALUES
         ($1, $3, ARRAY['Alice'], '{}'::jsonb, NOW()),
         ($2, $3, ARRAY['Bob'], '{}'::jsonb, NOW())
       ON CONFLICT (id) DO UPDATE SET names = EXCLUDED.names`,
        [aliceId, bobId, agentId],
      );

      await setupClient.query(
        `INSERT INTO rooms (id, agent_id, source, type, created_at)
       VALUES
         ($1, $4, 'test', 'DM', NOW()),
         ($2, $4, 'test', 'DM', NOW()),
         ($3, $4, 'test', 'DM', NOW())
       ON CONFLICT (id) DO NOTHING`,
        [sharedRoomId, alicePrivateRoomId, bobPrivateRoomId, agentId],
      );

      // Create participants (using snake_case column names)
      // Shared room: Alice only (agents are not participants)
      await setupClient.query(
        `INSERT INTO participants (entity_id, room_id, agent_id, created_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT DO NOTHING`,
        [aliceId, sharedRoomId, agentId],
      );

      // Alice private room: Alice only
      await setupClient.query(
        `INSERT INTO participants (entity_id, room_id, agent_id, created_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT DO NOTHING`,
        [aliceId, alicePrivateRoomId, agentId],
      );

      // Bob private room: Bob only
      await setupClient.query(
        `INSERT INTO participants (entity_id, room_id, agent_id, created_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT DO NOTHING`,
        [bobId, bobPrivateRoomId, agentId],
      );

      // Create test logs (using snake_case column names)
      // Need to use entity context for STRICT RLS tables
      await setupClient.query("BEGIN");
      await setupClient.query(`SET LOCAL app.entity_id = '${aliceId}'`);

      // Log 1: Alice in shared room
      await setupClient.query(
        `INSERT INTO logs (id, entity_id, room_id, type, body, created_at)
       VALUES ($1, $2, $3, 'useModel:TEXT_EMBEDDING', '{"model":"ada-002","tokens":100}'::jsonb, NOW())`,
        [uuidv4(), aliceId, sharedRoomId],
      );

      // Log 2: Alice in private room
      await setupClient.query(
        `INSERT INTO logs (id, entity_id, room_id, type, body, created_at)
       VALUES ($1, $2, $3, 'useModel:TEXT_LARGE', '{"model":"gpt-4","tokens":500}'::jsonb, NOW())`,
        [uuidv4(), aliceId, alicePrivateRoomId],
      );

      await setupClient.query("COMMIT");

      // Bob's log (with Bob's entity context)
      await setupClient.query("BEGIN");
      await setupClient.query(`SET LOCAL app.entity_id = '${bobId}'`);
      await setupClient.query(
        `INSERT INTO logs (id, entity_id, room_id, type, body, created_at)
```