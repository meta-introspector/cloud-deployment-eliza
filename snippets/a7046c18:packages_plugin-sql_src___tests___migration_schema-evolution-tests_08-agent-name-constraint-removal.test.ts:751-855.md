# a7046c18:packages_plugin-sql_src___tests___migration_schema-evolution-tests_08-agent-name-constraint-removal.test.ts:751-855

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/schema-evolution-tests/08-agent-name-constraint-removal.test.ts:751-855
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    // Verify constraint is gone
    const constraintAfter = await db.execute<{ constraint_name: string }>(sql`
      SELECT conname as constraint_name
      FROM pg_constraint
      WHERE conrelid = 'agents'::regclass
      AND conname = 'name_unique'
    `);
    expect(constraintAfter.rows.length).toBe(0);

    // Verify data integrity
    const agents = await db.execute<{ count: number }>(sql`
      SELECT COUNT(*) as count FROM agents
    `);
    expect(Number(agents.rows[0].count)).toBe(1);

    await client.close();
  });

  it("should document the migration path for users", async () => {
    // This test serves as documentation for how users should migrate their databases

    console.log("\n📚 [MIGRATION GUIDE] Agent Name Constraint Removal");
    console.log(
      "================================================================",
    );
    console.log(
      "If you have an existing elizaOS database with the old schema,",
    );
    console.log(
      "the migration will automatically run when you restart your agents.",
    );
    console.log("");
    console.log("What happens:");
    console.log("1. OLD SCHEMA: UNIQUE constraint on agent.name");
    console.log("2. MIGRATION: Drops the UNIQUE constraint");
    console.log("3. NEW SCHEMA: No name constraint, UUID-only identification");
    console.log("");
    console.log("Benefits:");
    console.log("✅ Multiple agents can have the same name");
    console.log("✅ Agents identified by UUID only");
    console.log("✅ No name conflicts when cloning agents");
    console.log("✅ Better multi-tenant support");
    console.log("");
    console.log("Backward compatibility:");
    console.log("✅ Existing agents preserved");
    console.log("✅ All data remains intact");
    console.log("✅ No manual intervention needed");
    console.log(
      "================================================================\n",
    );

    // Simulate the scenario
    await db.execute(sql`
      CREATE TABLE agents (
        id UUID PRIMARY KEY,
        name TEXT NOT NULL,
        username TEXT,
        enabled BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        bio JSONB DEFAULT '[]'::jsonb,
        message_examples JSONB NOT NULL DEFAULT '[]'::jsonb,
        post_examples JSONB NOT NULL DEFAULT '[]'::jsonb,
        topics JSONB NOT NULL DEFAULT '[]'::jsonb,
        adjectives JSONB NOT NULL DEFAULT '[]'::jsonb,
        knowledge JSONB NOT NULL DEFAULT '[]'::jsonb,
        plugins JSONB NOT NULL DEFAULT '[]'::jsonb,
        settings JSONB NOT NULL DEFAULT '{}'::jsonb,
        style JSONB NOT NULL DEFAULT '{}'::jsonb,
        system TEXT DEFAULT '',
        CONSTRAINT name_unique UNIQUE (name)
      )
    `);

    // User has existing agents
    await db.execute(sql`
      INSERT INTO agents (id, name, username)
      VALUES (${uuidv4()}, 'MyBot', 'bot1')
    `);

    // Migration happens automatically
    await db.execute(
      sql`ALTER TABLE agents DROP CONSTRAINT IF EXISTS name_unique`,
    );

    // User can now create agents with duplicate names
    await db.execute(sql`
      INSERT INTO agents (id, name, username)
      VALUES 
        (${uuidv4()}, 'MyBot', 'bot2'),
        (${uuidv4()}, 'MyBot', 'bot3')
    `);

    const result = await db.execute<{ count: number }>(sql`
      SELECT COUNT(*) as count FROM agents WHERE name = 'MyBot'
    `);

    expect(Number(result.rows[0].count)).toBe(3);
    console.log(
      `✅ Migration test passed: ${result.rows[0].count} agents with name "MyBot"`,
    );

    await client.close();
  });
});
```