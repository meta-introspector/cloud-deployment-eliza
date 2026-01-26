# a7046c18:packages_plugin-sql_src___tests___migration_initialization-with-plugin.test.ts:451-600

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/initialization-with-plugin.test.ts:451-600
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
            conditionId: testConditionId,
            questionId: `updated_question_${Date.now()}`,
            marketSlug: "updated-market-slug",
            question: "Updated test market question?",
            category: "Updated",
            active: false,
            closed: true,
            secondsDelay: 5,
            createdAt: new Date(),
            updatedAt: new Date(),
            lastSyncedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: polymarketMarketsTable.conditionId,
            set: {
              question: "Updated test market question?",
              active: false,
              closed: true,
              updatedAt: new Date(),
            },
          });
        console.log("✅ Upsert operation completed");

        // Verify the update
        const updatedMarket = await db.execute(
          sql.raw(
            `SELECT * FROM polymarket.markets WHERE condition_id = '${testConditionId}'`,
          ),
        );
        expect(updatedMarket.rows[0].question).toBe(
          "Updated test market question?",
        );
        expect(updatedMarket.rows[0].active).toBe(false);
        expect(updatedMarket.rows[0].closed).toBe(true);
        console.log("✅ Upsert verified");

        // Clean up test data
        console.log("Cleaning up test data...");
        await db.execute(
          sql.raw(
            `DELETE FROM polymarket.rewards WHERE condition_id = '${testConditionId}'`,
          ),
        );
        await db.execute(
          sql.raw(
            `DELETE FROM polymarket.tokens WHERE condition_id = '${testConditionId}'`,
          ),
        );
        await db.execute(
          sql.raw(
            `DELETE FROM polymarket.markets WHERE condition_id = '${testConditionId}'`,
          ),
        );
        console.log("✅ Test data cleaned up");
      } catch (error) {
        console.error("❌ Write/Read test failed:", error);
        if (error instanceof Error) {
          console.error("Error message:", error.message);
          console.error("Stack trace:", error.stack);
        }
        throw error;
      }
    });

    it("should handle foreign key constraints correctly", async () => {
      console.log("\n🔍 Testing foreign key constraints...\n");

      const { polymarketMarketsTable, polymarketTokensTable } = await import(
        "../fixtures/test-plugin-schema"
      );

      // Try to insert a token with non-existent conditionId (should fail)
      const invalidConditionId = `non_existent_${Date.now()}`;
      const tokenId = `test_token_${Date.now()}`;

      try {
        await db.insert(polymarketTokensTable).values({
          id: sql`gen_random_uuid()`,
          tokenId: tokenId,
          conditionId: invalidConditionId,
          outcome: "YES",
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        // If we get here, the foreign key constraint didn't work
        throw new Error(
          "Foreign key constraint should have prevented this insert",
        );
      } catch (error: any) {
        // This is expected - foreign key violation
        console.log("✅ Foreign key constraint working correctly");

        // In PGLite, the actual error is in the cause property
        const errorMessage = error.cause?.message || error.message;

        // The error should be a foreign key violation
        const isValidForeignKeyError =
          errorMessage.includes("violates foreign key constraint") ||
          (error.message.includes("Failed query") &&
            error.message.includes('insert into "polymarket"."tokens"') &&
            !error.message.includes(
              "Foreign key constraint should have prevented this insert",
            ));

        expect(isValidForeignKeyError).toBe(true);
      }
    });

    it("should handle transactions correctly across schema boundaries", async () => {
      console.log("\n🔍 Testing transactions with polymarket schema...\n");

      const { polymarketMarketsTable, polymarketTokensTable } = await import(
        "../fixtures/test-plugin-schema"
      );

      const testConditionId = `tx_test_${Date.now()}`;
      let transactionSucceeded = false;

      try {
        await db.transaction(async (tx: any) => {
          // Insert market
          await tx.insert(polymarketMarketsTable).values({
            id: sql`gen_random_uuid()`,
            conditionId: testConditionId,
            questionId: "tx_question",
            marketSlug: "tx-test",
            question: "Transaction test?",
            active: true,
            closed: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            lastSyncedAt: new Date(),
          });

          // Insert token
          await tx.insert(polymarketTokensTable).values({
            id: sql`gen_random_uuid()`,
            tokenId: `tx_token_${Date.now()}`,
            conditionId: testConditionId,
            outcome: "YES",
            createdAt: new Date(),
            updatedAt: new Date(),
          });

          transactionSucceeded = true;
          console.log("✅ Transaction operations completed");
        });

        // Verify both inserts succeeded
```