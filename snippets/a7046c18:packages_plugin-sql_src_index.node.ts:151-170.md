# a7046c18:packages_plugin-sql_src_index.node.ts:151-170

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/index.node.ts:151-170
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```

    runtime.registerDatabaseAdapter(dbAdapter);
    runtime.logger.info(
      { src: "plugin:sql", agentId: runtime.agentId },
      "Database adapter created and registered",
    );
  },
};

export default plugin;

export { DatabaseMigrationService } from "./migration-service";
export {
  applyRLSToNewTables,
  assignAgentToServer,
  getOrCreateRlsServer,
  installRLSFunctions,
  setServerContext,
  uninstallRLS,
} from "./rls";
```