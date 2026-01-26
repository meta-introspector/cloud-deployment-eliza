# a7046c18:packages_plugin-sql_src___tests___migration_initialization-with-plugin.test.ts:601-658

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/initialization-with-plugin.test.ts:601-658
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        const marketResult = await db.execute(
          sql.raw(
            `SELECT * FROM polymarket.markets WHERE condition_id = '${testConditionId}'`,
          ),
        );
        const tokenResult = await db.execute(
          sql.raw(
            `SELECT * FROM polymarket.tokens WHERE condition_id = '${testConditionId}'`,
          ),
        );

        expect(marketResult.rows.length).toBe(1);
        expect(tokenResult.rows.length).toBe(1);
        expect(transactionSucceeded).toBe(true);
        console.log("✅ Transaction committed successfully");

        // Clean up
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
      } catch (error) {
        console.error("❌ Transaction test failed:", error);
        throw error;
      }
    });

    it("should correctly use schema-qualified table names in queries", async () => {
      console.log("\n🔍 Testing schema qualification...\n");

      // Test that Drizzle generates correct SQL with schema prefix
      const { polymarketMarketsTable } = await import(
        "../fixtures/test-plugin-schema"
      );

      // Use Drizzle's query builder to verify it generates correct SQL
      const query = db
        .select()
        .from(polymarketMarketsTable)
        .where(sql`active = true`)
        .limit(1)
        .toSQL();

      console.log("Generated SQL:", query.sql);

      // Verify the SQL includes the schema qualification
      expect(query.sql).toContain("polymarket");
      expect(query.sql).toMatch(/"polymarket"\."markets"/);
      console.log("✅ Schema qualification verified in generated SQL");
    });
  });
});
```