# a7046c18:packages_plugin-sql_README.md:301-355

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/README.md:301-355
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
**"No changes detected"**

- Schema matches database state
- No migration needed

**Manual migration needed?**

- Use standard Drizzle Kit for complex scenarios:
  ```bash
  bunx drizzle-kit generate
  bunx drizzle-kit migrate
  ```

## Clean Shutdown

The adapter implements cleanup handlers for:

- SIGINT
- SIGTERM
- beforeExit

These ensure proper closing of database connections when the application shuts down.

## Implementation Details

### Connection Management

The plugin uses a global singleton pattern to manage database connections. This approach ensures that:

1. **Single Connection Per Process**: Only one connection manager instance exists per Node.js process, regardless of how many times the package is imported or initialized.

2. **Resource Efficiency**: Prevents multiple connection pools to the same database, which could lead to resource exhaustion.

3. **Consistent State**: Ensures all parts of the application share the same database connection state.

4. **Proper Cleanup**: Facilitates proper cleanup of database connections during application shutdown, preventing connection leaks.

This pattern is particularly important in monorepo setups or when the package is used by multiple modules within the same process. The implementation uses JavaScript Symbols to create a global registry that persists across module boundaries.

```typescript
// Example of the singleton pattern implementation
const GLOBAL_SINGLETONS = Symbol.for('@elizaos/plugin-sql/global-singletons');

// Store managers in a global symbol registry
if (!globalSymbols[GLOBAL_SINGLETONS]) {
  globalSymbols[GLOBAL_SINGLETONS] = {};
}

// Reuse existing managers or create new ones when needed
if (!globalSingletons.postgresConnectionManager) {
  globalSingletons.postgresConnectionManager = new PostgresConnectionManager(config.postgresUrl);
}
```

This approach is especially critical for PGlite connections, which require careful management to ensure proper shutdown and prevent resource leaks.
```