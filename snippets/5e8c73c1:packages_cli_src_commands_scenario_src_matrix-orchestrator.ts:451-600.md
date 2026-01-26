# 5e8c73c1:packages_cli_src_commands_scenario_src_matrix-orchestrator.ts:451-600

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/src/matrix-orchestrator.ts:451-600
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
        await shutdownScenarioServer(sharedServer.server, sharedServer.port);
      } catch (error) {}
    }

    // Cleanup
    resourceMonitor.stop();

    // Log final process state before cleanup
    const finalSummary = processManager.getSummary();
    if (finalSummary.total > 0) {
    }

    // Ensure all isolated environments are cleaned up
    for (const activeRun of activeRuns.values()) {
      try {
        await activeRun.context.cleanup();
      } catch (error) {}
    }
  }
}

/**
 * Executes a single isolated run.
 */
async function executeIndividualRun(
  runId: string,
  combination: MatrixCombination,
  baseScenario: Scenario,
  outputDir: string,
  progressTracker: ProgressTracker,
  _resourceMonitor: ResourceMonitor,
  timeout: number,
  sharedServer?: { server: AgentServer; port: number }, // Optional shared server for matrix testing
  dynamicPlugins?: string[] // Plugins extracted from scenario configuration
): Promise<MatrixRunResult> {
  const startTime = new Date();

  // Add timeout wrapper to prevent hanging
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Run ${runId} timed out after ${timeout}ms`));
    }, timeout);
  });

  try {
    // Start progress tracking
    progressTracker.startRun(runId, combination.id, combination.parameters);

    // Create isolated environment
    const context = await createIsolatedEnvironment(runId, outputDir);

    try {
      // Apply parameter overrides and write temporary scenario
      await writeTemporaryScenario(context.scenarioPath, baseScenario, combination.parameters);

      // Monitor resources before run
      const resourcesBefore = await getResourceSnapshot();
      // Execute scenario with timeout and race against timeout wrapper
      const scenarioResult = await Promise.race([
        executeScenarioWithTimeout(
          context.scenarioPath,
          context,
          timeout,
          (progress, status) => {
            progressTracker.updateRunProgress(runId, progress, status);
          },
          sharedServer, // Pass shared server if available
          runId, // Pass runId for unique agent naming
          dynamicPlugins // Pass dynamic plugins from scenario configuration
        ),
        timeoutPromise,
      ]);

      // Monitor resources after run
      const resourcesAfter = await getResourceSnapshot();

      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();

      // Calculate metrics
      const metrics = {
        memoryUsage: resourcesAfter.memoryUsage - resourcesBefore.memoryUsage,
        diskUsage: await calculateRunDiskUsage(context.tempDir),
        tokenCount: scenarioResult.tokenCount || 0,
        cpuUsage: resourcesAfter.cpuUsage,
      };

      // Mark run as completed
      progressTracker.completeRun(runId, true, duration);

      const result: MatrixRunResult = {
        runId,
        combinationId: combination.id,
        parameters: combination.parameters,
        startTime,
        endTime,
        duration,
        success: true,
        scenarioResult,
        metrics,
      };

      return result;
    } finally {
      // Always cleanup isolated environment
      await context.cleanup();
    }
  } catch (error) {
    const endTime = new Date();
    const duration = endTime.getTime() - startTime.getTime();

    // Mark run as failed
    progressTracker.completeRun(
      runId,
      false,
      duration,
      error instanceof Error ? error.message : String(error)
    );

    // Try to capture actual resource usage even for failed runs
    let resourceMetrics = {
      memoryUsage: 0,
      diskUsage: 0,
      tokenCount: 0,
      cpuUsage: 0,
    };

    const resourcesAfter = await getResourceSnapshot();
    resourceMetrics = {
      memoryUsage: resourcesAfter.memoryUsage,
      diskUsage: 0, // Can't measure temp dir if context cleanup failed
      tokenCount: 0,
      cpuUsage: resourcesAfter.cpuUsage,
    };

    return {
      runId,
      combinationId: combination.id,
      parameters: combination.parameters,
      startTime,
      endTime,
      duration,
      success: false,
      error: error instanceof Error ? error.message : String(error),
      metrics: resourceMetrics,
    };
  }
}

/**
```