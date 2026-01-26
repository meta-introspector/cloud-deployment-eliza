# a7046c18:packages_plugin-sql_src___tests___migration_schema-evolution-tests_08-agent-name-constraint-removal.test.ts:451-600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/schema-evolution-tests/08-agent-name-constraint-removal.test.ts:451-600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

    // Final verification: Total agent count
    const finalAgentCount = await db.execute<{ count: number }>(sql`
      SELECT COUNT(*) as count FROM agents
    `);
    expect(Number(finalAgentCount.rows[0].count)).toBe(6); // 4 original + 3 Elizas - 1 deleted = 6

    await client.close();
  });

  it("should handle migration with complex existing data and relationships", async () => {
    // Create old schema
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

    // Create related table that references agents
    await db.execute(sql`
      CREATE TABLE agent_sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
        session_data JSONB NOT NULL DEFAULT '{}'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
      )
    `);

    // Insert agents with complex data
    const complexAgent1 = {
      id: uuidv4(),
      name: "ComplexAgent",
      username: "complex1",
      settings: {
        nested: {
          deep: {
            value: "test",
            array: [1, 2, 3],
          },
        },
        secrets: {
          apiKey: "secret123",
          token: "token456",
        },
      },
      messageExamples: [
        [
          { name: "user", content: { text: "Hello" } },
          { name: "agent", content: { text: "Hi there!" } },
        ],
      ],
    };

    await db.execute(sql`
      INSERT INTO agents (id, name, username, settings, message_examples)
      VALUES (
        ${complexAgent1.id},
        ${complexAgent1.name},
        ${complexAgent1.username},
        ${JSON.stringify(complexAgent1.settings)}::jsonb,
        ${JSON.stringify(complexAgent1.messageExamples)}::jsonb
      )
    `);

    // Create session for this agent
    const sessionId = uuidv4();
    await db.execute(sql`
      INSERT INTO agent_sessions (id, agent_id, session_data)
      VALUES (${sessionId}, ${complexAgent1.id}, '{"active": true}'::jsonb)
    `);

    // Perform migration
    console.log(
      "🔄 [MIGRATION] Dropping unique constraint from complex setup...",
    );
    await db.execute(
      sql`ALTER TABLE agents DROP CONSTRAINT IF EXISTS name_unique`,
    );

    // Verify complex data is preserved
    const retrievedAgent = await db.execute<{
      id: string;
      name: string;
      settings: any;
      message_examples: any;
    }>(sql`
      SELECT id, name, settings, message_examples 
      FROM agents 
      WHERE id = ${complexAgent1.id}
    `);

    expect(retrievedAgent.rows.length).toBe(1);
    expect(retrievedAgent.rows[0].settings.nested.deep.value).toBe("test");
    expect(retrievedAgent.rows[0].settings.secrets.apiKey).toBe("secret123");
    expect(retrievedAgent.rows[0].message_examples[0][0].name).toBe("user");

    // Verify session relationship is intact
    const session = await db.execute<{ session_data: any }>(sql`
      SELECT session_data FROM agent_sessions WHERE agent_id = ${complexAgent1.id}
    `);
    expect(session.rows[0].session_data.active).toBe(true);

    // Now create duplicate complex agent
    const complexAgent2 = {
      id: uuidv4(),
      name: "ComplexAgent", // Same name
      username: "complex2", // Different username
      settings: {
        different: "settings",
      },
    };

    await db.execute(sql`
      INSERT INTO agents (id, name, username, settings)
      VALUES (
        ${complexAgent2.id},
        ${complexAgent2.name},
        ${complexAgent2.username},
        ${JSON.stringify(complexAgent2.settings)}::jsonb
      )
    `);

    // Verify both exist
    const complexAgents = await db.execute<{
      id: string;
      username: string;
    }>(sql`
      SELECT id, username FROM agents WHERE name = 'ComplexAgent'
    `);

    expect(complexAgents.rows.length).toBe(2);
    expect(complexAgents.rows.some((a) => a.username === "complex1")).toBe(
      true,
    );
```