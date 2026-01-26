# a7046c18:packages_docs_plugin-registry_sql_plugin-tables.mdx:451-463

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/sql/plugin-tables.mdx:451-463
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
3. Verify table names don't conflict with PostgreSQL keywords

### Foreign Key Errors

1. Ensure referenced tables exist
2. Check that data types match exactly
3. Verify the referenced column has a unique constraint

### Performance Issues

1. Add indexes for frequently queried columns
2. Use partial indexes for filtered queries
3. Consider partitioning for large tables
```