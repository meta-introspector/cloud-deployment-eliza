# a7046c18:scripts_debug-cli-delegation.ts:1-150

**Commit:** a7046c1843f76b29f0432654f631f950f18a4390
**Author:** lalalune
**Date:** Thu Jan 8 23:05:40 2026 -0800
**File:** scripts/debug-cli-delegation.ts:1-150
**Novelty Score:** 23659.22
**Concepts:** agent-system, authentication, blockchain, cache, containerization, documentation, embedded-db, event-driven, llm-integration, orchestration, performance, plugin-system, postgres, prompt-engineering, rag-system, rust-async, security, testing

```
#!/usr/bin/env bun

/**
 * elizaOS CLI Delegation Debug Tool
 *
 * This script helps diagnose issues with elizaOS CLI local delegation.
 * When you run `elizaos` commands, the CLI should automatically detect
 * and use local installations when available. This tool helps identify
 * why delegation might not be working.
 *
 * Usage:
 *   bun scripts/debug-cli-delegation.ts          # Run debug analysis
 *   bun scripts/debug-cli-delegation.ts --fix    # Attempt to fix common issues
 *   bun scripts/debug-cli-delegation.ts --help   # Show help
 *
 * Common Issues:
 *   1. No local @elizaos/cli installation
 *   2. Environment variables preventing delegation
 *   3. Running in test/CI mode
 *   4. Already running from local CLI
 *
 * @author elizaOS Team
 * @version 1.0.0
 */

import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import {
  bunExecInherit,
  type ExecResult,
} from "../packages/cli/src/utils/bun-exec";

// Define proper types for better type safety
interface PackageJson {
  name?: string;
  type?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

interface Colors {
  reset: string;
  bright: string;
  red: string;
  green: string;
  yellow: string;
  blue: string;
  magenta: string;
  cyan: string;
}

interface DebugResult {
  hasLocalCli: boolean;
  isRunningFromLocal: boolean;
  problematicEnvVars: string[];
  problematicArgs: string[];
  delegationWouldSucceed: boolean;
}

// Custom error types for better error handling
class DebugToolError extends Error {
  constructor(
    message: string,
    public readonly code: string,
  ) {
    super(message);
    this.name = "DebugToolError";
  }
}

class PackageInstallError extends DebugToolError {
  constructor(
    message: string,
    public readonly stderr: string,
  ) {
    super(message, "PACKAGE_INSTALL_ERROR");
  }
}

// Colors for better output
const colors: Colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

// Parse command line arguments
const args = process.argv.slice(2);
const shouldFix = args.includes("--fix");
const showHelp = args.includes("--help") || args.includes("-h");

/**
 * Display help information
 */
function displayHelp(): void {
  console.log(`${colors.cyan}elizaOS CLI Delegation Debug Tool${colors.reset}`);
  console.log(`${colors.bright}Usage:${colors.reset}`);
  console.log(
    `  bun scripts/debug-cli-delegation.ts          # Run debug analysis`,
  );
  console.log(
    `  bun scripts/debug-cli-delegation.ts --fix    # Attempt to fix common issues`,
  );
  console.log(
    `  bun scripts/debug-cli-delegation.ts --help   # Show this help`,
  );
  console.log();
  console.log(`${colors.bright}Description:${colors.reset}`);
  console.log(
    `  This tool diagnoses why elizaOS CLI local delegation might not be working.`,
  );
  console.log(
    `  The CLI should automatically use local installations when available.`,
  );
  process.exit(0);
}

/**
 * Check if the local CLI exists and get its path
 */
function checkLocalCli(): { exists: boolean; path: string } {
  const localCliPath = path.join(
    process.cwd(),
    "node_modules",
    "@elizaos",
    "cli",
    "dist",
    "index.js",
  );

  return {
    exists: existsSync(localCliPath),
    path: localCliPath,
  };
}

/**
 * Check if we're currently running from the local CLI
 */
function isRunningFromLocalCli(localCliPath: string): boolean {
  const currentScriptPath = process.argv[1];
  const expectedLocalCliPath = path.resolve(localCliPath);
  const currentResolvedPath = currentScriptPath
    ? path.resolve(currentScriptPath)
    : "unknown";
```