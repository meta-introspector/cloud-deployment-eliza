# a7046c18:packages_plugin-sql_src___tests___migration_database-detection.test.ts:301-347

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/database-detection.test.ts:301-347
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      // URLs with leading/trailing whitespace
      expect(
        migrator.testIsRealPostgresDatabase(
          "  postgres://localhost:5432/mydb  ",
        ),
      ).toBe(true);
      expect(
        migrator.testIsRealPostgresDatabase("\tpostgresql://localhost/db\n"),
      ).toBe(true);
      expect(
        migrator.testIsRealPostgresDatabase("  localhost:5432/mydb  "),
      ).toBe(true);

      // But reject truly empty strings
      expect(migrator.testIsRealPostgresDatabase("   ")).toBe(false);
    });
  });

  describe("Security Considerations", () => {
    it("should not be fooled by PostgreSQL keywords in non-PostgreSQL URLs", () => {
      // These contain PostgreSQL keywords but are not real PostgreSQL databases
      const urls = [
        "sqlite:///path/with/postgres/in/it.db",
        "mongodb://postgres.example.com:27017/db", // MongoDB on a host named postgres
        "file:///data/postgresql/backup.sqlite",
        ":memory:?name=postgres",
      ];

      for (const url of urls) {
        expect(migrator.testIsRealPostgresDatabase(url)).toBe(false);
      }
    });

    it("should correctly identify PostgreSQL even with confusing paths", () => {
      // These are real PostgreSQL despite having potentially confusing elements
      const urls = [
        "postgres://user:pass@localhost:5432/sqlite_migration", // DB named after sqlite
        "postgresql://localhost:5432/memory_cache", // DB with "memory" in name
        "postgres://localhost:5432/file_storage", // DB with "file" in name
      ];

      for (const url of urls) {
        expect(migrator.testIsRealPostgresDatabase(url)).toBe(true);
      }
    });
  });
});
```