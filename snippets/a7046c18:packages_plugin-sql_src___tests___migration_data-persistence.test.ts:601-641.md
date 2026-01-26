# a7046c18:packages_plugin-sql_src___tests___migration_data-persistence.test.ts:601-641

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/data-persistence.test.ts:601-641
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        user_id: uuid("user_id"), // New column
        session_id: text("session_id"), // New column
        processed: boolean("processed").default(false), // New column
      });

      const schema = { events: eventsTable };

      // Run migration
      await migrator.migrate("@elizaos/plugin-sql", schema, {
        verbose: false,
        force: true,
      });

      // Verify all data is preserved
      const finalCount = await db.execute(
        sql`SELECT COUNT(*) as count FROM events`,
      );
      expect(Number(finalCount.rows[0].count)).toBe(1000);

      // Spot check some records
      const sample = await db.execute(sql`
        SELECT * FROM events 
        WHERE id IN (1, 100, 500, 999, 1000)
        ORDER BY id
      `);

      expect(sample.rows).toHaveLength(5);
      for (const row of sample.rows) {
        expect(row.event_type).toBeDefined();
        expect(row.payload).toBeDefined();
        expect(row.created_at).toBeDefined();
        expect(row.processed).toBe(false); // New column default
      }

      // Verify migration completed successfully
      const status = await migrator.getStatus("@elizaos/plugin-sql");
      expect(status.hasRun).toBe(true);
      expect(status.lastMigration).toBeDefined();
    });
  });
});
```