# a7046c18:packages_plugin-sql_src___tests___migration_schema-evolution-tests_01-drop-column-with-data.test.ts:301-341

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/schema-evolution-tests/01-drop-column-with-data.test.ts:301-341
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    // Test 5: Force migration with options (alternative method)
    delete process.env.ELIZA_ALLOW_DESTRUCTIVE_MIGRATIONS;

    console.log("\n⚠️  Testing with force option...");
    await migrator.migrate("@elizaos/production-schema-v1", schemaV2, {
      force: true,
      allowDataLoss: true,
    });
    console.log("  ✅ Migration allowed with force option");

    // Verify column was dropped
    const columnsAfter = await db.execute(
      sql`SELECT column_name FROM information_schema.columns 
          WHERE table_name = 'agents' AND table_schema = 'public'`,
    );

    const columnNames = columnsAfter.rows.map((r: any) => r.column_name);
    expect(columnNames).not.toContain("username");

    console.log("\n📊 Schema after migration:");
    console.log(`  ✅ Agent table columns: ${columnNames.length}`);
    console.log("  ❌ Username column has been dropped");

    // Verify related data is intact
    const agentsAfterCount = await db.execute(
      sql`SELECT COUNT(*) as count FROM agents`,
    );
    const memoriesAfterCount = await db.execute(
      sql`SELECT COUNT(*) as count FROM memories`,
    );

    console.log("\n✅ Data integrity check:");
    console.log(
      `  - Agents preserved: ${(agentsAfterCount.rows[0] as CountRow).count}`,
    );
    console.log(
      `  - Memories preserved: ${(memoriesAfterCount.rows[0] as CountRow).count}`,
    );
    console.log("  - Username data: PERMANENTLY LOST");
  });
});
```