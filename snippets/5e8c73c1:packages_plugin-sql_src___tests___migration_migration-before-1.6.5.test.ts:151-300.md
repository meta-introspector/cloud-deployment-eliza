# 5e8c73c1:packages_plugin-sql_src___tests___migration_migration-before-1.6.5.test.ts:151-300

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-sql/src/__tests__/migration/migration-before-1.6.5.test.ts:151-300
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
      const worldColumnNames = worldsColumns.rows.map((r: any) => r.column_name);

      expect(worldColumnNames).toContain('message_server_id');
      expect(worldColumnNames).not.toContain('serverId');
      expect(worldColumnNames).not.toContain('server_id');
    });

    it('should preserve data during column renames', async () => {
      // Insert test data before migration
      const agentId = '123e4567-e89b-12d3-a456-426614174000';
      const roomId = '223e4567-e89b-12d3-a456-426614174000';

      await db.execute(sql`
        INSERT INTO agents (id, name) VALUES (${agentId}::uuid, 'Test Agent')
      `);

      await db.execute(sql`
        INSERT INTO rooms (id, "agentId", name, source, type)
        VALUES (${roomId}::uuid, ${agentId}::uuid, 'Test Room', 'test', 'general')
      `);

      await db.execute(sql`
        INSERT INTO memories ("agentId", "roomId", content, type)
        VALUES (${agentId}::uuid, ${roomId}::uuid, '{"text": "Hello"}'::jsonb, 'message')
      `);

      // Run migration
      await migrateToEntityRLS(mockAdapter);

      // Verify data is preserved
      const agents = await db.execute(sql`SELECT * FROM agents WHERE id = ${agentId}::uuid`);
      expect(agents.rows[0].name).toBe('Test Agent');

      const rooms = await db.execute(sql`SELECT * FROM rooms WHERE id = ${roomId}::uuid`);
      expect(rooms.rows[0].name).toBe('Test Room');
      expect(rooms.rows[0].agent_id).toBe(agentId);

      const memories = await db.execute(
        sql`SELECT * FROM memories WHERE agent_id = ${agentId}::uuid`
      );
      expect(memories.rows).toHaveLength(1);
      expect(memories.rows[0].room_id).toBe(roomId);
    });
  });

  describe('Flow 3: Already migrated (snake_case columns exist)', () => {
    beforeEach(async () => {
      // Create tables with snake_case columns (already migrated)
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
          agent_id UUID,
          world_id UUID,
          channel_id TEXT,
          created_at TIMESTAMP DEFAULT NOW() NOT NULL,
          name TEXT,
          source TEXT NOT NULL DEFAULT 'unknown',
          type TEXT NOT NULL DEFAULT 'general'
        )
      `);

      // Insert test data
      await db.execute(sql`
        INSERT INTO agents (id, name) VALUES ('123e4567-e89b-12d3-a456-426614174000'::uuid, 'Test Agent')
      `);

      await db.execute(sql`
        INSERT INTO rooms (id, agent_id, name, source, type)
        VALUES ('223e4567-e89b-12d3-a456-426614174000'::uuid, '123e4567-e89b-12d3-a456-426614174000'::uuid, 'Test Room', 'test', 'general')
      `);
    });

    it('should skip schema migration but still run RLS cleanup', async () => {
      // Enable RLS on rooms table to test cleanup
      await db.execute(sql`ALTER TABLE rooms ENABLE ROW LEVEL SECURITY`);

      // Verify RLS is enabled
      const beforeRls = await db.execute(sql`
        SELECT relrowsecurity FROM pg_class WHERE relname = 'rooms'
      `);
      expect(beforeRls.rows[0].relrowsecurity).toBe(true);

      // Run migration (should skip schema changes but do RLS cleanup)
      await migrateToEntityRLS(mockAdapter);

      // Verify RLS is disabled (cleanup happened)
      const afterRls = await db.execute(sql`
        SELECT relrowsecurity FROM pg_class WHERE relname = 'rooms'
      `);
      expect(afterRls.rows[0].relrowsecurity).toBe(false);

      // Verify data is still intact
      const rooms = await db.execute(sql`SELECT * FROM rooms`);
      expect(rooms.rows).toHaveLength(1);
      expect(rooms.rows[0].name).toBe('Test Room');
    });

    it('should not modify existing snake_case columns', async () => {
      await migrateToEntityRLS(mockAdapter);

      const roomsColumns = await db.execute(sql`
        SELECT column_name FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'rooms'
        ORDER BY column_name
      `);
      const roomColumnNames = roomsColumns.rows.map((r: any) => r.column_name);

      // Should still have snake_case columns
      expect(roomColumnNames).toContain('agent_id');
      expect(roomColumnNames).toContain('world_id');
      expect(roomColumnNames).toContain('channel_id');
      expect(roomColumnNames).toContain('created_at');
    });

    it('should NOT disable RLS when ENABLE_DATA_ISOLATION=true (avoid wasteful cycle)', async () => {
      // Enable RLS on rooms table
      await db.execute(sql`ALTER TABLE rooms ENABLE ROW LEVEL SECURITY`);

      // Verify RLS is enabled
      const beforeRls = await db.execute(sql`
        SELECT relrowsecurity FROM pg_class WHERE relname = 'rooms'
      `);
      expect(beforeRls.rows[0].relrowsecurity).toBe(true);

      // Set ENABLE_DATA_ISOLATION=true
      const originalEnv = process.env.ENABLE_DATA_ISOLATION;
      process.env.ENABLE_DATA_ISOLATION = 'true';

      try {
        // Run migration (should NOT disable RLS because ENABLE_DATA_ISOLATION=true)
        await migrateToEntityRLS(mockAdapter);

        // Verify RLS is STILL enabled (no wasteful disable/re-enable cycle)
        const afterRls = await db.execute(sql`
          SELECT relrowsecurity FROM pg_class WHERE relname = 'rooms'
        `);
        expect(afterRls.rows[0].relrowsecurity).toBe(true);

        // Verify data is still intact
        const rooms = await db.execute(sql`SELECT * FROM rooms`);
        expect(rooms.rows).toHaveLength(1);
        expect(rooms.rows[0].name).toBe('Test Room');
```