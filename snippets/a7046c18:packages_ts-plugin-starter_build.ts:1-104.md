# a7046c18:packages_ts-plugin-starter_build.ts:1-104

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/ts-plugin-starter/build.ts:1-104
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
#!/usr/bin/env bun
/**
 * Self-contained build script for elizaOS plugins
 */

import { existsSync } from "node:fs";
import { rm } from "node:fs/promises";
import { $ } from "bun";

async function cleanBuild(outdir = "dist") {
  if (existsSync(outdir)) {
    await rm(outdir, { recursive: true, force: true });
    console.log(`✓ Cleaned ${outdir} directory`);
  }
}

async function build() {
  const start = performance.now();
  console.log("🚀 Building plugin...");

  try {
    // Clean previous build
    await cleanBuild("dist");

    // Run JavaScript build and TypeScript declarations in parallel
    console.log("Starting build tasks...");

    const [buildResult, _tscResult] = await Promise.all([
      // Task 1: Build with Bun
      (async () => {
        console.log("📦 Bundling with Bun...");
        const result = await Bun.build({
          entrypoints: ["./src/index.ts"],
          outdir: "./dist",
          target: "node",
          format: "esm",
          sourcemap: true,
          minify: false,
          external: [
            "dotenv",
            "node:*",
            "@elizaos/core",
            "@elizaos/cli",
            "zod",
          ],
          naming: {
            entry: "[dir]/[name].[ext]",
          },
        });

        if (!result.success) {
          console.error("✗ Build failed:", result.logs);
          return { success: false, outputs: [] };
        }

        const totalSize = result.outputs.reduce(
          (sum, output) => sum + output.size,
          0,
        );
        const sizeMB = (totalSize / 1024 / 1024).toFixed(2);
        console.log(`✓ Built ${result.outputs.length} file(s) - ${sizeMB}MB`);

        return result;
      })(),

      // Task 2: Generate TypeScript declarations
      (async () => {
        console.log("📝 Generating TypeScript declarations...");
        try {
          await $`tsc --emitDeclarationOnly --incremental --project ./tsconfig.build.json`.quiet();
          console.log("✓ TypeScript declarations generated");
          return { success: true };
        } catch (_error) {
          console.warn("⚠ Failed to generate TypeScript declarations");
          console.warn("  This is usually due to test files or type errors.");
          return { success: false };
        }
      })(),
    ]);

    if (!buildResult.success) {
      return false;
    }

    const elapsed = ((performance.now() - start) / 1000).toFixed(2);
    console.log(`✅ Build complete! (${elapsed}s)`);
    return true;
  } catch (error) {
    console.error("Build error:", error);
    return false;
  }
}

// Execute the build
build()
  .then((success) => {
    if (!success) {
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error("Build script error:", error);
    process.exit(1);
  });
```