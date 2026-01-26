# a7046c18:packages_plugin-sql_src___tests___migration_production-scenario.test.ts:601-619

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/production-scenario.test.ts:601-619
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
        );
      }

      // Introspect the database
      const snapshot = await introspector.introspectSchema("public");

      // Verify all tables were captured
      expect(Object.keys(snapshot.tables)).toHaveLength(tableCount);

      // Verify data exists
      for (let i = 0; i < tableCount; i++) {
        const result = await db.execute(
          sql.raw(`SELECT COUNT(*) as count FROM table_${i}`),
        );
        expect(Number(result.rows[0].count)).toBe(1);
      }
    });
  });
});
```