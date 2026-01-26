# 5e8c73c1:packages_plugin-sql_src___tests___integration_postgres_rls-entity.test.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-sql/src/__tests__/integration/postgres/rls-entity.test.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import { Client } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { v4 as uuidv4 } from 'uuid';
import type { IDatabaseAdapter } from '@elizaos/core';
import { DatabaseMigrationService } from '../../../migration-service';
import { plugin as sqlPlugin } from '../../../index';
import { installRLSFunctions, applyRLSToNewTables, applyEntityRLSToAllTables } from '../../../rls';

/**
 * PostgreSQL RLS Entity Integration Tests
 *
 * These tests require a real PostgreSQL database with RLS enabled.
 * Run with: docker-compose up -d postgres
 *
 * Tests verify:
 * - Entity-level isolation (user privacy)
 * - Participant-based access control (room membership)
 * - Entity RLS works with Server RLS (double isolation)
 *
 * This test is the FIRST in BATCH_RLS and is responsible for:
 * 1. Running migrations to create the schema
 * 2. Installing RLS functions and policies
 *
 * Uses eliza_test user for ALL connections (not superuser) - the application_name
 * provides server context for RLS.
 */

// Skip these tests if POSTGRES_URL is not set (e.g., in CI without PostgreSQL)
describe.skipIf(!process.env.POSTGRES_URL)('PostgreSQL RLS Entity Integration', () => {
  let setupClient: Client; // Setup client with server context
  let userClient: Client;

  const POSTGRES_URL =
    process.env.POSTGRES_URL || 'postgresql://eliza_test:test123@localhost:5432/eliza_test';
  const serverId = uuidv4();
  const aliceId = uuidv4();
  const bobId = uuidv4();
  const charlieId = uuidv4();
  const room1Id = uuidv4();
  const room2Id = uuidv4();
  const agentId = uuidv4();

  beforeAll(async () => {
    // Setup client with server context (for migrations and data setup)
    setupClient = new Client({
      connectionString: POSTGRES_URL,
      application_name: serverId,
    });
    await setupClient.connect();

    // Clean up from previous tests - drop all tables and schemas for fresh start
    // Use a superuser connection for cleanup if possible
    const cleanupUrl = new URL(POSTGRES_URL);
    cleanupUrl.username = 'postgres';
    cleanupUrl.password = 'postgres';
    const cleanupClient = new Client({ connectionString: cleanupUrl.toString() });
    try {
      await cleanupClient.connect();
      await cleanupClient.query(`DROP SCHEMA IF EXISTS migrations CASCADE`);
      await cleanupClient.query(`
        DO $$ DECLARE
          r RECORD;
        BEGIN
          FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
            EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
          END LOOP;
        END $$;
      `);
      console.log('[RLS Test] Cleanup complete using superuser');
      await cleanupClient.end();
    } catch (err) {
      console.log('[RLS Test] Superuser cleanup failed, continuing with eliza_test');
      try {
        await cleanupClient.end();
      } catch {
        /* ignore */
      }
    }

    // Initialize schema with migrations
    const db = drizzle(setupClient);
    const migrationService = new DatabaseMigrationService();
    await migrationService.initializeWithDatabase(db);
    migrationService.discoverAndRegisterPluginSchemas([sqlPlugin]);
    await migrationService.runAllPluginMigrations();
    console.log('[RLS Test] Schema initialized via migrations');

    // Install RLS functions and apply to all tables
    const mockAdapter = { db } as IDatabaseAdapter;
    await installRLSFunctions(mockAdapter);
    await applyRLSToNewTables(mockAdapter);
    await applyEntityRLSToAllTables(mockAdapter);
    console.log('[RLS Test] RLS functions installed and applied');

    // Grant permissions on newly created tables to eliza_test
    // (in case the test is run by a different user who owns the tables)
    try {
      await setupClient.query(`GRANT ALL ON ALL TABLES IN SCHEMA public TO eliza_test`);
      await setupClient.query(`GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO eliza_test`);
    } catch (err) {
      // Ignore if already granted or permission denied (we're already eliza_test)
      console.log('[RLS Test] Permission grant skipped (may already be granted)');
    }

    // User client with server context (for test assertions)
    userClient = new Client({
      connectionString: POSTGRES_URL,
      application_name: serverId,
    });
    await userClient.connect();

    // Setup test data (with server context via application_name)
    // servers table has no RLS, so any connection can insert
    await setupClient.query(
      `INSERT INTO servers (id, created_at, updated_at)
       VALUES ($1, NOW(), NOW())
       ON CONFLICT (id) DO NOTHING`,
      [serverId]
    );

    // Create agent (server_id will be set by DEFAULT current_server_id())
    await setupClient.query(
      `INSERT INTO agents (id, name, username, server_id, created_at, updated_at)
       VALUES ($1, 'Test Agent RLS', $2, $3, NOW(), NOW())
       ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name`,
      [agentId, `rls_test_agent_${serverId.substring(0, 8)}`, serverId]
    );

    // Create entities
    try {
      const result = await setupClient.query(
        `INSERT INTO entities (id, agent_id, names, metadata, created_at)
         VALUES
           ($1, $4, ARRAY['Alice'], '{}'::jsonb, NOW()),
           ($2, $4, ARRAY['Bob'], '{}'::jsonb, NOW()),
           ($3, $4, ARRAY['Charlie'], '{}'::jsonb, NOW())
         ON CONFLICT (id) DO UPDATE SET names = EXCLUDED.names
         RETURNING id`,
        [aliceId, bobId, charlieId, agentId]
      );
      console.log('[RLS Test] Entities created:', result.rows.length);
    } catch (err) {
      console.error(
        '[RLS Test] Failed to create entities:',
        err instanceof Error ? err.message : String(err)
      );
      throw err;
    }

```