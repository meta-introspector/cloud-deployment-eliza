# 5e8c73c1:packages_cli_src_commands_scenario_src_run-isolation.ts:301-409

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/src/run-isolation.ts:301-409
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
 *
 * @param prefix - Prefix for the temporary directory name
 * @returns Path to a unique temporary directory
 */
export function getIsolatedTempDir(prefix: string = 'eliza-matrix'): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return join(tmpdir(), `${prefix}-${timestamp}-${random}`);
}

/**
 * Estimates disk space required for a scenario run.
 *
 * @param baseScenario - The scenario that will be executed
 * @returns Estimated disk space in bytes
 */
export function estimateRunDiskSpace(baseScenario: {
  run?: Array<{ evaluations?: unknown[] }>;
}): number {
  // Basic estimation based on scenario complexity
  const baseSize = 50 * 1024 * 1024; // 50 MB base
  const runCount = baseScenario.run?.length || 1;
  const evaluationCount =
    baseScenario.run?.reduce(
      (sum: number, run: { evaluations?: unknown[] }) => sum + (run.evaluations?.length || 0),
      0
    ) || 0;

  // Estimate additional space based on complexity
  const complexityMultiplier = 1 + runCount * 0.1 + evaluationCount * 0.05;

  return Math.ceil(baseSize * complexityMultiplier);
}

/**
 * Checks if there's sufficient disk space for a matrix run.
 *
 * @param outputDir - Directory where matrix output will be stored
 * @param estimatedSpace - Estimated space required in bytes
 * @returns True if there's sufficient space
 */
export async function checkDiskSpace(outputDir: string, _estimatedSpace: number): Promise<boolean> {
  try {
    await fs.stat(outputDir);
    // This is a simplified check - in a real implementation you'd check available disk space
    // For now, we'll assume there's enough space if the directory exists
    return true;
  } catch {
    // Directory doesn't exist, try to create it to test writability
    try {
      await fs.mkdir(outputDir, { recursive: true });
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Monitors an isolated environment for resource usage during execution.
 *
 * @param context - The isolation context to monitor
 * @returns Resource usage information
 */
export async function monitorIsolatedResources(context: IsolationContext): Promise<{
  diskUsage: number;
  fileCount: number;
  directorySize: number;
}> {
  try {
    // Calculate directory size and file count
    let totalSize = 0;
    let fileCount = 0;

    async function calculateSize(dirPath: string): Promise<void> {
      try {
        const entries = await fs.readdir(dirPath, { withFileTypes: true });

        for (const entry of entries) {
          const fullPath = join(dirPath, entry.name);

          if (entry.isDirectory()) {
            await calculateSize(fullPath);
          } else {
            const stats = await fs.stat(fullPath);
            totalSize += stats.size;
            fileCount++;
          }
        }
      } catch {
        // Ignore errors for individual files/directories
      }
    }

    await calculateSize(context.tempDir);

    return {
      diskUsage: totalSize,
      fileCount,
      directorySize: totalSize,
    };
  } catch {
    return {
      diskUsage: 0,
      fileCount: 0,
      directorySize: 0,
    };
  }
}
```