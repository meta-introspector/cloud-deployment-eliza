# a7046c18:packages_plugin-sql_src___tests___migration_initialization-with-plugin.test.ts:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/initialization-with-plugin.test.ts:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
          SELECT 
            schemaname,
            COUNT(*) as table_count
          FROM pg_tables
          WHERE schemaname NOT IN ('pg_catalog', 'information_schema', 'pg_toast')
          GROUP BY schemaname
          ORDER BY schemaname
        `),
      );

      const counts = tableCountsResult.rows.reduce((acc: any, row: any) => {
        acc[row.schemaname] = parseInt(row.table_count, 10);
        return acc;
      }, {});

      console.log("Table counts per schema:", counts);

      // Core tables in public schema
      expect(counts.public).toBeGreaterThan(10); // Core has many tables

      // Plugin tables in polymarket schema
      expect(counts.polymarket).toBe(5); // markets, tokens, rewards, prices, sync_status

      // Migration tables
      expect(counts.migrations).toBe(3); // _migrations, _journal, _snapshots
    });
  });

  describe("Migration Status", () => {
    it("should provide accurate status for both core and plugin", async () => {
      const coreStatus = await migrator.getStatus("@elizaos/plugin-sql");
      const pluginStatus = await migrator.getStatus("polymarket");

      console.log("\nMigration Status:");
      console.log("Core:", {
        hasRun: coreStatus.hasRun,
        snapshots: coreStatus.snapshots,
      });
      console.log("Plugin:", {
        hasRun: pluginStatus.hasRun,
        snapshots: pluginStatus.snapshots,
      });

      expect(coreStatus.hasRun).toBe(true);
      expect(coreStatus.snapshots).toBeGreaterThan(0);

      expect(pluginStatus.hasRun).toBe(true);
      expect(pluginStatus.snapshots).toBeGreaterThan(0);
    });
  });

  describe("Polymarket Schema Write/Read Operations", () => {
    it("should successfully insert and read data from polymarket.markets table", async () => {
      console.log(
        "\n🔍 Testing write/read operations on polymarket schema...\n",
      );

      const testConditionId = `test_${testAgentId.slice(0, 8)}`;
      const testMarketId = testAgentId; // Use the test UUID

      // Direct insert using the polymarket schema tables
      try {
        // Import the actual schema tables
        const {
          polymarketMarketsTable,
          polymarketTokensTable,
          polymarketRewardsTable,
        } = await import("../fixtures/test-plugin-schema");

        // Test 1: Insert a market
        console.log("Inserting test market...");
        await db.insert(polymarketMarketsTable).values({
          id: testMarketId,
          conditionId: testConditionId,
          questionId: `test_question_${Date.now()}`,
          marketSlug: "test-market-slug",
          question: "Test market question?",
          category: "Test",
          active: true,
          closed: false,
          secondsDelay: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          lastSyncedAt: new Date(),
        });
        console.log("✅ Market inserted successfully");

        // Verify the insert with raw SQL to confirm schema
        const marketCheck = await db.execute(
          sql.raw(
            `SELECT * FROM polymarket.markets WHERE condition_id = '${testConditionId}'`,
          ),
        );
        expect(marketCheck.rows.length).toBe(1);
        expect(marketCheck.rows[0].condition_id).toBe(testConditionId);
        console.log("✅ Market verified via raw SQL");

        // Test 2: Insert tokens for the market
        const tokenId1 = `token_yes_${Date.now()}`;
        const tokenId2 = `token_no_${Date.now()}`;

        console.log("Inserting test tokens...");
        await db.insert(polymarketTokensTable).values([
          {
            id: sql`gen_random_uuid()`,
            tokenId: tokenId1,
            conditionId: testConditionId,
            outcome: "YES",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: sql`gen_random_uuid()`,
            tokenId: tokenId2,
            conditionId: testConditionId,
            outcome: "NO",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]);
        console.log("✅ Tokens inserted successfully");

        // Verify tokens
        const tokenCheck = await db.execute(
          sql.raw(
            `SELECT * FROM polymarket.tokens WHERE condition_id = '${testConditionId}'`,
          ),
        );
        expect(tokenCheck.rows.length).toBe(2);
        console.log("✅ Tokens verified via raw SQL");

        // Test 3: Insert reward config
        console.log("Inserting test reward config...");
        await db.insert(polymarketRewardsTable).values({
          id: sql`gen_random_uuid()`,
          conditionId: testConditionId,
          minSize: "100",
          maxSpread: "0.05",
          rewardEpoch: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        console.log("✅ Reward config inserted successfully");

        // Test 4: Test ON CONFLICT DO UPDATE (upsert)
        console.log("Testing upsert functionality...");
        await db
          .insert(polymarketMarketsTable)
          .values({
            id: sql`gen_random_uuid()`,
```