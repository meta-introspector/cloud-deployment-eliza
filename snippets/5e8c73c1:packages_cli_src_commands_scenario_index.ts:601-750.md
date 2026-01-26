# 5e8c73c1:packages_cli_src_commands_scenario_index.ts:601-750

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/scenario/index.ts:601-750
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
              typeof rawMatrixConfig.base_scenario === 'string' &&
              !path.isAbsolute(rawMatrixConfig.base_scenario)
            ) {
              rawMatrixConfig.base_scenario = path.resolve(
                configDir,
                rawMatrixConfig.base_scenario
              );
            }

            // Step 3: Validate matrix configuration
            logger.info('🔍 Validating matrix configuration...');
            const validationResult = validateMatrixConfig(rawMatrixConfig);

            if (!validationResult.success) {
              logger.error('❌ Matrix configuration validation failed:');
              const errors = validationResult.error.format();

              // Display user-friendly error messages
              const formatErrors = (
                obj: Record<string, unknown> & { _errors?: string[] },
                errorPath: string = ''
              ): void => {
                if (obj._errors && obj._errors.length > 0) {
                  obj._errors.forEach((error: string) => {
                    logger.error(`   ${errorPath}: ${error}`);
                  });
                }

                Object.keys(obj).forEach((key) => {
                  if (key !== '_errors' && typeof obj[key] === 'object' && obj[key] !== null) {
                    const newPath = errorPath ? `${errorPath}.${key}` : key;
                    formatErrors(
                      obj[key] as Record<string, unknown> & { _errors?: string[] },
                      newPath
                    );
                  }
                });
              };

              formatErrors(errors);
              logger.info('💡 Please fix the configuration errors and try again.');
              logger.info('📖 See the matrix testing documentation for examples and guidance.');
              process.exit(1);
            }

            const matrixConfig = validationResult.data;
            logger.info('✅ Matrix configuration is valid!');

            // Step 3: Analyze matrix dimensions
            const totalCombinations = calculateTotalCombinations(matrixConfig);
            const totalRuns = calculateTotalRuns(matrixConfig);

            // Step 4: Display matrix analysis
            logger.info('\n📊 Matrix Analysis:');
            logger.info(`   Name: ${matrixConfig.name}`);
            if (matrixConfig.description) {
              logger.info(`   Description: ${matrixConfig.description}`);
            }
            logger.info(`   Base Scenario: ${matrixConfig.base_scenario}`);
            logger.info(`   Runs per combination: ${matrixConfig.runs_per_combination}`);
            logger.info(`   Matrix axes: ${matrixConfig.matrix.length}`);
            logger.info(`   Total combinations: ${totalCombinations}`);
            logger.info(`   Total test runs: ${totalRuns}`);

            // Display matrix structure
            logger.info('\n🎯 Matrix Structure:');
            matrixConfig.matrix.forEach((axis, index) => {
              logger.info(`   Axis ${index + 1}: ${axis.parameter}`);
              logger.info(`     Values: [${axis.values.map((v) => JSON.stringify(v)).join(', ')}]`);
              logger.info(`     Count: ${axis.values.length}`);
            });

            // Step 5: Verify base scenario exists and load it
            // Base scenario path was already resolved in Step 2
            const baseScenarioPath = matrixConfig.base_scenario;
            if (!fs.existsSync(baseScenarioPath)) {
              logger.error(`\n❌ Error: Base scenario file not found at '${baseScenarioPath}'`);
              logger.info('💡 Make sure the base_scenario path in your matrix config is correct.');
              process.exit(1);
            }
            logger.info(`✅ Base scenario file found: ${baseScenarioPath}`);

            // Load and validate base scenario
            let baseScenario: Scenario;
            try {
              const baseScenarioContents = fs.readFileSync(baseScenarioPath, 'utf8');
              const loadedScenario = yaml.load(baseScenarioContents);
              baseScenario =
                typeof loadedScenario === 'object' &&
                loadedScenario !== null &&
                !Array.isArray(loadedScenario)
                  ? (loadedScenario as Scenario)
                  : ({} as Scenario);

              // Validate base scenario structure
              const baseValidationResult = ScenarioSchema.safeParse(baseScenario);
              if (!baseValidationResult.success) {
                logger.error(`\n❌ Error: Base scenario file is invalid:`);
                logger.error(JSON.stringify(baseValidationResult.error.format(), null, 2));
                process.exit(1);
              }
              logger.info(`✅ Base scenario is valid`);
            } catch (yamlError) {
              logger.error(`\n❌ Error: Failed to parse base scenario YAML file:`);
              logger.error(yamlError instanceof Error ? yamlError.message : String(yamlError));
              process.exit(1);
            }

            // Step 5.5: Validate matrix parameter paths against base scenario
            logger.info(`🔍 Validating matrix parameter paths...`);
            const pathValidation = validateMatrixParameterPaths(baseScenario, matrixConfig.matrix);
            if (!pathValidation.valid) {
              logger.error(`\n❌ Error: Invalid parameter paths in matrix configuration:`);
              pathValidation.invalidPaths.forEach((invalidPath) => {
                logger.error(`   - ${invalidPath}`);
              });
              logger.info('💡 Make sure all parameter paths exist in your base scenario.');
              logger.info('📖 Check the matrix testing documentation for parameter path examples.');
              process.exit(1);
            }
            logger.info(`✅ All matrix parameter paths are valid`);

            // Step 6: Generate matrix combinations using proper API from ticket #5779
            const combinations = generateMatrixCombinations(matrixConfig);

            if (options.verbose || options.dryRun) {
              logger.info('\n🔀 Matrix Combinations:');
              combinations.forEach((combo, index) => {
                logger.info(
                  `   ${index + 1}. ${combo.id}: ${JSON.stringify(combo.parameters, null, 0)}`
                );
              });

              // Show parameter combination details for the first combination
              if (combinations.length > 0 && options.verbose) {
                logger.info('\n🛠️  Parameter Override Preview:');
                try {
                  const firstCombination = combinations[0];
                  const overrides = combinationToOverrides(firstCombination.parameters);

                  logger.info(`   📋 Example: ${firstCombination.id}`);
                  logger.info(
                    `   📊 Metadata: ${firstCombination.metadata.combinationIndex + 1} of ${firstCombination.metadata.totalCombinations}`
                  );
                  logger.info(`   📝 Original scenario name: "${baseScenario.name}"`);
                  logger.info(`   📝 Modified scenario ready for execution`);
                  logger.info(`   📝 Parameters applied:`);

                  // Show specific parameter changes
                  overrides.forEach((override) => {
```