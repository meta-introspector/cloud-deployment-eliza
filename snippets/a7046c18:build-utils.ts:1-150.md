# a7046c18:build-utils.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** build-utils.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
#!/usr/bin/env bun

/**
 * Common build utilities for Bun.build across the monorepo
 */

import { existsSync, type FSWatcher, watch } from "node:fs";
import { join } from "node:path";
import type { BuildConfig, BunPlugin } from "bun";

export interface ElizaBuildOptions {
  /** Package root directory */
  root?: string;
  /** Entry points - defaults to ['src/index.ts'] */
  entrypoints?: string[];
  /** Output directory - defaults to 'dist' */
  outdir?: string;
  /** Target environment - defaults to 'node' for packages */
  target?: "node" | "bun" | "browser";
  /** External dependencies */
  external?: string[];
  /** Whether to generate sourcemaps */
  sourcemap?: boolean | "linked" | "inline" | "external";
  /** Whether to minify */
  minify?: boolean;
  /** Additional plugins */
  plugins?: BunPlugin[];
  /** Format - defaults to 'esm' */
  format?: "esm" | "cjs";
  /** Copy assets configuration */
  assets?: Array<{ from: string; to: string }>;
  /** Whether this is a CLI tool */
  isCli?: boolean;
  /** Whether to generate TypeScript declarations (using tsc separately) */
  generateDts?: boolean;
}

/**
 * Get performance timer
 */
export function getTimer() {
  const start = performance.now();
  return {
    elapsed: () => {
      const end = performance.now();
      return (end - start).toFixed(2);
    },
    elapsedMs: () => {
      const end = performance.now();
      return Math.round(end - start);
    },
  };
}

/**
 * Creates a standardized Bun build configuration for elizaOS packages
 */
export async function createElizaBuildConfig(
  options: ElizaBuildOptions,
): Promise<BuildConfig> {
  const {
    root: _root = process.cwd(),
    entrypoints = ["src/index.ts"],
    outdir = "dist",
    target = "node",
    external = [],
    sourcemap = false,
    minify = false,
    plugins = [],
    format = "esm",
    assets: _assets = [],
  } = options;

  // Resolve paths relative to root
  const resolvedEntrypoints = entrypoints
    .filter((entry) => entry && entry.trim() !== "") // Filter out empty strings
    .map((entry) => (entry.startsWith("./") ? entry : `./${entry}`));

  // Common external packages for Node.js targets
  const nodeExternals =
    target === "node" || target === "bun"
      ? [
          "node:*",
          "fs",
          "path",
          "crypto",
          "stream",
          "buffer",
          "util",
          "events",
          "url",
          "http",
          "https",
          "os",
          "child_process",
          "worker_threads",
          "cluster",
          "zlib",
          "querystring",
          "string_decoder",
          "tls",
          "net",
          "dns",
          "dgram",
          "readline",
          "repl",
          "vm",
          "assert",
          "console",
          "process",
          "timers",
          "perf_hooks",
          "async_hooks",
        ]
      : [];

  // elizaOS workspace packages that should typically be external
  const elizaExternals = [
    "@elizaos/core",
    "@elizaos/server",
    "@elizaos/client",
    "@elizaos/api-client",
    "@elizaos/plugin-*",
  ];

  // Filter out empty strings and clean up the external array
  const cleanExternals = [...external].filter(
    (ext) => ext && !ext.startsWith("//") && ext.trim() !== "",
  );

  const config: BuildConfig = {
    entrypoints: resolvedEntrypoints,
    outdir,
    target: target === "node" ? "node" : target,
    format,
    // Note: 'splitting' option removed as it's not part of Bun's BuildConfig type
    // splitting: format === 'esm' && entrypoints.length > 1,
    sourcemap,
    minify,
    external: [...nodeExternals, ...elizaExternals, ...cleanExternals],
    plugins,
    naming: {
      entry: "[dir]/[name].[ext]",
      chunk: "[name]-[hash].[ext]",
      asset: "[name]-[hash].[ext]",
    },
  };

  return config;
}
```