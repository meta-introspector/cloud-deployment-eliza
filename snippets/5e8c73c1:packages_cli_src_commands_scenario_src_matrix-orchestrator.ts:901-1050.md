# 5e8c73c1:packages_cli_src_commands_scenario_src_matrix-orchestrator.ts:901-1050

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/src/matrix-orchestrator.ts:901-1050
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
  return {
    memoryUsage: resources.memoryUsage,
    cpuUsage: resources.cpuUsage,
  };
}

/**
 * Calculates disk usage for a run.
 */
async function calculateRunDiskUsage(tempDir: string): Promise<number> {
  try {
    const { monitorIsolatedResources } = await import('./run-isolation');
    const context: IsolationContext = {
      tempDir,
      runId: '',
      scenarioPath: '',
      dbPath: '',
      logPath: '',
      cleanup: async () => {},
    };
    const resources = await monitorIsolatedResources(context);
    return resources.diskUsage;
  } catch {
    return 0;
  }
}

/**
 * Saves matrix configuration to output directory.
 */
async function saveMatrixConfiguration(config: MatrixConfig, outputDir: string): Promise<void> {
  const configPath = join(outputDir, 'config.yaml');
  await fs.writeFile(configPath, JSON.stringify(config, null, 2));
}

/**
 * Saves individual run result.
 */
async function saveRunResult(result: MatrixRunResult, outputDir: string): Promise<void> {
  const runsDir = join(outputDir, 'runs');
  await fs.mkdir(runsDir, { recursive: true });

  const resultPath = join(runsDir, `${result.runId}.json`);
  await fs.writeFile(resultPath, JSON.stringify(result, null, 2));
}

/**
 * Creates a combination summary from results.
 */
function createCombinationSummary(
  combinationId: string,
  allResults: MatrixRunResult[]
): CombinationSummary {
  const combinationResults = allResults.filter((r) => r.combinationId === combinationId);
  const successfulRuns = combinationResults.filter((r) => r.success).length;
  const failedRuns = combinationResults.length - successfulRuns;
  const successRate =
    combinationResults.length > 0 ? successfulRuns / combinationResults.length : 0;
  const averageDuration =
    combinationResults.length > 0
      ? combinationResults.reduce((sum, r) => sum + r.duration, 0) / combinationResults.length
      : 0;

  return {
    combinationId,
    parameters: combinationResults[0]?.parameters || {},
    totalRuns: combinationResults.length,
    successfulRuns,
    failedRuns,
    successRate,
    averageDuration,
    runs: combinationResults,
  };
}

/**
 * Generates comprehensive execution summary.
 */
async function generateExecutionSummary(
  _config: MatrixConfig,
  combinations: MatrixCombination[],
  results: MatrixRunResult[],
  startTime: Date,
  endTime: Date,
  resourceMonitor: ResourceMonitor
): Promise<MatrixExecutionSummary> {
  const totalDuration = endTime.getTime() - startTime.getTime();
  const successfulRuns = results.filter((r) => r.success).length;
  const failedRuns = results.length - successfulRuns;
  const successRate = results.length > 0 ? successfulRuns / results.length : 0;
  const averageRunTime =
    results.length > 0 ? results.reduce((sum, r) => sum + r.duration, 0) / results.length : 0;

  // Generate combination summaries
  const combinationSummaries = combinations.map((combination) =>
    createCombinationSummary(combination.id, results)
  );

  // Calculate resource usage statistics
  const resourceStats = resourceMonitor.getStatistics();

  return {
    totalRuns: results.length,
    successfulRuns,
    failedRuns,
    totalDuration,
    averageRunTime,
    successRate,
    combinations: combinationSummaries,
    startTime,
    endTime,
    resourceUsage: {
      peakMemoryUsage: resourceStats.memory.max,
      peakDiskUsage: resourceStats.disk.max,
      peakCpuUsage: resourceStats.cpu.max,
      averageMemoryUsage: resourceStats.memory.average,
      averageDiskUsage: resourceStats.disk.average,
      averageCpuUsage: resourceStats.cpu.average,
    },
  };
}

/**
 * Saves execution summary to output directory.
 */
async function saveSummary(summary: MatrixExecutionSummary, outputDir: string): Promise<void> {
  const summaryPath = join(outputDir, 'summary.json');
  await fs.writeFile(summaryPath, JSON.stringify(summary, null, 2));

  // Also create logs directory structure
  const logsDir = join(outputDir, 'logs');
  await fs.mkdir(logsDir, { recursive: true });

  // Create matrix execution log
  const logPath = join(logsDir, 'matrix-execution.log');
  const logContent = [
    `Matrix Execution Summary`,
    `========================`,
    `Start Time: ${summary.startTime.toISOString()}`,
    `End Time: ${summary.endTime.toISOString()}`,
    `Total Duration: ${summary.totalDuration}ms`,
    `Total Runs: ${summary.totalRuns}`,
    `Successful Runs: ${summary.successfulRuns}`,
    `Failed Runs: ${summary.failedRuns}`,
    `Success Rate: ${(summary.successRate * 100).toFixed(1)}%`,
    `Average Run Time: ${summary.averageRunTime.toFixed(0)}ms`,
    ``,
    `Resource Usage:`,
    `- Peak Memory: ${summary.resourceUsage.peakMemoryUsage.toFixed(1)}%`,
    `- Peak Disk: ${summary.resourceUsage.peakDiskUsage.toFixed(1)}%`,
```