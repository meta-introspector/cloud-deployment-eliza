# a7046c18:packages_plugin-sql_src___tests___migration_production-scenario.test.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/production-scenario.test.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      const agents = await db.execute(
        sql`SELECT * FROM agents WHERE id = ${agentId}::uuid`,
      );
      expect(agents.rows[0]).toBeDefined();
      expect(agents.rows[0].name).toBe("Production Agent");
    });

    it("should work with tables that already have snake_case columns (post-migration)", async () => {
      // This test simulates a database that has ALREADY been migrated
      // (migrations.ts already ran and renamed columns to snake_case)
      // RuntimeMigrator should handle this gracefully

      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS memories (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          agent_id UUID NOT NULL,
          room_id UUID,
          entity_id UUID,
          content JSONB NOT NULL,
          created_at TIMESTAMP DEFAULT NOW(),
          type TEXT NOT NULL DEFAULT 'message',
          "unique" BOOLEAN DEFAULT TRUE,
          metadata JSONB DEFAULT '{}',
          world_id UUID
        )
      `);

      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS agents (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          settings JSONB DEFAULT '{}'::jsonb,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          enabled BOOLEAN DEFAULT TRUE,
          username TEXT,
          system TEXT DEFAULT '',
          bio JSONB DEFAULT '[]'::jsonb,
          message_examples JSONB DEFAULT '[]'::jsonb,
          post_examples JSONB DEFAULT '[]'::jsonb,
          topics JSONB DEFAULT '[]'::jsonb,
          adjectives JSONB DEFAULT '[]'::jsonb,
          knowledge JSONB DEFAULT '[]'::jsonb,
          plugins JSONB DEFAULT '[]'::jsonb,
          style JSONB DEFAULT '{}'::jsonb
        )
      `);

      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS rooms (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          agent_id UUID,
          name TEXT,
          source TEXT NOT NULL DEFAULT 'unknown',
          type TEXT NOT NULL DEFAULT 'general',
          created_at TIMESTAMP DEFAULT NOW() NOT NULL,
          world_id UUID,
          message_server_id UUID,
          metadata JSONB,
          channel_id TEXT
        )
      `);

      // Insert some production data
      const agentId = "123e4567-e89b-12d3-a456-426614174000";
      const roomId = "223e4567-e89b-12d3-a456-426614174000";

      await db.execute(sql`
        INSERT INTO agents (id, name, settings)
        VALUES (${agentId}::uuid, 'Production Agent', '{"model": "gpt-4"}'::jsonb)
      `);

      await db.execute(sql`
        INSERT INTO rooms (id, agent_id, name, source, type)
        VALUES (${roomId}::uuid, ${agentId}::uuid, 'Main Room', 'test', 'general')
      `);

      await db.execute(sql`
        INSERT INTO memories (agent_id, room_id, entity_id, content, type)
        VALUES
        (${agentId}::uuid, ${roomId}::uuid, null, '{"text": "System initialized"}'::jsonb, 'message'),
        (${agentId}::uuid, ${roomId}::uuid, null, '{"text": "User preferences loaded"}'::jsonb, 'message'),
        (${agentId}::uuid, ${roomId}::uuid, null, '{"text": "Context established"}'::jsonb, 'message')
      `);

      // RuntimeMigrator should work fine - schema already matches
      await migrator.migrate("@elizaos/plugin-sql", coreSchema, {
        verbose: false,
      });

      // Verify data is preserved
      const agents = await db.execute(
        sql`SELECT * FROM agents WHERE id = ${agentId}::uuid`,
      );
      expect(agents.rows[0]).toBeDefined();
      expect(agents.rows[0].name).toBe("Production Agent");

      // Verify memories data is preserved
      const memories = await db.execute(
        sql`SELECT COUNT(*) as count FROM memories`,
      );
      expect(Number(memories.rows[0].count)).toBe(3);

      // Check that columns are snake_case
      const memoryColumns = await db.execute(sql`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = 'memories'
        ORDER BY column_name
      `);

      const columnNames = memoryColumns.rows.map((row) => row.column_name);
      expect(columnNames).toContain("agent_id");
      expect(columnNames).toContain("room_id");
      expect(columnNames).toContain("content");
      expect(columnNames).toContain("type");
    });

    it("should handle version mismatch between DB and code schema", async () => {
      // Create an older version of a table structure
      await db.execute(sql`
        CREATE TABLE participants (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          agent_id UUID NOT NULL,
          room_id UUID NOT NULL,
          user_name TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `);

      // Add some data
      const agentId = "323e4567-e89b-12d3-a456-426614174000";
      const roomId = "423e4567-e89b-12d3-a456-426614174000";

      await db.execute(sql`
        INSERT INTO participants (agent_id, room_id, user_name) 
        VALUES 
        (${agentId}::uuid, ${roomId}::uuid, 'Alice'),
        (${agentId}::uuid, ${roomId}::uuid, 'Bob')
      `);

      // The new schema might have additional fields
      const participantTable = pgTable("participants", {
        id: uuid("id").primaryKey().defaultRandom(),
        agent_id: uuid("agent_id").notNull(),
        room_id: uuid("room_id").notNull(),
        user_name: text("user_name").notNull(),
        created_at: timestamp("created_at").defaultNow(),
        // New fields not in the old schema
        updated_at: timestamp("updated_at").defaultNow(),
```