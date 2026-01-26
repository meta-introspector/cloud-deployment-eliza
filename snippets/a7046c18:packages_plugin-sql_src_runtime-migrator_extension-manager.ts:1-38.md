# a7046c18:packages_plugin-sql_src_runtime-migrator_extension-manager.ts:1-38

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/runtime-migrator/extension-manager.ts:1-38
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { logger } from "@elizaos/core";
import { sql } from "drizzle-orm";
import type { DrizzleDB } from "./types";

export class ExtensionManager {
  constructor(private db: DrizzleDB) {}

  async installRequiredExtensions(extensions: string[]): Promise<void> {
    for (const extension of extensions) {
      try {
        // Validate extension name to prevent SQL injection
        // Extension names should only contain alphanumeric characters, underscores, and hyphens
        if (!/^[a-zA-Z0-9_-]+$/.test(extension)) {
          logger.warn(
            { src: "plugin:sql", extension },
            "Invalid extension name - contains invalid characters",
          );
          continue;
        }

        // Use sql.identifier for safe escaping of SQL identifiers
        await this.db.execute(
          sql`CREATE EXTENSION IF NOT EXISTS ${sql.identifier(extension)}`,
        );
        logger.debug({ src: "plugin:sql", extension }, "Extension installed");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        logger.warn(
          { src: "plugin:sql", extension, error: errorMessage },
          "Could not install extension",
        );
        // Some extensions might not be available or already installed
        // This shouldn't stop the migration process
      }
    }
  }
}
```