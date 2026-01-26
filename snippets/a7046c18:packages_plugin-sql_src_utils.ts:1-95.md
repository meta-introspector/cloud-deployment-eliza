# a7046c18:packages_plugin-sql_src_utils.ts:1-95

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/plugin-sql/src/utils.ts:1-95
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { existsSync } from "node:fs";
import path from "node:path";
import dotenv from "dotenv";

/**
 * Expands a file path starting with `~` to the project directory.
 *
 * @param filepath - The path to expand.
 * @returns The expanded path.
 */
export function expandTildePath(filepath: string): string {
  if (filepath?.startsWith("~")) {
    return path.join(process.cwd(), filepath.slice(1));
  }
  return filepath;
}

/**
 * Resolves the path to the nearest `.env` file.
 *
 * If no `.env` file is found when traversing up from the starting directory,
 * a path to `.env` in the starting directory is returned.
 *
 * @param startDir - The directory to start searching from. Defaults to the
 *   current working directory.
 * @returns The resolved path to the `.env` file.
 */
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

/**
 * Resolves the directory used for PGlite database storage.
 *
 * Resolution order:
 * 1. The `dir` argument if provided.
 * 2. The `PGLITE_DATA_DIR` environment variable.
 * 3. The `fallbackDir` argument if provided.
 * 4. `./.eliza/.elizadb` relative to the current working directory.
 *
 * @param dir - Optional directory preference.
 * @param fallbackDir - Optional fallback directory when env var is not set.
 * @returns The resolved data directory with any tilde expanded.
 */
export function resolvePgliteDir(dir?: string, fallbackDir?: string): string {
  const envPath = resolveEnvFile();
  if (existsSync(envPath)) {
    dotenv.config({ path: envPath });
  }

  // cwd might be plugin-sql if we're running tests from monorepo
  // are we in monorepo config?
  let monoPath;
  if (existsSync(path.join(process.cwd(), "packages", "core"))) {
    monoPath = process.cwd();
  } else {
    const twoUp = path.resolve(process.cwd(), "../.."); // assuming running from package
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

  // Automatically migrate legacy path (<cwd>/.elizadb) to new location (<cwd>/.eliza/.elizadb)
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