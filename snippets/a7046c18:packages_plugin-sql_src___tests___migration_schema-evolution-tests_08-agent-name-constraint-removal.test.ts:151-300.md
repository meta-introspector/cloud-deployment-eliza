# a7046c18:packages_plugin-sql_src___tests___migration_schema-evolution-tests_08-agent-name-constraint-removal.test.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/schema-evolution-tests/08-agent-name-constraint-removal.test.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
  });

  it("should migrate from old schema with unique name constraint to new schema without it", async () => {
    // Step 1: Create OLD schema with unique name constraint
    await db.execute(sql`
      CREATE TABLE agents_old_schema (
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
        CONSTRAINT name_unique_old UNIQUE (name)
      )
    `);

    // Step 2: Insert test data with unique names (old constraint allows this)
    const agent1Id = uuidv4();
    const agent2Id = uuidv4();
    const agent3Id = uuidv4();

    await db.execute(sql`
      INSERT INTO agents_old_schema (id, name, username, bio, settings)
      VALUES 
        (${agent1Id}, 'Agent One', 'user1', '["First unique agent"]'::jsonb, '{"key": "value1"}'::jsonb),
        (${agent2Id}, 'Agent Two', 'user2', '["Second unique agent"]'::jsonb, '{"key": "value2"}'::jsonb),
        (${agent3Id}, 'Agent Three', 'user3', '["Third unique agent"]'::jsonb, '{"key": "value3"}'::jsonb)
    `);

    // Verify old constraint prevents duplicates
    let duplicateError: any = null;
    try {
      await db.execute(sql`
        INSERT INTO agents_old_schema (id, name, username)
        VALUES (${uuidv4()}, 'Agent One', 'duplicate_user')
      `);
    } catch (error) {
      duplicateError = error;
    }
    expect(duplicateError).not.toBeNull();
    // Error message varies by database, but should indicate a constraint/unique violation
    const errorStr = String(duplicateError);
    const hasUniqueError =
      errorStr.toLowerCase().includes("unique") ||
      errorStr.includes("name_unique_old") ||
      errorStr.includes("duplicate") ||
      errorStr.includes("constraint");
    expect(hasUniqueError).toBe(true);

    // Step 3: Perform migration - Drop the unique constraint
    await db.execute(
      sql`ALTER TABLE agents_old_schema DROP CONSTRAINT name_unique_old`,
    );

    // Step 4: Verify constraint was removed - should now allow duplicate names
    const duplicateId1 = uuidv4();
    const duplicateId2 = uuidv4();

    // These should both succeed with the same name
    await db.execute(sql`
      INSERT INTO agents_old_schema (id, name, username, bio)
      VALUES (${duplicateId1}, 'Duplicate Name', 'dup_user1', '["First with duplicate name"]'::jsonb)
    `);

    await db.execute(sql`
      INSERT INTO agents_old_schema (id, name, username, bio)
      VALUES (${duplicateId2}, 'Duplicate Name', 'dup_user2', '["Second with duplicate name"]'::jsonb)
    `);

    // Step 5: Verify all agents exist including those with duplicate names
    const allAgents = await db.execute<{
      id: string;
      name: string;
      username: string;
      bio: any;
    }>(
      sql`SELECT id, name, username, bio FROM agents_old_schema ORDER BY created_at`,
    );

    expect(allAgents.rows.length).toBeGreaterThanOrEqual(5);

    // Verify the original unique-name agents
    expect(
      allAgents.rows.some((a) => a.id === agent1Id && a.name === "Agent One"),
    ).toBe(true);
    expect(
      allAgents.rows.some((a) => a.id === agent2Id && a.name === "Agent Two"),
    ).toBe(true);
    expect(
      allAgents.rows.some((a) => a.id === agent3Id && a.name === "Agent Three"),
    ).toBe(true);

    // Verify the duplicate-name agents
    const duplicates = allAgents.rows.filter(
      (a) => a.name === "Duplicate Name",
    );
    expect(duplicates.length).toBe(2);
    expect(duplicates[0].id).not.toBe(duplicates[1].id);
    expect(duplicates[0].username).not.toBe(duplicates[1].username);

    // Step 6: Verify we can continue to create more duplicates
    const duplicateId3 = uuidv4();
    await db.execute(sql`
      INSERT INTO agents_old_schema (id, name, username, bio)
      VALUES (${duplicateId3}, 'Duplicate Name', 'dup_user3', '["Third with duplicate name"]'::jsonb)
    `);

    const finalCount = await db.execute<{ count: number }>(sql`
      SELECT COUNT(*) as count FROM agents_old_schema WHERE name = 'Duplicate Name'
    `);

    expect(Number(finalCount.rows[0].count)).toBe(3);
  });

  it("should handle real-world migration scenario: existing database to new schema", async () => {
    // Simulate a real-world scenario where a database has existing agents
    // with unique names, and we need to migrate to support duplicate names

    // Step 1: Create old schema and populate with production-like data
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
```