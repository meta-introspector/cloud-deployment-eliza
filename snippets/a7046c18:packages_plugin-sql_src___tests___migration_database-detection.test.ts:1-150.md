# a7046c18:packages_plugin-sql_src___tests___migration_database-detection.test.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/__tests__/migration/database-detection.test.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { describe, expect, it } from "bun:test";
import { RuntimeMigrator } from "../../runtime-migrator";
import type { DrizzleDB } from "../../runtime-migrator/types";

/**
 * Unit tests for the isRealPostgresDatabase method
 * Testing the improved database detection logic that handles various PostgreSQL connection formats
 */
describe("RuntimeMigrator - Database Detection", () => {
  // Create a test helper to access the private method
  // Since isRealPostgresDatabase is private, we'll test it through a minimal wrapper
  // Test interface for accessing private methods
  interface TestableRuntimeMigrator extends RuntimeMigrator {
    isRealPostgresDatabase(url: string): boolean;
  }

  class TestRuntimeMigrator extends RuntimeMigrator {
    constructor() {
      // Pass a dummy db object since we're only testing the detection logic
      // Use unknown cast since we're not actually using the db for this test
      super({} as unknown as DrizzleDB);
    }

    // Expose the private method for testing
    public testIsRealPostgresDatabase(url: string): boolean {
      return (
        this as unknown as TestableRuntimeMigrator
      ).isRealPostgresDatabase(url);
    }
  }

  const migrator = new TestRuntimeMigrator();

  describe("Valid PostgreSQL Connection Strings", () => {
    it("should detect standard postgres:// URLs", () => {
      const urls = [
        "postgres://user:password@localhost:5432/mydb",
        "postgres://user@localhost/mydb",
        "postgres://localhost/mydb",
        "POSTGRES://USER:PASSWORD@HOST:5432/DB", // Case insensitive
      ];

      for (const url of urls) {
        expect(migrator.testIsRealPostgresDatabase(url)).toBe(true);
      }
    });

    it("should detect standard postgresql:// URLs", () => {
      const urls = [
        "postgresql://user:password@localhost:5432/mydb",
        "postgresql://user@localhost/mydb",
        "postgresql://localhost/mydb",
        "POSTGRESQL://USER:PASSWORD@HOST:5432/DB", // Case insensitive
      ];

      for (const url of urls) {
        expect(migrator.testIsRealPostgresDatabase(url)).toBe(true);
      }
    });

    it("should detect cloud provider PostgreSQL URLs", () => {
      const urls = [
        // AWS RDS
        "postgresql://user:pass@myinstance.123456789012.us-east-1.rds.amazonaws.com:5432/mydb",
        "postgres://user:pass@mydb.cluster-abc123.us-west-2.rds.amazonaws.com:5432/prod",

        // Azure Database for PostgreSQL
        "postgresql://user@myserver:password@myserver.postgres.database.azure.com:5432/mydb?sslmode=require",

        // Google Cloud SQL
        "postgresql://user:password@127.0.0.1:5432/mydb?host=/cloudsql/project:region:instance",
        "postgres://user@35.201.123.45:5432/production?application_name=myapp",

        // Supabase
        "postgresql://postgres.abcdefghijklmnop:password@aws-0-us-west-1.pooler.supabase.com:5432/postgres",
        "postgres://user:pass@db.abcdefghijklmnop.supabase.co:5432/postgres",

        // Neon
        "postgresql://user:pass@ep-cool-name-123456.us-east-2.aws.neon.tech/neondb?sslmode=require",
        "postgres://user:pass@ep-name-123456.eu-central-1.aws.neon.tech/dbname",

        // DigitalOcean Managed Database
        "postgresql://doadmin:password@db-postgresql-nyc1-12345-do-user-123456-0.db.ondigitalocean.com:25060/defaultdb?sslmode=require",

        // Aiven
        "postgres://avnadmin:password@pg-123456-project.aivencloud.com:12345/defaultdb?sslmode=require",
        "postgresql://user:pass@my-pg-project-name.aiven.io:21234/mydb",

        // TimescaleDB Cloud
        "postgresql://tsdbadmin:password@abcdef123.a.timescaledb.io:31234/tsdb?sslmode=require",
        "postgres://user:pass@service.region.timescale.com:30000/tsdb",

        // CockroachDB (PostgreSQL-compatible)
        "postgresql://user:pass@free-tier.gcp-us-central1.cockroachlabs.cloud:26257/defaultdb?sslmode=require",
        "postgres://user@app-name-1234.cockroachlabs.cloud:26257/mydb",
      ];

      for (const url of urls) {
        expect(migrator.testIsRealPostgresDatabase(url)).toBe(true);
      }
    });

    it("should detect PostgreSQL URLs with special parameters", () => {
      const urls = [
        "postgres://user:pass@localhost:5432/mydb?sslmode=require",
        "postgresql://user:pass@localhost:5432/mydb?sslmode=require&connect_timeout=10",
        "postgres://user:pass@localhost:5432/mydb?application_name=myapp",
        "postgresql://user:pass@localhost:5432/mydb?sslmode=require&sslcert=client.crt&sslkey=client.key",
      ];

      for (const url of urls) {
        expect(migrator.testIsRealPostgresDatabase(url)).toBe(true);
      }
    });

    it("should detect host:port/database format without scheme", () => {
      const urls = [
        "localhost:5432/mydb",
        "192.168.1.1:5432/testdb",
        "db.example.com:5432/production",
        "postgres-server.local:5433/app_db",
        "10.0.0.50:5432/my_database",
      ];

      for (const url of urls) {
        expect(migrator.testIsRealPostgresDatabase(url)).toBe(true);
      }
    });

    it("should detect PostgreSQL connection string parameters", () => {
      const urls = [
        "host=localhost port=5432 dbname=mydb user=myuser password=mypass",
        "host=db.example.com port=5432 dbname=production sslmode=require",
        "host=192.168.1.1 dbname=testdb user=admin",
        "dbname=mydb host=localhost",
      ];

      for (const url of urls) {
        expect(migrator.testIsRealPostgresDatabase(url)).toBe(true);
      }
    });

    it("should detect alternative PostgreSQL ports", () => {
      const urls = [
        "postgres://localhost:5433/mydb",
        "postgresql://host:6543/database",
        "postgres://server:15432/db",
        "localhost:5433/mydb",
      ];

```