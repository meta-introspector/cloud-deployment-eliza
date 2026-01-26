# a7046c18:packages_plugin-sql_src___tests___migration_schema-evolution-tests_01-drop-column-with-data.test.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/schema-evolution-tests/01-drop-column-with-data.test.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        metadata: { type: "fragment", documentId: "doc1", position: 1 },
        unique: true,
      },
      {
        id: "770e8400-e29b-41d4-a716-446655440002",
        agentId: "550e8400-e29b-41d4-a716-446655440002",
        entityId: "660e8400-e29b-41d4-a716-446655440002",
        type: "fact",
        content: { data: "Analysis result", confidence: 0.95 },
        metadata: { type: "document", timestamp: new Date().toISOString() },
        unique: true,
      },
    ]);

    // Verify data was inserted
    const agentsBeforeCount = await db.execute(
      sql`SELECT COUNT(*) as count FROM agents`,
    );
    const memoriesBeforeCount = await db.execute(
      sql`SELECT COUNT(*) as count FROM memories`,
    );

    console.log("\n📊 Production data statistics:");
    console.log(`  - Agents: ${(agentsBeforeCount.rows[0] as CountRow).count}`);
    console.log(
      `  - Memories: ${(memoriesBeforeCount.rows[0] as CountRow).count}`,
    );

    // Check usernames exist
    const usernameCheck = await db.execute(
      sql`SELECT name, username FROM agents WHERE username IS NOT NULL`,
    );
    console.log(`  - Agents with usernames: ${usernameCheck.rows.length}`);
    usernameCheck.rows.forEach((row: any) => {
      console.log(`    • ${row.name}: @${row.username}`);
    });

    // Now create V2 schema WITHOUT username column (destructive change!)
    // We need to recreate the agent table definition without username
    const { pgTable, text, uuid, boolean, timestamp, jsonb, unique } =
      await import("drizzle-orm/pg-core");

    const agentTableV2 = pgTable(
      "agents",
      {
        id: uuid("id").primaryKey().defaultRandom(),
        enabled: boolean("enabled").default(true).notNull(),
        createdAt: timestamp("created_at", { withTimezone: true })
          .default(sql`now()`)
          .notNull(),
        updatedAt: timestamp("updated_at", { withTimezone: true })
          .default(sql`now()`)
          .notNull(),
        name: text("name").notNull(),
        // username: text('username'), // REMOVED - destructive change!
        system: text("system").default(""),
        bio: jsonb("bio").$type<string | string[]>().default(sql`'[]'::jsonb`),
        messageExamples: jsonb("message_examples")
          .default(sql`'[]'::jsonb`)
          .notNull(),
        postExamples: jsonb("post_examples")
          .default(sql`'[]'::jsonb`)
          .notNull(),
        topics: jsonb("topics").default(sql`'[]'::jsonb`).notNull(),
        adjectives: jsonb("adjectives").default(sql`'[]'::jsonb`).notNull(),
        knowledge: jsonb("knowledge").default(sql`'[]'::jsonb`).notNull(),
        plugins: jsonb("plugins").default(sql`'[]'::jsonb`).notNull(),
        settings: jsonb("settings").default(sql`'{}'::jsonb`).notNull(),
        style: jsonb("style").default(sql`'{}'::jsonb`).notNull(),
      },
      (table) => ({
        nameUnique: unique("name_unique").on(table.name),
      }),
    );

    const schemaV2 = {
      ...schemaV1,
      agents: agentTableV2, // Replace with version without username
    };

    // Test 1: Check migration for data loss warnings
    console.log("\n🔍 Checking migration for data loss...");
    const dataLossCheck = await migrator.checkMigration(
      "@elizaos/production-schema-v1",
      schemaV2,
    );

    if (dataLossCheck) {
      expect(dataLossCheck.hasDataLoss).toBe(true);
      expect(dataLossCheck.requiresConfirmation).toBe(true);
      expect(dataLossCheck.warnings).toContain(
        'Column "username" in table "public.agents" will be dropped',
      );

      console.log("\n⚠️  Data Loss Detection:");
      dataLossCheck.warnings.forEach((warning) => {
        console.log(`  ❌ ${warning}`);
      });
    }

    // Test 2: Attempt migration without environment variable (should fail even in development)
    process.env.NODE_ENV = "development";
    delete process.env.ELIZA_ALLOW_DESTRUCTIVE_MIGRATIONS;

    console.log("\n🛡️  Testing protection without environment variable...");
    let blockedError: Error | null = null;
    try {
      await migrator.migrate("@elizaos/production-schema-v1", schemaV2);
    } catch (error) {
      blockedError = error as Error;
    }

    expect(blockedError).not.toBeNull();
    expect(blockedError?.message).toContain("Destructive migration blocked");
    expect(blockedError?.message).toContain(
      "ELIZA_ALLOW_DESTRUCTIVE_MIGRATIONS",
    );
    console.log(`  ✅ Migration blocked: ${blockedError?.message}`);

    // Test 3: Production mode should also block (even with more warnings)
    process.env.NODE_ENV = "production";

    console.log("\n🛡️  Testing production protection...");
    let productionError: Error | null = null;
    try {
      await migrator.migrate("@elizaos/production-schema-v1", schemaV2);
    } catch (error) {
      productionError = error as Error;
    }

    expect(productionError).not.toBeNull();
    expect(productionError?.message).toContain("production");
    expect(productionError?.message).toContain(
      "ELIZA_ALLOW_DESTRUCTIVE_MIGRATIONS",
    );
    console.log(
      `  ✅ Production blocked: ${productionError?.message.substring(0, 80)}...`,
    );

    // Test 4: Allow migration with environment variable
    process.env.NODE_ENV = "development";
    process.env.ELIZA_ALLOW_DESTRUCTIVE_MIGRATIONS = "true";

    console.log("\n⚠️  Testing with ELIZA_ALLOW_DESTRUCTIVE_MIGRATIONS=true...");
    await migrator.migrate("@elizaos/production-schema-v1", schemaV2);
    console.log("  ✅ Migration allowed with environment variable");

    // Reset for next test
    await migrator.migrate("@elizaos/production-schema-v1", schemaV1);

```