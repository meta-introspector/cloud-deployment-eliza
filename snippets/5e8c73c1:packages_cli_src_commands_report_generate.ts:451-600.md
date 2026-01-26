# 5e8c73c1:packages_cli_src_commands_report_generate.ts:451-600

**Commit:** 5e8c73c182183f29f3a258addda3fe909cf82a6d
**Author:** Christopher Trimboli
**Date:** Fri Dec 19 13:53:16 2025 -0800
**File:** packages/cli/src/commands/report/generate.ts:451-600
**Novelty Score:** 217.94
**Concepts:** agent-system, embedded-db, event-driven, orchestration, plugin-system, postgres, security, testing

```
    process.exit(1);
  }
})();
`;

    const nodeProcess = spawn('node', ['-e', nodeScript], {
      stdio: 'inherit',
      cwd: process.cwd(),
    });

    nodeProcess.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`PDF generation process exited with code ${code}`));
      }
    });

    nodeProcess.on('error', (error) => {
      reject(new Error(`Failed to spawn PDF generation process: ${error.message}`));
    });
  });
}

/**
 * Validate that the input directory exists and is accessible
 */
async function validateInputDirectory(inputDir: string): Promise<void> {
  try {
    const stats = await fs.stat(inputDir);
    if (!stats.isDirectory()) {
      throw new Error(`Input path is not a directory: ${inputDir}`);
    }
  } catch (error) {
    const errorWithCode = error as Error & { code?: string };
    if (errorWithCode.code === 'ENOENT') {
      throw new Error(`Input directory not found: ${inputDir}`);
    }
    throw new Error(
      `Cannot access input directory: ${inputDir}. ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Find and process all run-*.json files in the input directory
 */
async function ingestRunData(inputDir: string): Promise<DataIngestionResult> {
  const fileStats = { processed: 0, skipped: 0, errors: [] as string[] };
  const validRuns: ScenarioRunResult[] = [];
  let matrixConfig: MatrixConfig | null = null;

  try {
    // Find all run-*.json files, prioritizing files in runs/ subdirectory
    const runFiles = await glob('**/run-*.json', { cwd: inputDir, absolute: true });

    if (runFiles.length === 0) {
      throw new Error('No run-*.json files found in the input directory');
    }

    console.log(`📁 Found ${runFiles.length} run files to process`);

    // Also look for matrix configuration file
    const configFiles = await glob('**/*.matrix.yaml', { cwd: inputDir, absolute: true });
    if (configFiles.length > 0) {
      try {
        // Read config file (content not used yet, but we validate it exists)
        await fs.readFile(configFiles[0], 'utf8');
        // For now, we'll create a basic config since we need yaml parsing
        // In a real implementation, we'd use a yaml parser here
        matrixConfig = {
          name: 'Matrix Configuration',
          description: 'Loaded from matrix run',
          base_scenario: 'scenario.yaml',
          runs_per_combination: 1,
          matrix: [],
        };
      } catch (error) {
        fileStats.errors.push(`Failed to load matrix config: ${(error as Error).message}`);
      }
    }

    // If no matrix config found, create a minimal default
    if (!matrixConfig) {
      matrixConfig = {
        name: 'Unknown Matrix',
        description: 'No matrix configuration file found',
        base_scenario: 'unknown.scenario.yaml',
        runs_per_combination: 1,
        matrix: [],
      };
    }

    // Process each run file
    for (const filePath of runFiles) {
      try {
        const fileContent = await fs.readFile(filePath, 'utf8');
        const runData = JSON.parse(fileContent);

        let transformedRun: ScenarioRunResult;

        // Check if this looks like a MatrixRunResult first (more common case)
        const isMatrixResult =
          runData.runId &&
          runData.combinationId &&
          typeof runData.startTime === 'string' &&
          typeof runData.endTime === 'string';

        if (isMatrixResult) {
          // This is a MatrixRunResult - transform it
          console.log(
            `🔧 [DEBUG] Detected MatrixRunResult format for ${filePath.split('/').pop()}`
          );
          const matrixResult = runData as MatrixRunResult;
          transformedRun = transformMatrixRunResultToScenarioRunResult(matrixResult);

          // Validate the transformed result
          const validationResult = ScenarioRunResultSchema.safeParse(transformedRun);
          if (!validationResult.success) {
            console.log(
              `🔧 [DEBUG] Transformation validation failed:`,
              validationResult.error.issues
            );
            throw new Error(
              `Transformed MatrixRunResult failed validation: ${JSON.stringify(validationResult.error.issues)}`
            );
          }

          transformedRun = validationResult.data as ScenarioRunResult;
          console.log(`🔧 [DEBUG] Successfully transformed MatrixRunResult to ScenarioRunResult`);
        } else {
          // Try to validate as ScenarioRunResult directly
          const scenarioValidation = ScenarioRunResultSchema.safeParse(runData);
          if (scenarioValidation.success) {
            transformedRun = scenarioValidation.data as ScenarioRunResult;
            console.log(
              `🔧 [DEBUG] Direct ScenarioRunResult validation successful for ${filePath.split('/').pop()}`
            );
          } else {
            console.log(
              `🔧 [DEBUG] File ${filePath.split('/').pop()} does not match any known format`
            );
            console.log(`🔧 [DEBUG] Available fields:`, Object.keys(runData));
            throw new Error(`File does not match ScenarioRunResult or MatrixRunResult format`);
          }
        }

        validRuns.push(transformedRun);
        fileStats.processed++;
      } catch (error) {
```