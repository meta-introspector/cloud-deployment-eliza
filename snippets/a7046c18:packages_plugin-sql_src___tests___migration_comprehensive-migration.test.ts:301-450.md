# a7046c18:packages_plugin-sql_src___tests___migration_comprehensive-migration.test.ts:301-450

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/comprehensive-migration.test.ts:301-450
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
            ('550e8400-e29b-41d4-a716-446655440000', 'test-entity')`,
      );

      // Insert vector embedding
      const testVector = Array(384)
        .fill(0)
        .map(() => Math.random())
        .join(",");
      await db.execute(
        sql`INSERT INTO public.vector_embeddings (entity_id, dim_384) VALUES 
            ('550e8400-e29b-41d4-a716-446655440000', '[${sql.raw(testVector)}]')`,
      );

      // Test vector similarity query
      const result = await db.execute(
        sql`SELECT entity_id, dim_384 <=> '[${sql.raw(testVector)}]' as distance 
            FROM public.vector_embeddings 
            WHERE dim_384 IS NOT NULL 
            ORDER BY distance 
            LIMIT 1`,
      );

      expect(result.rows).toHaveLength(1);
      const row = result.rows[0] as AgentRow;
      expect(row.entity_id).toBe("550e8400-e29b-41d4-a716-446655440000");
      expect(row.distance).toBe(0); // Same vector should have distance 0
    });
  });

  describe("Data Integrity", () => {
    it("should enforce foreign key constraints", async () => {
      // Try to insert dependent entity with non-existent base_id
      let errorThrown = false;
      try {
        await db.execute(
          sql`INSERT INTO public.dependent_entities (base_id, type) VALUES 
              ('99999999-9999-9999-9999-999999999999', 'test')`,
        );
      } catch (_error) {
        errorThrown = true;
      }
      expect(errorThrown).toBe(true);
    });

    it("should enforce unique constraints", async () => {
      // Insert a base entity
      await db.execute(
        sql`INSERT INTO public.base_entities (id, name) VALUES 
            ('550e8400-e29b-41d4-a716-446655440001', 'unique-test')`,
      );

      // Try to insert another with the same name
      let errorThrown = false;
      try {
        await db.execute(
          sql`INSERT INTO public.base_entities (id, name) VALUES 
              ('550e8400-e29b-41d4-a716-446655440002', 'unique-test')`,
        );
      } catch (_error) {
        errorThrown = true;
      }
      expect(errorThrown).toBe(true);
    });

    it("should enforce check constraints", async () => {
      // Insert base entity first
      await db.execute(
        sql`INSERT INTO public.base_entities (id, name) VALUES 
            ('550e8400-e29b-41d4-a716-446655440003', 'check-test')`,
      );

      // Try to insert dependent with negative value (should fail)
      let errorThrown = false;
      try {
        await db.execute(
          sql`INSERT INTO public.dependent_entities (base_id, type, value) VALUES 
              ('550e8400-e29b-41d4-a716-446655440003', 'test', -1)`,
        );
      } catch (_error) {
        errorThrown = true;
      }
      expect(errorThrown).toBe(true);
    });
  });

  describe("Edge Cases", () => {
    it("should handle idempotent migrations (running same migration twice)", async () => {
      // Run migration again - should not fail
      let errorThrown = false;
      let _errorDetails: any = null;
      try {
        await migrator.migrate("test-plugin", testSchema, { verbose: true });
      } catch (error) {
        errorThrown = true;
        _errorDetails = error;
        console.error("[TEST] Idempotent migration failed:", error);
      }
      expect(errorThrown).toBe(false);

      // Tables should still exist
      const result = await db.execute(
        sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`,
      );
      expect(result.rows.length).toBeGreaterThanOrEqual(4);
    });

    it("should handle empty schema gracefully", async () => {
      let errorThrown = false;
      let _errorDetails: any = null;
      try {
        await migrator.migrate("empty-plugin", {}, { verbose: true });
      } catch (error) {
        errorThrown = true;
        _errorDetails = error;
        console.error("[TEST] Empty schema migration failed:", error);
      }
      expect(errorThrown).toBe(false);
    });

    it("should handle schema with non-table exports", async () => {
      // Create a simple table just for this test to avoid conflicts
      const testMixedTable = pgTable("mixed_test_table", {
        id: uuid("id").primaryKey().defaultRandom(),
        name: text("name").notNull(),
        created_at: timestamp("created_at", { withTimezone: true })
          .default(sql`now()`)
          .notNull(),
      });

      const mixedSchema = {
        testMixedTable,
        someConstant: "not-a-table",
        someFunction: () => "also-not-a-table",
        someObject: { notATable: true },
      };

      let errorThrown = false;
      let _errorDetails: any = null;
      try {
        await migrator.migrate("mixed-plugin", mixedSchema, { verbose: true });
      } catch (error) {
        errorThrown = true;
        _errorDetails = error;
        console.error("[TEST] Mixed schema migration failed:", error);
      }
      expect(errorThrown).toBe(false);

      // Should only create the actual table
      const result = await db.execute(
        sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`,
```