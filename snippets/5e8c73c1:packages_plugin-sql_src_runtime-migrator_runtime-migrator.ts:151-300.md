# 5e8c73c1:packages_plugin-sql_src_runtime-migrator_runtime-migrator.ts:151-300

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-sql/src/runtime-migrator/runtime-migrator.ts:151-300
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```

  /**
   * Detect if a connection string represents a real PostgreSQL database
   * (not PGLite, in-memory, or other non-PostgreSQL databases)
   */
  private isRealPostgresDatabase(connectionUrl: string): boolean {
    if (!connectionUrl?.trim()) return false;

    const url = connectionUrl.trim().toLowerCase();

    // Exclude non-PostgreSQL databases (check schemes first)
    const nonPgSchemes = ['mysql://', 'mysqli://', 'mariadb://', 'mongodb://', 'mongodb+srv://'];
    if (nonPgSchemes.some((s) => url.startsWith(s))) return false;

    // Always reject :memory: databases (even with postgres:// scheme, it's not valid)
    if (url.includes(':memory:')) return false;

    // PostgreSQL URL schemes - check BEFORE other exclude patterns
    // (a postgres:// URL may have "sqlite" in the database name, that's OK)
    const pgSchemes = [
      'postgres://',
      'postgresql://',
      'postgis://',
      'pgbouncer://',
      'pgpool://',
      'cockroach://',
      'cockroachdb://',
      'redshift://',
      'timescaledb://',
      'yugabyte://',
    ];
    if (pgSchemes.some((s) => url.startsWith(s))) return true;

    // Exclude PGLite, SQLite databases (only for non-postgres:// URLs)
    const excludePatterns = ['pglite', 'sqlite'];
    const urlBase = url.split('?')[0];
    if (excludePatterns.some((p) => url.includes(p))) return false;
    if (/\.(db|sqlite|sqlite3)$/.test(urlBase)) return false;

    // Local PostgreSQL (localhost, 127.0.0.1, Docker service names)
    if (url.includes('localhost') || url.includes('127.0.0.1')) return true;

    // PostgreSQL connection params (libpq style)
    const connParams = [
      'host=',
      'dbname=',
      'sslmode=',
      'connect_timeout=',
      'application_name=',
      'user=',
      'password=',
      'port=',
      'options=',
      'sslcert=',
      'sslkey=',
      'sslrootcert=',
      'fallback_application_name=',
      'keepalives=',
      'target_session_attrs=',
    ];
    if (connParams.some((p) => url.includes(p))) return true;

    // user@host format with postgres keyword or port
    if (url.includes('@') && (url.includes('postgres') || /:\d{4,5}/.test(url))) return true;

    // Common PostgreSQL ports
    if (/:(5432|5433|5434|6432|8432|9999|25060|26257)\b/.test(url)) return true;

    // Cloud providers
    const cloudPatterns = [
      // AWS
      'amazonaws.com',
      '.rds.',
      // Azure
      'azure.com',
      'database.azure.com',
      // Google Cloud
      'googleusercontent',
      'cloudsql',
      // Supabase
      'supabase',
      // Neon
      'neon.tech',
      'neon.build',
      // Railway
      'railway.app',
      'railway.internal',
      // Render
      'render.com',
      'onrender.com',
      // Heroku
      'heroku',
      // TimescaleDB
      'timescale',
      '.tsdb.cloud',
      // CockroachDB
      'cockroachlabs',
      'cockroachdb.cloud',
      '.crdb.io',
      // DigitalOcean
      'digitalocean',
      'db.ondigitalocean',
      'do-user-',
      // Aiven
      'aiven',
      // Crunchy Data
      'crunchydata',
      // ElephantSQL
      'elephantsql',
      // YugabyteDB
      'yugabyte',
      // Scaleway
      'scaleway',
      '.rdb.fr-par.scw.cloud',
      // Vercel Postgres
      'vercel-storage',
      // PlanetScale
      'psdb.cloud',
      // Xata
      'xata.sh',
      // Fly.io
      'fly.dev',
      'fly.io',
    ];
    if (cloudPatterns.some((p) => url.includes(p))) return true;

    // IP:port patterns (IPv4 and IPv6)
    if (/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}:\d{1,5}/.test(url)) return true;
    if (/\[[0-9a-f:]+\](:\d{1,5})?/i.test(connectionUrl)) return true;

    // host:port/database format (Docker Compose, etc.)
    if (/^[a-z0-9_.-]+:\d{1,5}\/[a-z0-9_-]+/i.test(connectionUrl)) return true;

    logger.debug(
      { src: 'plugin:sql', urlPreview: url.substring(0, 50) },
      'Connection string did not match any PostgreSQL patterns'
    );
    return false;
  }

  /**
   * Initialize migration system - create necessary tables
   * @throws Error if table creation fails
   */
  async initialize(): Promise<void> {
    logger.info({ src: 'plugin:sql' }, 'Initializing migration system');
    await this.migrationTracker.ensureTables();
    logger.info({ src: 'plugin:sql' }, 'Migration system initialized');
  }

```