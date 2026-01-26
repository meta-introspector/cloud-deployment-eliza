# 5e8c73c1:packages_cli_src_commands_scenario_src_run-isolation.ts:151-300

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/src/run-isolation.ts:151-300
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```

/**
 * Writes a temporary scenario file with parameter overrides applied.
 *
 * @param scenarioPath - Path where the temporary scenario should be written
 * @param baseScenario - The base scenario object to modify
 * @param parameters - Parameter overrides to apply
 */
export async function writeTemporaryScenario(
  scenarioPath: string,
  baseScenario: Record<string, unknown>,
  parameters: Record<string, unknown>
): Promise<void> {
  try {
    // Simple parameter application for isolated runs
    // Create a deep copy of the base scenario
    const modifiedScenario = JSON.parse(JSON.stringify(baseScenario));

    // Apply simple parameter overrides
    for (const [path, value] of Object.entries(parameters)) {
      setNestedProperty(modifiedScenario, path, value);
    }

    // Write the modified scenario to the temporary file
    await fs.writeFile(scenarioPath, JSON.stringify(modifiedScenario, null, 2));
  } catch (error) {
    throw new Error(
      `Failed to write temporary scenario: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Simple utility to set nested properties using dot notation.
 * This is a simplified version that avoids complex dependencies.
 */
function setNestedProperty(obj: Record<string, unknown>, path: string, value: unknown): void {
  const keys = path.split('.');
  let current: Record<string, unknown> = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    // Handle array access like "run[0]"
    const arrayMatch = key.match(/^(.+)\[(\d+)\]$/);
    if (arrayMatch) {
      const arrayKey = arrayMatch[1]!;
      const index = parseInt(arrayMatch[2]!, 10);

      if (!current[arrayKey]) {
        current[arrayKey] = [];
      }
      const arr = current[arrayKey] as unknown[];
      if (!arr[index]) {
        arr[index] = {};
      }
      current = arr[index] as Record<string, unknown>;
    } else {
      if (!current[key]) {
        current[key] = {};
      }
      current = current[key] as Record<string, unknown>;
    }
  }

  // Set the final value
  const finalKey = keys[keys.length - 1];
  const finalArrayMatch = finalKey.match(/^(.+)\[(\d+)\]$/);
  if (finalArrayMatch) {
    const arrayKey = finalArrayMatch[1]!;
    const index = parseInt(finalArrayMatch[2]!, 10);

    if (!current[arrayKey]) {
      current[arrayKey] = [];
    }
    (current[arrayKey] as unknown[])[index] = value;
  } else {
    current[finalKey] = value;
  }
}

/**
 * Validates that an isolation context is properly set up.
 *
 * @param context - The isolation context to validate
 * @returns True if the context is valid and ready for use
 */
export async function validateIsolationContext(context: IsolationContext): Promise<boolean> {
  try {
    // Check that all required directories exist
    const tempDirExists = await fs
      .access(context.tempDir)
      .then(() => true)
      .catch(() => false);
    const dbDirExists = await fs
      .access(context.dbPath)
      .then(() => true)
      .catch(() => false);
    const logDirExists = await fs
      .access(dirname(context.logPath))
      .then(() => true)
      .catch(() => false);

    return tempDirExists && dbDirExists && logDirExists;
  } catch {
    return false;
  }
}

/**
 * Creates environment variables for isolated execution.
 *
 * @param context - The isolation context
 * @returns Environment variables object
 */
export function createIsolatedEnvironmentVariables(
  context: IsolationContext
): Record<string, string> {
  const baseEnv = { ...process.env };

  // Override database-related environment variables for isolation
  const isolatedEnv = {
    ...baseEnv,
    // Point to isolated database
    DATABASE_URL: `file://${context.dbPath}/database.db`,
    PGLITE_DATA_DIR: context.dbPath,

    // Set isolated temp directory
    TMPDIR: context.tempDir,
    TEMP: context.tempDir,
    TMP: context.tempDir,

    // Set log configuration
    LOG_FILE: context.logPath,
    LOG_LEVEL: 'debug',

    // Mark as isolated execution
    ELIZA_ISOLATED_RUN: 'true',
    ELIZA_RUN_ID: context.runId,

    // Disable any global state or caching
    DISABLE_GLOBAL_CACHE: 'true',
    FORCE_ISOLATED_MODE: 'true',
  };

  return isolatedEnv;
}

/**
 * Gets the current system temporary directory with a unique subdirectory.
```