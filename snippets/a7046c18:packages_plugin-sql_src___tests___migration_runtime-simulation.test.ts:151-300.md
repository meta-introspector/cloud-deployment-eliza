# a7046c18:packages_plugin-sql_src___tests___migration_runtime-simulation.test.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/runtime-simulation.test.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      `\n📋 Polymarket migration records: ${polymarketMigrationCheck.rows.length}`,
    );
    expect(polymarketMigrationCheck.rows.length).toBe(1);

    const polymarketMigration = polymarketMigrationCheck.rows[0] as any;
    console.log("Polymarket migration details:");
    console.log("  - Plugin:", polymarketMigration.plugin_name);
    console.log("  - Hash:", polymarketMigration.hash);
    console.log("  - Created:", polymarketMigration.created_at);

    // Check snapshots for polymarket
    const polymarketSnapshots = await db.execute(sql`
      SELECT * FROM migrations._snapshots 
      WHERE plugin_name = 'polymarket'
      ORDER BY id DESC
    `);
    console.log(
      `\n📸 Polymarket snapshots: ${polymarketSnapshots.rows.length}`,
    );

    // Verify polymarket schema and tables
    const polymarketSchemaExists = await db.execute(sql`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.schemata 
        WHERE schema_name = 'polymarket'
      ) as exists
    `);
    expect(polymarketSchemaExists.rows[0]?.exists).toBe(true);
    console.log("\n✅ Polymarket schema created");

    const polymarketTables = await db.execute(sql`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'polymarket' 
      ORDER BY tablename
    `);
    const polymarketTableNames = polymarketTables.rows.map(
      (r: any) => r.tablename,
    );
    console.log(`📦 Polymarket tables: ${polymarketTableNames.length}`);
    console.log("Tables:", polymarketTableNames.join(", "));

    console.log(`\n${"=".repeat(80)}`);
    console.log("STEP 4: Verify Complete Migration State");
    console.log("=".repeat(80));

    // Check total migration records (should be 2: core + polymarket)
    const allMigrations = await db.execute(sql`
      SELECT 
        plugin_name,
        hash,
        created_at
      FROM migrations._migrations 
      ORDER BY created_at ASC
    `);

    console.log(`\n📊 Total migration records: ${allMigrations.rows.length}`);
    expect(allMigrations.rows.length).toBe(2);

    console.log("\nAll migrations:");
    for (const migration of allMigrations.rows as MigrationRow[]) {
      console.log(
        `  - ${migration.plugin_name}: ${migration.hash} (${migration.created_at})`,
      );
    }

    // Check journal entries (if table exists)
    try {
      const journalEntries = await db.execute(sql`
        SELECT * FROM migrations._journal 
        ORDER BY id ASC
      `);

      console.log(`\n📓 Journal entries: ${journalEntries.rows.length}`);
      for (const entry of journalEntries.rows as JournalRow[]) {
        console.log(`  - Journal entry:`, entry);
      }
    } catch (_err) {
      console.log("\n📓 Journal table not available or empty");
    }

    // Verify snapshot content for polymarket
    const latestPolymarketSnapshot = await db.execute(sql`
      SELECT * FROM migrations._snapshots 
      WHERE plugin_name = 'polymarket'
      ORDER BY id DESC
      LIMIT 1
    `);

    if (latestPolymarketSnapshot.rows.length > 0) {
      const snapshot = latestPolymarketSnapshot.rows[0] as SnapshotRow;

      try {
        const snapshotData =
          typeof snapshot.snapshot === "string"
            ? JSON.parse(snapshot.snapshot)
            : snapshot.snapshot;

        console.log("\n🔍 Polymarket Snapshot Analysis:");
        console.log("  - Version:", snapshotData.version);
        console.log("  - Dialect:", snapshotData.dialect);
        console.log(
          "  - Tables:",
          Object.keys(snapshotData.tables || {}).length,
        );
        console.log(
          "  - Table names:",
          Object.keys(snapshotData.tables || {}).join(", "),
        );

        // Check if tables are correctly namespaced
        for (const tableName of Object.keys(snapshotData.tables || {})) {
          expect(tableName).toMatch(/^polymarket\./);
          console.log(`    ✓ ${tableName} is correctly namespaced`);
        }
      } catch (_e) {
        console.log("\n🔍 Polymarket Snapshot (raw):", snapshot.snapshot);
      }
    }

    console.log(`\n${"=".repeat(80)}`);
    console.log("STEP 5: Test Migration Status Methods");
    console.log("=".repeat(80));

    // Test getStatus for both plugins
    const coreStatus = await migrator.getStatus("@elizaos/plugin-sql");
    const polymarketStatus = await migrator.getStatus("polymarket");

    console.log("\n📈 Migration Status:");
    console.log("Core (@elizaos/plugin-sql):");
    console.log("  - Has Run:", coreStatus.hasRun);
    console.log("  - Snapshots:", coreStatus.snapshots);
    console.log("  - Last Migration:", coreStatus.lastMigration);

    console.log("\nPolymarket:");
    console.log("  - Has Run:", polymarketStatus.hasRun);
    console.log("  - Snapshots:", polymarketStatus.snapshots);
    console.log("  - Last Migration:", polymarketStatus.lastMigration);

    expect(coreStatus.hasRun).toBe(true);
    expect(polymarketStatus.hasRun).toBe(true);

    console.log(`\n${"=".repeat(80)}`);
    console.log("STEP 6: Simulate Re-initialization (Idempotency Check)");
    console.log("=".repeat(80));

    // Create a new migrator instance (simulating restart)
    const migrator2 = new RuntimeMigrator(db);
    await migrator2.initialize();

    // Try to migrate again - should skip both
```