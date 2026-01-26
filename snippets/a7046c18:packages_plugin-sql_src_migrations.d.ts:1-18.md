# a7046c18:packages_plugin-sql_src_migrations.d.ts:1-18

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/migrations.d.ts:1-18
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { type IDatabaseAdapter } from "@elizaos/core";
/**
 * TEMPORARY MIGRATION: pre-1.6.5 → 1.6.5+ schema migration
 *
 * This migration runs automatically on startup and is idempotent.
 * It handles the migration from Owner RLS to Server RLS + Entity RLS, including:
 * - Disabling old RLS policies temporarily
 * - Renaming server_id → message_server_id in channels, worlds, rooms
 * - Converting TEXT → UUID where needed
 * - Dropping old server_id columns for RLS
 * - Cleaning up indexes
 *
 * @param adapter - Database adapter
 */
export declare function migrateToEntityRLS(
  adapter: IDatabaseAdapter,
): Promise<void>;
//# sourceMappingURL=migrations.d.ts.map
```