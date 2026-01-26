# a7046c18:packages_docs_plugin-registry_sql.mdx:151-210

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/docs/plugin-registry/sql.mdx:151-210
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

### 3. Dynamic Migration
The system:
- Introspects existing database structure
- Compares with plugin schema definitions
- Generates and executes necessary DDL
- Handles errors gracefully

### 4. Runtime Access
Plugins access the database through the runtime:
```typescript
const adapter = runtime.databaseAdapter;
await adapter.getMemories({ agentId });
```

## Advanced Features

### Composite Primary Keys
```typescript
const cacheTable = pgTable('cache', {
  key: text('key').notNull(),
  agentId: uuid('agent_id').notNull(),
  value: jsonb('value'),
}, (table) => ({
  pk: primaryKey(table.key, table.agentId),
}));
```

### Foreign Key Dependencies
Tables with foreign keys are automatically created in the correct order.

### Schema Introspection
The system can analyze and adapt to existing database structures.

### Error Recovery
- Automatic retries with exponential backoff
- Detailed error logging
- Graceful degradation

## Best Practices

1. **Define Clear Schemas** - Use TypeScript for type safety
2. **Use UUIDs** - For distributed compatibility
3. **Include Timestamps** - Track data changes
4. **Index Strategically** - For query performance
5. **Test Migrations** - Verify schema changes locally

## Limitations

- No automatic downgrades or rollbacks
- Column type changes require manual intervention
- Data migrations must be handled separately
- Schema changes should be tested thoroughly

## Next Steps

- [Database Adapters](/plugin-registry/sql/database-adapters) - Detailed adapter documentation
- [Schema Management](/plugin-registry/sql/schema-management) - Creating and managing schemas
- [Plugin Tables Guide](/plugin-registry/sql/plugin-tables) - Adding tables to your plugin
- [Examples](/plugin-registry/sql/examples) - Real-world usage patterns
```