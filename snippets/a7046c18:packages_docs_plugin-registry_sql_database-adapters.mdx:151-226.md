# a7046c18:packages_docs_plugin-registry_sql_database-adapters.mdx:151-226

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/sql/database-adapters.mdx:151-226
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
## Best Practices

### Development (PGLite)

1. Use default data directory for consistency
2. Clear data directory between test runs if needed
3. Be aware of file system limitations
4. Suitable for single-instance development

### Production (PostgreSQL)

1. Always use connection pooling
2. Configure SSL for secure connections
3. Monitor connection pool usage
4. Use environment variables for configuration
5. Implement proper backup strategies

## Configuration

The SQL plugin automatically selects the appropriate adapter based on environment variables.

### Environment Variables

```bash
# .env file

# For PostgreSQL (production)
POSTGRES_URL=postgresql://user:password@host:5432/database

# For custom PGLite directory (optional)
# If not set, defaults to ./.eliza/.elizadb
PGLITE_DATA_DIR=/path/to/custom/db
```

### Configuration Priority

1. **If `POSTGRES_URL` is set** → Uses PostgreSQL adapter
2. **If `POSTGRES_URL` is not set** → Uses PGLite adapter
   - With `PGLITE_DATA_DIR` if specified
   - Otherwise uses default path: `./.eliza/.elizadb`

### PostgreSQL Configuration

The PostgreSQL adapter supports any PostgreSQL-compatible database:

- **Supabase** - Use the connection string from your project settings
- **Neon** - Use the connection string from your Neon console  
- **Amazon RDS PostgreSQL**
- **Google Cloud SQL PostgreSQL**
- **Self-hosted PostgreSQL** (v12+)

Example connection strings:
```bash
# Supabase
POSTGRES_URL=postgresql://postgres:[password]@[project].supabase.co:5432/postgres

# Neon
POSTGRES_URL=postgresql://[user]:[password]@[project].neon.tech/[database]?sslmode=require

# Standard PostgreSQL
POSTGRES_URL=postgresql://user:password@localhost:5432/mydb
```

## Error Handling

Both adapters include:
- Automatic retry logic (3 attempts by default)
- Exponential backoff between retries
- Detailed error logging
- Graceful degradation

The adapters handle common scenarios like:
- Connection timeouts
- Transient network failures
- Pool exhaustion (PostgreSQL)
- File system errors (PGLite)
```