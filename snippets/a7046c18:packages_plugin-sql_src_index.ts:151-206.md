# a7046c18:packages_plugin-sql_src_index.ts:151-206

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/index.ts:151-206
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
              return Boolean(existing);
            } catch {
              return false;
            }
          })();

    if (adapterRegistered) {
      runtime.logger.info(
        { src: "plugin:sql", agentId: runtime.agentId },
        "Database adapter already registered, skipping creation",
      );
      return;
    }

    runtime.logger.debug(
      { src: "plugin:sql", agentId: runtime.agentId },
      "No database adapter found, proceeding to register",
    );

    // Get database configuration from runtime settings
    const postgresUrl = runtime.getSetting("POSTGRES_URL");
    // Only support PGLITE_DATA_DIR going forward
    const dataDir = runtime.getSetting("PGLITE_DATA_DIR");

    const dbAdapter = createDatabaseAdapter(
      {
        dataDir: typeof dataDir === "string" ? dataDir : undefined,
        postgresUrl: typeof postgresUrl === "string" ? postgresUrl : undefined,
      },
      runtime.agentId,
    );

    runtime.registerDatabaseAdapter(dbAdapter);
    runtime.logger.info(
      { src: "plugin:sql", agentId: runtime.agentId },
      "Database adapter created and registered",
    );

    // Note: DatabaseMigrationService is not registered as a runtime service
    // because migrations are handled at the server level before agents are loaded
  },
};

export default plugin;

// Export additional utilities that may be needed by consumers
export { DatabaseMigrationService } from "./migration-service";
export {
  applyRLSToNewTables,
  assignAgentToServer,
  getOrCreateRlsServer,
  installRLSFunctions,
  setServerContext,
  uninstallRLS,
} from "./rls";
export { schema };
```