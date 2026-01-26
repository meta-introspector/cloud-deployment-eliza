# 5e8c73c1:packages_cli_src_commands_scenario_src_matrix-orchestrator.ts:151-300

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/src/matrix-orchestrator.ts:151-300
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
  startTime: Date;
  promise: Promise<MatrixRunResult>;
}

/**
 * Main function to execute all matrix runs with complete orchestration.
 *
 * This function implements all acceptance criteria from ticket #5782:
 * - Matrix execution loop with progress tracking
 * - Complete run isolation and cleanup
 * - Scenario override integration
 * - Data collection and storage
 * - Error handling and recovery
 * - Resource management
 *
 * @param config - Matrix configuration
 * @param combinations - All combinations to execute
 * @param options - Execution options
 * @returns Array of all run results
 */
export async function executeMatrixRuns(
  config: MatrixConfig,
  combinations: MatrixCombination[],
  options: MatrixExecutionOptions
): Promise<MatrixRunResult[]> {
  const startTime = new Date();
  const results: MatrixRunResult[] = [];
  const activeRuns = new Map<string, ActiveRun>();

  // Declare shared server at function scope for cleanup
  let sharedServer: { server: AgentServer; port: number } | null = null;

  // Setup execution environment
  const { outputDir, maxParallel = 1, continueOnFailure = true, runTimeout = 300000 } = options;
  await fs.mkdir(outputDir, { recursive: true });

  // Initialize progress tracking
  const progressTracker = createProgressTracker({
    totalCombinations: combinations.length,
    runsPerCombination: config.runs_per_combination,
    onProgress: options.onProgress,
    onCombinationComplete: (combinationProgress) => {
      if (options.onCombinationComplete) {
        const summary = createCombinationSummary(combinationProgress.combinationId, results);
        options.onCombinationComplete(summary);
      }
    },
  });

  // Initialize resource monitoring
  const resourceMonitor = createResourceMonitor({
    thresholds: {
      memoryWarning: 75,
      memoryCritical: 90,
      diskWarning: 80,
      diskCritical: 95,
      cpuWarning: 80,
      cpuCritical: 95,
    },
    onAlert: options.onResourceWarning,
    onUpdate: options.onResourceUpdate,
    checkInterval: 5000,
  });

  resourceMonitor.start();

  try {
    // Load base scenario
    const baseScenarioContent = await fs.readFile(config.base_scenario, 'utf8');
    let baseScenario: Scenario;

    try {
      // Try parsing as JSON first
      baseScenario = JSON.parse(baseScenarioContent);
    } catch {
      // If JSON fails, try YAML
      const yaml = await import('js-yaml');
      baseScenario = yaml.load(baseScenarioContent) as Scenario;
    }

    // Copy matrix configuration to output directory
    await saveMatrixConfiguration(config, outputDir);

    // Extract plugins from base scenario configuration
    const defaultPlugins = ['@elizaos/plugin-sql', '@elizaos/plugin-bootstrap'];
    const scenarioPlugins = Array.isArray(baseScenario.plugins)
      ? baseScenario.plugins
          .filter(
            (p: string | { name: string; enabled?: boolean }) =>
              typeof p === 'string' || p.enabled !== false
          )
          .map((p: string | { name: string }) => (typeof p === 'string' ? p : p.name))
      : [];
    const finalPlugins = Array.from(
      new Set([...scenarioPlugins, ...defaultPlugins, '@elizaos/plugin-openai'])
    );

    if (combinations.length > 1 || config.runs_per_combination > 1) {
      console.log(
        '🔧 [DEBUG] Matrix testing detected - creating shared server for better isolation...'
      );
      const { createScenarioServer } = await import('./runtime-factory');

      try {
        const serverResult = await createScenarioServer(null, 3000);
        sharedServer = {
          server: serverResult.server,
          port: serverResult.port,
        };
      } catch (error) {
        sharedServer = null;
      }
    }

    // Execute all combinations
    let runCounter = 0;

    for (const combination of combinations) {
      const combinationResults: MatrixRunResult[] = [];

      // Execute all runs for this combination
      for (let runIndex = 0; runIndex < config.runs_per_combination; runIndex++) {
        const memoryUsage = process.memoryUsage();

        // Check if memory usage is too high and force cleanup
        if (memoryUsage.heapUsed > 500 * 1024 * 1024) {
          // 500MB threshold
          if (global.gc) {
            global.gc();
          }
        }

        runCounter++;
        const runId = generateRunFilename(runCounter);

        // Wait for available slot if we're at max parallelism
        await waitForAvailableSlot(activeRuns, maxParallel);

        // Start the run (with optional shared server)
        const runPromise = executeIndividualRun(
          runId,
          combination,
          baseScenario,
          outputDir,
          progressTracker,
          resourceMonitor,
          runTimeout,
          sharedServer ?? undefined, // Pass shared server if available
          finalPlugins // Pass dynamic plugins from scenario configuration
        );
```