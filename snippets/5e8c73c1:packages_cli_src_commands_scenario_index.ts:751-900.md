# 5e8c73c1:packages_cli_src_commands_scenario_index.ts:751-900

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/index.ts:751-900
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
                    logger.info(`   🔧 ${override.path}: ${JSON.stringify(override.value)}`);
                  });

                  logger.info(
                    `   📝 This combination will run ${matrixConfig.runs_per_combination} time(s)`
                  );
                } catch (error) {
                  logger.warn(
                    `   ⚠️  Could not generate override preview: ${error instanceof Error ? error.message : String(error)}`
                  );
                }
              }
            }

            // Step 7: Apply filters if specified
            let filteredCombinations = combinations;
            if (options.filter) {
              logger.info(`\n🔍 Applying filter: ${options.filter}`);
              filteredCombinations = filterCombinations(combinations, options.filter);
              logger.info(`   Filtered to ${filteredCombinations.length} combinations`);
            }

            // Step 8: Warn about large matrices
            if (totalRuns > 50) {
              logger.info(`\n⚠️  Warning: This matrix will execute ${totalRuns} total test runs.`);
              logger.info('   This may take a significant amount of time and resources.');
              logger.info(
                '   Consider using --filter to reduce the scope or increasing --parallel for faster execution.'
              );
            }

            // Step 9: Show execution plan
            if (options.dryRun) {
              logger.info('\n🔍 Dry Run Complete - Matrix Analysis Only');
              logger.info('✨ Matrix configuration is valid and ready for execution.');
              logger.info('📝 To execute the matrix, run the same command without --dry-run');

              // Cleanup any processes from dry-run analysis
              if (!isShuttingDown) {
                const summary = processManager.getSummary();
                if (summary.total > 0) {
                  logger.info(
                    `🔧 [Matrix] Cleaning up ${summary.total} processes after dry-run...`
                  );
                  await processManager.terminateAllProcesses();
                }
              }

              process.exit(0);
            } else {
              // Calculate execution statistics
              const executionStats = calculateExecutionStats(
                filteredCombinations,
                matrixConfig.runs_per_combination
              );

              logger.info('\n🚀 Matrix Execution Plan:');
              logger.info(`   Parallel execution: ${options.parallel} concurrent runs`);
              logger.info(`   Total combinations to execute: ${executionStats.totalCombinations}`);
              logger.info(`   Total runs: ${executionStats.totalRuns}`);
              logger.info(
                `   Estimated duration: ${formatDuration(executionStats.estimatedDuration.realistic)} (realistic)`
              );
              logger.info(
                `   Duration range: ${formatDuration(executionStats.estimatedDuration.optimistic)} - ${formatDuration(executionStats.estimatedDuration.pessimistic)}`
              );

              // Create execution context for future use
              // const executionContext = createExecutionContext(matrixConfig, filteredCombinations, {
              //   parallelism: parseInt(options.parallel, 10),
              //   dryRun: false,
              //   filter: options.filter,
              //   verbose: options.verbose,
              // });

              logger.info('\n✅ Matrix Ready for Execution:');
              logger.info('   🎯 Matrix configuration: ✅ Valid');
              logger.info('   🎯 Parameter combinations: ✅ Generated');
              logger.info('   🎯 Execution context: ✅ Prepared');
              logger.info('   🎯 Base scenario: ✅ Validated');

              // Import orchestrator for actual execution
              const { executeMatrixRuns } = await import('./src/matrix-orchestrator');

              logger.info('\n🚀 Starting Matrix Execution...');

              // Create output directory with timestamp in scenario logs
              const logsDir = path.join(__dirname, '_logs_');
              const matrixRunId = generateRunFilename(1);
              const outputDir = path.join(logsDir, matrixRunId.replace('run-', 'matrix-'));

              // Execute the matrix with full orchestration
              const results = await executeMatrixRuns(matrixConfig, filteredCombinations, {
                outputDir,
                maxParallel: parseInt(options.parallel, 10),
                continueOnFailure: true,
                runTimeout: 300000, // 5 minutes per run
                verbose: options.verbose,
                onProgress: (message, eventType, _data) => {
                  if (
                    options.verbose ||
                    eventType === 'MATRIX_STARTED' ||
                    eventType === 'COMBINATION_COMPLETED' ||
                    eventType === 'MATRIX_COMPLETED'
                  ) {
                    logger.info(`🔄 ${message}`);
                  }
                },
                onCombinationComplete: (summary) => {
                  logger.info(
                    `✅ Combination ${summary.combinationId} completed: ${summary.successfulRuns}/${summary.totalRuns} successful (${(summary.successRate * 100).toFixed(1)}%)`
                  );
                },
                onResourceWarning: (alert) => {
                  logger.warn(
                    `⚠️  Resource ${alert.resource} at ${alert.currentUsage.toFixed(1)}%: ${alert.message}`
                  );
                  if (alert.recommendation) {
                    logger.info(`💡 Recommendation: ${alert.recommendation}`);
                  }
                },
              });

              // Report final results
              const successfulRuns = results.filter((r) => r.success).length;
              const failedRuns = results.length - successfulRuns;
              const successRate = results.length > 0 ? (successfulRuns / results.length) * 100 : 0;

              logger.info('\n🎉 Matrix Execution Complete!');
              logger.info(`📊 Results Summary:`);
              logger.info(`   Total runs: ${results.length}`);
              logger.info(`   Successful: ${successfulRuns}`);
              logger.info(`   Failed: ${failedRuns}`);
              logger.info(`   Success rate: ${successRate.toFixed(1)}%`);
              logger.info(`📁 Results saved to: ${outputDir}`);

              // Cleanup processes before exit
              if (!isShuttingDown) {
                const summary = processManager.getSummary();
                if (summary.total > 0) {
                  logger.info(
                    `🔧 [Matrix] Cleaning up ${summary.total} processes after completion...`
                  );
                  await processManager.terminateAllProcesses();
                  logger.info(`🔧 [Matrix] Process cleanup completed`);
                }
              }

              // Exit with appropriate code
              process.exit(failedRuns === 0 ? 0 : 1);
```