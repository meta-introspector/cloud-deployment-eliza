# a7046c18:packages_plugin-sql_src_utils.node.ts:1-67

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/utils.node.ts:1-67
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { existsSync } from "node:fs";
import path from "node:path";
import dotenv from "dotenv";

/**
 * Node-specific utils split out for server builds.
 */

export function expandTildePath(filepath: string): string {
  if (filepath?.startsWith("~")) {
    return path.join(process.cwd(), filepath.slice(1));
  }
  return filepath;
}

export function resolveEnvFile(startDir: string = process.cwd()): string {
  let currentDir = startDir;

  while (true) {
    const candidate = path.join(currentDir, ".env");
    if (existsSync(candidate)) {
      return candidate;
    }

    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      break;
    }
    currentDir = parentDir;
  }

  return path.join(startDir, ".env");
}

export function resolvePgliteDir(dir?: string, fallbackDir?: string): string {
  const envPath = resolveEnvFile();
  if (existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }

  let monoPath;
  if (existsSync(path.join(process.cwd(), "packages", "core"))) {
    monoPath = process.cwd();
  } else {
    const twoUp = path.resolve(process.cwd(), "../..");
    if (existsSync(path.join(twoUp, "packages", "core"))) {
      monoPath = twoUp;
    }
  }

  const base =
    dir ??
    process.env.PGLITE_DATA_DIR ??
    fallbackDir ??
    (monoPath ? path.join(monoPath, ".eliza", ".elizadb") : undefined) ??
    path.join(process.cwd(), ".eliza", ".elizadb");

  const resolved = expandTildePath(base);
  const legacyPath = path.join(process.cwd(), ".elizadb");
  if (resolved === legacyPath) {
    const newPath = path.join(process.cwd(), ".eliza", ".elizadb");
    process.env.PGLITE_DATA_DIR = newPath;
    return newPath;
  }

  return resolved;
}
```