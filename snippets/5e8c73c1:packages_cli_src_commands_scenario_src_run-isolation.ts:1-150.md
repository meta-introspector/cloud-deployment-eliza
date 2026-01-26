# 5e8c73c1:packages_cli_src_commands_scenario_src_run-isolation.ts:1-150

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/src/run-isolation.ts:1-150
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
/**
 * Run Isolation System for Matrix Testing
 *
 * This module provides complete isolation between scenario runs to prevent
 * interference and ensure clean execution environments. Each run gets its own
 * temporary directory, database instance, and log files.
 *
 * Required by ticket #5782 - Acceptance Criterion 2.
 */

import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { tmpdir } from 'os';
// Import will be done dynamically to avoid circular dependencies

/**
 * Represents a completely isolated environment for a single scenario run.
 */
export interface IsolationContext {
  /** Unique identifier for this run */
  runId: string;
  /** Root temporary directory for this run */
  tempDir: string;
  /** Path to isolated database directory */
  dbPath: string;
  /** Path to log file for this run */
  logPath: string;
  /** Path to temporary scenario file with overrides applied */
  scenarioPath: string;
  /** Cleanup function that removes all artifacts */
  cleanup: () => Promise<void>;
}

/**
 * Global run sequence counter for generating unique run IDs.
 */
let runSequence = 0;

/**
 * Resets the run sequence counter (useful for testing).
 */
export function resetRunSequence(): void {
  runSequence = 0;
}

/**
 * Generates a unique run ID with sequence number and hash.
 *
 * @returns Unique run ID in format "run-XXX-hash"
 */
export function generateRunId(): string {
  const sequence = String(runSequence++).padStart(3, '0');
  const hash = Math.random().toString(16).substring(2, 10);
  return `run-${sequence}-${hash}`;
}

/**
 * Creates a completely isolated environment for a scenario run.
 *
 * This function sets up:
 * - Isolated temporary directory
 * - Separate database path
 * - Individual log file
 * - Clean environment state
 *
 * @param runId - Unique identifier for this run
 * @param outputDir - Base output directory for the matrix execution
 * @returns Isolation context with cleanup function
 */
export async function createIsolatedEnvironment(
  runId: string,
  outputDir: string
): Promise<IsolationContext> {
  // Create isolated temporary directory
  const tempDir = join(outputDir, 'temp', runId);
  await fs.mkdir(tempDir, { recursive: true });

  // Set up isolated paths
  const dbPath = join(tempDir, 'database');
  const logsDir = join(tempDir, 'logs');
  const logPath = join(logsDir, 'run.log');
  const scenarioPath = join(tempDir, 'scenario.yaml');

  // Create necessary subdirectories
  await fs.mkdir(dirname(logPath), { recursive: true });
  await fs.mkdir(dbPath, { recursive: true });

  // Create cleanup function
  const cleanup = async () => {
    await cleanupIsolatedEnvironment({
      runId,
      tempDir,
      dbPath,
      logPath,
      scenarioPath,
      cleanup: () => Promise.resolve(),
    });
  };

  return {
    runId,
    tempDir,
    dbPath,
    logPath,
    scenarioPath,
    cleanup,
  };
}

/**
 * Completely removes an isolated environment and all its artifacts.
 *
 * @param context - The isolation context to clean up
 */
export async function cleanupIsolatedEnvironment(context: IsolationContext): Promise<void> {
  try {
    // Remove the entire temporary directory tree
    await fs.rm(context.tempDir, { recursive: true, force: true });
  } catch (error) {
    // Log cleanup errors but don't throw - cleanup should be resilient
    console.warn(`Warning: Failed to cleanup isolated environment ${context.runId}:`, error);
  }
}

/**
 * Ensures the isolated database directory is properly configured.
 *
 * @param dbPath - Path to the isolated database directory
 */
export async function ensureIsolatedDatabase(dbPath: string): Promise<void> {
  try {
    // Ensure database directory exists
    await fs.mkdir(dbPath, { recursive: true });

    // Create database configuration file for isolation
    const dbConfig = {
      type: 'pglite',
      path: dbPath,
      isolated: true,
      temporary: true,
    };

    const configPath = join(dbPath, 'config.json');
    await fs.writeFile(configPath, JSON.stringify(dbConfig, null, 2));
  } catch (error) {
    throw new Error(
      `Failed to setup isolated database: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}
```