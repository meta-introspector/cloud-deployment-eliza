# a7046c18:packages_core_build.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** packages/core/build.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
#!/usr/bin/env bun

/**
 * Dual build script for @elizaos/core - generates both Node.js and browser builds
 * TypeScript source is now in typescript/src/
 */

import { existsSync, mkdirSync } from "node:fs";
import { createBuildRunner } from "../../build-utils";

// Source directory for TypeScript
const TS_SRC = "typescript/src";

// Ensure dist directories exist
["dist", "dist/node", "dist/browser"].forEach((dir) => {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
});

// Browser-specific externals (these should be provided by the host environment)
const browserExternals = [
  // These will be loaded via CDN or bundled by the consuming app
  "sharp", // Image processing - not available in browser
  "@hapi/shot", // Test utility - not needed in browser
  "@opentelemetry/context-async-hooks", // Exclude OpenTelemetry Node modules
  "async_hooks", // Node.js built-in module
  "node:diagnostics_channel", // Node.js built-in module
  "node:async_hooks", // Node.js built-in module
  "crypto-browserify",
];

// Node-specific externals (native modules and node-specific packages)
const nodeExternals = ["dotenv", "sharp", "zod", "@hapi/shot"];

// Shared configuration
const sharedConfig = {
  packageName: "@elizaos/core",
  sourcemap: true,
  minify: false,
  generateDts: true,
};

/**
 * Build for Node.js environment
 */
async function buildNode() {
  console.log("🔨 Building for Node.js...");
  const startTime = Date.now();

  const runNode = createBuildRunner({
    ...sharedConfig,
    buildOptions: {
      entrypoints: [`${TS_SRC}/index.node.ts`],
      outdir: "dist/node",
      target: "node",
      format: "esm",
      external: nodeExternals,
      sourcemap: true,
      minify: false,
      generateDts: false, // We'll generate declarations separately for all entry points
    },
  });

  await runNode();

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`✅ Node.js build complete in ${duration}s`);
}

/**
 * Build for browser environment
 */
async function buildBrowser() {
  console.log("🌐 Building for Browser...");
  const startTime = Date.now();

  const runBrowser = createBuildRunner({
    ...sharedConfig,
    buildOptions: {
      entrypoints: [`${TS_SRC}/index.browser.ts`],
      outdir: "dist/browser",
      target: "browser",
      format: "esm",
      external: browserExternals,
      sourcemap: true,
      minify: true, // Minify for browser to reduce bundle size
      generateDts: false, // Use the same .d.ts files from Node build
      // No additional browser resolver plugins; avoid pulling large node-polyfill trees
      plugins: [],
    },
  });

  await runBrowser();

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`✅ Browser build complete in ${duration}s`);
}

/**
 * Build testing module (Node.js only)
 */
async function buildTesting() {
  console.log("🧪 Building testing module...");
  const startTime = Date.now();

  const runTesting = createBuildRunner({
    ...sharedConfig,
    buildOptions: {
      entrypoints: [`${TS_SRC}/testing/index.ts`],
      outdir: "dist/testing",
      target: "node",
      format: "esm",
      external: [...nodeExternals, "@elizaos/plugin-sql"],
      sourcemap: true,
      minify: false,
      generateDts: false,
    },
  });

  await runTesting();

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`✅ Testing module build complete in ${duration}s`);
}

/**
 * Build for both targets
 */
async function buildAll() {
  console.log("🚀 Starting dual build process for @elizaos/core");
  const totalStart = Date.now();

  // Build everything in parallel for maximum speed
  // TypeScript declarations can be generated while JS is being built
  const [_nodeResult, _browserResult, _testingResult, _] = await Promise.all([
    buildNode(),
    buildBrowser(),
    buildTesting(),
    generateTypeScriptDeclarations(), // Run in parallel, not sequentially
  ]);

  const totalDuration = ((Date.now() - totalStart) / 1000).toFixed(2);
  console.log(`\n🎉 All builds complete in ${totalDuration}s`);
}

/**
 * Generate TypeScript declarations for all entry points
 */
async function generateTypeScriptDeclarations() {
```