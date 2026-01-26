# a7046c18:packages_plugin-sql_src___tests___migration_runtime-simulation.test.ts:301-363

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/runtime-simulation.test.ts:301-363
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    console.log("\n🔄 Re-running migrations (should skip)...");

    await migrator2.migrate("@elizaos/plugin-sql", coreSchema, {
      verbose: false,
    });

    await migrator2.migrate("polymarket", testPolymarketSchema, {
      verbose: false,
    });

    // Verify still only 2 migration records
    const finalMigrationCount = await db.execute(sql`
      SELECT COUNT(*) as count FROM migrations._migrations
    `);

    console.log(
      `\n📊 Final migration count: ${finalMigrationCount.rows[0]?.count}`,
    );
    expect(Number(finalMigrationCount.rows[0]?.count)).toBe(2);

    // Final summary
    console.log(`\n${"=".repeat(80)}`);
    console.log("✅ MIGRATION SIMULATION COMPLETE");
    console.log("=".repeat(80));
    console.log("\nSummary:");
    console.log("  - Both migrations recorded: ✓");
    console.log("  - Core tables in public schema: ✓");
    console.log("  - Polymarket tables in polymarket schema: ✓");
    console.log("  - Snapshots created: ✓");
    console.log("  - Journal entries logged: ✓");
    console.log("  - Idempotency verified: ✓");
  });

  it("should handle plugin registration order correctly", async () => {
    console.log(`\n${"=".repeat(80)}`);
    console.log("Testing Plugin Registration Order");
    console.log("=".repeat(80));

    // Check if order matters for migration recording
    const migrationOrder = await db.execute(sql`
      SELECT 
        plugin_name,
        created_at,
        ROW_NUMBER() OVER (ORDER BY created_at ASC) as migration_order
      FROM migrations._migrations
      ORDER BY created_at ASC
    `);

    console.log("\nMigration Order:");
    for (const record of migrationOrder.rows as MigrationOrderRow[]) {
      console.log(
        `  ${record.migration_order}. ${record.plugin_name} at ${record.created_at}`,
      );
    }

    // Core should be migrated first
    const firstMigration = migrationOrder.rows[0] as MigrationOrderRow;
    expect(firstMigration.plugin_name).toBe("@elizaos/plugin-sql");

    const secondMigration = migrationOrder.rows[1] as MigrationOrderRow;
    expect(secondMigration.plugin_name).toBe("polymarket");
  });
});
```