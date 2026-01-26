# a7046c18:packages_plugin-sql_src___tests___unit_migration-service.test.ts:151-162

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/unit/migration-service.test.ts:151-162
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

    it("should run migrations even with no plugins", async () => {
      // Initialize database
      await migrationService.initializeWithDatabase(mockDb);

      // Don't register any plugins

      // Run migrations
      await migrationService.runAllPluginMigrations();
    });
  });
});
```