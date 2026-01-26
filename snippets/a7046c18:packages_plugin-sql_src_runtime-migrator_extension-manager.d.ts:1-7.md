# a7046c18:packages_plugin-sql_src_runtime-migrator_extension-manager.d.ts:1-7

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/runtime-migrator/extension-manager.d.ts:1-7
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import type { DrizzleDB } from "./types";
export declare class ExtensionManager {
  private db;
  constructor(db: DrizzleDB);
  installRequiredExtensions(extensions: string[]): Promise<void>;
}
//# sourceMappingURL=extension-manager.d.ts.map
```