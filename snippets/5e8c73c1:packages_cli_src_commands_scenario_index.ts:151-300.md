# 5e8c73c1:packages_cli_src_commands_scenario_index.ts:151-300

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/index.ts:151-300
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```

            if (!pluginResult.valid) {
              logger.error('Plugin validation failed:');
              pluginResult.errors.forEach((error) => {
                logger.error(`  - ${error}`);
              });
              process.exit(1);
            }

            if (pluginResult.warnings.length > 0) {
              logger.warn('Plugin warnings:');
              pluginResult.warnings.forEach((warning) => {
                logger.warn(`  - ${warning}`);
              });
            }

            logger.info(generateSummary(pluginResult));
          } else {
            logger.info('No plugins specified in scenario');
          }
          // Initialize Reporter
          reporter = new Reporter();
          reporter.reportStart(scenario);
          const defaultPlugins = [
            '@elizaos/plugin-sql',
            '@elizaos/plugin-bootstrap',
            '@elizaos/plugin-openai',
          ];
          // Ensure PGLite uses isolated directory per scenario run when not overridden
          if (!process.env.PGLITE_DATA_DIR) {
            const uniqueDir = `${process.cwd()}/test-data/scenario-${Date.now()}-${Math.random().toString(36).slice(2)}`;
            process.env.PGLITE_DATA_DIR = uniqueDir;
          }
          // Extract plugin names from scenario configuration, filtering by enabled status
          const scenarioWithPlugins = scenario as Scenario & {
            plugins?: Array<string | { name: string; enabled?: boolean }>;
          };
          const scenarioPlugins = Array.isArray(scenarioWithPlugins.plugins)
            ? scenarioWithPlugins.plugins
                .filter(
                  (p: string | { name: string; enabled?: boolean }) =>
                    typeof p === 'string' || p.enabled !== false
                ) // Only include enabled plugins (default to true if not specified)
                .map((p: string | { name: string }) => (typeof p === 'string' ? p : p.name)) // Extract name if it's an object
            : [];
          const finalPlugins = Array.from(new Set([...scenarioPlugins, ...defaultPlugins]));
          logger.info(`Using plugins: ${JSON.stringify(finalPlugins)}`);
          // Create server and start agent for local environment
          if (!server || !runtime || !agentId) {
            const created = await createScenarioServerAndAgent(null, 3000, finalPlugins);
            server = created.server;
            runtime = created.runtime;
            agentId = created.agentId;
            createdServer = created.createdServer;
            serverPort = created.port;
          }
          provider = new LocalEnvironmentProvider(server, agentId, runtime, serverPort);
          logger.info('Using local environment');

          // Initialize MockEngine if we have a runtime and mocks are defined
          if (runtime && scenario.setup?.mocks && !options.live) {
            logger.info('Initializing MockEngine...');
            mockEngine = new MockEngine(runtime);
            logger.info('Applying mocks...');
            mockEngine.applyMocks(scenario.setup.mocks);
          }

          logger.info('Setting up local environment...');
          await provider.setup(scenario);

          // Initialize data aggregator if we have a runtime (Ticket #5786)
          if (runtime) {
            const trajectoryReconstructor = new TrajectoryReconstructor(runtime);
            const evaluationEngine = new EvaluationEngine(runtime);
            dataAggregator = new RunDataAggregator(
              runtime,
              trajectoryReconstructor,
              evaluationEngine
            );

            // Start the run tracking with consistent naming format
            const runId = generateRunFilename(1); // Single scenario run, so index 1
            const combinationId = `single-${scenarioRunId}`; // For single runs, not matrix
            const parameters = { 'scenario.file': filePath }; // Basic parameter tracking

            dataAggregator.startRun(runId, combinationId, parameters);
            logger.info(`📊 [DataAggregator] Started tracking run: ${runId}`);
          }

          logger.info('Executing run block...');
          const startTime = Date.now();
          const results = await provider.run(scenario);
          const endTime = Date.now();

          // Report execution results using Reporter
          results.forEach((result) => {
            reporter?.reportExecutionResult(result);
          });

          // Ensure _logs_ directory exists (already created at beginning)
          logger.info(`📂 Using logs directory: ${logsDir}`);

          // Generate scenario run identifier with consistent naming
          const runId = generateRunFilename(1); // Single scenario run, so index 1

          // Write execution results with trajectory data to JSON files (Ticket #5785)
          results.forEach((result, i) => {
            const executionFilename = generateStepFilename(runId, i, 'execution');
            const executionPath = path.join(logsDir, executionFilename);
            fs.writeFileSync(executionPath, JSON.stringify(result, null, 2));
            logger.info(`📄 Execution results written to: ${executionPath}`);
          });

          // Run evaluations for each step
          const allEvaluationResults: Array<{
            success: boolean;
            message: string;
            [key: string]: unknown;
          }> = [];

          if (runtime) {
            // Full evaluation engine with runtime for complex evaluators
            const evaluationEngine = new EvaluationEngine(runtime);
            logger.info('Running evaluations with runtime...');

            for (let i = 0; i < results.length; i++) {
              const step = scenario.run[i];
              const result = results[i];

              if (step.evaluations && step.evaluations.length > 0) {
                const evaluationResults = await runEvaluationsWithFallback(
                  evaluationEngine,
                  step.evaluations,
                  result
                );
                const evaluationFilename = generateStepFilename(runId, i, 'evaluation');
                const evaluationPath = path.join(logsDir, evaluationFilename);
                fs.writeFileSync(evaluationPath, JSON.stringify(evaluationResults, null, 2));
                logger.info(`📊 Evaluation results written to: ${evaluationPath}`);
                allEvaluationResults.push(...evaluationResults);
              }
            }
          } else {
            // Simple evaluators that don't require runtime
            logger.info('Running basic evaluations without runtime...');

            for (let i = 0; i < results.length; i++) {
              const step = scenario.run[i];
              const result = results[i];

```