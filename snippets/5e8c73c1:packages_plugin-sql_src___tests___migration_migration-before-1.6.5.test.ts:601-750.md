# 5e8c73c1:packages_plugin-sql_src___tests___migration_migration-before-1.6.5.test.ts:601-750

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-sql/src/__tests__/migration/migration-before-1.6.5.test.ts:601-750
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
      expect(columnNames).toContain('tweet_id');
      expect(columnNames).toContain('author_id');
      expect(columnNames).toContain('created_at');
    });
  });

  describe('Flow 7: Tables in non-public schemas', () => {
    beforeEach(async () => {
      // Create plugin-sql required tables
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
          "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
          name TEXT,
          source TEXT NOT NULL DEFAULT 'unknown',
          type TEXT NOT NULL DEFAULT 'general'
        )
      `);

      // Create a separate schema
      await db.execute(sql`CREATE SCHEMA IF NOT EXISTS other_schema`);

      // Create table in other_schema with server_id and camelCase columns
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS other_schema.custom_table (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          server_id UUID,
          "agentId" UUID,
          data JSONB,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);
    });

    it('should NOT touch tables in non-public schemas', async () => {
      // Insert test data
      const serverId = '823e4567-e89b-12d3-a456-426614174000';
      const agentId = '923e4567-e89b-12d3-a456-426614174000';
      await db.execute(sql`
        INSERT INTO other_schema.custom_table (id, server_id, "agentId", data)
        VALUES ('a23e4567-e89b-12d3-a456-426614174000'::uuid, ${serverId}::uuid, ${agentId}::uuid, '{"key": "value"}'::jsonb)
      `);

      // Run migration
      await migrateToEntityRLS(mockAdapter);

      // Verify table in other_schema is completely untouched
      const columns = await db.execute(sql`
        SELECT column_name FROM information_schema.columns
        WHERE table_schema = 'other_schema' AND table_name = 'custom_table'
        ORDER BY column_name
      `);
      const columnNames = columns.rows.map((r: any) => r.column_name);

      // server_id should still exist (not dropped)
      expect(columnNames).toContain('server_id');
      // agentId should NOT be renamed to agent_id
      expect(columnNames).toContain('agentId');
      expect(columnNames).not.toContain('agent_id');

      // Verify data is intact
      const data = await db.execute(sql`SELECT * FROM other_schema.custom_table`);
      expect(data.rows).toHaveLength(1);
      expect(data.rows[0].server_id).toBe(serverId);
    });

    it('should NOT disable RLS on tables in non-public schemas', async () => {
      // Enable RLS on other_schema.custom_table
      await db.execute(sql`ALTER TABLE other_schema.custom_table ENABLE ROW LEVEL SECURITY`);

      // Verify RLS is enabled
      const beforeRls = await db.execute(sql`
        SELECT relrowsecurity FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relname = 'custom_table' AND n.nspname = 'other_schema'
      `);
      expect(beforeRls.rows[0].relrowsecurity).toBe(true);

      // Run migration
      await migrateToEntityRLS(mockAdapter);

      // RLS should still be enabled (migration doesn't touch other schemas)
      const afterRls = await db.execute(sql`
        SELECT relrowsecurity FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relname = 'custom_table' AND n.nspname = 'other_schema'
      `);
      expect(afterRls.rows[0].relrowsecurity).toBe(true);
    });
  });

  describe('Flow 8: Indexes from other plugins', () => {
    beforeEach(async () => {
      // Create plugin-sql required tables
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
          "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
          name TEXT,
          source TEXT NOT NULL DEFAULT 'unknown',
          type TEXT NOT NULL DEFAULT 'general'
        )
      `);

      // Create another plugin table with custom indexes
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS analytics_events (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          event_type TEXT NOT NULL,
          user_id UUID NOT NULL,
          timestamp TIMESTAMP DEFAULT NOW()
        )
      `);

      // Create custom indexes on the analytics table
      await db.execute(sql`CREATE INDEX idx_analytics_event_type ON analytics_events(event_type)`);
      await db.execute(sql`CREATE INDEX idx_analytics_user_id ON analytics_events(user_id)`);
    });

    it('should drop ALL indexes in public schema including other plugins (current behavior)', async () => {
      // Insert test data
      await db.execute(sql`
        INSERT INTO analytics_events (id, event_type, user_id)
        VALUES ('b23e4567-e89b-12d3-a456-426614174000'::uuid, 'page_view', 'c23e4567-e89b-12d3-a456-426614174000'::uuid)
      `);

      // Verify indexes exist
      const beforeIndexes = await db.execute(sql`
        SELECT indexname FROM pg_indexes
        WHERE schemaname = 'public' AND tablename = 'analytics_events'
        AND indexname NOT LIKE '%_pkey'
      `);
```