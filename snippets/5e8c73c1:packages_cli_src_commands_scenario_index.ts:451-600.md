# 5e8c73c1:packages_cli_src_commands_scenario_index.ts:451-600

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/index.ts:451-600
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
            try {
              dataAggregator.recordError(error instanceof Error ? error : new Error(String(error)));

              // Try to generate a result even for failed runs
              const roomId = agentId || 'unknown';
              const failedResult = await dataAggregator.buildResult(roomId, [], {
                exitCode: 1,
                stdout: '',
                stderr: error instanceof Error ? error.message : String(error),
                durationMs: 0,
                files: {}, // Add required files property
              });

              const errorFilename = `run-${failedResult.run_id}.json`;
              const errorPath = path.join(logsDir, errorFilename);
              fs.writeFileSync(errorPath, JSON.stringify(failedResult, null, 2));
              logger.info(`💥 [DataAggregator] Error result written to: ${errorPath}`);
            } catch (aggregatorError) {
              logger.error(`[DataAggregator] Failed to record error: ${aggregatorError}`);
            }
          }

          process.exit(1);
        } finally {
          // Revert mocks first to ensure clean state
          if (mockEngine) {
            logger.info('Reverting mocks...');
            mockEngine.revertMocks();
          }

          if (provider) {
            logger.info('Tearing down environment...');
            await provider.teardown();
          }
          if (runtime) {
            try {
              await runtime.close();
              logger.info('Runtime shutdown complete');
            } catch {}
          }
          if (server && createdServer) {
            try {
              await shutdownScenarioServer(server, serverPort);
            } catch {}
          }

          // Report final result and exit with appropriate code
          reporter?.reportFinalResult(finalStatus);
          process.exit(finalStatus ? 0 : 1);
        }
      })
  )
  .addCommand(
    new Command('matrix')
      .argument('<configPath>', 'Path to the matrix configuration .yaml file')
      .option('--dry-run', 'Show matrix analysis without executing tests', false)
      .option('--parallel <number>', 'Maximum number of parallel test runs', '1')
      .option('--filter <pattern>', 'Filter parameter combinations by pattern')
      .option('--verbose', 'Show detailed progress information', false)
      .description('Execute a scenario matrix from a configuration file')
      .action(
        async (
          configPath: string,
          options: {
            dryRun: boolean;
            parallel: string;
            filter?: string;
            verbose: boolean;
          }
        ) => {
          // Import matrix-specific modules only when needed
          const { validateMatrixConfig, calculateTotalCombinations, calculateTotalRuns } =
            await import('./src/matrix-schema');
          const {
            generateMatrixCombinations,
            filterCombinations,
            calculateExecutionStats,
            formatDuration,
          } = await import('./src/matrix-runner');
          const { validateMatrixParameterPaths, combinationToOverrides } =
            await import('./src/parameter-override');

          const logger = elizaLogger || console;
          logger.info(`🧪 Starting matrix analysis with config: ${configPath}`);

          if (options.verbose) {
            logger.info(`Options: ${JSON.stringify(options, null, 2)}`);
          }

          // Import process manager for cleanup
          const { processManager } = await import('./src/process-manager');

          // Set up signal handlers for graceful cleanup
          let isShuttingDown = false;
          const handleShutdown = async (signal: string) => {
            if (isShuttingDown) {
              logger.info(`🔧 [Matrix] Already shutting down, ignoring ${signal}`);
              return;
            }
            isShuttingDown = true;
            logger.info(`🔧 [Matrix] Received ${signal}, initiating graceful shutdown...`);

            const summary = processManager.getSummary();
            if (summary.total > 0) {
              logger.info(`🔧 [Matrix] Cleaning up ${summary.total} tracked processes...`);
              await processManager.terminateAllProcesses();
              logger.info(`🔧 [Matrix] Process cleanup completed`);
            }

            logger.info(`🔧 [Matrix] Shutdown complete`);
            process.exit(0);
          };

          // Register signal handlers
          process.on('SIGINT', () => handleShutdown('SIGINT'));
          process.on('SIGTERM', () => handleShutdown('SIGTERM'));

          try {
            // Step 1: Load and validate configuration file
            const fullPath = path.resolve(configPath);
            const configDir = path.dirname(fullPath);
            logger.info(`📂 Loading matrix configuration from: ${fullPath}`);

            if (!fs.existsSync(fullPath)) {
              logger.error(`❌ Error: Matrix configuration file not found at '${fullPath}'`);
              logger.info('💡 Make sure the file exists and the path is correct.');
              process.exit(1);
            }

            const fileContents = fs.readFileSync(fullPath, 'utf8');
            let rawMatrixConfig: Record<string, unknown>;

            try {
              const loadedConfig = yaml.load(fileContents);
              rawMatrixConfig =
                typeof loadedConfig === 'object' &&
                loadedConfig !== null &&
                !Array.isArray(loadedConfig)
                  ? (loadedConfig as Record<string, unknown>)
                  : {};
            } catch (yamlError) {
              logger.error(`❌ Error: Failed to parse YAML configuration file:`);
              logger.error(yamlError instanceof Error ? yamlError.message : String(yamlError));
              logger.info('💡 Check that your YAML syntax is valid.');
              process.exit(1);
            }

            // Step 2: Resolve base scenario path relative to matrix config directory
            if (
              rawMatrixConfig.base_scenario &&
```