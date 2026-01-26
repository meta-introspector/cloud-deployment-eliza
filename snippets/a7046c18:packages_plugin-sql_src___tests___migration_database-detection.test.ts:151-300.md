# a7046c18:packages_plugin-sql_src___tests___migration_database-detection.test.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/database-detection.test.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      for (const url of urls) {
        expect(migrator.testIsRealPostgresDatabase(url)).toBe(true);
      }
    });
  });

  describe("Invalid/Non-PostgreSQL Connection Strings", () => {
    it("should reject PGLite connection strings", () => {
      const urls = [
        "pglite://localhost/mydb",
        "/path/to/pglite/database",
        "./pglite/data",
        "/home/user/pglite/db",
      ];

      for (const url of urls) {
        expect(migrator.testIsRealPostgresDatabase(url)).toBe(false);
      }
    });

    it("should reject in-memory database strings", () => {
      const urls = [
        ":memory:",
        "sqlite::memory:",
        "postgres://:memory:",
        "postgresql://localhost:5432/:memory:",
        "file::memory:?cache=shared",
      ];

      for (const url of urls) {
        expect(migrator.testIsRealPostgresDatabase(url)).toBe(false);
      }
    });

    it("should reject SQLite connection strings", () => {
      const urls = [
        "sqlite:///path/to/database.db",
        "sqlite3:///home/user/data.db",
        "/path/to/database.sqlite",
        "./data/app.db",
        "database.db",
        "myapp.sqlite",
        "data.sqlite3",
      ];

      for (const url of urls) {
        expect(migrator.testIsRealPostgresDatabase(url)).toBe(false);
      }
    });

    it("should reject file-based database paths", () => {
      const urls = [
        "/absolute/path/to/data.db",
        "./relative/path/to/data.sqlite",
        "../parent/database.db",
        "database.db",
        "local.sqlite3",
      ];

      for (const url of urls) {
        expect(migrator.testIsRealPostgresDatabase(url)).toBe(false);
      }
    });

    it("should reject empty or invalid strings", () => {
      const urls = ["", " ", "   ", "\n", "\t"];

      for (const url of urls) {
        expect(migrator.testIsRealPostgresDatabase(url)).toBe(false);
      }
    });

    it("should reject MySQL connection strings", () => {
      const urls = [
        "mysql://user:password@localhost:3306/mydb",
        "mysql://localhost/database",
        "mysqli://user@host/db",
      ];

      for (const url of urls) {
        expect(migrator.testIsRealPostgresDatabase(url)).toBe(false);
      }
    });

    it("should reject MongoDB connection strings", () => {
      const urls = [
        "mongodb://localhost:27017/mydb",
        "mongodb+srv://user:pass@cluster.mongodb.net/db",
        "mongodb://user:password@host1:27017,host2:27017/database",
      ];

      for (const url of urls) {
        expect(migrator.testIsRealPostgresDatabase(url)).toBe(false);
      }
    });
  });

  describe("Edge Cases", () => {
    it("should handle URLs with special characters in credentials", () => {
      const urls = [
        "postgres://user%40example:p%40ssw0rd@localhost:5432/mydb", // @ symbol encoded
        "postgresql://user:p@$$w0rd!@localhost:5432/mydb",
        "postgres://user\\with\\backslash:pass@localhost/db",
      ];

      for (const url of urls) {
        expect(migrator.testIsRealPostgresDatabase(url)).toBe(true);
      }
    });

    it("should handle URLs with unusual database names", () => {
      const urls = [
        "postgres://localhost:5432/my-db-name",
        "postgresql://localhost:5432/my_db_name_123",
        "postgres://localhost:5432/DB",
        "localhost:5432/test-db_2024",
      ];

      for (const url of urls) {
        expect(migrator.testIsRealPostgresDatabase(url)).toBe(true);
      }
    });

    it("should handle URLs with IPv6 addresses", () => {
      const urls = [
        "postgres://[::1]:5432/mydb",
        "postgresql://user:pass@[2001:db8::1]:5432/database",
        "postgres://[fe80::1%lo0]:5432/localdb",
      ];

      for (const url of urls) {
        expect(migrator.testIsRealPostgresDatabase(url)).toBe(true);
      }
    });

    it("should be case-insensitive for detection", () => {
      const urls = [
        "POSTGRES://LOCALHOST:5432/MYDB",
        "PostgreSQL://Host:5432/Database",
        "postgres://SUPABASE.com/db",
        "POSTGRESQL://NEON.TECH/database",
        "HOST=localhost DBNAME=mydb",
      ];

      for (const url of urls) {
        expect(migrator.testIsRealPostgresDatabase(url)).toBe(true);
      }
    });

    it("should handle whitespace appropriately", () => {
```