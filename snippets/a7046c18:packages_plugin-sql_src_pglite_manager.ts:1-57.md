# a7046c18:packages_plugin-sql_src_pglite_manager.ts:1-57

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/pglite/manager.ts:1-57
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { PGlite, type PGliteOptions } from "@electric-sql/pglite";
import { fuzzystrmatch } from "@electric-sql/pglite/contrib/fuzzystrmatch";
import { vector } from "@electric-sql/pglite/vector";
import type { IDatabaseClientManager } from "../types";

/**
 * Class representing a database client manager for PGlite.
 * @implements { IDatabaseClientManager }
 */
export class PGliteClientManager implements IDatabaseClientManager<PGlite> {
  private client: PGlite;
  private shuttingDown = false;

  /**
   * Constructor for creating a new instance of PGlite with the provided options.
   * Initializes the PGlite client with additional extensions.
   * @param {PGliteOptions} options - The options to configure the PGlite client.
   */
  constructor(options: PGliteOptions) {
    this.client = new PGlite({
      ...options,
      extensions: {
        vector,
        fuzzystrmatch,
      },
    });
    this.setupShutdownHandlers();
  }

  public getConnection(): PGlite {
    return this.client;
  }

  public isShuttingDown(): boolean {
    return this.shuttingDown;
  }

  public async initialize(): Promise<void> {
    // Kept for backward compatibility
  }

  public async close(): Promise<void> {
    this.shuttingDown = true;
    // Actually close the PGLite client to release file locks and cleanup resources
    // Without this, the WAL files remain locked and deleting the data directory
    // causes ENOENT errors when subsequent tests try to access it
    if (this.client) {
      try {
        await this.client.close();
      } catch {}
    }
  }

  private setupShutdownHandlers() {
    // Implementation of setupShutdownHandlers method
  }
}
```