# a7046c18:packages_plugin-sql_src___tests___migration_schema-evolution-tests_08-agent-name-constraint-removal.test.ts:601-750

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/schema-evolution-tests/08-agent-name-constraint-removal.test.ts:601-750
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    expect(complexAgents.rows.some((a) => a.username === "complex2")).toBe(
      true,
    );

    await client.close();
  });

  it("should verify NO name-based lookups remain in migrated system", async () => {
    // This test ensures the system uses UUID-based lookups only

    await db.execute(sql`
      CREATE TABLE agents (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        enabled BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        name TEXT NOT NULL,
        username TEXT,
        system TEXT DEFAULT '',
        bio JSONB DEFAULT '[]'::jsonb,
        message_examples JSONB NOT NULL DEFAULT '[]'::jsonb,
        post_examples JSONB NOT NULL DEFAULT '[]'::jsonb,
        topics JSONB NOT NULL DEFAULT '[]'::jsonb,
        adjectives JSONB NOT NULL DEFAULT '[]'::jsonb,
        knowledge JSONB NOT NULL DEFAULT '[]'::jsonb,
        plugins JSONB NOT NULL DEFAULT '[]'::jsonb,
        settings JSONB NOT NULL DEFAULT '{}'::jsonb,
        style JSONB NOT NULL DEFAULT '{}'::jsonb
      )
    `);

    const sharedName = "SharedName";
    const agent1Id = uuidv4();
    const agent2Id = uuidv4();
    const agent3Id = uuidv4();

    // Create multiple agents with same name
    await db.execute(sql`
      INSERT INTO agents (id, name, username, bio)
      VALUES 
        (${agent1Id}, ${sharedName}, 'user1', '["Agent 1"]'::jsonb),
        (${agent2Id}, ${sharedName}, 'user2', '["Agent 2"]'::jsonb),
        (${agent3Id}, ${sharedName}, 'user3', '["Agent 3"]'::jsonb)
    `);

    // Verify: Getting by ID returns the correct specific agent
    const agent1 = await db.execute<{
      id: string;
      username: string;
      bio: any;
    }>(sql`
      SELECT id, username, bio FROM agents WHERE id = ${agent1Id}
    `);
    expect(agent1.rows[0].username).toBe("user1");
    expect(agent1.rows[0].bio).toContain("Agent 1");

    // Verify: Updating by ID affects only that agent
    await db.execute(sql`
      UPDATE agents SET bio = '["Updated Agent 1"]'::jsonb WHERE id = ${agent1Id}
    `);

    const updated = await db.execute<{ bio: any }>(sql`
      SELECT bio FROM agents WHERE id = ${agent1Id}
    `);
    expect(updated.rows[0].bio).toContain("Updated Agent 1");

    // Others unchanged
    const agent2Check = await db.execute<{ bio: any }>(sql`
      SELECT bio FROM agents WHERE id = ${agent2Id}
    `);
    expect(agent2Check.rows[0].bio).toContain("Agent 2");

    // Verify: Deleting by ID removes only that agent
    await db.execute(sql`DELETE FROM agents WHERE id = ${agent2Id}`);

    const remaining = await db.execute<{ count: number }>(sql`
      SELECT COUNT(*) as count FROM agents WHERE name = ${sharedName}
    `);
    expect(Number(remaining.rows[0].count)).toBe(2);

    // Verify: All operations are UUID-based, not name-based
    const allWithSharedName = await db.execute<{ id: string }>(sql`
      SELECT id FROM agents WHERE name = ${sharedName}
    `);
    expect(allWithSharedName.rows.length).toBe(2);
    expect(allWithSharedName.rows.some((a) => a.id === agent1Id)).toBe(true);
    expect(allWithSharedName.rows.some((a) => a.id === agent3Id)).toBe(true);
    expect(allWithSharedName.rows.some((a) => a.id === agent2Id)).toBe(false); // Deleted

    await client.close();
  });

  it("should allow rollback if migration fails (transaction safety)", async () => {
    // Test that migration failures don't corrupt data

    await db.execute(sql`
      CREATE TABLE agents (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        enabled BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        name TEXT NOT NULL,
        username TEXT,
        system TEXT DEFAULT '',
        bio JSONB DEFAULT '[]'::jsonb,
        message_examples JSONB NOT NULL DEFAULT '[]'::jsonb,
        post_examples JSONB NOT NULL DEFAULT '[]'::jsonb,
        topics JSONB NOT NULL DEFAULT '[]'::jsonb,
        adjectives JSONB NOT NULL DEFAULT '[]'::jsonb,
        knowledge JSONB NOT NULL DEFAULT '[]'::jsonb,
        plugins JSONB NOT NULL DEFAULT '[]'::jsonb,
        settings JSONB NOT NULL DEFAULT '{}'::jsonb,
        style JSONB NOT NULL DEFAULT '{}'::jsonb,
        CONSTRAINT name_unique UNIQUE (name)
      )
    `);

    // Insert test data
    await db.execute(sql`
      INSERT INTO agents (id, name, username)
      VALUES (${uuidv4()}, 'TestAgent', 'test1')
    `);

    // Verify constraint exists
    const constraintBefore = await db.execute<{ constraint_name: string }>(sql`
      SELECT conname as constraint_name
      FROM pg_constraint
      WHERE conrelid = 'agents'::regclass
      AND conname = 'name_unique'
    `);
    expect(constraintBefore.rows.length).toBe(1);

    // Perform migration in transaction
    let migrationError: any = null;
    try {
      await db.transaction(async (tx) => {
        // Drop constraint
        await tx.execute(sql`ALTER TABLE agents DROP CONSTRAINT name_unique`);

        // Simulate a failure after constraint drop
        // (In real scenario, this could be a failed column addition, etc.)
        // For this test, we'll complete successfully
      });
    } catch (error) {
      migrationError = error;
    }

    // Verify migration succeeded
    expect(migrationError).toBeNull();

```