# 5e8c73c1:packages_cli_src_commands_scenario_src_matrix-orchestrator.ts:751-900

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/src/matrix-orchestrator.ts:751-900
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
                );
                evaluationResults.push(...stepEvaluations);
              } catch (evaluationError) {
                // Still add a failed evaluation result
                evaluationResults.push({
                  evaluator_type: 'step_evaluation_failed',
                  success: false,
                  summary: `Step ${i} evaluations failed: ${evaluationError instanceof Error ? evaluationError.message : String(evaluationError)}`,
                  details: { step: i, error: String(evaluationError) },
                });
              }
            }
          }
        }

        onProgress(0.9, 'Processing results...');

        // Calculate success based on judgment strategy
        let success = false;
        if (scenario.judgment?.strategy === 'all_pass') {
          success = evaluationResults.every((r) => r.success);
        } else if (scenario.judgment?.strategy === 'any_pass') {
          success = evaluationResults.some((r) => r.success);
        } else {
          success = evaluationResults.length > 0 && evaluationResults.every((r) => r.success);
        }

        // Cleanup: Only shut down server if we created it (single scenario mode)
        // For shared server mode, we only clean up the agent
        if (serverCreated) {
          await shutdownScenarioServer(server, port);
        } else {
          // Stop the agent but keep the server running
          if (server && typeof server.unregisterAgent === 'function') {
            server.unregisterAgent(agentId);
          } else {
          }
        }

        onProgress(1.0, 'Complete');

        const result = {
          success,
          evaluations: evaluationResults,
          executionResults,
          tokenCount: estimateTokenCount(executionResults),
          duration: Date.now() - scenarioStartTime, // Actual execution duration in ms
        };

        clearTimeout(timeoutHandle);
        resolve(result);
      } finally {
        // Restore original environment
        process.env = originalEnv;
      }
    } catch (error) {
      clearTimeout(timeoutHandle);
      reject(error);
    }
  });
}

/**
 * Estimates token count from execution results using actual trajectory data.
 */
function estimateTokenCount(executionResults: ExecutionResult[]): number {
  let tokenCount = 0;

  for (const result of executionResults) {
    // Count tokens from stdout (agent's response)
    if (result.stdout) {
      tokenCount += Math.ceil(result.stdout.length / 4);
    }

    // Count tokens from stderr if present
    if (result.stderr) {
      tokenCount += Math.ceil(result.stderr.length / 4);
    }

    // Count tokens from trajectory steps (thoughts, actions, observations)
    if (result.trajectory && Array.isArray(result.trajectory)) {
      for (const step of result.trajectory) {
        if (step.content) {
          if (typeof step.content === 'string') {
            tokenCount += Math.ceil(step.content.length / 4);
          } else if (typeof step.content === 'object') {
            // For action content, count the stringified version
            tokenCount += Math.ceil(JSON.stringify(step.content).length / 4);
          }
        }
      }
    }
  }

  return tokenCount;
}

/**
 * Waits for an available execution slot.
 */
async function waitForAvailableSlot(
  activeRuns: Map<string, ActiveRun>,
  maxParallel: number
): Promise<void> {
  while (activeRuns.size >= maxParallel) {
    // Wait for at least one run to complete
    const promises = Array.from(activeRuns.values()).map((run) => run.promise);
    if (promises.length === 0) {
      break;
    }

    await Promise.race(promises);

    // Give the promise handlers time to clean up
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}

/**
 * Waits for all runs in a combination to complete.
 */
async function waitForCombinationCompletion(
  combinationId: string,
  activeRuns: Map<string, ActiveRun>
): Promise<void> {
  const combinationRuns = Array.from(activeRuns.values()).filter(
    (run) => run.combinationId === combinationId
  );

  if (combinationRuns.length > 0) {
    await Promise.allSettled(combinationRuns.map((run) => run.promise));
  }
}

/**
 * Waits for all active runs to complete.
 */
async function waitForAllRunsCompletion(activeRuns: Map<string, ActiveRun>): Promise<void> {
  const promises = Array.from(activeRuns.values()).map((run) => run.promise);
  if (promises.length > 0) {
    await Promise.allSettled(promises);
  }
}

/**
 * Gets a snapshot of current system resources.
 */
async function getResourceSnapshot(): Promise<{ memoryUsage: number; cpuUsage: number }> {
  const { getSystemResources } = await import('./resource-monitor');
  const resources = await getSystemResources();
```