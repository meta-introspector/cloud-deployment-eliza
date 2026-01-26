# a7046c18:packages_plugin-sql_src_runtime-migrator_drizzle-adapters_diff-calculator.ts:451-516

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/runtime-migrator/drizzle-adapters/diff-calculator.ts:451-516
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      const currFKs = currTable.foreignKeys || {};

      // Find new, deleted, and altered foreign keys
      for (const fkName in currFKs) {
        if (!(fkName in prevFKs)) {
          // New FK
          diff.foreignKeys.created.push(currFKs[fkName]);
        } else {
          // Check if FK definition changed (CASCADE behavior, etc.)
          const prevFK = prevFKs[fkName];
          const currFK = currFKs[fkName];

          // Compare FK properties
          const prevOnDelete = prevFK.onDelete || "no action";
          const currOnDelete = currFK.onDelete || "no action";
          const prevOnUpdate = prevFK.onUpdate || "no action";
          const currOnUpdate = currFK.onUpdate || "no action";

          if (prevOnDelete !== currOnDelete || prevOnUpdate !== currOnUpdate) {
            // FK CASCADE behavior changed - need to drop and recreate
            diff.foreignKeys.altered.push({
              old: prevFK,
              new: currFK,
            });
          }
        }
      }

      // Find deleted foreign keys (not altered)
      for (const fkName in prevFKs) {
        if (!(fkName in currFKs)) {
          diff.foreignKeys.deleted.push({
            name: fkName,
            tableFrom: tableName,
          });
        }
      }
    }
  }

  return diff;
}

/**
 * Check if a diff has any changes
 */
export function hasDiffChanges(diff: SchemaDiff): boolean {
  return (
    diff.tables.created.length > 0 ||
    diff.tables.deleted.length > 0 ||
    diff.tables.modified.length > 0 ||
    diff.columns.added.length > 0 ||
    diff.columns.deleted.length > 0 ||
    diff.columns.modified.length > 0 ||
    diff.indexes.created.length > 0 ||
    diff.indexes.deleted.length > 0 ||
    diff.indexes.altered.length > 0 ||
    diff.foreignKeys.created.length > 0 ||
    diff.foreignKeys.deleted.length > 0 ||
    diff.foreignKeys.altered.length > 0 ||
    diff.uniqueConstraints.created.length > 0 ||
    diff.uniqueConstraints.deleted.length > 0 ||
    diff.checkConstraints.created.length > 0 ||
    diff.checkConstraints.deleted.length > 0
  );
}
```