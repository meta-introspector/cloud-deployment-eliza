# a7046c18:packages_plugin-sql_src_rls.d.ts:151-177

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/rls.d.ts:151-177
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
 * ```typescript
 * // Called automatically by installRLSFunctions()
 * await installRLSFunctions(database);
 *
 * // Or call separately if needed
 * await installEntityRLS(database);
 * await applyEntityRLSToAllTables(database);
 * ```
 */
export declare function installEntityRLS(
  adapter: IDatabaseAdapter,
): Promise<void>;
/**
 * Apply Entity RLS policies to all eligible tables
 * Call this after installEntityRLS() to activate the policies
 */
export declare function applyEntityRLSToAllTables(
  adapter: IDatabaseAdapter,
): Promise<void>;
/**
 * Remove Entity RLS (for rollback or testing)
 * Drops entity RLS functions and policies but keeps server RLS intact
 */
export declare function uninstallEntityRLS(
  adapter: IDatabaseAdapter,
): Promise<void>;
//# sourceMappingURL=rls.d.ts.map
```