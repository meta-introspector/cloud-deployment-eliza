# 5e8c73c1:packages_plugin-sql_src___tests___migration_migration-before-1.6.5.test.ts:451-600

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-sql/src/__tests__/migration/migration-before-1.6.5.test.ts:451-600
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
      `);

      const ownerId = '423e4567-e89b-12d3-a456-426614174000';
      await db.execute(sql`
        INSERT INTO agents (id, name, owner_id)
        VALUES ('123e4567-e89b-12d3-a456-426614174000'::uuid, 'Test Agent', ${ownerId}::uuid)
      `);

      await migrateToEntityRLS(mockAdapter);

      // Verify column was renamed
      const agentsColumns = await db.execute(sql`
        SELECT column_name FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'agents'
        ORDER BY column_name
      `);
      const agentColumnNames = agentsColumns.rows.map((r: any) => r.column_name);

      expect(agentColumnNames).toContain('server_id');
      expect(agentColumnNames).not.toContain('owner_id');

      // Verify data was preserved
      const agents = await db.execute(sql`SELECT server_id FROM agents`);
      expect(agents.rows[0].server_id).toBe(ownerId);
    });
  });

  describe('Flow 6: Other plugin tables in public schema', () => {
    beforeEach(async () => {
      // Create plugin-sql required tables with camelCase columns (pre-1.6.5)
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

      // Create a table from another plugin (e.g., plugin-twitter)
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS twitter_posts (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          tweet_id TEXT NOT NULL,
          author_id TEXT NOT NULL,
          content TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);

      // Create another plugin table with server_id column (potential conflict!)
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS custom_plugin_data (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          server_id UUID,
          data JSONB,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);
    });

    it('should DROP server_id from unknown plugin tables (current behavior - potential issue)', async () => {
      // Insert test data in custom_plugin_data
      const serverId = '523e4567-e89b-12d3-a456-426614174000';
      await db.execute(sql`
        INSERT INTO custom_plugin_data (id, server_id, data)
        VALUES ('623e4567-e89b-12d3-a456-426614174000'::uuid, ${serverId}::uuid, '{"key": "value"}'::jsonb)
      `);

      // Run migration
      await migrateToEntityRLS(mockAdapter);

      // Check if server_id column was preserved or deleted
      const columns = await db.execute(sql`
        SELECT column_name FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'custom_plugin_data'
        ORDER BY column_name
      `);
      const columnNames = columns.rows.map((r: any) => r.column_name);

      // CURRENT BEHAVIOR: migrations.ts DROPS server_id from tables not in exclusion list
      // This is DOCUMENTED BEHAVIOR - other plugins should NOT use server_id column name
      expect(columnNames).not.toContain('server_id'); // server_id is DROPPED
    });

    it('should preserve other plugin tables with their data intact', async () => {
      // Insert test data
      await db.execute(sql`
        INSERT INTO twitter_posts (id, tweet_id, author_id, content)
        VALUES ('723e4567-e89b-12d3-a456-426614174000'::uuid, '12345', 'user123', 'Hello Twitter!')
      `);

      // Run migration
      await migrateToEntityRLS(mockAdapter);

      // Verify twitter_posts table and data are intact
      const tweets = await db.execute(sql`SELECT * FROM twitter_posts`);
      expect(tweets.rows).toHaveLength(1);
      expect(tweets.rows[0].content).toBe('Hello Twitter!');
      expect(tweets.rows[0].tweet_id).toBe('12345');
    });

    it('should disable RLS on other plugin tables during migration', async () => {
      // Enable RLS on twitter_posts
      await db.execute(sql`ALTER TABLE twitter_posts ENABLE ROW LEVEL SECURITY`);

      // Verify RLS is enabled
      const beforeRls = await db.execute(sql`
        SELECT relrowsecurity FROM pg_class WHERE relname = 'twitter_posts'
      `);
      expect(beforeRls.rows[0].relrowsecurity).toBe(true);

      // Run migration
      await migrateToEntityRLS(mockAdapter);

      // RLS should be disabled on ALL tables including other plugins
      const afterRls = await db.execute(sql`
        SELECT relrowsecurity FROM pg_class WHERE relname = 'twitter_posts'
      `);
      expect(afterRls.rows[0].relrowsecurity).toBe(false);
    });

    it('should NOT rename columns in other plugin tables', async () => {
      // Insert test data
      await db.execute(sql`
        INSERT INTO twitter_posts (id, tweet_id, author_id, content)
        VALUES ('723e4567-e89b-12d3-a456-426614174000'::uuid, '12345', 'user123', 'Hello!')
      `);

      // Run migration
      await migrateToEntityRLS(mockAdapter);

      // Verify columns are unchanged
      const columns = await db.execute(sql`
        SELECT column_name FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'twitter_posts'
        ORDER BY column_name
      `);
      const columnNames = columns.rows.map((r: any) => r.column_name);

```