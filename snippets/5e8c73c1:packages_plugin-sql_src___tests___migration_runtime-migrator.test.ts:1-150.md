# 5e8c73c1:packages_plugin-sql_src___tests___migration_runtime-migrator.test.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-sql/src/__tests__/migration/runtime-migrator.test.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import { sql } from 'drizzle-orm';
import * as schema from '../../schema';
import { RuntimeMigrator } from '../../runtime-migrator';
import type { DrizzleDB } from '../../runtime-migrator/types';
import { createIsolatedTestDatabaseForMigration } from '../test-helpers';

describe('Runtime Migrator - PostgreSQL Integration Tests', () => {
  let db: DrizzleDB;
  let migrator: RuntimeMigrator;
  let cleanup: () => Promise<void>;
  const testResults: { passed: string[]; failed: string[] } = { passed: [], failed: [] };

  beforeAll(async () => {
    console.log('\n🚀 Starting Runtime Migrator Tests...\n');

    const testSetup = await createIsolatedTestDatabaseForMigration('runtime_migrator_tests');
    db = testSetup.db;
    cleanup = testSetup.cleanup;

    // Initialize the runtime migrator
    migrator = new RuntimeMigrator(db);

    // We're already in an isolated schema, so no cleanup needed
    console.log('🗑️  Test environment ready...');

    try {
      // Drop migrations schema if exists (in case of previous test failure)
      await db.execute(sql`DROP SCHEMA IF EXISTS migrations CASCADE`);

      console.log('✅ Test environment cleaned\n');
    } catch (error) {
      console.log('⚠️  Cleanup warning:', error);
    }
  });

  afterAll(async () => {
    // Print test summary
    console.log('\n' + '='.repeat(80));
    console.log('📊 RUNTIME MIGRATOR TEST SUMMARY');
    console.log('='.repeat(80) + '\n');

    console.log(`✅ PASSED (${testResults.passed.length} tests):`);
    testResults.passed.forEach((test, i) => {
      console.log(`   ${i + 1}. ${test}`);
    });

    if (testResults.failed.length > 0) {
      console.log(`\n❌ FAILED (${testResults.failed.length} tests):`);
      testResults.failed.forEach((test, i) => {
        console.log(`   ${i + 1}. ${test}`);
      });
    }

    console.log('\n' + '='.repeat(80) + '\n');

    if (cleanup) {
      await cleanup();
    }
  });

  describe('Migration System Initialization', () => {
    it('should initialize migration tables', async () => {
      await migrator.initialize();

      // Check migrations schema exists
      const schemaResult = await db.execute(
        sql`SELECT EXISTS (
          SELECT 1 FROM information_schema.schemata 
          WHERE schema_name = 'migrations'
        ) as exists`
      );

      const schemaExists = (schemaResult.rows[0] as any).exists;
      expect(schemaExists).toBe(true);

      if (schemaExists) {
        testResults.passed.push('Migration schema created');
      } else {
        testResults.failed.push('Migration schema not created');
      }

      // Check all migration tables exist
      const tables = ['_migrations', '_journal', '_snapshots'];

      for (const tableName of tables) {
        const result = await db.execute(
          sql`SELECT EXISTS (
            SELECT 1 FROM pg_tables
            WHERE schemaname = 'migrations'
            AND tablename = ${tableName}
          ) as exists`
        );

        const exists = (result.rows[0] as any).exists;
        expect(exists).toBe(true);

        if (exists) {
          testResults.passed.push(`Migration table created: migrations.${tableName}`);
        } else {
          testResults.failed.push(`Migration table missing: migrations.${tableName}`);
        }
      }
    });
  });

  describe('Schema Migration Execution', () => {
    it('should run initial migration for plugin-sql schema', async () => {
      // Run the migration with the actual schema
      await migrator.migrate('plugin-sql', schema, { verbose: true });

      // Check that tables were created in public schema
      const tablesResult = await db.execute(
        sql`SELECT tablename FROM pg_tables 
            WHERE schemaname = 'public' 
            ORDER BY tablename`
      );

      const createdTables = tablesResult.rows.map((r: any) => r.tablename);
      console.log(`\n📋 Tables created: ${createdTables.length}`);

      // Expected tables from schema
      const expectedTables = [
        'agents',
        'cache',
        'channel_participants',
        'channels',
        'components',
        'embeddings',
        'entities',
        'logs',
        'memories',
        'message_servers',
        'message_server_agents',
        'central_messages',
        'participants',
        'relationships',
        'rooms',
        'tasks',
        'worlds',
      ];

      for (const table of expectedTables) {
        if (createdTables.includes(table)) {
          testResults.passed.push(`Table created: ${table}`);
        } else {
          testResults.failed.push(`Table missing: ${table}`);
        }
        expect(createdTables).toContain(table);
      }
```