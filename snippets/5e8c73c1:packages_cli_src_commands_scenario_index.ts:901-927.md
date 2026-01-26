# 5e8c73c1:packages_cli_src_commands_scenario_index.ts:901-927

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/index.ts:901-927
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
            }
          } catch (error) {
            logger.error(
              '❌ An error occurred during matrix analysis:',
              error instanceof Error ? error.message : String(error)
            );
            if (options.verbose && error instanceof Error && error.stack) {
              logger.error(`Stack trace: ${error.stack}`);
            }

            // Cleanup processes on error
            if (!isShuttingDown) {
              const summary = processManager.getSummary();
              if (summary.total > 0) {
                logger.info(`🔧 [Matrix] Cleaning up ${summary.total} processes after error...`);
                await processManager.terminateAllProcesses();
              }
            }

            logger.info('💡 Use --verbose for more detailed error information.');
            process.exit(1);
          }
        }
      )
  );

export default scenario;
```