# 5e8c73c1:packages_plugin-sql_src___tests___migration_migration-before-1.6.5.test.ts:301-450

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-sql/src/__tests__/migration/migration-before-1.6.5.test.ts:301-450
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
      } finally {
        // Restore original env
        if (originalEnv === undefined) {
          delete process.env.ENABLE_DATA_ISOLATION;
        } else {
          process.env.ENABLE_DATA_ISOLATION = originalEnv;
        }
      }
    });
  });

  describe('Flow 4: serverId to message_server_id migration', () => {
    it('should convert TEXT serverId to UUID message_server_id with valid UUID', async () => {
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
          "serverId" TEXT,
          name TEXT,
          source TEXT NOT NULL DEFAULT 'unknown',
          type TEXT NOT NULL DEFAULT 'general'
        )
      `);

      // Insert with valid UUID as text
      const serverId = '323e4567-e89b-12d3-a456-426614174000';
      await db.execute(sql`
        INSERT INTO rooms (id, "serverId", name, source, type)
        VALUES ('223e4567-e89b-12d3-a456-426614174000'::uuid, ${serverId}, 'Test Room', 'test', 'general')
      `);

      await migrateToEntityRLS(mockAdapter);

      // Verify column was renamed and converted to UUID
      const roomsColumns = await db.execute(sql`
        SELECT column_name, data_type FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'rooms' AND column_name = 'message_server_id'
      `);

      expect(roomsColumns.rows).toHaveLength(1);
      expect(roomsColumns.rows[0].data_type).toBe('uuid');

      // Verify data was preserved
      const rooms = await db.execute(sql`SELECT message_server_id FROM rooms`);
      expect(rooms.rows[0].message_server_id).toBe(serverId);
    });

    it('should convert non-UUID TEXT serverId to md5 UUID', async () => {
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
          "serverId" TEXT,
          name TEXT,
          source TEXT NOT NULL DEFAULT 'unknown',
          type TEXT NOT NULL DEFAULT 'general'
        )
      `);

      // Insert with non-UUID text
      await db.execute(sql`
        INSERT INTO rooms (id, "serverId", name, source, type)
        VALUES ('223e4567-e89b-12d3-a456-426614174000'::uuid, 'my-server-name', 'Test Room', 'test', 'general')
      `);

      await migrateToEntityRLS(mockAdapter);

      // Verify data was converted (md5 hash of 'my-server-name')
      const rooms = await db.execute(sql`SELECT message_server_id FROM rooms`);
      expect(rooms.rows[0].message_server_id).toBeDefined();
      // The value should be a valid UUID (md5 hash)
      expect(rooms.rows[0].message_server_id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
      );
    });

    it('should handle NULL serverId values', async () => {
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
          "serverId" TEXT,
          name TEXT,
          source TEXT NOT NULL DEFAULT 'unknown',
          type TEXT NOT NULL DEFAULT 'general'
        )
      `);

      // Insert with NULL serverId
      await db.execute(sql`
        INSERT INTO rooms (id, "serverId", name, source, type)
        VALUES ('223e4567-e89b-12d3-a456-426614174000'::uuid, NULL, 'Test Room', 'test', 'general')
      `);

      await migrateToEntityRLS(mockAdapter);

      // Verify NULL was preserved
      const rooms = await db.execute(sql`SELECT message_server_id FROM rooms`);
      expect(rooms.rows[0].message_server_id).toBeNull();
    });
  });

  describe('Flow 5: owner_id to server_id migration (agents table)', () => {
    it('should rename agents.owner_id to server_id', async () => {
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS agents (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          owner_id UUID,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        )
      `);

      // Also need rooms table for migration check
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS rooms (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          "agentId" UUID,
          "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
          name TEXT,
          source TEXT NOT NULL DEFAULT 'unknown',
          type TEXT NOT NULL DEFAULT 'general'
        )
```