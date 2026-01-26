# a7046c18:packages_plugin-sql_README.md:151-300

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/README.md:151-300
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

```typescript
// In your plugin's schema.ts
import { pgTable, text, uuid } from 'drizzle-orm/pg-core';

export const myTable = pgTable('my_table', {
  id: uuid('id').primaryKey(),
  name: text('name').notNull(),
});

// Export schema in your plugin
export const plugin = {
  name: '@your-org/plugin-name',
  schema: schema, // Your Drizzle schema object
  // ... rest of plugin
};
```

2. **Runtime detects changes** at startup:

```bash
[RuntimeMigrator] Starting migration for plugin: @your-org/plugin-name
[RuntimeMigrator] Executing 2 SQL statements...
[RuntimeMigrator] Migration completed successfully
```

3. **Automatic safety checks**:

```bash
# Destructive changes are blocked
[RuntimeMigrator] Destructive migration blocked
[RuntimeMigrator] Destructive operations detected:
[RuntimeMigrator]   - Column "email" will be dropped from table "users"
[RuntimeMigrator] To proceed:
[RuntimeMigrator]   1. Set ELIZA_ALLOW_DESTRUCTIVE_MIGRATIONS=true
[RuntimeMigrator]   2. Or use { force: true } option
```

### Migration Controls

Control migration behavior via environment variables:

```bash
# Allow destructive migrations (drops, type changes)
ELIZA_ALLOW_DESTRUCTIVE_MIGRATIONS=true

# Development vs Production
NODE_ENV=production  # Stricter checks, verbose off by default
NODE_ENV=development  # More permissive, verbose on
```

Or programmatically:

```typescript
await databaseAdapter.runPluginMigrations(plugins, {
  verbose: true, // Show SQL statements
  force: true, // Allow destructive changes
  dryRun: true, // Preview without applying
});
```

### Transitioning from Manual Migrations

If you have existing manual Drizzle migrations:

1. **Keep existing migrations** - They remain compatible
2. **Add schema to plugin** - Export your Drizzle schema
3. **First run** - Runtime migrator detects current state
4. **Future changes** - Just update schema and restart

Example transition:

```typescript
// Before: Manual migrations
// 1. Edit schema
// 2. Run: bunx drizzle-kit generate
// 3. Run: bunx drizzle-kit push
// 4. Restart agent

// After: Runtime migrations
// 1. Edit schema in plugin
// 2. Restart agent (migrations run automatically)
```

### Schema Namespacing

Plugins automatically get namespaced schemas for isolation:

- `@elizaos/plugin-sql` → Uses `public` schema (core tables)
- `@your-org/plugin-name` → Uses `your_org_plugin_name` schema
- Prevents table name conflicts between plugins
- Clean separation of concerns

To use a custom schema:

```typescript
import { pgSchema } from 'drizzle-orm/pg-core';

const mySchema = pgSchema('my_custom_schema');
export const myTable = mySchema.table('my_table', {
  // ... columns
});
```

### Debugging Migrations

Check migration status:

```typescript
const migrator = migrationService.getMigrator();
const status = await migrator.getStatus('@your-org/plugin-name');
console.log(status);
// {
//   hasRun: true,
//   lastMigration: { hash: "...", timestamp: ... },
//   journal: [...],
//   snapshots: 3
// }
```

Preview changes without applying:

```typescript
const check = await migrator.checkMigration('@your-org/plugin-name', schema);
if (check?.hasDataLoss) {
  console.log('Warning: Destructive changes:', check.warnings);
}
```

### Database Support

The plugin supports two database backends with automatic migration support:

1. **PostgreSQL**: Production-ready with full feature support
2. **PGlite**: Embedded database for development/testing

Both use identical migration systems - develop locally with PGlite, deploy to PostgreSQL.

### Troubleshooting

**"Destructive migration blocked"**

- Set `ELIZA_ALLOW_DESTRUCTIVE_MIGRATIONS=true` for development
- For production, review changes carefully before enabling

**"Migration already in progress"**

- Another instance is running migrations
- System will wait for lock automatically

```