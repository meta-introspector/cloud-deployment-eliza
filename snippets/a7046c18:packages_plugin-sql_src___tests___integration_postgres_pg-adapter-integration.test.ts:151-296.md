# a7046c18:packages_plugin-sql_src___tests___integration_postgres_pg-adapter-integration.test.ts:151-296

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/integration/postgres/pg-adapter-integration.test.ts:151-296
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        const connection = manager.getConnection();

        expect(connection).toBeDefined();
        expect(connection.query).toBeDefined();
      });

      it("should handle multiple operations", async () => {
        const db = adapter.getDatabase();

        // Execute multiple operations
        const results = await Promise.all([
          db.execute(sql`SELECT 1 as id`),
          db.execute(sql`SELECT 2 as id`),
          db.execute(sql`SELECT 3 as id`),
        ]);

        expect(results).toHaveLength(3);
        results.forEach((result, index) => {
          expect(result.rows[0].id).toBe(index + 1);
        });
      });
    });

    describe("Error Handling", () => {
      it("should handle query errors gracefully", async () => {
        const db = adapter.getDatabase();

        let errorThrown = false;
        try {
          await db.execute(sql`SELECT * FROM non_existent_table`);
        } catch (error) {
          errorThrown = true;
          expect(error).toBeDefined();
        }

        expect(errorThrown).toBe(true);
      });

      it("should maintain connection after error", async () => {
        const db = adapter.getDatabase();

        // Cause an error
        try {
          await db.execute(sql`INVALID SQL`);
        } catch (_e) {
          // Expected error
        }

        // Connection should still work
        const result = await db.execute(sql`SELECT 1 as value`);
        expect(result.rows[0].value).toBe(1);
      });
    });

    describe("Advanced Features", () => {
      it("should support JSON operations", async () => {
        const db = adapter.getDatabase();

        await db.execute(sql`
          CREATE TABLE IF NOT EXISTS json_test (
            id SERIAL PRIMARY KEY,
            data JSONB
          )
        `);

        try {
          const testData = { name: "test", values: [1, 2, 3] };

          await db.execute(sql`
            INSERT INTO json_test (data) VALUES (${JSON.stringify(testData)}::jsonb)
          `);

          const result = await db.execute(sql`
            SELECT data FROM json_test WHERE data->>'name' = 'test'
          `);

          expect(result.rows[0].data).toEqual(testData);
        } finally {
          await db.execute(sql`DROP TABLE IF EXISTS json_test`);
        }
      });

      it("should support array operations", async () => {
        const db = adapter.getDatabase();

        await db.execute(sql`
          CREATE TABLE IF NOT EXISTS array_test (
            id SERIAL PRIMARY KEY,
            tags TEXT[]
          )
        `);

        try {
          // PGLite requires array syntax
          await db.execute(sql`
            INSERT INTO array_test (tags) VALUES (ARRAY['tag1', 'tag2', 'tag3'])
          `);

          const result = await db.execute(sql`
            SELECT tags FROM array_test WHERE 'tag2' = ANY(tags)
          `);

          expect(result.rows[0].tags).toEqual(["tag1", "tag2", "tag3"]);
        } finally {
          await db.execute(sql`DROP TABLE IF EXISTS array_test`);
        }
      });

      it("should support timestamp operations", async () => {
        const db = adapter.getDatabase();

        const result = await db.execute(sql`
          SELECT 
            CURRENT_TIMESTAMP as current_time,
            CURRENT_TIMESTAMP + INTERVAL '1 day' as tomorrow,
            CURRENT_TIMESTAMP - INTERVAL '1 hour' as hour_ago
        `);

        const row = result.rows[0];
        expect(row.current_time).toBeDefined();
        expect(row.tomorrow).toBeDefined();
        expect(row.hour_ago).toBeDefined();
      });
    });

    describe("Adapter Shutdown", () => {
      it("should handle close gracefully", async () => {
        // Create a temporary adapter
        const tempClient = new PGlite();
        const tempManager = new PGliteClientManager(tempClient);
        const tempAdapter = new PgliteDatabaseAdapter(
          uuidv4() as UUID,
          tempManager,
        );
        await tempAdapter.init();

        // Close it
        await tempAdapter.close();

        // Should not be ready after close
        const isReady = await tempAdapter.isReady();
        expect(isReady).toBe(false);
      });
    });
  });
});
```