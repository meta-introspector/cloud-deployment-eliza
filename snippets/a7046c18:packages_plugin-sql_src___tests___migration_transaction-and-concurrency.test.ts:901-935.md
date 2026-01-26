# a7046c18:packages_plugin-sql_src___tests___migration_transaction-and-concurrency.test.ts:901-935

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/transaction-and-concurrency.test.ts:901-935
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        // and both will try to acquire the lock
        const [result1, result2] = await Promise.allSettled([
          migrator1.migrate(pluginName, schema1),
          migrator2.migrate(pluginName, schema2),
        ]);

        // Both should succeed (one creates, one is skipped by double-check)
        expect(result1.status).toBe("fulfilled");
        expect(result2.status).toBe("fulfilled");

        // Should have exactly one migration record
        const migrationCount = await db.execute(
          sql.raw(`SELECT COUNT(*) as count FROM migrations._migrations 
                 WHERE plugin_name = '${pluginName}'`),
        );
        expect(
          parseInt(String((migrationCount.rows[0] as CountRow).count), 10),
        ).toBe(1);

        // Table should exist
        const tableExists = await db.execute(
          sql.raw(`SELECT EXISTS (
          SELECT FROM information_schema.tables
          WHERE table_schema = 'public' AND table_name = 'test_race_null_initial'
        )`),
        );
        expect(tableExists.rows[0]?.exists).toBe(true);

        // Verify the double-check logic worked by checking logs
        // (In a real scenario, we'd check that one process logged
        // "Migration completed by another process")
      },
    );
  });
});
```