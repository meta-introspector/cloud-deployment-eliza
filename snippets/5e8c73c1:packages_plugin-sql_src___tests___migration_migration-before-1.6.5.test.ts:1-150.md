# 5e8c73c1:packages_plugin-sql_src___tests___migration_migration-before-1.6.5.test.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-sql/src/__tests__/migration/migration-before-1.6.5.test.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
/**
 * Tests for migrations.ts - migrateToEntityRLS function
 *
 * These tests verify the migration from pre-1.6.5 (camelCase) to 1.6.5+ (snake_case)
 * including RLS cleanup and column renames.
 *
 * Works with both PGLite (default) and PostgreSQL (when POSTGRES_URL is set).
 */
import { describe, it, expect, beforeEach, afterEach } from 'bun:test';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/pglite';
import { PGlite } from '@electric-sql/pglite';
import { vector } from '@electric-sql/pglite/vector';
import { migrateToEntityRLS } from '../../migrations';

describe('migrateToEntityRLS (pre-1.6.5 migration)', () => {
  let pgClient: PGlite;
  let db: any;
  let mockAdapter: any;

  beforeEach(async () => {
    pgClient = new PGlite({ extensions: { vector } });
    db = drizzle(pgClient);

    // Create a mock adapter with the db property
    mockAdapter = {
      db,
      getDatabase: () => db,
    };
  });

  afterEach(async () => {
    await pgClient.close();
  });

  describe('Flow 1: Fresh install (no tables)', () => {
    it('should return early when rooms table does not exist', async () => {
      // No tables created - should return early without error
      await migrateToEntityRLS(mockAdapter);

      // Verify no tables were created (migration returned early)
      const tablesResult = await db.execute(sql`
        SELECT table_name FROM information_schema.tables
        WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      `);

      // Only system tables should exist (if any)
      const tableNames = tablesResult.rows.map((r: any) => r.table_name);
      expect(tableNames).not.toContain('rooms');
      expect(tableNames).not.toContain('memories');
    });
  });

  describe('Flow 2: Migration from pre-1.6.5 (camelCase columns)', () => {
    beforeEach(async () => {
      // Create tables with camelCase columns (simulating pre-1.6.5)
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS agents (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);

      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS rooms (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          "agentId" UUID,
          "worldId" UUID,
          "channelId" TEXT,
          "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
          name TEXT,
          source TEXT NOT NULL DEFAULT 'unknown',
          type TEXT NOT NULL DEFAULT 'general'
        )
      `);

      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS memories (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          "agentId" UUID NOT NULL,
          "roomId" UUID,
          "entityId" UUID,
          "createdAt" TIMESTAMP DEFAULT NOW(),
          "worldId" UUID,
          content JSONB NOT NULL,
          type TEXT NOT NULL DEFAULT 'message'
        )
      `);

      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS worlds (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          "agentId" UUID,
          "serverId" TEXT,
          "createdAt" TIMESTAMP DEFAULT NOW()
        )
      `);
    });

    it('should rename camelCase columns to snake_case', async () => {
      // Run migration
      await migrateToEntityRLS(mockAdapter);

      // Verify rooms columns are now snake_case
      const roomsColumns = await db.execute(sql`
        SELECT column_name FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'rooms'
        ORDER BY column_name
      `);
      const roomColumnNames = roomsColumns.rows.map((r: any) => r.column_name);

      expect(roomColumnNames).toContain('agent_id');
      expect(roomColumnNames).toContain('world_id');
      expect(roomColumnNames).toContain('channel_id');
      expect(roomColumnNames).toContain('created_at');
      expect(roomColumnNames).not.toContain('agentId');
      expect(roomColumnNames).not.toContain('worldId');
      expect(roomColumnNames).not.toContain('channelId');
      expect(roomColumnNames).not.toContain('createdAt');
    });

    it('should rename memories camelCase columns to snake_case', async () => {
      await migrateToEntityRLS(mockAdapter);

      const memoriesColumns = await db.execute(sql`
        SELECT column_name FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'memories'
        ORDER BY column_name
      `);
      const memoryColumnNames = memoriesColumns.rows.map((r: any) => r.column_name);

      expect(memoryColumnNames).toContain('agent_id');
      expect(memoryColumnNames).toContain('room_id');
      expect(memoryColumnNames).toContain('entity_id');
      expect(memoryColumnNames).toContain('created_at');
      expect(memoryColumnNames).toContain('world_id');
      expect(memoryColumnNames).not.toContain('agentId');
      expect(memoryColumnNames).not.toContain('roomId');
      expect(memoryColumnNames).not.toContain('entityId');
    });

    it('should rename worlds.serverId to message_server_id', async () => {
      await migrateToEntityRLS(mockAdapter);

      const worldsColumns = await db.execute(sql`
        SELECT column_name FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'worlds'
        ORDER BY column_name
      `);
```