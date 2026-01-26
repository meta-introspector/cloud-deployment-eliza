# a7046c18:packages_plugin-sql_src_runtime-migrator_runtime-migrator.ts:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/runtime-migrator/runtime-migrator.ts:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
    // This preserves uniqueness better than modulo and avoids collisions
    const mask63Bits = 0x7fffffffffffffffn; // 63 bits set to 1
    lockId = lockId & mask63Bits;

    // Ensure non-zero (extremely unlikely but handle it)
    if (lockId === 0n) {
      lockId = 1n;
    }

    return lockId;
  }

  /**
   * Validate that a value is a valid PostgreSQL bigint
   * PostgreSQL bigint range: -9223372036854775808 to 9223372036854775807
   */
  private validateBigInt(value: bigint): boolean {
    const MIN_BIGINT = -9223372036854775808n;
    const MAX_BIGINT = 9223372036854775807n;
    return value >= MIN_BIGINT && value <= MAX_BIGINT;
  }

  /**
   * Detect if a connection string represents a real PostgreSQL database
   * (not PGLite, in-memory, or other non-PostgreSQL databases)
   */
  private isRealPostgresDatabase(connectionUrl: string): boolean {
    if (!connectionUrl?.trim()) return false;

    const url = connectionUrl.trim().toLowerCase();

    // Exclude non-PostgreSQL databases (check schemes first)
    const nonPgSchemes = [
      "mysql://",
      "mysqli://",
      "mariadb://",
      "mongodb://",
      "mongodb+srv://",
    ];
    if (nonPgSchemes.some((s) => url.startsWith(s))) return false;

    // Always reject :memory: databases (even with postgres:// scheme, it's not valid)
    if (url.includes(":memory:")) return false;

    // PostgreSQL URL schemes - check BEFORE other exclude patterns
    // (a postgres:// URL may have "sqlite" in the database name, that's OK)
    const pgSchemes = [
      "postgres://",
      "postgresql://",
      "postgis://",
      "pgbouncer://",
      "pgpool://",
      "cockroach://",
      "cockroachdb://",
      "redshift://",
      "timescaledb://",
      "yugabyte://",
    ];
    if (pgSchemes.some((s) => url.startsWith(s))) return true;

    // Exclude PGLite, SQLite databases (only for non-postgres:// URLs)
    const excludePatterns = ["pglite", "sqlite"];
    const urlBase = url.split("?")[0];
    if (excludePatterns.some((p) => url.includes(p))) return false;
    if (/\.(db|sqlite|sqlite3)$/.test(urlBase)) return false;

    // Local PostgreSQL (localhost, 127.0.0.1, Docker service names)
    if (url.includes("localhost") || url.includes("127.0.0.1")) return true;

    // PostgreSQL connection params (libpq style)
    const connParams = [
      "host=",
      "dbname=",
      "sslmode=",
      "connect_timeout=",
      "application_name=",
      "user=",
      "password=",
      "port=",
      "options=",
      "sslcert=",
      "sslkey=",
      "sslrootcert=",
      "fallback_application_name=",
      "keepalives=",
      "target_session_attrs=",
    ];
    if (connParams.some((p) => url.includes(p))) return true;

    // user@host format with postgres keyword or port
    if (url.includes("@") && (url.includes("postgres") || /:\d{4,5}/.test(url)))
      return true;

    // Common PostgreSQL ports
    if (/:(5432|5433|5434|6432|8432|9999|25060|26257)\b/.test(url)) return true;

    // Cloud providers
    const cloudPatterns = [
      // AWS
      "amazonaws.com",
      ".rds.",
      // Azure
      "azure.com",
      "database.azure.com",
      // Google Cloud
      "googleusercontent",
      "cloudsql",
      // Supabase
      "supabase",
      // Neon
      "neon.tech",
      "neon.build",
      // Railway
      "railway.app",
      "railway.internal",
      // Render
      "render.com",
      "onrender.com",
      // Heroku
      "heroku",
      // TimescaleDB
      "timescale",
      ".tsdb.cloud",
      // CockroachDB
      "cockroachlabs",
      "cockroachdb.cloud",
      ".crdb.io",
      // DigitalOcean
      "digitalocean",
      "db.ondigitalocean",
      "do-user-",
      // Aiven
      "aiven",
      // Crunchy Data
      "crunchydata",
      // ElephantSQL
      "elephantsql",
      // YugabyteDB
      "yugabyte",
      // Scaleway
      "scaleway",
      ".rdb.fr-par.scw.cloud",
      // Vercel Postgres
      "vercel-storage",
      // PlanetScale
      "psdb.cloud",
      // Xata
      "xata.sh",
      // Fly.io
      "fly.dev",
```