# a7046c18:packages_plugin-sql_src_index.browser.ts:1-87

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/index.browser.ts:1-87
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import {
  type IAgentRuntime,
  type IDatabaseAdapter,
  logger,
  type Plugin,
  type UUID,
} from "@elizaos/core/browser";
import { PgliteDatabaseAdapter } from "./pglite/adapter";
import { PGliteClientManager } from "./pglite/manager";
import * as schema from "./schema";

/**
 * Browser-safe entrypoint for @elizaos/plugin-sql
 *
 * This entrypoint only uses the PGlite (WASM) path and avoids any Node/Postgres-only
 * code or Node builtins, so it can be safely bundled into browser/client environments.
 */

// Global singletons (browser-safe)
const GLOBAL_SINGLETONS = Symbol.for("@elizaos/plugin-sql/global-singletons");

interface GlobalSingletons {
  pgLiteClientManager?: PGliteClientManager;
}

// Type assertion needed because globalThis doesn't include symbol keys in its type definition
const globalSymbols = globalThis as typeof globalThis &
  Record<symbol, GlobalSingletons>;
if (!globalSymbols[GLOBAL_SINGLETONS]) {
  globalSymbols[GLOBAL_SINGLETONS] = {};
}
const globalSingletons = globalSymbols[GLOBAL_SINGLETONS];

/**
 * Create a PGlite adapter for the browser (in-memory by default).
 * No Postgres fallback in browser builds.
 */
export function createDatabaseAdapter(
  _config: { dataDir?: string },
  agentId: UUID,
): IDatabaseAdapter {
  if (!globalSingletons.pgLiteClientManager) {
    // Use in-memory PGlite by default in the browser.
    globalSingletons.pgLiteClientManager = new PGliteClientManager({});
  }
  return new PgliteDatabaseAdapter(
    agentId,
    globalSingletons.pgLiteClientManager,
  );
}

export const plugin: Plugin = {
  name: "@elizaos/plugin-sql",
  description: "A plugin for SQL database access (PGlite WASM in browser).",
  priority: 0,
  schema: schema,
  init: async (_config, runtime: IAgentRuntime) => {
    logger.info({ src: "plugin:sql" }, "plugin-sql (browser) init starting");

    // Check if a database adapter is already registered
    try {
      // Try to check if the runtime is ready (has an adapter)
      const isReady = await runtime.isReady();
      if (isReady) {
        logger.info(
          { src: "plugin:sql" },
          "Database adapter already registered, skipping creation",
        );
        return;
      }
    } catch (_error) {
      // No adapter exists or isReady failed, continue with creation
    }

    // In browser builds, always use PGlite (in-memory unless configured elsewhere in runtime)
    const dbAdapter = createDatabaseAdapter({}, runtime.agentId);
    runtime.registerDatabaseAdapter(dbAdapter);
    logger.info(
      { src: "plugin:sql" },
      "Browser database adapter (PGlite) created and registered",
    );
  },
};

export default plugin;

export { DatabaseMigrationService } from "./migration-service";
```