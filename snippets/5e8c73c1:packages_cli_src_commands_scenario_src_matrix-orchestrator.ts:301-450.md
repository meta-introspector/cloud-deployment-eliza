# 5e8c73c1:packages_cli_src_commands_scenario_src_matrix-orchestrator.ts:301-450

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/src/matrix-orchestrator.ts:301-450
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```

        // Track active run
        const context = await createIsolatedEnvironment(runId, outputDir);
        activeRuns.set(runId, {
          runId,
          combinationId: combination.id,
          parameters: combination.parameters,
          context,
          startTime: new Date(),
          promise: runPromise,
        });

        // Handle run completion
        runPromise
          .then(async (result) => {
            results.push(result);
            combinationResults.push(result);

            // Save individual run result
            await saveRunResult(result, outputDir);

            // Cleanup active run tracking
            const activeRun = activeRuns.get(runId);
            if (activeRun) {
              try {
                await activeRun.context.cleanup();
              } catch (cleanupError) {}
              activeRuns.delete(runId);

              // Force garbage collection if available
              if (global.gc) {
                global.gc();
              }
            }
          })
          .catch(async (error) => {
            // Capture actual resource usage even for failed runs
            let resourceMetrics = {
              memoryUsage: 0,
              diskUsage: 0,
              tokenCount: 0,
              cpuUsage: 0,
            };

            try {
              const resourcesAfter = await getResourceSnapshot();
              const activeRun = activeRuns.get(runId);
              if (activeRun) {
                resourceMetrics = {
                  memoryUsage: resourcesAfter.memoryUsage,
                  diskUsage: await calculateRunDiskUsage(activeRun.context.tempDir),
                  tokenCount: 0, // No scenario result to estimate from
                  cpuUsage: resourcesAfter.cpuUsage,
                };
              }
            } catch (metricsError) {
              // Metrics collection failed - use default values, don't fail the run
              logger.debug(
                {
                  src: 'cli',
                  command: 'scenario:matrix',
                  error:
                    metricsError instanceof Error ? metricsError.message : String(metricsError),
                },
                'Failed to collect resource metrics for failed run'
              );
            }

            // Handle run failure
            const failedResult: MatrixRunResult = {
              runId,
              combinationId: combination.id,
              parameters: combination.parameters,
              startTime: new Date(),
              endTime: new Date(),
              duration: 0,
              success: false,
              error: error.message,
              metrics: resourceMetrics,
            };

            results.push(failedResult);
            await saveRunResult(failedResult, outputDir);

            // Enhanced cleanup for failed runs
            const activeRun = activeRuns.get(runId);
            if (activeRun) {
              try {
                await activeRun.context.cleanup();
              } catch (cleanupError) {
                // Cleanup failed - log but don't fail the run
                logger.debug(
                  {
                    src: 'cli',
                    command: 'scenario:matrix',
                    error:
                      cleanupError instanceof Error ? cleanupError.message : String(cleanupError),
                  },
                  'Failed to cleanup context for failed run'
                );
              }
              activeRuns.delete(runId);

              // Force garbage collection if available
              if (global.gc) {
                global.gc();
              }
            }

            if (!continueOnFailure) {
              throw error;
            }
          });
      }

      // Wait for all runs in this combination to complete
      try {
        await waitForCombinationCompletion(combination.id, activeRuns);
      } catch (error) {
        // Continue with next combination even if this one failed
        if (!continueOnFailure) {
          throw error;
        }
      }

      // Mark combination as complete
      progressTracker.completeCombination(combination.id);
    }

    // Wait for all remaining runs to complete
    await waitForAllRunsCompletion(activeRuns);

    // Generate and save final summary
    const summary = await generateExecutionSummary(
      config,
      combinations,
      results,
      startTime,
      new Date(),
      resourceMonitor
    );

    await saveSummary(summary, outputDir);

    return results;
  } finally {
    // Cleanup shared server if it was created
    if (sharedServer) {
      try {
        const { shutdownScenarioServer } = await import('./runtime-factory');
```