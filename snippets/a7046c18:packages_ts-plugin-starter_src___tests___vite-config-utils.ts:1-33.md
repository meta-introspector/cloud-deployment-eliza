# a7046c18:packages_ts-plugin-starter_src___tests___vite-config-utils.ts:1-33

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/ts-plugin-starter/src/__tests__/vite-config-utils.ts:1-33
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import fs from "node:fs";
import path from "node:path";

/**
 * Extracts the Vite build.outDir from vite.config.ts
 * Handles both relative and absolute paths, accounting for Vite's root directory
 */
export async function getViteOutDir(packageRoot: string): Promise<string> {
  const viteConfigPath = path.join(packageRoot, "vite.config.ts");

  if (!fs.existsSync(viteConfigPath)) {
    throw new Error(`vite.config.ts not found at ${viteConfigPath}`);
  }

  // Import the vite config dynamically
  const configModule = await import(viteConfigPath);
  const config =
    typeof configModule.default === "function"
      ? configModule.default({ command: "build", mode: "production" })
      : configModule.default;

  let outDir = config.build?.outDir || "dist";
  const viteRoot = config.root || ".";

  // If outDir is relative, resolve it relative to the vite root
  if (!path.isAbsolute(outDir)) {
    const viteRootAbsolute = path.resolve(packageRoot, viteRoot);
    outDir = path.resolve(viteRootAbsolute, outDir);
  }

  // Ensure the path is relative to packageRoot for consistency
  return path.relative(packageRoot, outDir);
}
```