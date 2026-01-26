# 5e8c73c1:packages_plugin-sql_src_pglite_manager.ts:1-57

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/plugin-sql/src/pglite/manager.ts:1-57
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
import { PGlite, type PGliteOptions } from '@electric-sql/pglite';
import { fuzzystrmatch } from '@electric-sql/pglite/contrib/fuzzystrmatch';
import { vector } from '@electric-sql/pglite/vector';
import type { IDatabaseClientManager } from '../types';

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