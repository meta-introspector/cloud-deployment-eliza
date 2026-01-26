# a7046c18:packages_plugin-sql_src___tests___migration_schema-evolution-tests_08-agent-name-constraint-removal.test.ts:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/schema-evolution-tests/08-agent-name-constraint-removal.test.ts:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

    // Create "production" data - multiple agents with different names
    const productionAgents = [
      {
        id: uuidv4(),
        name: "Eliza",
        username: "eliza_prod",
        bio: '["Production Eliza"]',
      },
      {
        id: uuidv4(),
        name: "Support Bot",
        username: "support",
        bio: '["Support agent"]',
      },
      {
        id: uuidv4(),
        name: "Sales Assistant",
        username: "sales",
        bio: '["Sales helper"]',
      },
      {
        id: uuidv4(),
        name: "Dev Helper",
        username: "dev",
        bio: '["Developer assistant"]',
      },
    ];

    for (const agent of productionAgents) {
      await db.execute(sql`
        INSERT INTO agents (id, name, username, bio)
        VALUES (${agent.id}, ${agent.name}, ${agent.username}, ${agent.bio}::jsonb)
      `);
    }

    // Verify old constraint is active
    const countBefore = await db.execute<{ count: number }>(
      sql`SELECT COUNT(*) as count FROM agents`,
    );
    expect(Number(countBefore.rows[0].count)).toBe(4);

    // Verify constraint blocks duplicate names
    let constraintError: any = null;
    try {
      await db.execute(sql`
        INSERT INTO agents (id, name, username)
        VALUES (${uuidv4()}, 'Eliza', 'eliza_duplicate')
      `);
    } catch (error) {
      constraintError = error;
    }
    expect(constraintError).not.toBeNull();

    // Step 2: MIGRATION - Drop the unique constraint
    console.log("🔄 [MIGRATION] Dropping unique name constraint...");
    await db.execute(
      sql`ALTER TABLE agents DROP CONSTRAINT IF EXISTS name_unique`,
    );
    console.log("✅ [MIGRATION] Constraint dropped successfully");

    // Step 3: Verify constraint is gone by checking pg_constraint
    const constraintCheck = await db.execute<{ constraint_name: string }>(sql`
      SELECT conname as constraint_name
      FROM pg_constraint
      WHERE conrelid = 'agents'::regclass
      AND conname = 'name_unique'
    `);
    expect(constraintCheck.rows.length).toBe(0);

    // Step 4: Verify all existing data is preserved
    const allAgentsAfterMigration = await db.execute<{
      id: string;
      name: string;
      username: string;
      bio: any;
    }>(sql`SELECT id, name, username, bio FROM agents ORDER BY created_at`);

    expect(allAgentsAfterMigration.rows.length).toBe(4);
    for (const prodAgent of productionAgents) {
      const found = allAgentsAfterMigration.rows.find(
        (a) => a.id === prodAgent.id,
      );
      expect(found).toBeTruthy();
      expect(found?.name).toBe(prodAgent.name);
      expect(found?.username).toBe(prodAgent.username);
    }

    // Step 5: Verify we can now create agents with duplicate names
    const elizaClone1 = uuidv4();
    const elizaClone2 = uuidv4();
    const elizaClone3 = uuidv4();

    await db.execute(sql`
      INSERT INTO agents (id, name, username, bio)
      VALUES (${elizaClone1}, 'Eliza', 'eliza_clone1', '["First Eliza clone"]'::jsonb)
    `);

    await db.execute(sql`
      INSERT INTO agents (id, name, username, bio)
      VALUES (${elizaClone2}, 'Eliza', 'eliza_clone2', '["Second Eliza clone"]'::jsonb)
    `);

    await db.execute(sql`
      INSERT INTO agents (id, name, username, bio)
      VALUES (${elizaClone3}, 'Eliza', 'eliza_clone3', '["Third Eliza clone"]'::jsonb)
    `);

    // Step 6: Verify all Eliza instances exist
    const elizas = await db.execute<{
      id: string;
      name: string;
      username: string;
      bio: any;
    }>(
      sql`SELECT id, name, username, bio FROM agents WHERE name = 'Eliza' ORDER BY created_at`,
    );

    expect(elizas.rows.length).toBe(4); // 1 original + 3 clones
    const elizaIds = elizas.rows.map((e) => e.id);
    expect(new Set(elizaIds).size).toBe(4); // All unique IDs

    // Verify each is distinct by username
    const elizaUsernames = elizas.rows.map((e) => e.username);
    expect(elizaUsernames).toContain("eliza_prod");
    expect(elizaUsernames).toContain("eliza_clone1");
    expect(elizaUsernames).toContain("eliza_clone2");
    expect(elizaUsernames).toContain("eliza_clone3");

    // Step 7: Verify CRUD operations work correctly on duplicate-name agents
    // Update one Eliza
    await db.execute(sql`
      UPDATE agents 
      SET bio = '["Updated Eliza clone 1"]'::jsonb
      WHERE id = ${elizaClone1}
    `);

    const updatedEliza = await db.execute<{ bio: any }>(sql`
      SELECT bio FROM agents WHERE id = ${elizaClone1}
    `);

    expect(updatedEliza.rows[0].bio).toContain("Updated Eliza clone 1");

    // Delete one Eliza
    await db.execute(sql`DELETE FROM agents WHERE id = ${elizaClone2}`);

    const remainingElizas = await db.execute<{ count: number }>(sql`
      SELECT COUNT(*) as count FROM agents WHERE name = 'Eliza'
    `);
    expect(Number(remainingElizas.rows[0].count)).toBe(3);
```