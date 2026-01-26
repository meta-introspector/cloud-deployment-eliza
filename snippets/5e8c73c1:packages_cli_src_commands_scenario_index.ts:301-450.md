# 5e8c73c1:packages_cli_src_commands_scenario_index.ts:301-450

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/index.ts:301-450
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
              if (step.evaluations && step.evaluations.length > 0) {
                const stepEvaluationResults: Array<{
                  success: boolean;
                  message: string;
                  [key: string]: unknown;
                }> = [];

                for (const evaluation of step.evaluations) {
                  let evaluationResult: {
                    success: boolean;
                    message: string;
                    [key: string]: unknown;
                  };

                  // Handle basic evaluators that don't need runtime
                  if (evaluation.type === 'string_contains') {
                    const success = result.stdout.includes(evaluation.value);
                    evaluationResult = {
                      success,
                      message: `Checked if stdout contains "${evaluation.value}". Result: ${success}`,
                    };
                  } else if (evaluation.type === 'regex_match') {
                    const success = new RegExp(evaluation.pattern).test(result.stdout);
                    evaluationResult = {
                      success,
                      message: `Checked if stdout matches regex "${evaluation.pattern}". Result: ${success}`,
                    };
                  } else {
                    // Unknown evaluator type
                    evaluationResult = {
                      success: false,
                      message: `Unknown evaluator type: '${evaluation.type}' (requires runtime)`,
                    };
                  }

                  stepEvaluationResults.push(evaluationResult);
                  allEvaluationResults.push(evaluationResult);
                }

                // Save basic evaluation results to file (same as runtime evaluations)
                const evaluationFilename = generateStepFilename(runId, i, 'evaluation');
                const evaluationPath = path.join(logsDir, evaluationFilename);
                fs.writeFileSync(evaluationPath, JSON.stringify(stepEvaluationResults, null, 2));
                logger.info(`📊 Basic evaluation results written to: ${evaluationPath}`);
              }
            }
          }

          // Report evaluation results using Reporter
          reporter?.reportEvaluationResults(allEvaluationResults);

          // Apply judgment logic
          if (scenario.judgment?.strategy === 'all_pass') {
            finalStatus = allEvaluationResults.every((res) => res.success);
          } else if (scenario.judgment?.strategy === 'any_pass') {
            finalStatus = allEvaluationResults.some((res) => res.success);
          } else {
            // Default to fail for unknown strategies
            finalStatus = false;
          }

          // Generate centralized ScenarioRunResult (Ticket #5786)
          if (dataAggregator && runtime) {
            try {
              // Record execution metrics
              const executionTimeSeconds = (endTime - startTime) / 1000;
              dataAggregator.recordMetrics({
                execution_time_seconds: executionTimeSeconds,
                llm_calls: 1, // TODO: Track actual LLM calls
                total_tokens: 500, // TODO: Track actual token usage
              });

              // Record final agent response (from last result)
              const lastResult = results[results.length - 1];
              if (lastResult && lastResult.stdout) {
                dataAggregator.recordFinalResponse(lastResult.stdout);
              }

              // Build the centralized result
              const roomId = agentId; // Use agentId as roomId for single runs
              const combinedExecutionResult = {
                exitCode: finalStatus ? 0 : 1,
                stdout: results.map((r) => r.stdout).join('\n'),
                stderr: results.map((r) => r.stderr).join('\n'),
                durationMs: endTime - startTime,
                files: {}, // Add required files property
              };

              // Convert legacy evaluation results to enhanced format for data aggregator
              const enhancedEvaluationResults: EnhancedEvaluationResult[] =
                allEvaluationResults.map((result): EnhancedEvaluationResult => {
                  // If the result has _enhanced field, use that (enhanced format)
                  if (result._enhanced) {
                    return result._enhanced as EnhancedEvaluationResult;
                  }
                  // If the result already has the enhanced format structure, use it directly
                  if (
                    result.evaluator_type &&
                    result.summary &&
                    result.details &&
                    typeof result.evaluator_type === 'string' &&
                    typeof result.summary === 'string' &&
                    typeof result.details === 'object' &&
                    result.details !== null
                  ) {
                    return {
                      evaluator_type: result.evaluator_type,
                      success: result.success || false,
                      summary: result.summary,
                      details: result.details as Record<string, unknown>,
                    };
                  }
                  // Otherwise, create a basic enhanced format from legacy
                  return {
                    evaluator_type: 'legacy',
                    success: result.success || false,
                    summary: result.message || 'Legacy evaluation result',
                    details: {
                      legacy_result: result,
                      converted: true,
                    },
                  };
                });

              const scenarioRunResult = await dataAggregator.buildResult(
                roomId,
                enhancedEvaluationResults,
                combinedExecutionResult
              );

              // Write centralized result to file with new naming pattern
              const centralizedFilename = `${runId}.json`;
              const centralizedPath = path.join(logsDir, centralizedFilename);
              fs.writeFileSync(centralizedPath, JSON.stringify(scenarioRunResult, null, 2));
              logger.info(`📋 [DataAggregator] Centralized result written to: ${centralizedPath}`);
            } catch (aggregatorError) {
              logger.error(
                `[DataAggregator] Failed to generate centralized result: ${aggregatorError}`
              );
              // Don't fail the entire scenario due to aggregator issues
            }
          }
        } catch (error) {
          logger.error(
            'An error occurred during scenario execution:',
            error instanceof Error ? error.message : String(error)
          );

          // Record error in data aggregator if available (Ticket #5786)
          if (dataAggregator) {
```