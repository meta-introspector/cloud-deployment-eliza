# 5e8c73c1:packages_plugin-sql_src___tests___migration_migration-before-1.6.5.test.ts:751-820

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-sql/src/__tests__/migration/migration-before-1.6.5.test.ts:751-820
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
      expect(beforeIndexes.rows.length).toBeGreaterThanOrEqual(2);

      // Run migration
      await migrateToEntityRLS(mockAdapter);

      // CURRENT BEHAVIOR: ALL regular indexes are dropped (including from other plugins)
      // This is DOCUMENTED BEHAVIOR - indexes are recreated by RuntimeMigrator
      const afterIndexes = await db.execute(sql`
        SELECT indexname FROM pg_indexes
        WHERE schemaname = 'public' AND tablename = 'analytics_events'
        AND indexname NOT LIKE '%_pkey'
      `);
      expect(afterIndexes.rows.length).toBe(0); // All indexes dropped

      // Verify data is still intact though
      const events = await db.execute(sql`SELECT * FROM analytics_events`);
      expect(events.rows).toHaveLength(1);
    });
  });

  describe('Idempotency', () => {
    it('should be safe to run multiple times', async () => {
      // Create tables with camelCase
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

      await db.execute(sql`
        INSERT INTO rooms (id, name, source, type)
        VALUES ('223e4567-e89b-12d3-a456-426614174000'::uuid, 'Test Room', 'test', 'general')
      `);

      // Run migration multiple times
      await migrateToEntityRLS(mockAdapter);
      await migrateToEntityRLS(mockAdapter);
      await migrateToEntityRLS(mockAdapter);

      // Verify data is still intact
      const rooms = await db.execute(sql`SELECT * FROM rooms`);
      expect(rooms.rows).toHaveLength(1);
      expect(rooms.rows[0].name).toBe('Test Room');

      // Verify columns are correct
      const roomsColumns = await db.execute(sql`
        SELECT column_name FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'rooms'
        ORDER BY column_name
      `);
      const roomColumnNames = roomsColumns.rows.map((r: any) => r.column_name);

      expect(roomColumnNames).toContain('agent_id');
      expect(roomColumnNames).toContain('created_at');
    });
  });
});
```