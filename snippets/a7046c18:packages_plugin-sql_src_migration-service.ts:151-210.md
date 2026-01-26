# a7046c18:packages_plugin-sql_src_migration-service.ts:151-210

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/migration-service.ts:151-210
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
      // Re-apply RLS after all migrations are complete
      // This ensures RLS is active on all tables with proper server_id columns
      // ONLY if data isolation is enabled
      const dataIsolationEnabled = process.env.ENABLE_DATA_ISOLATION === "true";

      if (dataIsolationEnabled) {
        try {
          logger.info(
            { src: "plugin:sql" },
            "Re-applying Row Level Security...",
          );
          // RLS functions expect IDatabaseAdapter, create wrapper
          interface AdapterWrapper extends IDatabaseAdapter {
            db: DrizzleDatabase;
          }
          const adapterWrapper: AdapterWrapper = {
            db: this.db,
          } as AdapterWrapper;
          await installRLSFunctions(adapterWrapper);
          await applyRLSToNewTables(adapterWrapper);
          await applyEntityRLSToAllTables(adapterWrapper);
          logger.info({ src: "plugin:sql" }, "RLS re-applied successfully");
        } catch (rlsError) {
          const errorMsg =
            rlsError instanceof Error ? rlsError.message : String(rlsError);
          logger.warn(
            { src: "plugin:sql", error: errorMsg },
            "Failed to re-apply RLS (this is OK if server_id columns are not yet in schemas)",
          );
        }
      } else {
        logger.info(
          { src: "plugin:sql" },
          "Skipping RLS re-application (ENABLE_DATA_ISOLATION is not true)",
        );
      }
    } else {
      logger.error(
        { src: "plugin:sql", failureCount, successCount },
        "Some migrations failed",
      );

      // Throw a consolidated error with details about all failures
      const errorSummary = errors
        .map((e) => `${e.pluginName}: ${e.error.message}`)
        .join("\n  ");
      throw new Error(
        `${failureCount} migration(s) failed:\n  ${errorSummary}`,
      );
    }
  }

  /**
   * Get the runtime migrator instance for advanced operations
   * @returns RuntimeMigrator instance or null if not initialized
   */
  getMigrator(): RuntimeMigrator | null {
    return this.migrator;
  }
}
```