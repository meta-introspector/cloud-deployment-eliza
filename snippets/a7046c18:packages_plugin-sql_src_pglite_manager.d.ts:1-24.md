# a7046c18:packages_plugin-sql_src_pglite_manager.d.ts:1-24

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/pglite/manager.d.ts:1-24
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { PGlite, type PGliteOptions } from "@electric-sql/pglite";
import type { IDatabaseClientManager } from "../types";
/**
 * Class representing a database client manager for PGlite.
 * @implements { IDatabaseClientManager }
 */
export declare class PGliteClientManager
  implements IDatabaseClientManager<PGlite>
{
  private client;
  private shuttingDown;
  /**
   * Constructor for creating a new instance of PGlite with the provided options.
   * Initializes the PGlite client with additional extensions.
   * @param {PGliteOptions} options - The options to configure the PGlite client.
   */
  constructor(options: PGliteOptions);
  getConnection(): PGlite;
  isShuttingDown(): boolean;
  initialize(): Promise<void>;
  close(): Promise<void>;
  private setupShutdownHandlers;
}
//# sourceMappingURL=manager.d.ts.map
```