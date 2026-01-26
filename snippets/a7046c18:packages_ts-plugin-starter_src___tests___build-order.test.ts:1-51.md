# a7046c18:packages_ts-plugin-starter_src___tests___build-order.test.ts:1-51

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/ts-plugin-starter/src/__tests__/build-order.test.ts:1-51
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import fs from "node:fs";
import path from "node:path";
import { $ } from "bun";
import { getViteOutDir } from "./vite-config-utils";

describe("Build Order Integration Test", () => {
  const rootDir = path.resolve(__dirname, "../..");
  const distDir = path.join(rootDir, "dist");
  let viteBuildDir: string;
  const _tsupBuildMarker = path.join(distDir, "index.js"); // TSup creates this

  beforeAll(async () => {
    // Get the actual vite build directory from config
    const viteOutDirRelative = await getViteOutDir(rootDir);
    viteBuildDir = path.join(rootDir, viteOutDirRelative);

    // Clean dist directory before test
    if (fs.existsSync(distDir)) {
      await fs.promises.rm(distDir, { recursive: true, force: true });
    }
  });

  afterAll(async () => {
    // Clean up after test
    if (fs.existsSync(distDir)) {
      await fs.promises.rm(distDir, { recursive: true, force: true });
    }
  });

  it("should ensure vite build outputs persist after tsup build", async () => {
    // Run the full build process
    await $`cd ${rootDir} && bun run build`;

    const distFiles = fs.readdirSync(distDir);

    // Should have vite outputs (HTML files)
    expect(distFiles.some((file) => file.endsWith(".html"))).toBe(true);

    // Should have vite manifest (if configured)
    const viteBuildMarker = path.join(viteBuildDir, ".vite", "manifest.json");
    expect(fs.existsSync(viteBuildMarker)).toBe(true);

    // Should have vite assets directory
    expect(distFiles.includes("assets")).toBe(true);

    // Should have tsup outputs (JS and d.ts files)
    expect(distFiles.some((file) => file === "index.js")).toBe(true);
    expect(distFiles.some((file) => file === "index.d.ts")).toBe(true);
  }, 30000); // 30 second timeout for build process
});
```